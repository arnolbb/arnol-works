"use client";

import { useState, useCallback } from "react";
import { fileUrl, type ToolProcessResult } from "@/lib/api-client";
import { API_BASE_URL } from "@/lib/api-client";

function formatBytes(bytes: number) {
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes; let i = 0;
  while (value >= 1024 && i < units.length - 1) { value /= 1024; i++; }
  return `${value.toFixed(value >= 10 || i === 0 ? 0 : 1)} ${units[i]}`;
}

type FileEntry = { id: string; file: File };

function makeEntry(file: File): FileEntry {
  return { id: `${file.name}-${file.size}-${Math.random()}`, file };
}

export function MergePdfForm() {
  const [entries, setEntries] = useState<FileEntry[]>([]);
  const [status, setStatus] = useState<"idle" | "processing" | "done">("idle");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ToolProcessResult | null>(null);

  const addFiles = useCallback((newFiles: FileList | null) => {
    if (!newFiles) return;
    setEntries((prev) => [...prev, ...Array.from(newFiles).map(makeEntry)]);
  }, []);

  const remove = useCallback((id: string) => setEntries((prev) => prev.filter((e) => e.id !== id)), []);

  const moveUp = useCallback((index: number) => {
    if (index <= 0) return;
    setEntries((prev) => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  }, []);

  const moveDown = useCallback((index: number) => {
    setEntries((prev) => {
      if (index >= prev.length - 1) return prev;
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next;
    });
  }, []);

  async function handleProcess() {
    if (entries.length < 2) return;
    setStatus("processing"); setError(null); setResult(null);
    try {
      const formData = new FormData();
      for (const entry of entries) formData.append("files", entry.file);
      const response = await fetch(`${API_BASE_URL}/api/pdf/merge`, { method: "POST", body: formData });
      if (!response.ok) {
        const data = await response.json().catch(() => ({})) as { error?: { message?: string } };
        throw new Error(data.error?.message ?? "Gagal menggabungkan PDF.");
      }
      const data = await response.json() as ToolProcessResult;
      setResult(data); setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Tool gagal memproses file.");
      setStatus("idle");
    }
  }

  function handleReset() { setEntries([]); setStatus("idle"); setError(null); setResult(null); }

  const isProcessing = status === "processing";
  const isDone = status === "done";
  const canProcess = entries.length >= 2 && !isProcessing;

  return (
    <section className="rounded-[22px] border border-slate-200 bg-white p-5 dark:border-brand-line dark:bg-slate-900/75 sm:p-7">
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div>
          {/* Upload zone */}
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-[18px] border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center transition hover:border-brand-primary dark:border-slate-700 dark:bg-slate-950/70">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-brand-soft font-mono text-sm font-semibold text-brand-primary dark:bg-indigo-400/10 dark:text-indigo-300">PDF</span>
            <span className="mt-3 text-base font-medium text-brand-ink dark:text-slate-100">Tambahkan File PDF</span>
            <span className="mt-1 text-xs text-slate-500 dark:text-slate-400">Pilih satu atau lebih PDF. Min 2 file untuk mulai.</span>
            <span className="mt-4 rounded-md bg-brand-primary px-4 py-2 text-sm font-semibold text-white">Pilih File</span>
            <input type="file" accept="application/pdf,.pdf" multiple className="sr-only" onChange={(e) => addFiles(e.target.files)} />
          </label>

          {/* File list with reorder controls */}
          {entries.length > 0 ? (
            <div className="mt-5 rounded-2xl border border-slate-200 bg-brand-paper p-4 dark:border-brand-line dark:bg-slate-950/70">
              <div className="flex items-center justify-between">
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Urutan Gabungan ({entries.length} file)</p>
                <label className="cursor-pointer rounded-md border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-slate-400 dark:border-brand-line dark:text-slate-400">
                  + Tambah
                  <input type="file" accept="application/pdf,.pdf" multiple className="sr-only" onChange={(e) => addFiles(e.target.files)} />
                </label>
              </div>
              <ol className="mt-4 grid gap-2">
                {entries.map((entry, index) => (
                  <li key={entry.id} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 dark:border-brand-line/60 dark:bg-slate-900">
                    <span className="shrink-0 w-5 text-center font-mono text-xs text-slate-400">{index + 1}</span>
                    <span className="flex-1 truncate text-sm text-slate-700 dark:text-slate-300">{entry.file.name}</span>
                    <span className="shrink-0 text-xs text-slate-400">{formatBytes(entry.file.size)}</span>
                    <div className="flex shrink-0 gap-1">
                      <button type="button" onClick={() => moveUp(index)} disabled={index === 0} aria-label="Pindah ke atas" className="rounded p-1 text-slate-400 transition hover:bg-slate-100 disabled:opacity-30 dark:hover:bg-slate-800">↑</button>
                      <button type="button" onClick={() => moveDown(index)} disabled={index === entries.length - 1} aria-label="Pindah ke bawah" className="rounded p-1 text-slate-400 transition hover:bg-slate-100 disabled:opacity-30 dark:hover:bg-slate-800">↓</button>
                      <button type="button" onClick={() => remove(entry.id)} aria-label="Hapus file" className="rounded p-1 text-red-400 transition hover:bg-red-50 dark:hover:bg-red-400/10">✕</button>
                    </div>
                  </li>
                ))}
              </ol>
              <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">Urutan di atas adalah urutan halaman dalam hasil PDF gabungan.</p>
            </div>
          ) : null}

          {error ? (
            <div role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-400/30 dark:bg-red-400/10">
              <p className="text-sm font-medium text-red-700 dark:text-red-300">{error}</p>
              <button type="button" onClick={handleProcess} disabled={!canProcess} className="mt-3 rounded-md border border-red-300 bg-white px-4 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-50 disabled:opacity-50 dark:border-red-400/40 dark:bg-transparent dark:text-red-300">Coba Lagi</button>
            </div>
          ) : null}
        </div>

        <aside className="rounded-[18px] border border-slate-200 bg-brand-paper p-5 dark:border-brand-line dark:bg-slate-950/70">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Output</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-brand-ink dark:text-slate-100">PDF Gabungan</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">Minimal 2 file PDF. Urutan halaman mengikuti daftar di kiri.</p>

          {!isDone ? (
            <button type="button" disabled={!canProcess} onClick={handleProcess} aria-busy={isProcessing} className="mt-6 w-full rounded-md bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 dark:bg-white dark:text-brand-night dark:hover:bg-slate-200 dark:disabled:bg-slate-800 dark:disabled:text-slate-500">
              {isProcessing ? <span className="flex items-center justify-center gap-2"><span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" />Menggabungkan...</span> : "Gabungkan PDF"}
            </button>
          ) : null}

          {result ? (
            <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-400/30 dark:bg-emerald-400/10">
              <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">Selesai digabungkan.</p>
              <div className="mt-3 grid gap-1 text-xs text-emerald-800 dark:text-emerald-200">
                {result.fileCount ? <p>Total file: <strong>{result.fileCount} PDF</strong></p> : null}
                {result.totalPages ? <p>Total halaman: <strong>{result.totalPages} hal</strong></p> : null}
                {result.outputSize ? <p>Ukuran hasil: <strong>{formatBytes(result.outputSize)}</strong></p> : null}
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