"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { StatusBadge } from "@/components/ui";

function countStats(text: string) {
  const trimmed = text.trim();
  if (!trimmed) return { chars: 0, charsNoSpaces: 0, words: 0, sentences: 0, paragraphs: 0, lines: 0 };

  const chars = text.length;
  const charsNoSpaces = text.replace(/\s/g, "").length;
  const words = trimmed.split(/\s+/).filter(Boolean).length;
  const sentences = trimmed.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;
  const paragraphs = trimmed.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length;
  const lines = text.split("\n").length;
  return { chars, charsNoSpaces, words, sentences, paragraphs, lines };
}

function StatCard({ label, value }: Readonly<{ label: string; value: number }>) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-brand-paper p-4 text-center dark:border-brand-line dark:bg-slate-950/70">
      <p className="text-3xl font-semibold tracking-tight text-brand-ink dark:text-slate-100">{value.toLocaleString("id-ID")}</p>
      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  );
}

export default function WordCounterPage() {
  const [text, setText] = useState("");
  const stats = countStats(text);

  const handleClear = useCallback(() => setText(""), []);
  const handlePaste = useCallback(async () => {
    try {
      const clipText = await navigator.clipboard.readText();
      setText(clipText);
    } catch { /* clipboard not available */ }
  }, []);

  return (
    <PageShell className="py-8 sm:py-12 lg:py-16">
      <div className="mb-8 rounded-[28px] border border-slate-200 bg-white/90 p-6 dark:border-brand-line dark:bg-slate-900/60 sm:p-8">
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs uppercase tracking-[0.22em] text-slate-600 dark:text-slate-400">
          <Link href="/tools" className="hover:text-brand-primary dark:hover:text-indigo-300">Tools</Link>
          <span>›</span>
          <span className="text-brand-primary dark:text-indigo-300">Teks Utility</span>
        </div>
        <h1 className="mt-5 text-3xl font-semibold tracking-[-0.03em] text-brand-ink dark:text-slate-100 sm:text-4xl">Hitung Kata & Karakter</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-700 dark:text-slate-300 sm:text-base sm:leading-8">Hitung jumlah kata, karakter, kalimat, dan paragraf secara instan. Cocok untuk esai, skripsi, caption, dan konten.</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <StatusBadge tone="emerald">Gratis</StatusBadge>
          <StatusBadge tone="indigo">Tanpa Login</StatusBadge>
          <StatusBadge tone="slate">Realtime</StatusBadge>
        </div>
      </div>

      <section className="rounded-[22px] border border-slate-200 bg-white p-5 dark:border-brand-line dark:bg-slate-900/75 sm:p-7">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div>
            <div className="mb-3 flex items-center justify-between">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Teks</p>
              <div className="flex gap-2">
                <button type="button" onClick={handlePaste} className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-slate-400 dark:border-brand-line dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-500">Paste</button>
                <button type="button" onClick={handleClear} className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-slate-400 dark:border-brand-line dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-500">Hapus</button>
              </div>
            </div>
            <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Ketik atau paste teks di sini..." rows={14} className="w-full resize-y rounded-[18px] border border-slate-300 bg-slate-50 p-5 text-sm leading-7 text-brand-ink outline-none transition focus:border-brand-primary dark:border-slate-700 dark:bg-slate-950/70 dark:text-slate-100 dark:focus:border-indigo-400" />
          </div>

          <aside className="rounded-[18px] border border-slate-200 bg-brand-paper p-5 dark:border-brand-line dark:bg-slate-950/70">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Statistik</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <StatCard label="Kata" value={stats.words} />
              <StatCard label="Karakter" value={stats.chars} />
              <StatCard label="Tanpa Spasi" value={stats.charsNoSpaces} />
              <StatCard label="Kalimat" value={stats.sentences} />
              <StatCard label="Paragraf" value={stats.paragraphs} />
              <StatCard label="Baris" value={stats.lines} />
            </div>
            <div className="mt-5 rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 text-xs leading-5 text-slate-600 dark:border-indigo-400/20 dark:bg-indigo-400/5 dark:text-slate-400">
              <p className="font-semibold text-brand-primary dark:text-indigo-300">Tips</p>
              <p className="mt-1">Statistik dihitung otomatis saat kamu mengetik. Tidak ada data yang dikirim ke server.</p>
            </div>
          </aside>
        </div>
      </section>
    </PageShell>
  );
}
