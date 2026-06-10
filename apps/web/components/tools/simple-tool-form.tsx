"use client";

import { useState } from "react";
import { fileUrl, processTool, type ToolProcessResult } from "@/lib/api-client";

type SimpleToolFormProps = Readonly<{
  endpoint: string;
  accept: string;
  multiple?: boolean;
  title: string;
  description: string;
  buttonLabel: string;
  outputLabel: string;
  extraField?: { name: string; label: string; defaultValue: string; suffix?: string };
}>;

function formatBytes(bytes?: number) {
  if (!bytes) return "-";
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  return `${value.toFixed(value >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

export function SimpleToolForm({ endpoint, accept, multiple = false, title, description, buttonLabel, outputLabel, extraField }: SimpleToolFormProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<"idle" | "processing" | "done">("idle");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ToolProcessResult | null>(null);
  const [extraValue, setExtraValue] = useState(extraField?.defaultValue ?? "");

  async function handleProcess() {
    if (files.length === 0) return;
    setStatus("processing");
    setError(null);
    setResult(null);
    try {
      const extraFields = extraField ? { [extraField.name]: extraValue } : undefined;
      const nextResult = await processTool(endpoint, files, multiple, extraFields);
      setResult(nextResult);
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Tool gagal memproses file.");
      setStatus("idle");
    }
  }

  return (
    <section className="rounded-[22px] border border-slate-200 bg-white p-5 dark:border-brand-line dark:bg-slate-900/75 sm:p-7">
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div>
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-[18px] border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center transition hover:border-brand-primary dark:border-slate-700 dark:bg-slate-950/70">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-brand-soft font-mono text-sm font-semibold text-brand-primary dark:bg-indigo-400/10 dark:text-indigo-300">FILE</span>
            <span className="mt-4 text-xl font-medium text-brand-ink dark:text-slate-100">{title}</span>
            <span className="mt-2 max-w-lg text-sm leading-6 text-slate-600 dark:text-slate-400">{description}</span>
            <span className="mt-5 rounded-md bg-brand-primary px-5 py-3 text-sm font-semibold text-white">Pilih File</span>
            <input type="file" accept={accept} multiple={multiple} className="sr-only" onChange={(event) => setFiles(Array.from(event.target.files ?? []))} />
          </label>

          {files.length > 0 ? (
            <div className="mt-5 rounded-2xl border border-slate-200 bg-brand-paper p-4 dark:border-brand-line dark:bg-slate-950/70">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">File dipilih</p>
              <div className="mt-3 grid gap-2 text-sm text-slate-700 dark:text-slate-300">
                {files.map((file) => <p key={`${file.name}-${file.size}`} className="flex justify-between gap-4"><span className="truncate">{file.name}</span><span className="shrink-0">{formatBytes(file.size)}</span></p>)}
              </div>
            </div>
          ) : null}

          {extraField ? (
            <label className="mt-5 block rounded-2xl border border-slate-200 bg-brand-paper p-4 dark:border-brand-line dark:bg-slate-950/70">
              <span className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{extraField.label}</span>
              <div className="mt-3 flex items-center gap-3">
                <input value={extraValue} onChange={(event) => setExtraValue(event.target.value)} inputMode="numeric" className="h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-brand-ink outline-none focus:border-brand-primary dark:border-brand-line dark:bg-slate-900 dark:text-slate-100" />
                {extraField.suffix ? <span className="text-sm text-slate-500 dark:text-slate-400">{extraField.suffix}</span> : null}
              </div>
            </label>
          ) : null}

          {error ? <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-400/30 dark:bg-red-400/10 dark:text-red-300">{error}</div> : null}
        </div>

        <aside className="rounded-[18px] border border-slate-200 bg-brand-paper p-5 dark:border-brand-line dark:bg-slate-950/70">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Output</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-brand-ink dark:text-slate-100">{outputLabel}</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">File diproses sementara dan bisa langsung diunduh setelah selesai.</p>
          <button type="button" disabled={files.length === 0 || status === "processing"} onClick={handleProcess} className="mt-6 w-full rounded-md bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 dark:bg-white dark:text-brand-night dark:hover:bg-slate-200 dark:disabled:bg-slate-800 dark:disabled:text-slate-500">
            {status === "processing" ? "Memproses..." : buttonLabel}
          </button>

          {result ? (
            <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-200">
              <p className="font-semibold">Selesai diproses.</p>
              <div className="mt-3 grid gap-1 text-xs">
                {result.originalSize ? <p>Ukuran awal: {formatBytes(result.originalSize)}</p> : null}
                {result.outputSize ? <p>Ukuran hasil: {formatBytes(result.outputSize)}</p> : null}
                {typeof result.reductionPercent === "number" ? <p>Pengurangan: {result.reductionPercent}%</p> : null}
                {result.fileCount ? <p>File PDF: {result.fileCount}</p> : null}
                {result.imageCount ? <p>Gambar: {result.imageCount}</p> : null}
                {result.totalPages ? <p>Total halaman: {result.totalPages}</p> : null}
                {result.pageCount ? <p>Total gambar: {result.pageCount}</p> : null}
              </div>
              <a href={fileUrl(result.downloadUrl) ?? "#"} className="mt-4 inline-flex w-full justify-center rounded-md bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">Download Hasil</a>
            </div>
          ) : null}
        </aside>
      </div>
    </section>
  );
}
