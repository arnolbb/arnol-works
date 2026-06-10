import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { Eyebrow, Panel, StatusBadge } from "@/components/ui";
import { getAvailableTools, tools } from "@/lib/tools-registry";

const projects = [
  { title: "Arnol Works Platform", status: "Live", description: "Portfolio + tools lab dengan utilitas PDF dan gambar yang bisa dipakai langsung.", meta: "Next.js · FastAPI · Local temp storage", href: "/" },
  { title: "PDF Toolkit", status: "Active", description: "Pisah PDF warna/hitam-putih, kompres PDF, gabungkan PDF, dan konversi PDF ke JPG.", meta: "PyMuPDF · pypdf", href: "/tools" },
  { title: "Image Toolkit", status: "Active", description: "JPG/PNG ke PDF, kompres gambar, dan resize gambar untuk kebutuhan upload harian.", meta: "Pillow · ZIP output", href: "/tools" },
];

export default function ProjectsPage() {
  const activeTools = getAvailableTools();
  const plannedTools = tools.length - activeTools.length;

  return (
    <PageShell>
      <Panel as="section" className="p-7 sm:p-10">
        <Eyebrow>Projects</Eyebrow>
        <h1 className="mt-5 text-4xl font-semibold tracking-[-0.03em] text-brand-ink dark:text-slate-100">Project yang sedang dibangun</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-400">Arnol Works sekarang berisi {activeTools.length} tools aktif untuk PDF dan gambar, dengan {plannedTools} tool tambahan yang masih direncanakan. Fokusnya tetap utilitas sederhana yang benar-benar sering dipakai.</p>
      </Panel>
      <section className="mt-8 grid gap-5 md:grid-cols-3">
        {projects.map((item) => (
          <Panel key={item.title} as="article" className="p-6 transition hover:-translate-y-1 hover:border-slate-300 dark:hover:border-slate-500">
            <div className="flex items-start justify-between gap-4"><StatusBadge tone={item.status === "Live" ? "emerald" : "indigo"}>{item.status}</StatusBadge><span className="h-2.5 w-2.5 rounded-full bg-emerald-400" /></div>
            <h2 className="mt-8 text-xl font-semibold tracking-[-0.02em] text-brand-ink dark:text-slate-100">{item.title}</h2>
            <p className="mt-3 min-h-24 text-sm leading-7 text-slate-600 dark:text-slate-400">{item.description}</p>
            <p className="mt-5 border-t border-slate-200 pt-4 font-mono text-xs text-slate-500 dark:border-brand-line dark:text-slate-400">{item.meta}</p>
            <Link href={item.href} className="mt-5 inline-flex text-sm font-semibold text-brand-primary dark:text-indigo-300">Lihat detail →</Link>
          </Panel>
        ))}
      </section>
    </PageShell>
  );
}
