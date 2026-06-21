import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { Eyebrow, Panel } from "@/components/ui";

const principles = [
  "Useful before fancy",
  "Ship kecil tapi nyata",
  "Belajar lewat produk",
  "Dokumentasikan proses",
];

const stack = ["Next.js App Router", "FastAPI", "TypeScript", "Python", "PyMuPDF", "Tailwind CSS"];

export const metadata = { title: "Tentang — Arnol Works" };

export default function AboutPage() {
  return (
    <PageShell>
      <section className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
        <Panel className="p-7 sm:p-10">
          <Eyebrow>About</Eyebrow>
          <h1 className="mt-5 text-4xl font-semibold tracking-[-0.03em] text-brand-ink dark:text-slate-100">
            Tentang Arnol Works
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-400">
            Arnol Works adalah portfolio aktif berbasis multi-tools platform. Setiap tool dibangun untuk menyelesaikan masalah nyata — sekaligus membuktikan kemampuan membangun produk web yang rapi, berguna, dan bisa dikembangkan.
          </p>
          <p className="mt-5 text-base leading-7 text-slate-600 dark:text-slate-400">
            Fokusnya bukan tampilan yang rumit, melainkan tools yang langsung bisa dipakai: kompres PDF, gabung PDF, hapus background gambar, dan banyak lagi. Semua dibangun modular agar tools baru mudah ditambahkan.
          </p>
          <p className="mt-5 text-base leading-7 text-slate-600 dark:text-slate-400">
            Tertarik kolaborasi, diskusi project, atau punya ide tool yang berguna? Jangan ragu untuk menghubungi.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/tools"
              className="inline-flex justify-center rounded-md bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-brand-night dark:hover:bg-slate-200"
            >
              Lihat Tools
            </Link>
            <Link
              href="/contact"
              className="inline-flex justify-center rounded-md border border-slate-300 bg-white/80 px-6 py-3 text-sm font-semibold text-brand-ink transition hover:border-slate-400 dark:border-brand-line/50 dark:bg-brand-panel/60 dark:text-slate-100"
            >
              Hubungi Kami
            </Link>
          </div>
        </Panel>

        <div className="grid gap-6">
          <Panel as="aside" className="p-6">
            <Eyebrow>Build Principles</Eyebrow>
            <div className="mt-5 grid gap-3">
              {principles.map((item) => (
                <div key={item} className="rounded-xl border border-slate-200 bg-brand-paper p-4 text-sm font-medium text-brand-ink dark:border-brand-line dark:bg-slate-950/70 dark:text-slate-100">
                  {item}
                </div>
              ))}
            </div>
          </Panel>
          <Panel as="aside" className="p-6">
            <Eyebrow>Stack</Eyebrow>
            <div className="mt-5 flex flex-wrap gap-2">
              {stack.map((item) => (
                <span key={item} className="rounded-full border border-slate-200 bg-brand-paper px-3 py-1 text-xs font-medium text-slate-700 dark:border-brand-line dark:bg-slate-950/70 dark:text-slate-300">
                  {item}
                </span>
              ))}
            </div>
          </Panel>
        </div>
      </section>
    </PageShell>
  );
}