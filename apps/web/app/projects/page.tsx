import { PageShell } from "@/components/page-shell";

const projects = [
  { title: "Arnol Works", description: "Portfolio + multi-tools platform dengan tools PDF pertama yang sudah berjalan." },
  { title: "PDF Color/BW Splitter", description: "Mini product untuk memisahkan halaman warna dan hitam putih dari dokumen PDF." },
  { title: "Build Notes", description: "Catatan proses, keputusan teknis, dan pembelajaran dari eksperimen produk." },
];

export default function ProjectsPage() {
  return (
    <PageShell>
      <section>
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-slate-500">Projects</p>
        <h1 className="mt-5 text-4xl font-semibold tracking-[-0.03em] text-brand-ink">Projects</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">Beberapa project dan eksperimen produk yang menjadi bagian dari Arnol Works.</p>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {projects.map((item) => <article key={item.title} className="rounded-[18px] border border-slate-200 bg-white p-5"><div className="h-28 rounded-xl border border-slate-200 bg-brand-paper" /><h2 className="mt-4 font-medium text-brand-ink">{item.title}</h2><p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p></article>)}
        </div>
      </section>
    </PageShell>
  );
}
