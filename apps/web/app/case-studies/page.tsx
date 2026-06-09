import { PageShell } from "@/components/page-shell";

export default function CaseStudiesPage() {
  return (
    <PageShell>
      <section className="max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-slate-500">Notes</p>
        <h1 className="mt-5 text-4xl font-semibold tracking-[-0.03em] text-brand-ink">Build Notes</h1>
        <p className="mt-5 text-lg leading-8 text-slate-600">Catatan proses membangun tools dan eksperimen produk Arnol Works. Halaman ini disiapkan untuk case study yang lebih lengkap.</p>
      </section>
    </PageShell>
  );
}
