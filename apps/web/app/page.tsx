import Link from "next/link";
import { Container } from "@/components/page-shell";
import { tools } from "@/lib/tools-registry";

const features = ["Deteksi halaman warna", "Review & pilih manual", "Download dua PDF hasil split"];
const timeline = [
  { label: "MVP", text: "PDF splitter sudah bisa dipakai", tone: "emerald" },
  { label: "Polish", text: "UI review halaman dirapikan", tone: "indigo" },
  { label: "Next", text: "Deploy dan tambah tools baru", tone: "amber" },
];

export default function HomePage() {
  const visibleTools = tools.slice(0, 4);

  return (
    <>
      <section className="relative overflow-hidden border-b border-slate-200 dark:border-brand-line py-14 lg:py-20">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(15,23,42,0.055)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.055)_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="absolute right-0 top-0 -z-10 h-72 w-72 rounded-full bg-brand-soft blur-3xl" />
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_460px] lg:items-center">
            <div>
              <p className="inline-flex rounded-full border border-slate-200 dark:border-brand-line bg-white dark:bg-brand-panel/80 px-4 py-2 font-mono text-xs uppercase tracking-[0.18em] text-slate-600 dark:text-slate-400">Arnol Works · Tools Lab</p>
              <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-tight tracking-[-0.04em] text-brand-ink dark:text-slate-100 sm:text-5xl lg:text-[58px]">
                Saya membangun tools web sederhana yang benar-benar bisa dipakai.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-400">
                Arnol Works adalah ruang kerja digital untuk tools kecil, mini product, dan catatan build yang berangkat dari masalah nyata sehari-hari.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/tools" className="inline-flex justify-center rounded-md bg-black px-7 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-brand-night dark:hover:bg-slate-200">Lihat Tools</Link>
                <Link href="/projects" className="inline-flex justify-center rounded-md border border-slate-300 bg-white px-7 py-3 text-sm font-semibold text-brand-ink transition hover:border-slate-500 dark:border-brand-line dark:bg-brand-panel/80 dark:text-slate-100 dark:hover:border-slate-500 dark:hover:bg-slate-800">Lihat Project</Link>
              </div>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <Metric label="Tool aktif" value="01" />
                <Metric label="Stack" value="Next/FastAPI" />
                <Metric label="Fokus" value="Utility" />
              </div>
            </div>
            <BuilderWorkspaceCard />
          </div>
        </Container>
      </section>

      <section className="border-b border-slate-200 dark:border-brand-line py-14">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">Latest Build</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-brand-ink dark:text-slate-100">Pisah PDF Warna & Hitam Putih</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-400">
                Build pertama ini dibuat untuk kasus sederhana: dokumen tebal sering punya sedikit halaman warna, tapi biaya print bisa ikut mahal jika tidak dipisahkan.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {timeline.map((item) => <TimelineCard key={item.label} item={item} />)}
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 lg:py-20">
        <Container>
          <div className="mb-9 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Tools Shelf</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-brand-ink dark:text-slate-100">Tools yang sedang dibangun</h2>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">Utilitas kecil untuk pekerjaan dokumen, gambar, dan workflow harian.</p>
            </div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{tools.length} tools tersedia / direncanakan</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {visibleTools.map((tool) => <HomeToolCard key={tool.id} tool={tool} />)}
          </div>
        </Container>
      </section>

      <section className="py-10 lg:py-16">
        <Container>
          <div className="overflow-hidden rounded-[28px] border border-slate-800 bg-slate-950 text-white">
            <div className="grid gap-0 lg:grid-cols-[1fr_380px]">
              <div className="p-8 sm:p-10 lg:p-12">
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">Build Notes #01</p>
                <h2 className="mt-5 max-w-2xl text-3xl font-semibold tracking-[-0.03em]">Di balik layar pembuatan tool PDF pertama.</h2>
                <div className="mt-10 grid gap-8 lg:grid-cols-2">
                  <NoteBlock title="Problem">Biaya print bisa membengkak saat dokumen campuran warna dan hitam putih dikirim sebagai satu file.</NoteBlock>
                  <NoteBlock title="Approach">Backend mendeteksi kanal warna per halaman, lalu user tetap diberi kontrol manual sebelum split.</NoteBlock>
                </div>
              </div>
              <div className="border-t border-white/10 bg-white/[0.04] p-8 lg:border-l lg:border-t-0">
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">Stack Notes</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {["Next.js", "TypeScript", "Tailwind", "FastAPI", "PyMuPDF"].map((tech) => <span key={tech} className="rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 font-mono text-xs text-slate-200">{tech}</span>)}
                </div>
                <div className="mt-8 rounded-2xl border border-slate-700 bg-black/30 p-4 font-mono text-xs leading-6 text-slate-300">
                  <p>build: pdf-color-bw-splitter</p>
                  <p>status: ready</p>
                  <p>focus: useful before fancy</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

function Metric({ label, value }: Readonly<{ label: string; value: string }>) {
  return <div className="rounded-2xl border border-slate-200 dark:border-brand-line bg-white dark:bg-brand-panel/80 p-4"><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{label}</p><p className="mt-2 text-sm font-semibold text-brand-ink dark:text-slate-100">{value}</p></div>;
}

function BuilderWorkspaceCard() {
  return (
    <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_24px_80px_rgba(15,23,42,0.08)] dark:border-brand-line dark:bg-slate-950/80 dark:shadow-[0_24px_90px_rgba(0,0,0,0.35)]">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-brand-line pb-4">
        <div className="flex gap-1.5"><span className="h-3 w-3 rounded-full bg-red-300" /><span className="h-3 w-3 rounded-full bg-amber-300" /><span className="h-3 w-3 rounded-full bg-emerald-300" /></div>
        <span className="font-mono text-xs text-slate-500 dark:text-slate-400">latest-build.md</span>
      </div>
      <div className="mt-5 rounded-2xl border border-brand-border bg-brand-soft p-5 dark:border-slate-700 dark:bg-slate-900/95">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-brand-primary dark:text-indigo-300">MVP selesai</p>
            <h2 className="mt-3 text-2xl font-medium tracking-[-0.02em] text-brand-ink dark:text-slate-100">Pisah PDF Warna & Hitam Putih</h2>
          </div>
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 font-mono text-[11px] uppercase tracking-wide text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-300">Ready</span>
        </div>
        <div className="mt-6 grid gap-3">
          {features.map((feature) => <div key={feature} className="flex items-center gap-3 rounded-xl bg-white p-3 text-sm text-slate-700 shadow-sm dark:bg-slate-800 dark:text-slate-100 dark:shadow-none"><span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-500 text-[11px] text-white">✓</span>{feature}</div>)}
        </div>
        <Link href="/tools/pdf-color-bw-splitter" className="mt-6 inline-flex w-full justify-center rounded-md bg-brand-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-hover">Buka Tool</Link>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3 text-center">
        <MiniStat label="pages" value="scan" />
        <MiniStat label="review" value="manual" />
        <MiniStat label="output" value="2 PDF" />
      </div>
    </article>
  );
}

function MiniStat({ label, value }: Readonly<{ label: string; value: string }>) {
  return <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-brand-line dark:bg-slate-900/80"><p className="font-mono text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p><p className="mt-1 text-xs font-semibold text-brand-ink dark:text-slate-100">{value}</p></div>;
}

function TimelineCard({ item }: Readonly<{ item: (typeof timeline)[number] }>) {
  const dotColor = item.tone === "emerald" ? "bg-emerald-500" : item.tone === "amber" ? "bg-amber-500" : "bg-brand-primary";
  return <article className="rounded-[18px] border border-slate-200 dark:border-brand-line bg-white dark:bg-brand-panel p-5"><span className={`block h-2.5 w-2.5 rounded-full ${dotColor}`} /><p className="mt-5 font-mono text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{item.label}</p><p className="mt-3 text-sm leading-6 text-brand-ink dark:text-slate-100">{item.text}</p></article>;
}

function HomeToolCard({ tool }: Readonly<{ tool: (typeof tools)[number] }>) {
  const available = tool.status === "available";
  return (
    <article className="group rounded-[20px] border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-slate-300 dark:border-brand-line dark:bg-slate-900/70 dark:hover:border-slate-500">
      <div className="flex items-start justify-between gap-3">
        <div className={`grid h-11 w-11 place-items-center rounded-xl text-xs font-semibold ${available ? "bg-brand-soft text-brand-primary dark:bg-indigo-400/15 dark:text-indigo-200" : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300"}`}>{tool.icon}</div>
        <span className={`rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide ${available ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-300" : "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-300"}`}>{available ? "Tersedia" : "Rencana"}</span>
      </div>
      <h3 className="mt-8 text-lg font-medium leading-7 tracking-[-0.02em] text-brand-ink dark:text-slate-100">{tool.title}</h3>
      <p className="mt-3 min-h-20 text-sm leading-6 text-slate-600 dark:text-slate-400">{tool.description}</p>
      <div className="mt-5 border-t border-slate-200 dark:border-brand-line pt-4">
        {available ? <Link href={tool.href} className="text-sm font-medium text-brand-primary">Buka Tool →</Link> : <span className="text-sm text-slate-500 dark:text-slate-400">Masuk backlog build</span>}
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
