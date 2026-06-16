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
      {/* Redesigned Header Panel to match Projects & Tools page styling */}
      <Panel as="section" className="relative overflow-hidden p-7 sm:p-10 mb-8">
        <div className="absolute right-0 top-0 -z-10 h-52 w-52 rounded-full bg-brand-primary/10 blur-3xl dark:bg-indigo-900/5" />
        <div className="relative">
          <Eyebrow>Notes</Eyebrow>
          <h1 className="mt-5 text-4xl font-semibold tracking-[-0.03em] text-brand-ink dark:text-slate-100">Build Notes</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-400">Catatan pendek tentang keputusan desain, teknis, dan arah pengembangan Arnol Works.</p>
        </div>
      </Panel>
      
      <section className="mt-8 grid gap-5 md:grid-cols-3">
        {notes.map((note, index) => (
          <Panel key={note.title} as="article" className="p-6 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(74,62,230,0.06)] hover:border-brand-primary/30 dark:hover:border-indigo-400/30">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand-primary dark:text-indigo-300">Catatan 0{index + 1}</p>
            <h2 className="mt-5 text-xl font-semibold text-brand-ink dark:text-slate-100">{note.title}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">{note.text}</p>
          </Panel>
        ))}
      </section>
      <div className="mt-8 flex">
        <ButtonLink href="/projects" variant="secondary">Lihat Proyek</ButtonLink>
      </div>
    </PageShell>
  );
}
