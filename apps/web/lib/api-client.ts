export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export type AnalyzePage = {
  pageNumber: number;
  isColorDetected: boolean;
  thumbnailUrl: string;
};

export type AnalyzeResult = {
  jobId: string;
  totalPages: number;
  detectedColorPages: number[];
  pages: AnalyzePage[];
};

export type SplitResult = {
  jobId: string;
  colorPdfUrl: string | null;
  bwPdfUrl: string | null;
  colorPageCount: number;
  bwPageCount: number;
};

export type ToolProcessResult = {
  jobId: string;
  downloadUrl: string;
  originalSize?: number;
  outputSize?: number;
  reductionPercent?: number;
  fileCount?: number;
  imageCount?: number;
  totalPages?: number;
  pageCount?: number;
  preset?: string;
  sizeNote?: string | null;
};

type ApiErrorPayload = { error?: { message?: string } };

async function parseApiError(response: Response) {
  try {
    const data = (await response.json()) as ApiErrorPayload;
    return data.error?.message ?? "Request gagal diproses.";
  } catch {
    return "Request gagal diproses.";
  }
}

export function fileUrl(path: string | null) {
  if (!path) return null;
  return `${API_BASE_URL}${path}`;
}

async function postFiles(endpoint: string, files: File[], fieldName = "file", extraFields?: Record<string, string>): Promise<ToolProcessResult> {
  const formData = new FormData();
  for (const file of files) {
    formData.append(fieldName, file);
  }
  for (const [key, value] of Object.entries(extraFields ?? {})) {
    formData.append(key, value);
  }
  const response = await fetch(`${API_BASE_URL}${endpoint}`, { method: "POST", body: formData });
  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }
  return response.json();
}

export async function processTool(endpoint: string, files: File[], multiple = false, extraFields?: Record<string, string>): Promise<ToolProcessResult> {
  return postFiles(endpoint, files, multiple ? "files" : "file", extraFields);
}

export async function analyzePdf(file: File): Promise<AnalyzeResult> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch(`${API_BASE_URL}/api/pdf/analyze`, { method: "POST", body: formData });
  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }
  return response.json();
}

export async function splitPdf(jobId: string, selectedColorPages: number[]): Promise<SplitResult> {
  const response = await fetch(`${API_BASE_URL}/api/pdf/split`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jobId, selectedColorPages }),
  });
  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }
  return response.json();
}


