import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { Eyebrow } from "@/components/ui";

export const metadata = { title: "Mengapa PDF Splitter Dibangun Pertama — Arnol Works" };

export default function PdfSplitterNotePage() {
  return (
    <PageShell className="py-10 sm:py-16">
      <div className="mx-auto max-w-2xl">
        <Eyebrow>Build Notes</Eyebrow>
        <h1 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-brand-ink dark:text-slate-100">
          Mengapa PDF Splitter Dibangun Pertama
        </h1>
        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Juni 2026 · 4 menit baca</p>

        <div className="mt-10 space-y-6 text-sm leading-7 text-slate-700 dark:text-slate-300">
          <p>Ketika mulai membangun Arnol Works, ada satu pertanyaan yang harus dijawab lebih dulu: <em>tool apa yang dibangun pertama?</em></p>

          <p>Jawabannya datang dari masalah nyata. Sebuah dokumen laporan — campuran halaman berwarna dan hitam-putih — harus dicetak. Biaya print berwarna jauh lebih mahal. Untuk menghemat, halaman perlu dipisahkan dulu. Tidak ada tool gratis yang cukup mudah untuk melakukannya.</p>

          <p>Itu alasan pragmatisnya. Tapi ada alasan teknis yang sama pentingnya: PDF Splitter cukup kompleks untuk membuktikan kemampuan membangun full-stack feature yang nyata — upload file, analisis konten, review manual, dan output file yang terpisah — tanpa menjadi terlalu rumit untuk dikerjakan sendirian.</p>

          <h2 className="mt-8 text-lg font-semibold text-brand-ink dark:text-slate-100">Yang Lebih Sulit dari Perkiraan</h2>
          <p>Bagian paling tricky bukan deteksi warnanya — PyMuPDF menyediakan API pixel yang cukup andal. Yang lebih sulit adalah memutuskan <em>kapan sebuah halaman dianggap berwarna</em>.</p>
          <p>Halaman dengan logo kecil di pojok? Header tabel berwarna tipis? Watermark memudar? Semua kasus edge ini membuat threshold deteksi menjadi subjektif. Solusinya: sistem memberikan rekomendasi, tapi user selalu punya kendali penuh untuk mengubah klasifikasi setiap halaman sebelum split dilakukan.</p>

          <h2 className="mt-8 text-lg font-semibold text-brand-ink dark:text-slate-100">Pelajaran untuk Tool Berikutnya</h2>
          <p>Membangun PDF Splitter sebagai tool pertama mengajarkan pola arsitektur yang kemudian dipakai di semua tool berikutnya: job UUID, temporary storage, cleanup otomatis, dan validasi berlapis (file size, page count, file type). Investasi di fondasi awal membayar diri sendiri ketika tool ke-5, ke-8, ke-12 ditambahkan tanpa mengulang keputusan yang sama.</p>
        </div>

        <div className="mt-12 flex flex-wrap gap-4">
          <Link href="/tools/pdf-color-bw-splitter" className="inline-flex rounded-md bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-brand-night dark:hover:bg-slate-200">Coba Tool Ini</Link>
          <Link href="/case-studies" className="inline-flex rounded-md border border-slate-300 px-6 py-3 text-sm font-semibold text-brand-ink hover:border-slate-400 dark:border-brand-line dark:text-slate-100">← Semua Notes</Link>
        </div>
      </div>
    </PageShell>
  );
}