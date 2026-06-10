import { PageShell } from "@/components/page-shell";
import { Eyebrow, Panel } from "@/components/ui";

const contacts = [
  { label: "Domain", value: "arnol.my.id" },
  { label: "Email", value: "hello@arnol.my.id" },
  { label: "Focus", value: "Tools, web apps, product experiments" },
];

export default function ContactPage() {
  return (
    <PageShell>
      <section className="grid gap-8 lg:grid-cols-[1fr_420px] lg:items-start">
        <Panel className="p-7 sm:p-10">
          <Eyebrow>Contact</Eyebrow>
          <h1 className="mt-5 text-4xl font-semibold tracking-[-0.03em] text-brand-ink dark:text-slate-100">Kontak</h1>
          <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-400">Untuk feedback tools, ide utilitas baru, atau peluang project, hubungi Arnol Works melalui kanal berikut.</p>
        </Panel>
        <div className="grid gap-4">
          {contacts.map((item) => <Panel key={item.label} className="p-5"><Eyebrow className="tracking-[0.18em]">{item.label}</Eyebrow><p className="mt-3 break-words font-medium text-brand-ink dark:text-slate-100">{item.value}</p></Panel>)}
        </div>
      </section>
    </PageShell>
  );
}
