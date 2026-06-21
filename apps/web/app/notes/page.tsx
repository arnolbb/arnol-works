import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { Eyebrow, Panel } from "@/components/ui";

export const metadata = { title: "Build Notes — Arnol Works" };

const notes = [
  { slug: "mengapa-pdf-splitter-dibangun", title: "Mengapa PDF Splitter Dibangun Pertama", date: "Juni 2026", readTime: "4 menit" },
];

export default function NotesIndexPage() {
  return (
    <PageShell className="py-10 sm:py-16">
      <Eyebrow>Build Notes</Eyebrow>
      <h1 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-brand-ink dark:text-slate-100">Catatan Proses</h1>
      <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-400">Dokumentasi keputusan teknis, tantangan, dan hal-hal yang dipelajari saat membangun Arnol Works.</p>
      <div className="mt-10 grid gap-5">
        {notes.map((note) => (
          <Panel key={note.slug} className="p-6">
            <p className="font-mono text-xs text-slate-500 dark:text-slate-400">{note.date} · {note.readTime} baca</p>
            <h2 className="mt-3 text-lg font-semibold text-brand-ink dark:text-slate-100">{note.title}</h2>
            <Link href={`/notes/${note.slug}`} className="mt-4 inline-flex text-sm font-semibold text-brand-primary dark:text-indigo-300 hover:translate-x-0.5 transition-transform">Baca →</Link>
          </Panel>
        ))}
      </div>
    </PageShell>
  );
}