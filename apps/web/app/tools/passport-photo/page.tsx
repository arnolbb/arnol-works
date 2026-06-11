"use client";

import { useState } from "react";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { StatusBadge } from "@/components/ui";
import { API_BASE_URL } from "@/lib/api-client";

const SIZES = [
  { key: "2x3", label: "2×3 cm" },
  { key: "3x4", label: "3×4 cm" },
  { key: "4x6", label: "4×6 cm" },
];

const BG_COLORS = [
  { key: "merah", label: "Merah", hex: "#ef4444" },
  { key: "biru", label: "Biru", hex: "#3b82f6" },
  { key: "putih", label: "Putih", hex: "#f1f5f9" },
];

type PassportResult = {
  jobId: string;
  downloadUrl: string;
  singleUrl: string;
  sheetUrl: string;
  sizeKey: string;
  bgColor: string;
  outputSize: number;
};

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

export default function PassportPhotoPage() {
  const [file, setFile] = useState<File | null>(null);
  const [sizeKey, setSizeKey] = useState("3x4");
  const [bgColor, setBgColor] = useState("merah");
  const [status, setStatus] = useState<"idle" | "processing" | "done">("idle");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PassportResult | null>(null);

  async function handleProcess() {
    if (!file) return;
    setStatus("processing");
    setError(null);
    setResult(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("size", sizeKey);
      formData.append("bgColor", bgColor);
      const response = await fetch(`${API_BASE_URL}/api/image/passport-photo`, { method: "POST", body: formData });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error?.message ?? "Gagal membuat pas foto.");
      }
      const data: PassportResult = await response.json();
      setResult(data);
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal membuat pas foto.");
      setStatus("idle");
    }
  }

  return (
    <PageShell className="py-8 sm:py-12 lg:py-16">
      <div className="mb-8 rounded-[28px] border border-slate-200 bg-white/90 p-6 dark:border-brand-line dark:bg-slate-900/60 sm:p-8">
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs uppercase tracking-[0.22em] text-slate-600 dark:text-slate-400">
          <Link href="/tools" className="hover:text-brand-primary dark:hover:text-indigo-300">Tools</Link>
          <span>›</span>
          <span className="text-brand-primary dark:text-indigo-300">Image Utility</span>
        </div>
        <h1 className="mt-5 text-3xl font-semibold tracking-[-0.03em] text-brand-ink dark:text-slate-100 sm:text-4xl">Pas Foto Generator</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-700 dark:text-slate-300 sm:text-base sm:leading-8">Buat pas foto ukuran 2×3, 3×4, atau 4×6 dengan background merah, biru, atau putih. Otomatis hapus background dan siap cetak.</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <StatusBadge tone="emerald">Gratis</StatusBadge>
          <StatusBadge tone="indigo">AI Background</StatusBadge>
          <StatusBadge tone="slate">Siap Cetak</StatusBadge>
        </div>
      </div>

      <section className="rounded-[22px] border border-slate-200 bg-white p-5 dark:border-brand-line dark:bg-slate-900/75 sm:p-7">
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div>
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-[18px] border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center transition hover:border-brand-primary dark:border-slate-700 dark:bg-slate-950/70">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-brand-soft font-mono text-sm font-semibold text-brand-primary dark:bg-indigo-400/10 dark:text-indigo-300">FOTO</span>
              <span className="mt-4 text-xl font-medium text-brand-ink dark:text-slate-100">Upload Foto</span>
              <span className="mt-2 max-w-lg text-sm leading-6 text-slate-600 dark:text-slate-400">Upload foto wajah JPG, PNG, atau WebP. Semakin jelas fotonya, semakin bagus hasilnya.</span>
              <span className="mt-5 rounded-md bg-brand-primary px-5 py-3 text-sm font-semibold text-white">Pilih Foto</span>
              <input type="file" accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp" className="sr-only" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            </label>

            {file ? (
              <div className="mt-5 rounded-2xl border border-slate-200 bg-brand-paper p-4 dark:border-brand-line dark:bg-slate-950/70">
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">File dipilih</p>
                <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{file.name} — {formatBytes(file.size)}</p>
              </div>
            ) : null}

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-brand-paper p-4 dark:border-brand-line dark:bg-slate-950/70">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Ukuran</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {SIZES.map((s) => (
                    <button key={s.key} type="button" onClick={() => setSizeKey(s.key)} className={`rounded-md border px-4 py-2 text-sm font-medium transition ${sizeKey === s.key ? "border-brand-primary bg-brand-primary text-white dark:border-indigo-400 dark:bg-indigo-500" : "border-slate-200 bg-white text-slate-700 hover:border-slate-400 dark:border-brand-line dark:bg-slate-900 dark:text-slate-300"}`}>{s.label}</button>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-brand-paper p-4 dark:border-brand-line dark:bg-slate-950/70">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Warna Background</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {BG_COLORS.map((c) => (
                    <button key={c.key} type="button" onClick={() => setBgColor(c.key)} className={`flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition ${bgColor === c.key ? "border-brand-primary bg-brand-soft text-brand-primary dark:border-indigo-400 dark:bg-indigo-400/10 dark:text-indigo-300" : "border-slate-200 bg-white text-slate-700 hover:border-slate-400 dark:border-brand-line dark:bg-slate-900 dark:text-slate-300"}`}>
                      <span className="inline-block h-4 w-4 rounded-full border border-slate-300" style={{ backgroundColor: c.hex }} />
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {error ? <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-400/30 dark:bg-red-400/10 dark:text-red-300">{error}</div> : null}
          </div>

          <aside className="rounded-[18px] border border-slate-200 bg-brand-paper p-5 dark:border-brand-line dark:bg-slate-950/70">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Output</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-brand-ink dark:text-slate-100">Pas Foto Siap Cetak</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">Kamu akan mendapat pas foto satuan dan lembar cetak ukuran 4R yang bisa langsung dicetak di tempat foto/print.</p>
            <button type="button" disabled={!file || status === "processing"} onClick={handleProcess} className="mt-6 w-full rounded-md bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 dark:bg-white dark:text-brand-night dark:hover:bg-slate-200 dark:disabled:bg-slate-800 dark:disabled:text-slate-500">
              {status === "processing" ? "Memproses..." : "Buat Pas Foto"}
            </button>

            {result ? (
              <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-200">
                <p className="font-semibold">Pas foto berhasil dibuat!</p>
                <div className="mt-3 grid gap-1 text-xs">
                  <p>Ukuran: {result.sizeKey}</p>
                  <p>Background: {result.bgColor}</p>
                </div>
                <div className="mt-4 grid gap-2">
                  <a href={`${API_BASE_URL}${result.singleUrl}`} className="inline-flex w-full justify-center rounded-md bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">Download Pas Foto</a>
                  <a href={`${API_BASE_URL}${result.sheetUrl}`} className="inline-flex w-full justify-center rounded-md border border-emerald-300 bg-white px-4 py-2.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 dark:border-emerald-400/30 dark:bg-transparent dark:text-emerald-300 dark:hover:bg-emerald-400/10">Download Lembar Cetak</a>
                  <a href={`${API_BASE_URL}${result.downloadUrl}`} className="inline-flex w-full justify-center rounded-md border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 dark:border-brand-line dark:bg-transparent dark:text-slate-300 dark:hover:bg-slate-800">Download Semua (ZIP)</a>
                </div>
              </div>
            ) : null}
          </aside>
        </div>
      </section>
    </PageShell>
  );
}
