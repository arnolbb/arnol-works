import Link from "next/link";
import { Container } from "@/components/page-shell";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-brand-paper text-brand-ink">
      <Container className="py-12">
        <div className="grid gap-10 md:grid-cols-[1fr_auto_auto] md:justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-[-0.02em]">Arnol Works</h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-slate-600">Ruang kecil untuk membangun tools web, mencatat proses, dan mengubah masalah sehari-hari menjadi produk sederhana yang bisa dipakai.</p>
          </div>
          <div>
            <h3 className="font-mono text-xs uppercase tracking-[0.22em] text-slate-500">Navigasi</h3>
            <div className="mt-4 grid gap-3 text-sm text-slate-700">
              <Link href="/tools" className="hover:text-brand-ink">Tools</Link>
              <Link href="/projects" className="hover:text-brand-ink">Projects</Link>
              <Link href="/case-studies" className="hover:text-brand-ink">Notes</Link>
            </div>
          </div>
          <div>
            <h3 className="font-mono text-xs uppercase tracking-[0.22em] text-slate-500">Kontak</h3>
            <div className="mt-4 grid gap-3 text-sm text-slate-700">
              <span>arnol.web.id</span>
              <span>hello@arnol.web.id</span>
              <Link href="/contact" className="hover:text-brand-ink">Kirim feedback</Link>
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-3 border-t border-slate-200 pt-6 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Arnol Works. Dibuat sebagai portfolio produk.</p>
          <p className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Sistem berjalan</p>
        </div>
      </Container>
    </footer>
  );
}

export const Footer = SiteFooter;
