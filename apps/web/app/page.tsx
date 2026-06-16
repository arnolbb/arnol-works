import Link from "next/link";
import { Container } from "@/components/page-shell";
import { getAvailableTools, tools } from "@/lib/tools-registry";
import { ToolIcon } from "@/components/tools/tool-icon";

const features = ["PDF tools", "Image tools", "Download instan"];

export default function HomePage() {
  const activeTools = getAvailableTools();
  const plannedTools = tools.length - activeTools.length;
  const visibleTools = activeTools.slice(0, 4);

  const pdfToolsCount = activeTools.filter(t => t.category === "PDF" || t.tags.includes("PDF")).length;
  const imgToolsCount = activeTools.filter(t => t.category === "Gambar" || t.tags.includes("Gambar")).length;

  const timeline = [
    { label: "Aktif", text: `${activeTools.length} tools siap dipakai`, tone: "emerald" },
    { label: "Dokumen", text: `Memiliki ${pdfToolsCount} utilitas PDF terintegrasi`, tone: "indigo" },
    { label: "Gambar", text: `Memiliki ${imgToolsCount} utilitas gambar & cetak`, tone: "amber" },
  ];

  return (
    <>
      <section className="relative overflow-hidden border-b border-slate-200/80 dark:border-brand-line/50 py-14 lg:py-20">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.04)_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="absolute right-0 top-0 -z-10 h-72 w-72 rounded-full bg-brand-soft/60 blur-3xl dark:bg-indigo-900/10" />
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_460px] lg:items-center">
            <div>
              <p className="inline-flex rounded-full border border-slate-200/80 dark:border-brand-line/50 bg-white/80 backdrop-blur-sm dark:bg-brand-panel/60 px-4 py-2 font-mono text-xs uppercase tracking-[0.18em] text-slate-600 dark:text-slate-400">Arnol Works · Tools Lab</p>
              <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-tight tracking-[-0.04em] text-brand-ink dark:text-slate-100 sm:text-5xl lg:text-[58px]">
                Saya membangun tools web sederhana yang benar-benar bisa dipakai.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-400">
                Arnol Works adalah ruang kerja digital berisi utilitas PDF dan gambar untuk kebutuhan dokumen harian: kompres, gabung, konversi, resize, dan split file.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/tools" className="inline-flex justify-center rounded-md bg-black px-7 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-brand-night dark:hover:bg-slate-200 shadow-[0_4px_12px_rgba(0,0,0,0.1)]">Lihat Tools</Link>
                <Link href="/projects" className="inline-flex justify-center rounded-md border border-slate-300 bg-white/80 px-7 py-3 text-sm font-semibold text-brand-ink transition hover:border-slate-400 dark:border-brand-line/50 dark:bg-brand-panel/60 dark:text-slate-100 dark:hover:border-slate-500 dark:hover:bg-slate-800/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">Lihat Proyek</Link>
              </div>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <Metric label="Tool aktif" value={String(activeTools.length).padStart(2, "0")} />
                <Metric label="Stack" value="Next/FastAPI" />
                <Metric label="Fokus" value="PDF/Image" />
              </div>
            </div>
            <BuilderWorkspaceCard />
          </div>
        </Container>
      </section>

      <section className="border-b border-slate-200/80 dark:border-brand-line/50 py-14">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">Latest Build</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-brand-ink dark:text-slate-100">Tools dokumen harian sudah aktif</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-400">
                Arnol Works kini menyediakan beberapa tool praktis untuk PDF dan gambar: mulai dari split halaman warna, kompres PDF, gabung PDF, konversi JPG/PDF, sampai resize gambar.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {timeline.map((item) => <TimelineCard key={item.label} item={item} />)}
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 lg:py-20 border-b border-slate-200/80 dark:border-brand-line/50">
        <Container>
          <div className="mb-9 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Tools Shelf</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-brand-ink dark:text-slate-100">Tools yang sudah tersedia</h2>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">Utilitas kecil untuk pekerjaan dokumen, gambar, dan workflow harian.</p>
            </div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{activeTools.length} aktif / {plannedTools} direncanakan</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {visibleTools.map((tool) => <HomeToolCard key={tool.id} tool={tool} />)}
          </div>
        </Container>
      </section>

      <section className="py-10 lg:py-16">
        <Container>
          <div className="overflow-hidden rounded-[28px] border border-slate-800 bg-slate-950 text-white shadow-[0_24px_80px_rgba(15,23,42,0.18)]">
            <div className="grid gap-0 lg:grid-cols-[1fr_380px]">
              <div className="p-8 sm:p-10 lg:p-12">
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-slate-400">Build Notes #01</p>
                <h2 className="mt-5 max-w-2xl text-3xl font-semibold tracking-[-0.03em]">Di balik layar pembuatan tool PDF pertama.</h2>
                <div className="mt-10 grid gap-8 lg:grid-cols-2">
                  <NoteBlock title="Problem">Biaya print bisa membengkak saat dokumen campuran warna dan hitam putih dikirim sebagai satu file.</NoteBlock>
                  <NoteBlock title="Approach">Backend mendeteksi kanal warna per halaman, lalu user tetap diberi kontrol manual sebelum split.</NoteBlock>
                </div>
              </div>
              <div className="border-t border-white/10 bg-white/[0.04] p-8 lg:border-l lg:border-t-0">
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-slate-400">Arsitektur</p>
                <div className="mt-6 space-y-4 text-sm text-slate-300">
                  <div className="flex justify-between border-b border-white/5 pb-2"><span>Frontend</span><span className="font-mono text-white">Next.js App Router</span></div>
                  <div className="flex justify-between border-b border-white/5 pb-2"><span>Backend</span><span className="font-mono text-white">FastAPI (Python)</span></div>
                  <div className="flex justify-between border-b border-white/5 pb-2"><span>Libraries</span><span className="font-mono text-white">PyMuPDF / pypdf</span></div>
                  <div className="flex justify-between"><span>Hosting</span><span className="font-mono text-white">Vercel / Cloud Run</span></div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* FAQ Accordion Section */}
      <section className="py-14 lg:py-20 border-t border-slate-200/80 dark:border-brand-line/50">
        <Container>
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">FAQ</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-brand-ink dark:text-slate-100">Pertanyaan Umum</h2>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">Beberapa hal yang sering ditanyakan tentang platform dan utilitas Arnol Works.</p>
            </div>
            
            <div className="space-y-4">
              <FaqItem 
                q="Apa itu Arnol Works?" 
                a="Arnol Works adalah platform portfolio interaktif berisi kumpulan alat bantu (web tools) gratis dan eksperimen produk digital yang dibuat untuk mempermudah pekerjaan dokumen dan gambar sehari-hari." 
              />
              <FaqItem 
                q="Apakah file yang saya unggah di sini aman?" 
                a="Sangat aman. Semua file yang diunggah hanya disimpan sementara di memori server untuk diproses secara instan dan akan dihapus secara otomatis lewat skrip pembersihan berkala. Kami tidak menyimpan file Anda secara permanen." 
              />
              <FaqItem 
                q="Bagaimana cara kerja alat pemisah PDF Warna & Hitam Putih?" 
                a="Sistem kami menganalisis halaman PDF Anda menggunakan library pemrosesan warna, menandai halaman berwarna secara otomatis, dan memberikan opsi ulasan manual sebelum memisahkan dokumen menjadi dua file PDF siap cetak." 
              />
              <FaqItem 
                q="Apakah ada batasan ukuran file yang diunggah?" 
                a="Untuk menjaga performa dan kestabilan server bagi semua pengguna, batas maksimal ukuran file yang didukung saat ini adalah 50 megabyte (50MB) per unggahan." 
              />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

function Metric({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <div className="rounded-xl border border-slate-200/80 bg-white/60 backdrop-blur-sm p-4 dark:border-brand-line/50 dark:bg-slate-900/30">
      <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-2 text-lg font-semibold text-brand-ink dark:text-slate-100">{value}</p>
    </div>
  );
}

function BuilderWorkspaceCard() {
  return (
    <article className="rounded-[24px] border border-slate-200/80 bg-white/80 backdrop-blur-md p-5 shadow-[0_24px_80px_rgba(15,23,42,0.06)] hover:-translate-y-1 hover:shadow-[0_28px_90px_rgba(74,62,230,0.08)] transition-all duration-300 dark:border-brand-line/50 dark:bg-slate-950/70 dark:shadow-[0_24px_90px_rgba(0,0,0,0.3)]">
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-brand-line/50 pb-4">
        <div className="flex gap-1.5"><span className="h-3 w-3 rounded-full bg-red-300" /><span className="h-3 w-3 rounded-full bg-amber-300" /><span className="h-3 w-3 rounded-full bg-emerald-300" /></div>
        <span className="font-mono text-xs text-slate-500 dark:text-slate-400">latest-build.md</span>
      </div>
      <div className="mt-5 rounded-2xl border border-brand-border bg-brand-soft/80 p-5 dark:border-slate-700 dark:bg-slate-900/95">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-brand-primary dark:text-indigo-300">Tools aktif</p>
            <h2 className="mt-3 text-2xl font-medium tracking-[-0.02em] text-brand-ink dark:text-slate-100">PDF & Image Toolkit</h2>
          </div>
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 font-mono text-[11px] uppercase tracking-wide text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-300">Siap</span>
        </div>
        <div className="mt-6 grid gap-3">
          {features.map((feature) => <div key={feature} className="flex items-center gap-3 rounded-xl bg-white p-3 text-sm text-slate-700 shadow-sm dark:bg-slate-800 dark:text-slate-100 dark:shadow-none"><span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-500 text-[11px] text-white">✓</span>{feature}</div>)}
        </div>
        <Link href="/tools/pdf-color-bw-splitter" className="mt-6 inline-flex w-full justify-center rounded-md bg-brand-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-hover shadow-[0_4px_12px_rgba(74,62,230,0.15)]">Buka Tool</Link>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3 text-center">
        <MiniStat label="Halaman" value="Deteksi" />
        <MiniStat label="Review" value="Manual" />
        <MiniStat label="Hasil" value="2 PDF" />
      </div>
    </article>
  );
}

function MiniStat({ label, value }: Readonly<{ label: string; value: string }>) {
  return <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-3 dark:border-brand-line/50 dark:bg-slate-900/80"><p className="font-mono text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p><p className="mt-1 text-xs font-semibold text-brand-ink dark:text-slate-100">{value}</p></div>;
}

type TimelineItem = {
  label: string;
  text: string;
  tone: string;
};

function TimelineCard({ item }: Readonly<{ item: TimelineItem }>) {
  const dotColor = item.tone === "emerald" ? "bg-emerald-500" : item.tone === "amber" ? "bg-amber-500" : "bg-brand-primary";
  return <article className="rounded-[24px] border border-slate-200/80 dark:border-brand-line/50 bg-white/80 dark:bg-slate-900/60 backdrop-blur-md p-5 shadow-[0_4px_20px_rgba(15,23,42,0.02)]"><span className={`block h-2.5 w-2.5 rounded-full ${dotColor}`} /><p className="mt-5 font-mono text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{item.label}</p><p className="mt-3 text-sm leading-6 text-brand-ink dark:text-slate-100">{item.text}</p></article>;
}

function HomeToolCard({ tool }: Readonly<{ tool: (typeof tools)[number] }>) {
  const available = tool.status === "available";
  return (
    <article className="group flex flex-col rounded-[24px] border border-slate-200/80 bg-white/80 backdrop-blur-md p-5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(74,62,230,0.05)] hover:border-brand-primary/30 dark:border-brand-line/50 dark:bg-slate-900/60 dark:hover:border-indigo-400/30">
      <div className="flex items-center justify-between">
        <div className={`grid h-10 w-10 place-items-center rounded-xl text-xs font-semibold transition-all duration-300 ${available ? "bg-brand-soft text-brand-primary dark:bg-indigo-400/15 dark:text-indigo-300" : "bg-slate-100 text-slate-500 dark:bg-slate-800/80 dark:text-slate-400"}`}>
          <ToolIcon icon={tool.icon} slug={tool.id} className="size-5" />
        </div>
        <span className={`rounded-full border px-2.5 py-1 font-mono text-[9px] uppercase tracking-wide ${available ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-300" : "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-300"}`}>{available ? "Tersedia" : "Rencana"}</span>
      </div>
      <div className="mt-4 flex flex-1 flex-col">
        <h3 className="text-lg font-semibold leading-snug tracking-[-0.02em] text-brand-ink dark:text-slate-100 transition-colors group-hover:text-brand-primary dark:group-hover:text-indigo-300">{tool.title}</h3>
        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">{tool.description}</p>
      </div>
      <div className="mt-6 border-t border-slate-200/80 pt-4 dark:border-brand-line/50">
        {available ? <Link href={tool.href} className="inline-flex text-sm font-semibold text-brand-primary dark:text-indigo-300 hover:translate-x-0.5 transition-transform">Buka Tool →</Link> : <span className="text-sm text-slate-500 dark:text-slate-500">Direncanakan</span>}
      </div>
    </article>
  );
}

function NoteBlock({ title, children }: Readonly<{ title: string; children: React.ReactNode }>) {
  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">{title}</p>
      <p className="mt-4 text-sm leading-7 text-slate-300">{children}</p>
    </div>
  );
}

function FaqItem({ q, a }: Readonly<{ q: string; a: string }>) {
  return (
    <details className="group rounded-[18px] border border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-brand-line/50 dark:bg-slate-900/60 [&_summary::-webkit-details-marker]:hidden">
      <summary className="flex items-center justify-between cursor-pointer p-5 font-medium text-brand-ink dark:text-slate-100 outline-none list-none">
        <span className="text-sm sm:text-base leading-snug">{q}</span>
        <span className="ml-4 transition-transform duration-300 group-open:rotate-180 text-slate-400 dark:text-slate-500">
          <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </summary>
      <div className="px-5 pb-5 border-t border-slate-100/50 dark:border-brand-line/30 pt-4 text-xs sm:text-sm leading-6 text-slate-600 dark:text-slate-400">
        {a}
      </div>
    </details>
  );
}
