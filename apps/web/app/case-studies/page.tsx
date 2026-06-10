import { PageShell } from "@/components/page-shell";
import { ButtonLink, Eyebrow, Panel } from "@/components/ui";

const notes = [
  { title: "Kenapa mulai dari PDF splitter?", text: "Masalahnya jelas, dampaknya langsung terasa, dan cocok untuk menguji flow upload-processing-download." },
  { title: "Frontend polish v3", text: "Homepage diarahkan menjadi tools lab yang lebih personal, bukan template SaaS generik." },
  { title: "Deploy notes", text: "Frontend di Vercel, backend FastAPI di Cloud Run, dan domain utama di arnol.my.id." },
];

export default function CaseStudiesPage() {
  return (
    <PageShell>
      <section className="relative overflow-hidden rounded-[28px] border border-slate-800 bg-slate-950 p-7 text-white shadow-[0_24px_80px_rgba(15,23,42,0.18)] sm:p-10 dark:border-brand-line">
        <div className="absolute right-0 top-0 h-52 w-52 rounded-full bg-brand-primary/25 blur-3xl" />
        <div className="relative">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-slate-400">Notes</p>
          <h1 className="mt-5 text-4xl font-semibold tracking-[-0.03em]">Build Notes</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">Catatan pendek tentang keputusan desain, teknis, dan arah pengembangan Arnol Works.</p>
        </div>
      </section>
      <section className="mt-8 grid gap-5 md:grid-cols-3">
        {notes.map((note, index) => <Panel key={note.title} as="article" className="p-6"><p className="font-mono text-xs uppercase tracking-[0.2em] text-brand-primary dark:text-indigo-300">Note 0{index + 1}</p><h2 className="mt-5 text-xl font-semibold text-brand-ink dark:text-slate-100">{note.title}</h2><p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">{note.text}</p></Panel>)}
      </section>
      <ButtonLink href="/projects" variant="secondary" className="mt-8">Lihat Projects</ButtonLink>
    </PageShell>
  );
}
