import { PageShell } from "@/components/page-shell";

const contacts = [
  { label: "Domain", value: "arnol.my.id" },
  { label: "Email", value: "hello@arnol.my.id" },
  { label: "Focus", value: "Tools, web apps, product experiments" },
];

export default function ContactPage() {
  return (
    <PageShell>
      <section className="grid gap-8 lg:grid-cols-[1fr_420px] lg:items-start">
        <div className="rounded-[28px] border border-slate-200 bg-white p-7 sm:p-10">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-slate-500">Contact</p>
          <h1 className="mt-5 text-4xl font-semibold tracking-[-0.03em] text-brand-ink">Kontak</h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">Untuk feedback tools, ide utilitas baru, atau peluang project, hubungi Arnol Works melalui kanal berikut.</p>
        </div>
        <div className="grid gap-4">
          {contacts.map((item) => <div key={item.label} className="rounded-[18px] border border-slate-200 bg-white p-5"><p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500">{item.label}</p><p className="mt-3 break-words font-medium text-brand-ink">{item.value}</p></div>)}
        </div>
      </section>
    </PageShell>
  );
}