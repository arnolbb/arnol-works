import Link from "next/link";
import { Container } from "@/components/page-shell";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-slate-200 dark:border-slate-600/80 bg-brand-paper dark:bg-slate-900 text-brand-ink dark:text-slate-50">
      <Container className="py-12">
        <div className="grid gap-10 md:grid-cols-[1fr_auto_auto] md:justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-[-0.02em]">Arnol Works</h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-slate-600 dark:text-slate-300">Ruang kecil untuk membangun tools web, mencatat proses, dan mengubah masalah sehari-hari menjadi produk sederhana yang bisa dipakai.</p>
          </div>
          <div>
            <h3 className="font-mono text-xs uppercase tracking-[0.22em] text-slate-500 dark:text-slate-300">Navigasi</h3>
            <div className="mt-4 grid gap-3 text-sm text-slate-700 dark:text-slate-200">
              <Link href="/tools" className="hover:text-brand-ink dark:text-slate-100">Tools</Link>
              <Link href="/projects" className="hover:text-brand-ink dark:text-slate-100">Projects</Link>
              <Link href="/case-studies" className="hover:text-brand-ink dark:text-slate-100">Notes</Link>
            </div>
          </div>
          <div>
            <h3 className="font-mono text-xs uppercase tracking-[0.22em] text-slate-500 dark:text-slate-300">Kontak</h3>
            <div className="mt-4 grid gap-3 text-sm text-slate-700 dark:text-slate-200">
              <span>arnol.my.id</span>
              <span>hello@arnol.my.id</span>
              <Link href="/contact" className="hover:text-brand-ink dark:text-slate-100">Kirim feedback</Link>
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-3 border-t border-slate-200 dark:border-slate-600/80 pt-6 text-xs text-slate-600 dark:text-slate-300 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Arnol Works. Dibuat sebagai portfolio produk.</p>
          <p className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Sistem berjalan</p>
        </div>
      </Container>
    </footer>
  );
}

export const Footer = SiteFooter;
