import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { PdfUploadForm } from "@/components/pdf/pdf-upload-form";

const badges = ["Gratis", "Aman", "Cepat"];

export default function PdfColorBwSplitterPage() {
  return (
    <PageShell className="py-8 sm:py-12 lg:py-16">
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs uppercase tracking-[0.22em] text-slate-600">
          <Link href="/tools" className="hover:text-brand-primary">Tools</Link>
          <span>›</span>
          <span className="text-brand-primary">Pisah PDF Warna & Hitam Putih</span>
        </div>
        <h1 className="mt-5 text-3xl sm:text-4xl font-semibold tracking-[-0.03em] text-brand-ink">Pisah PDF Warna & Hitam Putih</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 sm:text-base sm:leading-8 text-slate-700">
          Analisis dokumen Anda secara otomatis untuk mendeteksi halaman berwarna dan memisahkannya untuk menghemat biaya cetak.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {badges.map((badge, index) => <span key={badge} className={`rounded-full px-4 py-2 font-mono text-xs uppercase tracking-wide ${index === 0 ? "bg-emerald-50 text-emerald-700" : index === 1 ? "bg-brand-soft text-brand-primary" : "bg-slate-100 text-slate-700"}`}>{badge}</span>)}
        </div>
      </div>
      <PdfUploadForm />
    </PageShell>
  );
}

