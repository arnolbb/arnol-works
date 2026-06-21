import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { Eyebrow, Panel, StatusBadge } from "@/components/ui";

export const metadata = { title: "Case Study: Arnol Works Platform" };

const stack = ["Next.js 14 App Router", "TypeScript", "FastAPI", "Python 3.11+", "PyMuPDF", "pypdf", "Pillow", "rembg (ONNX CPU)", "Tailwind CSS"];

export default function ArnolWorksCaseStudy() {
  return (
    <PageShell className="py-10 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <div className="mb-3 flex flex-wrap gap-2">
          <StatusBadge tone="emerald">Live</StatusBadge>
          <StatusBadge tone="indigo">Portfolio</StatusBadge>
        </div>
        <Eyebrow>Case Study</Eyebrow>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.03em] text-brand-ink dark:text-slate-100">Arnol Works Platform</h1>
        <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-400">Bagaimana portfolio personal berubah menjadi platform multi-tools yang bisa langsung dipakai.</p>

        <div className="mt-12 space-y-10 text-sm leading-7 text-slate-700 dark:text-slate-300">
          <section>
            <h2 className="text-xl font-semibold text-brand-ink dark:text-slate-100">Masalah</h2>
            <p className="mt-4">Portfolio statis tidak membuktikan kemampuan membangun produk nyata. Butuh sesuatu yang bisa langsung dipakai orang lain — bukan sekadar screenshot atau demo.</p>
            <p className="mt-3">Masalah sehari-hari yang sering muncul: PDF berwarna yang harus dipisahkan sebelum print, ukuran gambar yang terlalu besar untuk di-upload, atau beberapa PDF yang perlu digabung. Tools online yang ada seringkali lambat, berbayar, atau meminta akun.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-brand-ink dark:text-slate-100">Solusi</h2>
            <p className="mt-4">Membangun platform multi-tools dengan arsitektur modular: frontend Next.js dan backend FastAPI yang terpisah, sehingga tools baru mudah ditambahkan tanpa mengubah infrastruktur inti.</p>
            <p className="mt-3">Setiap tool berdiri sendiri: route terpisah, endpoint terpisah, service terpisah. Tidak ada ketergantungan antar-tool yang membuat penambahan fitur menjadi berisiko.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-brand-ink dark:text-slate-100">Target Pengguna</h2>
            <ul className="mt-4 list-disc pl-5 space-y-2">
              <li>Mahasiswa yang butuh kompres PDF sebelum upload tugas</li>
              <li>Pekerja kantoran yang perlu gabung atau pisah dokumen</li>
              <li>UMKM yang butuh hapus background foto produk</li>
              <li>Siapa saja yang butuh utilitas dokumen cepat tanpa daftar akun</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-brand-ink dark:text-slate-100">Fitur Utama</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {["Pisah PDF Warna & BW", "Kompres PDF", "Gabungkan PDF", "PDF ke Word", "JPG/PNG ke PDF", "PDF ke JPG", "Kompres Gambar", "Resize Gambar", "Hapus Background (AI)", "Pas Foto Generator", "QR Code Generator", "Hitung Kata & Karakter"].map((f) => (
                <div key={f} className="rounded-lg border border-slate-200 bg-brand-paper px-4 py-2.5 text-xs dark:border-brand-line dark:bg-slate-950/70">{f}</div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-brand-ink dark:text-slate-100">Stack & Arsitektur</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {stack.map((s) => (
                <span key={s} className="rounded-full border border-slate-200 bg-brand-paper px-3 py-1 text-xs dark:border-brand-line dark:bg-slate-950/70">{s}</span>
              ))}
            </div>
            <p className="mt-5">File diproses secara sinkron di server, disimpan sementara dengan UUID job ID, dan dihapus otomatis setelah 24 jam. Tidak ada database, tidak ada akun, tidak ada penyimpanan permanen.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-brand-ink dark:text-slate-100">Keputusan & Tantangan</h2>
            <ul className="mt-4 list-disc pl-5 space-y-3">
              <li><strong className="text-brand-ink dark:text-slate-100">PyMuPDF vs pypdf:</strong> PyMuPDF digunakan untuk render thumbnail dan analisis warna (cepat, native), pypdf untuk split/merge halaman asli tanpa merender ulang konten.</li>
              <li><strong className="text-brand-ink dark:text-slate-100">rembg tanpa GPU:</strong> Menggunakan ONNX Runtime CPU-only agar bisa berjalan di server hosting standar tanpa GPU.</li>
              <li><strong className="text-brand-ink dark:text-slate-100">Upload limits:</strong> Batas per-file, total batch, dan jumlah file dikonfigurasi via environment variable agar mudah disesuaikan tanpa deploy ulang kode.</li>
              <li><strong className="text-brand-ink dark:text-slate-100">Job expiry:</strong> Enforcement akses file expired dilakukan di level aplikasi, bukan hanya level filesystem, agar tetap aman meski jadwal cleanup terlambat.</li>
            </ul>
          </section>
        </div>

        <div className="mt-12 flex flex-wrap gap-4">
          <Link href="/tools" className="inline-flex rounded-md bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-brand-night dark:hover:bg-slate-200">Coba Tools</Link>
          <Link href="/projects" className="inline-flex rounded-md border border-slate-300 px-6 py-3 text-sm font-semibold text-brand-ink hover:border-slate-400 dark:border-brand-line dark:text-slate-100">← Semua Projects</Link>
        </div>
      </div>
    </PageShell>
  );
}