import { PageShell } from "@/components/page-shell";
import { Eyebrow, Panel } from "@/components/ui";

const principles = ["Useful before fancy", "Ship kecil tapi nyata", "Belajar lewat produk", "Dokumentasikan proses"];

export default function AboutPage() {
  return (
    <PageShell>
      <section className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
        <Panel className="p-7 sm:p-10">
          <Eyebrow>About</Eyebrow>
          <h1 className="mt-5 text-4xl font-semibold tracking-[-0.03em] text-brand-ink dark:text-slate-100">Tentang Arnol Works</h1>
          <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-400">Arnol Works adalah portfolio berbasis multi-tools platform. Setiap tools dibuat untuk menyelesaikan masalah nyata sekaligus menunjukkan proses membangun produk web yang rapi, berguna, dan bisa dikembangkan.</p>
          <p className="mt-5 text-base leading-8 text-slate-600 dark:text-slate-400">Fokusnya sederhana: membangun utilitas kecil yang bisa langsung dipakai, lalu memperbaikinya bertahap dari pengalaman pengguna nyata.</p>
        </Panel>
        <Panel as="aside" className="p-6">
          <Eyebrow>Build Principles</Eyebrow>
          <div className="mt-5 grid gap-3">
            {principles.map((item) => <div key={item} className="rounded-xl border border-slate-200 bg-brand-paper p-4 text-sm font-medium text-brand-ink dark:border-brand-line dark:bg-slate-950/70 dark:text-slate-100">{item}</div>)}
          </div>
        </Panel>
      </section>
    </PageShell>
  );
}
