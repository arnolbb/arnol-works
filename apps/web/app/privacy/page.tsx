import Link from "next/link";
import { PageShell } from "@/components/page-shell";

export const metadata = { title: "Kebijakan Privasi — Arnol Works" };

export default function PrivacyPage() {
  return (
    <PageShell className="py-10 sm:py-16">
      <div className="mx-auto max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Kebijakan Privasi</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-brand-ink dark:text-slate-100">Privasi Anda di Arnol Works</h1>
        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Terakhir diperbarui: Juni 2026</p>

        <div className="mt-10 space-y-8 text-sm leading-7 text-slate-700 dark:text-slate-300">
          <section>
            <h2 className="font-semibold text-brand-ink dark:text-slate-100">File yang Anda Upload</h2>
            <p className="mt-3">File yang Anda unggah ke tools Arnol Works hanya digunakan untuk memproses permintaan Anda secara langsung. File tidak dibagikan ke pihak ketiga, tidak digunakan untuk pelatihan model, dan tidak disimpan secara permanen.</p>
            <p className="mt-3">File disimpan sementara di server selama masa retensi singkat (default 24 jam), setelah itu dihapus otomatis. Anda dianjurkan mengunduh hasil segera setelah proses selesai.</p>
          </section>

          <section>
            <h2 className="font-semibold text-brand-ink dark:text-slate-100">Data yang Tidak Kami Kumpulkan</h2>
            <p className="mt-3">Arnol Works tidak meminta akun, tidak menyimpan email, tidak menggunakan cookie pelacak pihak ketiga, dan tidak mengintegrasikan layanan analytics berbayar pada saat ini.</p>
          </section>

          <section>
            <h2 className="font-semibold text-brand-ink dark:text-slate-100">Log Teknis</h2>
            <p className="mt-3">Server hosting mungkin mencatat informasi teknis standar seperti alamat IP dan waktu akses sebagai bagian dari infrastruktur hosting. Log ini tidak digunakan untuk mengidentifikasi pengguna secara personal.</p>
          </section>

          <section>
            <h2 className="font-semibold text-brand-ink dark:text-slate-100">Perubahan Kebijakan</h2>
            <p className="mt-3">Jika ada perubahan signifikan pada kebijakan ini, tanggal pembaruan di atas akan diubah. Kami tidak akan membuat perubahan yang secara retroaktif membahayakan privasi data yang sudah Anda unggah sebelumnya.</p>
          </section>

          <section>
            <h2 className="font-semibold text-brand-ink dark:text-slate-100">Kontak</h2>
            <p className="mt-3">Pertanyaan tentang privasi? Hubungi kami melalui <Link href="/contact" className="text-brand-primary underline dark:text-indigo-400">halaman kontak</Link>.</p>
          </section>
        </div>

        <div className="mt-12 flex gap-4 text-xs text-slate-500 dark:text-slate-400">
          <Link href="/terms" className="hover:text-brand-primary dark:hover:text-indigo-400">Syarat Penggunaan</Link>
          <span>·</span>
          <Link href="/file-retention" className="hover:text-brand-primary dark:hover:text-indigo-400">Retensi File</Link>
        </div>
      </div>
    </PageShell>
  );
}