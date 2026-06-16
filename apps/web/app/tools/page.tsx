"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PageShell } from "@/components/page-shell";
import { tools } from "@/lib/tools-registry";
import { ToolIcon } from "@/components/tools/tool-icon";

const categories = ["Semua", "PDF", "Gambar", "Konversi", "Generator", "Teks"];

export default function ToolsPage() {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [query, setQuery] = useState("");

  const filteredTools = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return tools.filter((tool) => {
      const categoryMap = activeCategory === "Teks" ? "Text" : activeCategory;
      const matchesCategory = activeCategory === "Semua" || tool.category === categoryMap || tool.tags.includes(categoryMap);
      const matchesSearch = !normalizedQuery || `${tool.title} ${tool.description} ${tool.tags.join(" ")}`.toLowerCase().includes(normalizedQuery);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, query]);

  return (
    <PageShell>
      {/* Compact Header Panel */}
      <div className="mb-8 rounded-[24px] border border-slate-200/80 bg-white/80 backdrop-blur-md p-6 sm:p-8 shadow-[0_12px_40px_rgba(15,23,42,0.03)] dark:border-brand-line/50 dark:bg-slate-900/60 dark:shadow-[0_18px_50px_rgba(0,0,0,0.15)]">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Tools Shelf</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-brand-ink dark:text-slate-100 sm:text-4xl">Tools</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-400">
          Kumpulan utilitas digital praktis yang dibangun bertahap untuk membantu workflow harian Anda.
        </p>
      </div>

      {/* Redesigned Search & Category Toolbar */}
      <div className="mb-8 rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-md p-3 shadow-[0_8px_30px_rgba(15,23,42,0.02)] dark:border-brand-line/50 dark:bg-slate-900/40 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <label className="relative block w-full lg:max-w-xs">
          <span className="sr-only">Cari utilitas</span>
          <input 
            id="tools-search" 
            value={query} 
            onChange={(event) => setQuery(event.target.value)} 
            placeholder="Cari tools..." 
            className="h-10 w-full rounded-xl border border-slate-200/60 bg-white/60 px-3 pl-9 text-sm text-brand-ink outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 dark:border-brand-line/40 dark:bg-slate-950/50 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400/10" 
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400 dark:text-slate-500">⌕</span>
        </label>
        
        {/* Categories Bar */}
        <div className="flex gap-1.5 overflow-x-auto max-w-full scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] py-0.5">
          {categories.map((category) => (
            <button 
              key={category} 
              type="button" 
              aria-pressed={activeCategory === category} 
              onClick={() => setActiveCategory(category)} 
              className={`whitespace-nowrap rounded-lg border px-3.5 py-1.5 text-xs font-medium transition-all duration-200 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 dark:focus-visible:ring-indigo-400 ${activeCategory === category ? "border-black bg-black text-white dark:border-indigo-400 dark:bg-indigo-500 dark:text-white shadow-[0_2px_8px_rgba(0,0,0,0.08)]" : "border-slate-200/80 bg-white/60 text-brand-ink hover:border-slate-400 dark:border-brand-line/40 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:border-slate-500"}`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Redesigned grid with compact heights */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTools.map((tool) => <ToolCard key={tool.id} tool={tool} />)}
        <IdeaCard />
      </div>
    </PageShell>
  );
}

function ToolCard({ tool }: Readonly<{ tool: (typeof tools)[number] }>) {
  const available = tool.status === "available";
  return (
    <article className={`group flex flex-col rounded-[20px] border bg-white/80 backdrop-blur-md p-5 transition-all duration-300 dark:bg-slate-900/60 ${available ? "border-slate-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.01)] hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(74,62,230,0.04)] hover:border-brand-primary/30 dark:border-brand-line/50 dark:hover:border-indigo-400/30" : "border-slate-200/80 opacity-70 dark:border-brand-line/50"}`}>
      <div className="flex items-center justify-between">
        <div className={`grid h-10 w-10 place-items-center rounded-xl text-xs font-semibold transition-all duration-300 ${available ? "bg-brand-soft text-brand-primary dark:bg-indigo-400/10 dark:text-indigo-300" : "bg-slate-100 text-slate-500 dark:bg-slate-800/80 dark:text-slate-400"}`}>
          <ToolIcon icon={tool.icon} slug={tool.id} className="size-5" />
        </div>
        <span className={`rounded-full border px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider ${available ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-300" : "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-300"}`}>{available ? "Tersedia" : "Rencana"}</span>
      </div>
      <div className="mt-4 flex flex-1 flex-col">
        <h2 className={`text-lg font-semibold leading-snug tracking-[-0.02em] transition-colors duration-300 ${available ? "text-brand-ink dark:text-slate-100 group-hover:text-brand-primary dark:group-hover:text-indigo-300" : "text-slate-400 dark:text-slate-500"}`}>{tool.title}</h2>
        <p className={`mt-2 text-xs leading-5 line-clamp-2 ${available ? "text-slate-500 dark:text-slate-400" : "text-slate-500/70 dark:text-slate-500"}`}>{tool.description}</p>
      </div>
      <div className="mt-4 border-t border-slate-200/80 pt-3 dark:border-brand-line/50">
        {available ? <Link href={tool.href} className="inline-flex text-xs font-semibold text-brand-primary dark:text-indigo-300 hover:translate-x-0.5 transition-transform duration-200">Gunakan →</Link> : <span className="text-xs text-slate-500 dark:text-slate-500">Direncanakan</span>}
      </div>
    </article>
  );
}

function IdeaCard() {
  return (
    <article className="grid min-h-[160px] place-items-center rounded-[20px] border border-dashed border-slate-300/80 bg-white/40 p-5 text-center transition-all duration-300 hover:border-brand-primary/40 hover:bg-white/60 dark:border-slate-700 dark:bg-slate-900/30 dark:hover:border-indigo-400/40 dark:hover:bg-slate-900/50">
      <div className="flex flex-col items-center">
        <div className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-lg text-slate-600 dark:border-brand-line dark:bg-slate-900 dark:text-slate-400">⊕</div>
        <h2 className="mt-3 text-lg font-semibold tracking-[-0.02em] text-brand-ink dark:text-slate-100">Butuh Tool Lain?</h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Ajukan ide utilitas yang Anda butuhkan.</p>
      </div>
    </article>
  );
}
