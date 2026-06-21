"use client";

import { useState } from "react";
import { fileUrl, type ToolProcessResult } from "@/lib/api-client";
import { API_BASE_URL } from "@/lib/api-client";

const PRESETS = [
  { value: "balanced", label: "Balanced", description: "Kompresi standar — cocok untuk kebanyakan PDF." },
  { value: "high_quality", label: "High Quality", description: "Kompresi minimal — prioritaskan kualitas visual." },
  { value: "smallest", label: "Smallest File", description: "Kompresi maksimal — ukuran sekecil mungkin." },
] as const;

function formatBytes(bytes?: number) {
  if (!bytes) return "-";
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes; let i = 0;
  while (value >= 1024 && i < units.length - 1) { value /= 1024; i++; }
  return `${value.toFixed(value >= 10 || i === 0 ? 0 : 1)} ${units[i]}`;
}

export function CompressPdfForm() {
  const [file, setFile] = useState<File | null>(null);
  const [preset, setPreset] = useState<string>("balanced");
  const [status, setStatus] = useState<"idle" | "processing" | "done">("idle");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ToolProcessResult | null>(null);

  async function handleProcess() {
    if (!file) return;
    setStatus("processing"); setError(null); setResult(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("preset", preset);
      const response = await fetch(`${API_BASE_URL}/api/pdf/compress`, { method: "POST", body: formData });
      if (!response.ok) {
        const data = await response.json().catch(() => ({})) as { error?: { message?: string } };
        throw new Error(data.error?.message ?? "Gagal mengompres PDF.");
      }
      const data = await response.json() as ToolProcessResult;
      setResult(data); setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Tool gagal memproses file.");
      setStatus("idle");
    }
  }

  function handleReset() { setFile(null); setStatus("idle"); setError(null); setResult(null); }

  const isProcessing = status === "processing";
  const isDone = status === "done";

  return (
    <section className="rounded-[22px] border border-slate-200 bg-white p-5 dark:border-brand-line dark:bg-slate-900/75 sm:p-7">
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div>
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-[18px] border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center transition hover:border-brand-primary dark:border-slate-700 dark:bg-slate-950/70">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-brand-soft font-mono text-sm font-semibold text-brand-primary dark:bg-indigo-400/10 dark:text-indigo-300">PDF</span>
            <span className="mt-4 text-xl font-medium text-brand-ink dark:text-slate-100">Kompres PDF</span>
            <span className="mt-2 max-w-lg text-sm leading-6 text-slate-600 dark:text-slate-400">Klik untuk memilih atau seret file PDF ke sini. Maks 50 MB.</span>
            <span className="mt-5 rounded-md bg-brand-primary px-5 py-3 text-sm font-semibold text-white">Pilih File PDF</span>
            <input type="file" accept="application/pdf,.pdf" className="sr-only" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          </label>

          {file ? (
            <div className="mt-5 rounded-2xl border border-slate-200 bg-brand-paper p-4 dark:border-brand-line dark:bg-slate-950/70">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">File dipilih</p>
              <p className="mt-3 flex justify-between gap-4 text-sm text-slate-700 dark:text-slate-300">
                <span className="truncate">{file.name}</span>
                <span className="shrink-0">{formatBytes(file.size)}</span>
              </p>
            </div>
          ) : null}

          <div className="mt-5 rounded-2xl border border-slate-200 bg-brand-paper p-4 dark:border-brand-line dark:bg-slate-950/70">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Mode Kompresi</p>
            <div className="mt-3 grid gap-2">
              {PRESETS.map((p) => (
                <label key={p.value} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition ${preset === p.value ? "border-brand-primary bg-brand-soft/40 dark:border-indigo-400/60 dark:bg-indigo-400/10" : "border-slate-200 bg-white hover:border-slate-300 dark:border-brand-line dark:bg-slate-900"}`}>
                  <input type="radio" name="preset" value={p.value} checked={preset === p.value} onChange={() => setPreset(p.value)} className="mt-0.5 accent-brand-primary" />
                  <span>
                    <span className="block text-sm font-semibold text-brand-ink dark:text-slate-100">{p.label}</span>
                    <span className="block text-xs leading-5 text-slate-500 dark:text-slate-400">{p.description}</span>
                  </span>
                </label>
              ))}
            </div>
            <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">Catatan: perbedaan ukuran antar preset bergantung pada konten PDF. PDF yang sudah terkompres mungkin tidak banyak berubah.</p>
          </div>

          {error ? (
            <div role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-400/30 dark:bg-red-400/10">
              <p className="text-sm font-medium text-red-700 dark:text-red-300">{error}</p>
              <button type="button" onClick={handleProcess} disabled={!file} className="mt-3 rounded-md border border-red-300 bg-white px-4 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-50 disabled:opacity-50 dark:border-red-400/40 dark:bg-transparent dark:text-red-300">Coba Lagi</button>
            </div>
          ) : null}
        </div>

        <aside className="rounded-[18px] border border-slate-200 bg-brand-paper p-5 dark:border-brand-line dark:bg-slate-950/70">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Output</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-brand-ink dark:text-slate-100">PDF Lebih Kecil</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">File diproses sementara dan bisa langsung diunduh setelah selesai.</p>

          {!isDone ? (
            <button type="button" disabled={!file || isProcessing} onClick={handleProcess} aria-busy={isProcessing} className="mt-6 w-full rounded-md bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 dark:bg-white dark:text-brand-night dark:hover:bg-slate-200 dark:disabled:bg-slate-800 dark:disabled:text-slate-500">
              {isProcessing ? <span className="flex items-center justify-center gap-2"><span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" />Memproses...</span> : "Kompres PDF"}
            </button>
          ) : null}

          {result ? (
            <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-400/30 dark:bg-emerald-400/10">
              <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">Selesai diproses.</p>
              <div className="mt-3 grid gap-1.5 text-xs text-emerald-800 dark:text-emerald-200">
                {result.originalSize ? <p>Ukuran awal: <strong>{formatBytes(result.originalSize)}</strong></p> : null}
                {result.outputSize ? <p>Ukuran hasil: <strong>{formatBytes(result.outputSize)}</strong></p> : null}
                {typeof result.reductionPercent === "number" ? (
                  <p>Pengurangan: <strong>{result.reductionPercent}%</strong></p>
                ) : null}
                {(result as { sizeNote?: string | null }).sizeNote ? (
                  <p className="mt-1 text-amber-700 dark:text-amber-300">{(result as { sizeNote?: string | null }).sizeNote}</p>
                ) : null}
              </div>
              <a href={fileUrl(result.downloadUrl) ?? "#"} className="mt-4 inline-flex w-full justify-center rounded-md bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">Download PDF</a>
              <button type="button" onClick={handleReset} className="mt-3 w-full rounded-md border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-brand-line dark:bg-transparent dark:text-slate-400 dark:hover:bg-slate-800">Proses File Baru</button>
            </div>
          ) : null}
        </aside>
      </div>
    </section>
  );
}