"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PageShell } from "@/components/page-shell";
import { tools } from "@/lib/tools-registry";

const categories = ["Semua", "PDF", "Gambar", "Developer", "Teks"];

export default function ToolsPage() {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [query, setQuery] = useState("");

  const filteredTools = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return tools.filter((tool) => {
      const categoryMap = activeCategory === "Developer" ? "Developers" : activeCategory === "Teks" ? "Text" : activeCategory;
      const matchesCategory = activeCategory === "Semua" || tool.category === categoryMap || tool.tags.includes(categoryMap);
      const matchesSearch = !normalizedQuery || `${tool.title} ${tool.description} ${tool.tags.join(" ")}`.toLowerCase().includes(normalizedQuery);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, query]);

  return (
    <PageShell>
      <div className="mb-14 rounded-[28px] border border-slate-200 dark:border-brand-line bg-white dark:bg-brand-panel p-7 sm:p-10">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Tools Shelf</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.035em] text-brand-ink dark:text-slate-100 sm:text-5xl">Tools</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 sm:text-2xl sm:leading-normal tracking-[-0.02em] text-slate-700 dark:text-slate-300">
          Kumpulan utilitas digital yang dibangun bertahap: mulai dari PDF splitter, lalu tools kecil lain yang membantu workflow harian.
        </p>
      </div>

      <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-center">
        <label className="relative block w-full lg:max-w-md">
          <span className="sr-only">Cari utilitas</span>
          <input id="tools-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari tools, kategori, atau use case..." className="h-12 w-full rounded-lg border border-slate-200 dark:border-brand-line bg-white dark:bg-brand-panel px-4 pl-11 text-base outline-none transition focus:border-brand-primary" />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-slate-500 dark:text-slate-400">⌕</span>
        </label>
        <div className="flex gap-3 overflow-x-auto pb-1">
          {categories.map((category) => (
            <button key={category} type="button" aria-pressed={activeCategory === category} onClick={() => setActiveCategory(category)} className={`whitespace-nowrap rounded-full border px-5 py-2.5 text-sm transition ${activeCategory === category ? "border-black bg-black text-white" : "border-slate-200 dark:border-brand-line bg-white dark:bg-brand-panel text-brand-ink dark:text-slate-100 hover:border-slate-400"}`}>
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {filteredTools.map((tool) => <ToolCard key={tool.id} tool={tool} />)}
        <IdeaCard />
      </div>
    </PageShell>
  );
}

function ToolCard({ tool }: Readonly<{ tool: (typeof tools)[number] }>) {
  const available = tool.status === "available";
  return (
    <article className={`group min-h-[320px] rounded-[20px] border bg-white dark:bg-brand-panel p-6 transition hover:-translate-y-1 sm:p-7 ${available ? "border-slate-200 dark:border-brand-line hover:border-slate-300 dark:border-slate-600" : "border-slate-200 dark:border-brand-line opacity-80"}`}>
      <div className="flex items-start justify-between gap-5">
        <div className={`grid h-14 w-14 place-items-center rounded-xl text-base font-semibold ${available ? "bg-brand-primary text-white" : "bg-amber-50 text-amber-700"}`}>{tool.icon}</div>
        <span className={`rounded-full border px-4 py-2 font-mono text-xs ${available ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-amber-200 bg-amber-50 text-amber-700"}`}>{available ? "Tersedia" : "Backlog"}</span>
      </div>
      <h2 className={`mt-9 text-2xl font-medium leading-tight tracking-[-0.03em] ${available ? "text-brand-ink dark:text-slate-100" : "text-slate-500 dark:text-slate-400"}`}>{tool.title}</h2>
      <p className={`mt-4 text-base leading-7 ${available ? "text-brand-ink dark:text-slate-100" : "text-slate-500 dark:text-slate-400"}`}>{tool.description}</p>
      <div className="mt-10 border-t border-slate-200 dark:border-brand-line pt-5">
        {available ? <Link href={tool.href} className="text-lg font-semibold text-brand-primary">Gunakan →</Link> : <div><span className="text-lg text-slate-500 dark:text-slate-400">Masuk antrian build</span><div className="mt-8 h-1 w-full rounded-full bg-amber-50"><div className="h-1 w-1/3 rounded-full bg-amber-300" /></div></div>}
      </div>
    </article>
  );
}

function IdeaCard() {
  return (
    <article className="grid min-h-[320px] place-items-center rounded-[20px] border border-dashed border-slate-300 dark:border-slate-600 bg-white dark:bg-brand-panel/70 p-8 text-center">
      <div>
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full border border-slate-200 dark:border-brand-line bg-white dark:bg-brand-panel text-3xl text-slate-600 dark:text-slate-400">⊕</div>
        <h2 className="mt-6 text-2xl font-medium tracking-[-0.03em] text-brand-ink dark:text-slate-100">Butuh Tool Lain?</h2>
        <p className="mt-3 text-base leading-7 text-slate-500 dark:text-slate-400">Punya ide utilitas yang berguna? Ini bisa masuk backlog Arnol Works berikutnya.</p>
      </div>
    </article>
  );
}




