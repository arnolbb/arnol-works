import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { PdfUploadForm } from "@/components/pdf/pdf-upload-form";
import { StatusBadge } from "@/components/ui";

const badges = [
  { label: "Gratis", tone: "emerald" as const },
  { label: "Aman", tone: "indigo" as const },
  { label: "Cepat", tone: "slate" as const },
];

export default function PdfColorBwSplitterPage() {
  return (
    <PageShell className="py-8 sm:py-12 lg:py-16">
      <div className="mb-8 rounded-[28px] border border-slate-200 bg-white/90 p-6 dark:border-brand-line dark:bg-slate-900/60 sm:p-8">
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs uppercase tracking-[0.22em] text-slate-600 dark:text-slate-400">
          <Link href="/tools" className="hover:text-brand-primary dark:hover:text-indigo-300">Tools</Link>
          <span>›</span>
          <span className="text-brand-primary dark:text-indigo-300">Pisah PDF Warna & Hitam Putih</span>
        </div>
        <h1 className="mt-5 text-3xl font-semibold tracking-[-0.03em] text-brand-ink dark:text-slate-100 sm:text-4xl">Pisah PDF Warna & Hitam Putih</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-700 dark:text-slate-300 sm:text-base sm:leading-8">
          Upload dokumen, biarkan sistem menandai halaman berwarna, lalu cek manual sebelum PDF dipisahkan untuk kebutuhan print yang lebih hemat.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {badges.map((badge) => <StatusBadge key={badge.label} tone={badge.tone}>{badge.label}</StatusBadge>)}
        </div>
      </div>
      <PdfUploadForm />
    </PageShell>
  );
}

