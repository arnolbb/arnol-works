import Link from "next/link";
import { PageShell } from "@/components/page-shell";

export const metadata = { title: "Kebijakan Retensi File — Arnol Works" };

export default function FileRetentionPage() {
  return (
    <PageShell className="py-10 sm:py-16">
      <div className="mx-auto max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Retensi File</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-brand-ink dark:text-slate-100">Berapa Lama File Anda Disimpan?</h1>
        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Terakhir diperbarui: Juni 2026</p>

        <div className="mt-10 space-y-8 text-sm leading-7 text-slate-700 dark:text-slate-300">
          <section>
            <h2 className="font-semibold text-brand-ink dark:text-slate-100">Masa Retensi Default</h2>
            <p className="mt-3">File yang Anda upload dan hasil pemrosesan disimpan sementara selama <strong className="text-brand-ink dark:text-slate-100">maksimal 24 jam</strong> setelah proses selesai. Setelah masa ini, file dihapus otomatis dari server.</p>
          </section>

          <section>
            <h2 className="font-semibold text-brand-ink dark:text-slate-100">Akses File Setelah Masa Retensi</h2>
            <p className="mt-3">Setelah masa retensi berakhir, link download Anda tidak akan bisa diakses lagi. Sistem kami secara aktif memblokir akses ke file yang sudah melewati masa simpan, bahkan jika file fisiknya belum sempat terhapus dari disk.</p>
            <p className="mt-3">Pola ini memastikan privasi Anda terlindungi terlepas dari jadwal pembersihan teknis server.</p>
          </section>

          <section>
            <h2 className="font-semibold text-brand-ink dark:text-slate-100">Saran Penggunaan</h2>
            <ul className="mt-3 list-disc pl-5 space-y-2">
              <li><strong className="text-brand-ink dark:text-slate-100">Unduh segera</strong> setelah proses selesai.</li>
              <li>Jangan mengandalkan link download sebagai penyimpanan jangka panjang.</li>
              <li>Simpan file asli Anda sebelum mengupload, sebagai cadangan.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-brand-ink dark:text-slate-100">Penghapusan Awal</h2>
            <p className="mt-3">Kami tidak menyediakan fitur hapus manual saat ini. Namun file akan dihapus otomatis sesuai jadwal. Jika Anda memiliki kekhawatiran khusus, hubungi kami.</p>
          </section>
        </div>

        <div className="mt-12 flex gap-4 text-xs text-slate-500 dark:text-slate-400">
          <Link href="/privacy" className="hover:text-brand-primary dark:hover:text-indigo-400">Kebijakan Privasi</Link>
          <span>·</span>
          <Link href="/terms" className="hover:text-brand-primary dark:hover:text-indigo-400">Syarat Penggunaan</Link>
        </div>
      </div>
    </PageShell>
  );
}