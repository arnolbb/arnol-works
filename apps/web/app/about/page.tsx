import { PageShell } from "@/components/page-shell";

const principles = ["Useful before fancy", "Ship kecil tapi nyata", "Belajar lewat produk", "Dokumentasikan proses"];

export default function AboutPage() {
  return (
    <PageShell>
      <section className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
        <div className="rounded-[28px] border border-slate-200 bg-white p-7 sm:p-10">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-slate-500">About</p>
          <h1 className="mt-5 text-4xl font-semibold tracking-[-0.03em] text-brand-ink">Tentang Arnol Works</h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">Arnol Works adalah portfolio berbasis multi-tools platform. Setiap tools dibuat untuk menyelesaikan masalah nyata sekaligus menunjukkan proses membangun produk web yang rapi, berguna, dan bisa dikembangkan.</p>
          <p className="mt-5 text-base leading-8 text-slate-600">Fokusnya sederhana: membangun utilitas kecil yang bisa langsung dipakai, lalu memperbaikinya bertahap dari pengalaman pengguna nyata.</p>
        </div>
        <aside className="rounded-[24px] border border-slate-200 bg-white p-6">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">Build Principles</p>
          <div className="mt-5 grid gap-3">
            {principles.map((item) => <div key={item} className="rounded-xl border border-slate-200 bg-brand-paper p-4 text-sm font-medium text-brand-ink">{item}</div>)}
          </div>
        </aside>
      </section>
    </PageShell>
  );
}