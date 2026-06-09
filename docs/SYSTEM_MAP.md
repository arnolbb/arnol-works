# System Map — Arnol Works

## 1. High-level architecture

Arnol Works menggunakan arsitektur web platform modular.

```text
User Browser
   ↓
Next.js Web App
   ↓ HTTP API
FastAPI Backend
   ↓
PDF Processing Services
   ↓
Temporary File Storage
```

Frontend bertanggung jawab untuk UI, routing, tool registry, upload, review halaman, dan download UX.

Backend bertanggung jawab untuk validasi PDF, analisis warna, thumbnail generation, split PDF, dan temporary file management.

## 2. Monorepo structure

Target struktur repository:

```text
arnol-works/
├─ apps/
│  ├─ web/
│  │  ├─ app/
│  │  │  ├─ page.tsx
│  │  │  ├─ tools/
│  │  │  │  ├─ page.tsx
│  │  │  │  └─ pdf-color-bw-splitter/
│  │  │  │     └─ page.tsx
│  │  │  ├─ projects/page.tsx
│  │  │  ├─ about/page.tsx
│  │  │  └─ contact/page.tsx
│  │  ├─ components/
│  │  ├─ features/
│  │  │  └─ pdf-color-bw-splitter/
│  │  ├─ lib/
│  │  │  ├─ tools-registry.ts
│  │  │  └─ api-client.ts
│  │  └─ package.json
│  └─ api/
│     ├─ app/
│     │  ├─ main.py
│     │  ├─ core/
│     │  ├─ routes/
│     │  ├─ services/
│     │  │  ├─ pdf_analyzer.py
│     │  │  ├─ pdf_splitter.py
│     │  │  └─ storage.py
│     │  ├─ schemas/
│     │  └─ utils/
│     ├─ requirements.txt
│     └─ README.md
├─ docs/
├─ AGENTS.md
├─ README.md
├─ .gitignore
└─ docker-compose.yml
```

## 3. Frontend route map

### `/`

Homepage Arnol Works.

Sections:

- Hero: Arnol Works branding.
- Short intro: portfolio + useful tools.
- Featured tool: Pisah PDF Warna & Hitam Putih.
- Tools preview.
- Projects placeholder.
- About/contact CTA.

### `/tools`

Tools directory.

Uses `tools-registry.ts`.

Displays:

- Tool name.
- Description.
- Category.
- Status: available/coming soon.
- CTA open tool.

### `/tools/pdf-color-bw-splitter`

Main MVP tool.

States:

1. Intro state.
2. Upload state.
3. Analyzing state.
4. Review state.
5. Splitting state.
6. Result state.
7. Error state.

### `/projects`

Portfolio placeholder.

### `/about`

About Arnol placeholder.

### `/contact`

Contact placeholder.

## 4. Tool registry

Frontend harus punya satu source of truth untuk daftar tools.

Example structure:

```ts
export type ToolStatus = 'available' | 'coming-soon';

export type ToolDefinition = {
  slug: string;
  name: string;
  shortDescription: string;
  longDescription?: string;
  category: 'pdf' | 'image' | 'text' | 'utility';
  status: ToolStatus;
  href: string;
  featured?: boolean;
};

export const toolsRegistry: ToolDefinition[] = [
  {
    slug: 'pdf-color-bw-splitter',
    name: 'Pisah PDF Warna & Hitam Putih',
    shortDescription: 'Pisahkan halaman PDF berwarna dan hitam-putih agar biaya print lebih hemat.',
    category: 'pdf',
    status: 'available',
    href: '/tools/pdf-color-bw-splitter',
    featured: true,
  },
];
```

## 5. PDF tool frontend state model

```ts
type AnalyzeStatus = 'idle' | 'uploading' | 'analyzing' | 'ready' | 'splitting' | 'done' | 'error';

type PdfPagePreview = {
  pageNumber: number;
  isColorDetected: boolean;
  thumbnailUrl: string;
};

type AnalyzeResult = {
  jobId: string;
  totalPages: number;
  detectedColorPages: number[];
  pages: PdfPagePreview[];
};

type SplitResult = {
  jobId: string;
  colorPdfUrl: string;
  bwPdfUrl: string;
  colorPageCount: number;
  bwPageCount: number;
};
```

State rules:

- `detectedColorPages` berasal dari backend.
- `selectedColorPages` disimpan di frontend dan default-nya sama dengan detectedColorPages.
- Saat user mengubah checklist atau input manual, hanya `selectedColorPages` yang berubah.
- Saat split, frontend hanya mengirim `selectedColorPages`.

## 6. Backend route map

### `GET /health`

Return status backend.

### `POST /api/pdf/analyze`

Input: multipart form PDF file.

Output:

```json
{
  "jobId": "uuid",
  "totalPages": 10,
  "detectedColorPages": [1, 3, 5],
  "pages": [
    {
      "pageNumber": 1,
      "isColorDetected": true,
      "thumbnailUrl": "/api/files/{jobId}/thumbs/page-1.jpg"
    }
  ]
}
```

### `POST /api/pdf/split`

Input:

```json
{
  "jobId": "uuid",
  "selectedColorPages": [1, 3, 5]
}
```

Output:

```json
{
  "jobId": "uuid",
  "colorPdfUrl": "/api/files/{jobId}/outputs/color-pages.pdf",
  "bwPdfUrl": "/api/files/{jobId}/outputs/bw-pages.pdf",
  "colorPageCount": 3,
  "bwPageCount": 7
}
```

### `GET /api/files/{jobId}/{path}`

Serve temporary thumbnails and output PDFs.

Must validate path to avoid directory traversal.

## 7. Backend service map

### `storage.py`

Responsibilities:

- Create job folder.
- Save uploaded file.
- Return safe file paths.
- Serve file paths.
- Cleanup old job folders.

Suggested temp structure:

```text
tmp/
└─ jobs/
   └─ {jobId}/
      ├─ input.pdf
      ├─ thumbs/
      │  ├─ page-1.jpg
      │  └─ page-2.jpg
      └─ outputs/
         ├─ color-pages.pdf
         └─ bw-pages.pdf
```

### `pdf_analyzer.py`

Responsibilities:

- Open PDF with PyMuPDF.
- Reject encrypted/password protected PDF.
- Render pages to image.
- Detect color pages.
- Save thumbnails.
- Return page analysis result.

### `pdf_splitter.py`

Responsibilities:

- Open original PDF with pypdf.
- Validate selectedColorPages.
- Create two PDF writers.
- Add original pages to color or bw output.
- Save output PDFs.

## 8. Data flow: analyze

```text
User uploads PDF
   ↓
Frontend validates basic file type and size
   ↓
POST /api/pdf/analyze
   ↓
Backend validates file
   ↓
Backend creates jobId and saves input.pdf
   ↓
PyMuPDF opens PDF
   ↓
For each page:
   - render low/medium resolution image
   - generate thumbnail
   - analyze color pixels
   ↓
Backend returns analysis JSON
   ↓
Frontend displays review grid
```

## 9. Data flow: split

```text
User selects final color pages
   ↓
POST /api/pdf/split
   ↓
Backend loads original input.pdf
   ↓
pypdf copies original pages into two new PDFs
   ↓
Save outputs
   ↓
Return download URLs
   ↓
User downloads files
```

## 10. Error handling

Use consistent error format:

```json
{
  "error": {
    "code": "PDF_ENCRYPTED",
    "message": "PDF ini terkunci atau membutuhkan password.",
    "details": null
  }
}
```

Suggested codes:

- `INVALID_FILE_TYPE`
- `FILE_TOO_LARGE`
- `PDF_ENCRYPTED`
- `PDF_CORRUPTED`
- `JOB_NOT_FOUND`
- `INVALID_PAGE_SELECTION`
- `PROCESSING_FAILED`

## 11. Security considerations MVP

- Validate MIME type and file extension.
- Limit file size.
- Store files in random UUID job folder.
- Prevent path traversal in file serving.
- Do not execute file content.
- Do not store files permanently.
- Cleanup temp files.
- Avoid exposing absolute server paths.

## 12. Scalability notes

MVP can use local temp storage. Later versions can migrate to:

- Object storage such as S3/R2.
- Background job queue.
- Redis for job metadata.
- Worker service for heavy PDF processing.
- Rate limiting.
- Auth and quota if needed.

