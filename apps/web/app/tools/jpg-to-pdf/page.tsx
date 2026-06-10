import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { SimpleToolForm } from "@/components/tools/simple-tool-form";
import { StatusBadge } from "@/components/ui";

export default function ToolPage() {
  return (
    <PageShell className="py-8 sm:py-12 lg:py-16">
      <div className="mb-8 rounded-[28px] border border-slate-200 bg-white/90 p-6 dark:border-brand-line dark:bg-slate-900/60 sm:p-8">
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs uppercase tracking-[0.22em] text-slate-600 dark:text-slate-400">
          <Link href="/tools" className="hover:text-brand-primary dark:hover:text-indigo-300">Tools</Link>
          <span>›</span>
          <span className="text-brand-primary dark:text-indigo-300">Image to PDF</span>
        </div>
        <h1 className="mt-5 text-3xl font-semibold tracking-[-0.03em] text-brand-ink dark:text-slate-100 sm:text-4xl">JPG/PNG ke PDF</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-700 dark:text-slate-300 sm:text-base sm:leading-8">Ubah foto dokumen, scan HP, atau gambar JPG/PNG menjadi satu file PDF yang mudah dikirim.</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <StatusBadge tone="emerald">Gratis</StatusBadge>
          <StatusBadge tone="indigo">Tanpa Login</StatusBadge>
          <StatusBadge tone="slate">File Sementara</StatusBadge>
        </div>
      </div>
      <SimpleToolForm endpoint="/api/image/to-pdf" accept="image/jpeg,image/png,.jpg,.jpeg,.png" multiple title="JPG/PNG ke PDF" description="Ubah foto dokumen, scan HP, atau gambar JPG/PNG menjadi satu file PDF yang mudah dikirim." buttonLabel="Buat PDF" outputLabel="PDF dari gambar" />
    </PageShell>
  );
}
