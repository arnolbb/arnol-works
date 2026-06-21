import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { webAppSchema } from "@/lib/structured-data";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { CompressPdfForm } from "@/components/tools/compress-pdf-form";
import { StatusBadge } from "@/components/ui";

export const metadata: Metadata = {
  title: "Kompres PDF",
  description: "Perkecil ukuran PDF agar lebih mudah diupload ke email, Google Form, atau sistem administrasi. Gratis tanpa login.",
  openGraph: { title: "Kompres PDF — Arnol Works", description: "Perkecil ukuran PDF secara instan. Gratis tanpa login.", url: "https://arnol.my.id/tools/compress-pdf" },
};

export default function ToolPage() {
  return (
    <PageShell className="py-8 sm:py-12 lg:py-16">
      <JsonLd data={webAppSchema("Kompres PDF", "Perkecil ukuran PDF agar lebih mudah diupload.", "/tools/compress-pdf")} />
      <div className="mb-8 rounded-[28px] border border-slate-200 bg-white/90 p-6 dark:border-brand-line dark:bg-slate-900/60 sm:p-8">
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs uppercase tracking-[0.22em] text-slate-600 dark:text-slate-400">
          <Link href="/tools" className="hover:text-brand-primary dark:hover:text-indigo-300">Tools</Link>
          <span>›</span>
          <span className="text-brand-primary dark:text-indigo-300">PDF Utility</span>
        </div>
        <h1 className="mt-5 text-3xl font-semibold tracking-[-0.03em] text-brand-ink dark:text-slate-100 sm:text-4xl">Kompres PDF</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-700 dark:text-slate-300 sm:text-base sm:leading-8">Perkecil ukuran PDF agar lebih mudah diupload ke email, Google Form, website kampus, lamaran kerja, atau sistem administrasi.</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <StatusBadge tone="emerald">Gratis</StatusBadge>
          <StatusBadge tone="indigo">Tanpa Login</StatusBadge>
          <StatusBadge tone="slate">File Sementara</StatusBadge>
        </div>
      </div>
      <CompressPdfForm />
    </PageShell>
  );
}