import Link from "next/link";
import { PageShell } from "@/components/page-shell";

export const metadata = { title: "Syarat Penggunaan — Arnol Works" };

export default function TermsPage() {
  return (
    <PageShell className="py-10 sm:py-16">
      <div className="mx-auto max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Syarat Penggunaan</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-brand-ink dark:text-slate-100">Syarat Penggunaan Arnol Works</h1>
        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Terakhir diperbarui: Juni 2026</p>

        <div className="mt-10 space-y-8 text-sm leading-7 text-slate-700 dark:text-slate-300">
          <section>
            <h2 className="font-semibold text-brand-ink dark:text-slate-100">Penggunaan yang Diizinkan</h2>
            <p className="mt-3">Tools Arnol Works dapat digunakan secara gratis untuk keperluan pribadi, akademis, dan bisnis legal. Anda bertanggung jawab atas konten file yang Anda proses menggunakan layanan ini.</p>
          </section>

          <section>
            <h2 className="font-semibold text-brand-ink dark:text-slate-100">Batasan Penggunaan</h2>
            <ul className="mt-3 list-disc pl-5 space-y-2">
              <li>Jangan gunakan layanan ini untuk memproses file yang melanggar hak cipta tanpa izin.</li>
              <li>Jangan lakukan request otomatis dalam jumlah besar yang dapat mengganggu layanan.</li>
              <li>Jangan coba mengakses atau memodifikasi file milik pengguna lain.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-brand-ink dark:text-slate-100">Ketersediaan Layanan</h2>
            <p className="mt-3">Arnol Works adalah proyek portfolio yang sedang berkembang. Layanan dapat berubah, diperbarui, atau mengalami gangguan tanpa pemberitahuan sebelumnya. Kami tidak memberikan jaminan uptime tertentu.</p>
          </section>

          <section>
            <h2 className="font-semibold text-brand-ink dark:text-slate-100">Hasil Pemrosesan</h2>
            <p className="mt-3">Hasil pemrosesan file disediakan sebagaimana adanya. Kami menyarankan Anda memverifikasi hasil sebelum digunakan untuk dokumen penting. Gunakan file asli Anda sebagai cadangan.</p>
          </section>

          <section>
            <h2 className="font-semibold text-brand-ink dark:text-slate-100">File Sementara</h2>
            <p className="mt-3">File yang Anda upload dan hasil pemrosesan bersifat sementara. Lihat <Link href="/file-retention" className="text-brand-primary underline dark:text-indigo-400">kebijakan retensi file</Link> untuk detail masa simpan.</p>
          </section>
        </div>

        <div className="mt-12 flex gap-4 text-xs text-slate-500 dark:text-slate-400">
          <Link href="/privacy" className="hover:text-brand-primary dark:hover:text-indigo-400">Kebijakan Privasi</Link>
          <span>·</span>
          <Link href="/file-retention" className="hover:text-brand-primary dark:hover:text-indigo-400">Retensi File</Link>
        </div>
      </div>
    </PageShell>
  );
}