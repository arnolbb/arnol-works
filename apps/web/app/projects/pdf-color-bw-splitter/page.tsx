import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { Eyebrow, StatusBadge } from "@/components/ui";

export const metadata = { title: "Case Study: PDF Color & BW Splitter" };

export default function PdfSplitterCaseStudy() {
  return (
    <PageShell className="py-10 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <div className="mb-3 flex flex-wrap gap-2">
          <StatusBadge tone="emerald">Live</StatusBadge>
          <StatusBadge tone="indigo">Tool</StatusBadge>
        </div>
        <Eyebrow>Case Study</Eyebrow>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.03em] text-brand-ink dark:text-slate-100">PDF Color & BW Splitter</h1>
        <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-400">Pisahkan halaman PDF berwarna dan hitam-putih menjadi dua file berbeda — untuk menghemat biaya print berwarna.</p>

        <div className="mt-12 space-y-10 text-sm leading-7 text-slate-700 dark:text-slate-300">
          <section>
            <h2 className="text-xl font-semibold text-brand-ink dark:text-slate-100">Masalah</h2>
            <p className="mt-4">Print berwarna jauh lebih mahal dari hitam-putih. Banyak dokumen seperti laporan akademis atau presentasi memiliki campuran halaman berwarna dan hitam-putih. Untuk menghemat biaya, halaman perlu dipisahkan — tapi tidak ada cara mudah melakukannya tanpa software khusus.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-brand-ink dark:text-slate-100">Solusi</h2>
            <p className="mt-4">Tool ini menganalisis setiap halaman PDF menggunakan PyMuPDF untuk mendeteksi apakah halaman mengandung warna. Sistem memberikan rekomendasi awal, tapi keputusan akhir ada di tangan user — setiap halaman bisa di-toggle sebelum split dilakukan.</p>
            <p className="mt-3">Output berupa dua file PDF terpisah: satu untuk halaman berwarna, satu untuk hitam-putih. Halaman asli tidak dirender ulang — pypdf langsung menyalin halaman dari PDF sumber agar kualitas tidak turun.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-brand-ink dark:text-slate-100">Cara Kerja Teknis</h2>
            <ol className="mt-4 list-decimal pl-5 space-y-3">
              <li>User upload PDF → backend membuat job dengan UUID unik</li>
              <li>PyMuPDF merender setiap halaman sebagai thumbnail dan menganalisis distribusi warna pixel</li>
              <li>Algoritma deteksi dengan 3 mode sensitivitas: strict, balanced, print-saving</li>
              <li>Frontend menampilkan thumbnail tiap halaman dengan status warna/BW yang bisa diubah manual</li>
              <li>User konfirmasi → pypdf split halaman asli tanpa re-encoding</li>
              <li>Dua file PDF tersedia untuk diunduh, job dihapus setelah 24 jam</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-brand-ink dark:text-slate-100">Keputusan Desain</h2>
            <ul className="mt-4 list-disc pl-5 space-y-3">
              <li><strong className="text-brand-ink dark:text-slate-100">Deteksi ≠ keputusan final:</strong> Sistem hanya memberikan rekomendasi. User selalu bisa mengubah klasifikasi setiap halaman sebelum split — karena deteksi otomatis tidak sempurna, terutama untuk halaman dengan elemen warna subtle.</li>
              <li><strong className="text-brand-ink dark:text-slate-100">Pisah PyMuPDF dan pypdf:</strong> PyMuPDF cepat untuk render dan analisis, pypdf preserves kualitas untuk output. Menggabungkan keduanya menghasilkan pipeline yang akurat sekaligus aman.</li>
              <li><strong className="text-brand-ink dark:text-slate-100">Nomor halaman 1-based:</strong> API menggunakan nomor halaman yang natural (1, 2, 3...) agar mudah diverifikasi user, bukan 0-based index internal.</li>
            </ul>
          </section>
        </div>

        <div className="mt-12 flex flex-wrap gap-4">
          <Link href="/tools/pdf-color-bw-splitter" className="inline-flex rounded-md bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-brand-night dark:hover:bg-slate-200">Coba Tool Ini</Link>
          <Link href="/projects" className="inline-flex rounded-md border border-slate-300 px-6 py-3 text-sm font-semibold text-brand-ink hover:border-slate-400 dark:border-brand-line dark:text-slate-100">← Semua Projects</Link>
        </div>
      </div>
    </PageShell>
  );
}