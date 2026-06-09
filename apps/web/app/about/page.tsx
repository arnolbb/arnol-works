import { PageShell } from "@/components/page-shell";

export default function AboutPage() {
  return (
    <PageShell>
      <section className="max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-slate-500">About</p>
        <h1 className="mt-5 text-4xl font-semibold tracking-[-0.03em] text-brand-ink">Tentang Arnol Works</h1>
        <p className="mt-5 text-lg leading-8 text-slate-600">Arnol Works adalah portfolio berbasis multi-tools platform. Setiap tools dibuat untuk menyelesaikan masalah nyata sekaligus menunjukkan proses membangun produk web yang rapi, berguna, dan bisa dikembangkan.</p>
      </section>
    </PageShell>
  );
}
