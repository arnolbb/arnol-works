import { PageShell } from "@/components/page-shell";
import { Eyebrow, Panel } from "@/components/ui";

export const metadata = { title: "Kontak — Arnol Works" };

const contacts = [
  { label: "Domain", value: "arnol.my.id" },
  { label: "Email", value: "hello@arnol.my.id" },
  { label: "Fokus", value: "Tools, web apps, product experiments" },
];

export default function ContactPage() {
  return (
    <PageShell>
      <section className="grid gap-8 lg:grid-cols-[1fr_420px] lg:items-start">
        <Panel className="p-7 sm:p-10">
          <Eyebrow>Contact</Eyebrow>
          <h1 className="mt-5 text-4xl font-semibold tracking-[-0.03em] text-brand-ink dark:text-slate-100">Diskusi &amp; Kolaborasi</h1>
          <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-400">
            Punya ide tool yang berguna, ingin berdiskusi tentang project, atau tertarik kolaborasi? Arnol terbuka untuk berbagai bentuk kerja sama.
          </p>
          <p className="mt-5 text-base leading-7 text-slate-600 dark:text-slate-400">
            Untuk feedback tools yang sudah ada, laporan bug, atau saran fitur — kirim email langsung. Setiap masukan membantu membuat Arnol Works lebih baik.
          </p>
          <div className="mt-8">
            <a
              href="mailto:hello@arnol.my.id"
              className="inline-flex justify-center rounded-md bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-brand-night dark:hover:bg-slate-200"
            >
              Kirim Email
            </a>
          </div>
        </Panel>
        <div className="grid gap-4">
          {contacts.map((item) => (
            <Panel key={item.label} className="p-5">
              <Eyebrow className="tracking-[0.18em]">{item.label}</Eyebrow>
              <p className="mt-3 break-words font-medium text-brand-ink dark:text-slate-100">{item.value}</p>
            </Panel>
          ))}
        </div>
      </section>
    </PageShell>
  );
}