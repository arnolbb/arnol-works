import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { Eyebrow, Panel, StatusBadge } from "@/components/ui";
import { getAvailableTools, tools } from "@/lib/tools-registry";

const projects = [
  { title: "Arnol Works Platform", status: "Live", description: "Portfolio + tools lab dengan utilitas PDF dan gambar yang bisa dipakai langsung.", meta: "Next.js · FastAPI · Local temp storage", href: "/" },
  { title: "PDF Toolkit", status: "Active", description: "Pisah PDF warna/hitam-putih, kompres PDF, gabungkan PDF, dan konversi PDF ke JPG.", meta: "PyMuPDF · pypdf", href: "/tools" },
  { title: "Image Toolkit", status: "Active", description: "JPG/PNG ke PDF, kompres gambar, dan resize gambar untuk kebutuhan upload harian.", meta: "Pillow · ZIP output", href: "/tools" },
  { title: "KeyStrike Time Attack", status: "Live", description: "Game mengetik bertema neon-cyberpunk. Uji dan latih kecepatan serta akurasi mengetikmu dalam 60 detik.", meta: "React · LocalStorage · Cyber Theme", href: "/projects/keystrike" },
];

export default function ProjectsPage() {
  const activeTools = getAvailableTools();
  const plannedTools = tools.length - activeTools.length;

  return (
    <PageShell>
      <Panel as="section" className="p-7 sm:p-10 mb-8">
        <Eyebrow>Proyek</Eyebrow>
        <h1 className="mt-5 text-4xl font-semibold tracking-[-0.03em] text-brand-ink dark:text-slate-100">Proyek yang sedang dibangun</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-400">Arnol Works sekarang berisi {activeTools.length} tools aktif untuk PDF dan gambar, dengan {plannedTools} tool tambahan yang masih direncanakan. Fokusnya tetap utilitas sederhana yang benar-benar sering dipakai.</p>
      </Panel>
      
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {projects.map((item) => (
          <Panel 
            key={item.title} 
            as="article" 
            className="flex flex-col overflow-hidden hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(74,62,230,0.06)] hover:border-brand-primary/30 dark:hover:border-indigo-400/30"
          >
            {/* Top Preview Mockup Section */}
            <div className="h-44 w-full border-b border-slate-200/80 bg-slate-50/50 dark:border-brand-line/30 dark:bg-slate-950/40 relative overflow-hidden flex items-center justify-center">
              {renderProjectPreview(item.title)}
            </div>
            
            {/* Bottom Content Section */}
            <div className="p-6 flex flex-1 flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-4">
                  <StatusBadge tone={item.status === "Live" ? "emerald" : "indigo"}>
                    {item.status}
                  </StatusBadge>
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </div>
                <h2 className="mt-6 text-xl font-semibold tracking-[-0.02em] text-brand-ink dark:text-slate-100">
                  {item.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  {item.description}
                </p>
              </div>
              <div>
                <p className="mt-5 border-t border-slate-200/80 pt-4 font-mono text-xs text-slate-500 dark:border-brand-line/50 dark:text-slate-400">
                  {item.meta}
                </p>
                <Link href={item.href} className="mt-5 inline-flex text-sm font-semibold text-brand-primary dark:text-indigo-300 hover:translate-x-1 transition-transform duration-200">
                  Lihat detail →
                </Link>
              </div>
            </div>
          </Panel>
        ))}
      </section>
    </PageShell>
  );
}

function renderProjectPreview(title: string) {
  switch (title) {
    case "Arnol Works Platform":
      return (
        <div className="w-full h-full relative flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gradient-to-tr from-brand-primary/10 to-emerald-500/10 blur-xl rounded-full" />
          <div className="w-48 h-28 rounded-lg border border-slate-200/80 bg-white/95 shadow-md dark:border-brand-line/50 dark:bg-slate-900/90 relative overflow-hidden flex flex-col p-2 transition-transform duration-300 group-hover:scale-[1.03]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-brand-line/30 pb-1.5 mb-2">
              <div className="flex gap-1"><span className="size-1.5 rounded-full bg-red-400" /><span className="size-1.5 rounded-full bg-amber-400" /><span className="size-1.5 rounded-full bg-emerald-400" /></div>
              <div className="h-1.5 w-16 bg-slate-200 dark:bg-slate-800 rounded-full" />
              <div className="size-1.5 bg-slate-200 dark:bg-slate-800 rounded-full" />
            </div>
            {/* Page content mock */}
            <div className="flex gap-2 flex-grow">
              <div className="w-12 bg-slate-50 dark:bg-slate-950/60 rounded p-1 flex flex-col gap-1.5">
                <div className="h-1 w-8 bg-brand-primary/20 rounded-full" />
                <div className="h-1 w-6 bg-slate-200 dark:bg-slate-800 rounded-full" />
                <div className="h-1 w-7 bg-slate-200 dark:bg-slate-800 rounded-full" />
              </div>
              <div className="flex-1 bg-brand-soft/30 dark:bg-indigo-950/10 rounded p-1.5 flex flex-col gap-2 relative">
                <div className="h-1.5 w-16 bg-brand-primary/40 rounded-full" />
                <div className="space-y-1">
                  <div className="h-0.5 w-full bg-slate-300/60 dark:bg-slate-700/60 rounded-full" />
                  <div className="h-0.5 w-10 bg-slate-300/60 dark:bg-slate-700/60 rounded-full" />
                </div>
                <div className="h-3.5 w-10 bg-brand-primary rounded mt-auto flex items-center justify-center text-[4px] text-white font-bold">Tools</div>
              </div>
            </div>
          </div>
        </div>
      );
    case "PDF Toolkit":
      return (
        <div className="w-full h-full relative flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gradient-to-tr from-red-500/10 to-amber-500/10 blur-xl rounded-full" />
          <div className="relative flex gap-4 items-center group-hover:scale-[1.03] transition-transform duration-300">
            {/* Main PDF */}
            <div className="w-16 h-22 rounded-md border border-slate-200/80 bg-white shadow-md dark:border-brand-line/50 dark:bg-slate-900 p-2 flex flex-col justify-between relative z-10">
              <div className="flex justify-between items-start">
                <div className="h-1 w-8 bg-slate-300 dark:bg-slate-700 rounded-full" />
                <div className="size-2 rounded-full bg-red-500" />
              </div>
              <div className="space-y-1">
                <div className="h-0.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full" />
                <div className="h-0.5 w-10 bg-slate-200 dark:bg-slate-800 rounded-full" />
                <div className="h-1 w-6 bg-red-400 rounded-full" />
              </div>
              <div className="h-3 w-8 bg-red-500 rounded flex items-center justify-center text-[5px] text-white font-bold">PDF</div>
            </div>
            
            {/* Splitted Output Pages */}
            <div className="flex flex-col gap-2 relative">
              {/* Color PDF */}
              <div className="w-12 h-16 rounded border border-slate-200/80 bg-white/95 shadow-sm dark:border-brand-line/50 dark:bg-slate-900 p-1 flex flex-col justify-between transform translate-x-1 translate-y-1 group-hover:translate-x-3 transition-transform duration-300">
                <div className="size-1.5 rounded-full bg-red-500" />
                <div className="h-2 w-6 bg-red-500 rounded flex items-center justify-center text-[4px] text-white font-bold">COLOR</div>
              </div>
              {/* BW PDF */}
              <div className="w-12 h-16 rounded border border-slate-200/80 bg-white/95 shadow-sm dark:border-brand-line/50 dark:bg-slate-900 p-1 flex flex-col justify-between transform translate-x-1 -translate-y-1 group-hover:translate-x-3 transition-transform duration-300">
                <div className="size-1.5 rounded-full bg-slate-400" />
                <div className="h-2 w-6 bg-slate-500 rounded flex items-center justify-center text-[4px] text-white font-bold">B&W</div>
              </div>
            </div>
          </div>
        </div>
      );
    case "Image Toolkit":
      return (
        <div className="w-full h-full relative flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-teal-500/10 blur-xl rounded-full" />
          <div className="w-40 h-24 rounded-lg border border-slate-200 bg-white dark:border-brand-line/50 dark:bg-slate-900 p-2 relative shadow-md flex items-center justify-center transition-transform duration-300 group-hover:scale-[1.03]">
            {/* Background grid */}
            <div className="absolute inset-1.5 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:8px_8px] rounded" />
            
            {/* Image frame with crop/resize handles */}
            <div className="w-24 h-16 bg-slate-50 dark:bg-slate-950/60 rounded border border-brand-primary/40 p-1 relative flex flex-col justify-between">
              {/* Resize Handles */}
              <div className="absolute -top-1 -left-1 size-1.5 bg-brand-primary rounded-full" />
              <div className="absolute -top-1 -right-1 size-1.5 bg-brand-primary rounded-full" />
              <div className="absolute -bottom-1 -left-1 size-1.5 bg-brand-primary rounded-full" />
              <div className="absolute -bottom-1 -right-1 size-1.5 bg-brand-primary rounded-full" />
              
              {/* Landscape content */}
              <div className="flex justify-between items-start">
                <div className="size-2 rounded-full bg-emerald-500/80" />
                <div className="h-1 w-6 bg-emerald-500/20 rounded-full" />
              </div>
              
              <svg className="w-full h-8 text-emerald-500/30 dark:text-emerald-500/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 16l4-4a2 2 0 012.828 0l6.344 6.344" />
              </svg>
            </div>
          </div>
        </div>
      );
    case "KeyStrike Time Attack":
      return (
        <div className="w-full h-full relative flex items-center justify-center bg-[#050a15] overflow-hidden transition-transform duration-300 group-hover:scale-[1.03]">
          {/* Cyberpunk Grid lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(133,222,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(133,222,255,0.05)_1px,transparent_1px)] bg-[size:16px_16px]" />
          
          {/* Neon glow */}
          <div className="absolute top-0 left-1/4 right-1/4 h-12 bg-indigo-500/15 blur-xl rounded-full" />
          
          {/* Miniature game interface */}
          <div className="w-40 flex flex-col gap-1.5 relative z-10 py-2">
            {/* Title */}
            <div className="text-[8px] uppercase tracking-widest text-center font-bold">
              <span className="text-[oklch(0.85_0.17_200)] font-black">KEY</span>
              <span className="text-[oklch(0.7_0.28_330)] font-black ml-1">STRIKE</span>
            </div>
            
            {/* Text screen mockup */}
            <div className="rounded border border-[oklch(0.85_0.17_200)]/30 bg-[#0c142c]/75 p-1 text-[4.5px] text-center font-mono leading-relaxed text-slate-300">
              <span className="text-[oklch(0.82_0.22_150)]">Latihan setiap hari</span>{" "}
              <span className="text-[oklch(0.85_0.17_200)] border-b border-[oklch(0.85_0.17_200)]">a</span>kan membuat jari...
            </div>
            
            {/* WPM / ACC metrics */}
            <div className="grid grid-cols-3 gap-1 text-center text-[5px]">
              <div className="border border-[oklch(0.85_0.17_200)]/20 rounded py-0.5 bg-slate-900/60">
                <div className="text-[3.5px] text-slate-500 font-mono">WPM</div>
                <div className="text-[oklch(0.85_0.17_200)] font-bold font-mono">84</div>
              </div>
              <div className="border border-[oklch(0.82_0.22_150)]/20 rounded py-0.5 bg-slate-900/60">
                <div className="text-[3.5px] text-slate-500 font-mono">ACC</div>
                <div className="text-[oklch(0.82_0.22_150)] font-bold font-mono">98%</div>
              </div>
              <div className="border border-[oklch(0.7_0.28_330)]/20 rounded py-0.5 bg-slate-900/60">
                <div className="text-[3.5px] text-slate-500 font-mono">SCORE</div>
                <div className="text-[oklch(0.7_0.28_330)] font-bold font-mono">940</div>
              </div>
            </div>
          </div>
        </div>
      );
    default:
      return null;
  }
}
