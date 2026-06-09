import Link from "next/link";
import { PageShell } from "@/components/page-shell";

const notes = [
  { title: "Kenapa mulai dari PDF splitter?", text: "Masalahnya jelas, dampaknya langsung terasa, dan cocok untuk menguji flow upload-processing-download." },
  { title: "Frontend polish v3", text: "Homepage diarahkan menjadi tools lab yang lebih personal, bukan template SaaS generik." },
  { title: "Deploy notes", text: "Frontend di Vercel, backend FastAPI di Cloud Run, dan domain utama di arnol.my.id." },
];

export default function CaseStudiesPage() {
  return (
    <PageShell>
      <section className="rounded-[28px] border border-slate-200 dark:border-brand-line bg-slate-950 p-7 text-white sm:p-10">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">Notes</p>
        <h1 className="mt-5 text-4xl font-semibold tracking-[-0.03em]">Build Notes</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">Catatan pendek tentang keputusan desain, teknis, dan arah pengembangan Arnol Works.</p>
      </section>
      <section className="mt-8 grid gap-5 md:grid-cols-3">
        {notes.map((note, index) => <article key={note.title} className="rounded-[22px] border border-slate-200 dark:border-brand-line bg-white dark:bg-brand-panel p-6"><p className="font-mono text-xs uppercase tracking-[0.2em] text-brand-primary">Note 0{index + 1}</p><h2 className="mt-5 text-xl font-semibold text-brand-ink dark:text-slate-100">{note.title}</h2><p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">{note.text}</p></article>)}
      </section>
      <Link href="/projects" className="mt-8 inline-flex rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-brand-panel px-5 py-3 text-sm font-semibold text-brand-ink dark:text-slate-100 hover:bg-brand-paper dark:hover:bg-slate-800 dark:bg-brand-night">Lihat Projects</Link>
    </PageShell>
  );
}