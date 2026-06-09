import { PageShell } from "@/components/page-shell";

export default function ContactPage() {
  return (
    <PageShell>
      <section className="max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-slate-500">Contact</p>
        <h1 className="mt-5 text-4xl font-semibold tracking-[-0.03em] text-brand-ink">Kontak</h1>
        <p className="mt-5 text-lg leading-8 text-slate-600">Untuk kolaborasi, feedback tools, atau peluang project, hubungi Arnol melalui domain dan email yang tersedia.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-[18px] border border-slate-200 bg-white p-5"><p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500">Domain</p><p className="mt-3 font-medium text-brand-ink">arnol.web.id</p></div>
          <div className="rounded-[18px] border border-slate-200 bg-white p-5"><p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500">Email</p><p className="mt-3 font-medium text-brand-ink">hello@arnol.web.id</p></div>
        </div>
      </section>
    </PageShell>
  );
}
