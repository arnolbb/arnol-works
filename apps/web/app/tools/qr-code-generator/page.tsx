"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { StatusBadge } from "@/components/ui";
import { generateQR } from "@/lib/qr-encoder";

const COLORS = [
  { label: "Hitam", value: "#000000" },
  { label: "Biru Tua", value: "#1e3a5f" },
  { label: "Hijau Tua", value: "#14532d" },
  { label: "Merah Marun", value: "#7f1d1d" },
  { label: "Ungu", value: "#4c1d95" },
];

const SIZES = [200, 300, 400, 600, 800];

export default function QrCodeGeneratorPage() {
  const [text, setText] = useState("");
  const [color, setColor] = useState("#000000");
  const [bgColor] = useState("#ffffff");
  const [size, setSize] = useState(400);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [generated, setGenerated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const drawQR = useCallback(() => {
    if (!text.trim()) { setGenerated(false); setError(null); return; }
    try {
      const matrix = generateQR(text);
      const canvas = canvasRef.current;
      if (!canvas) return;
      const moduleCount = matrix.length;
      const quiet = 4;
      const totalModules = moduleCount + quiet * 2;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const moduleSize = size / totalModules;
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, size, size);
      ctx.fillStyle = color;
      for (let r = 0; r < moduleCount; r++)
        for (let c = 0; c < moduleCount; c++)
          if (matrix[r][c])
            ctx.fillRect(
              Math.round((c + quiet) * moduleSize),
              Math.round((r + quiet) * moduleSize),
              Math.ceil(moduleSize),
              Math.ceil(moduleSize),
            );
      setGenerated(true);
      setError(null);
    } catch {
      setError("Teks terlalu panjang untuk QR code.");
      setGenerated(false);
    }
  }, [text, color, bgColor, size]);

  useEffect(() => { drawQR(); }, [drawQR]);

  const handleDownload = useCallback((format: "png" | "jpg") => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `qr-code.${format}`;
    link.href = canvas.toDataURL(format === "jpg" ? "image/jpeg" : "image/png", 0.95);
    link.click();
  }, []);

  return (
    <PageShell className="py-8 sm:py-12 lg:py-16">
      <div className="mb-8 rounded-[28px] border border-slate-200 bg-white/90 p-6 dark:border-brand-line dark:bg-slate-900/60 sm:p-8">
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs uppercase tracking-[0.22em] text-slate-600 dark:text-slate-400">
          <Link href="/tools" className="hover:text-brand-primary dark:hover:text-indigo-300">Tools</Link>
          <span>›</span>
          <span className="text-brand-primary dark:text-indigo-300">Generator</span>
        </div>
        <h1 className="mt-5 text-3xl font-semibold tracking-[-0.03em] text-brand-ink dark:text-slate-100 sm:text-4xl">QR Code Generator</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-700 dark:text-slate-300 sm:text-base sm:leading-8">Buat QR code dari teks atau URL secara instan. Cocok untuk UMKM, event, dan media sosial.</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <StatusBadge tone="emerald">Gratis</StatusBadge>
          <StatusBadge tone="indigo">Tanpa Login</StatusBadge>
          <StatusBadge tone="slate">Instan</StatusBadge>
        </div>
      </div>

      <section className="rounded-[22px] border border-slate-200 bg-white p-5 dark:border-brand-line dark:bg-slate-900/75 sm:p-7">
        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <div>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Input</p>
            <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Masukkan teks atau URL..." rows={4} className="w-full resize-y rounded-[18px] border border-slate-300 bg-slate-50 p-5 text-sm leading-7 text-brand-ink outline-none transition focus:border-brand-primary dark:border-slate-700 dark:bg-slate-950/70 dark:text-slate-100 dark:focus:border-indigo-400" />

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="rounded-2xl border border-slate-200 bg-brand-paper p-4 dark:border-brand-line dark:bg-slate-950/70">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Warna</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {COLORS.map((c) => (
                    <button key={c.value} type="button" onClick={() => setColor(c.value)} title={c.label} className={`h-8 w-8 rounded-full border-2 transition ${color === c.value ? "border-brand-primary scale-110 dark:border-indigo-400" : "border-slate-200 dark:border-slate-700"}`} style={{ backgroundColor: c.value }} />
                  ))}
                </div>
              </label>
              <label className="rounded-2xl border border-slate-200 bg-brand-paper p-4 dark:border-brand-line dark:bg-slate-950/70">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Ukuran</span>
                <select value={size} onChange={(e) => setSize(Number(e.target.value))} className="mt-2 block w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-brand-ink dark:border-brand-line dark:bg-slate-900 dark:text-slate-100">
                  {SIZES.map((s) => <option key={s} value={s}>{s} × {s} px</option>)}
                </select>
              </label>
            </div>

            {error ? <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-400/30 dark:bg-red-400/10 dark:text-red-300">{error}</div> : null}
          </div>

          <aside className="flex flex-col items-center rounded-[18px] border border-slate-200 bg-brand-paper p-5 dark:border-brand-line dark:bg-slate-950/70">
            <p className="self-start font-mono text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Preview</p>
            <div className="mt-4 flex items-center justify-center rounded-xl bg-white p-3 dark:bg-white">
              <canvas ref={canvasRef} width={size} height={size} className="max-w-full" style={{ imageRendering: "pixelated", maxHeight: 320 }} />
            </div>
            {!generated && !error ? <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Masukkan teks untuk generate QR code.</p> : null}
            {generated ? (
              <div className="mt-5 flex w-full gap-2">
                <button type="button" onClick={() => handleDownload("png")} className="flex-1 rounded-md bg-black px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-brand-night dark:hover:bg-slate-200">Download PNG</button>
                <button type="button" onClick={() => handleDownload("jpg")} className="flex-1 rounded-md border border-slate-300 px-4 py-2.5 text-sm font-semibold text-brand-ink transition hover:border-slate-500 dark:border-brand-line dark:text-slate-100 dark:hover:border-slate-500">Download JPG</button>
              </div>
            ) : null}
          </aside>
        </div>
      </section>
    </PageShell>
  );
}
