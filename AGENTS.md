# AGENTS.md â€” Arnol Works

Instruksi ini wajib dibaca dan dipatuhi oleh Codex/coding agent sebelum melakukan perubahan kode.

## Identitas project

Nama project: **Arnol Works**
Domain target: `arnol.my.id`
Jenis project: portfolio website + multi-tools platform
Tools pertama: **PDF Color/BW Splitter / Pisah PDF Warna & Hitam Putih**

Arnol Works bukan website khusus PDF. PDF splitter adalah tools pertama dari platform yang nantinya berisi banyak tools, mini product, eksperimen digital, dan project portfolio.

## Prinsip kerja agent

1. Kerjakan task secara berurutan mengikuti `docs/CODEX_TASKS.md`.
2. Jangan menambah scope tanpa diminta.
3. Jangan membuat fitur auth, payment, dashboard admin, database production, atau AI fitur tambahan kecuali sudah masuk task.
4. Jaga arsitektur modular agar tools baru mudah ditambahkan.
5. Semua perubahan harus memiliki alasan yang jelas.
6. Setelah menyelesaikan task, berikan ringkasan file yang diubah dan cara menjalankan/menguji.
7. Jangan menghapus dokumen spesifikasi kecuali diminta.
8. Jangan menyimpan file upload user secara permanen untuk MVP.
9. Jangan menaruh secret/key di repository.
10. Jangan mengubah isi PDF menjadi gambar saat membuat output akhir.

## Coding standards

Frontend:

- Gunakan TypeScript.
- Gunakan Next.js App Router.
- Gunakan komponen kecil dan reusable.
- Pisahkan tool registry dari UI.
- Hindari hardcode data tools langsung di banyak halaman.
- Gunakan naming yang jelas.

Backend:

- Gunakan FastAPI.
- Gunakan struktur service yang modular.
- Pisahkan route/controller dari PDF processing logic.
- Tambahkan validasi file.
- Tambahkan error handling yang bisa dipahami frontend.
- Semua temporary files harus memiliki cleanup strategy.

PDF:

- Gunakan PyMuPDF hanya untuk render thumbnail dan analisis warna.
- Gunakan pypdf untuk split halaman asli.
- Output PDF harus mempertahankan halaman asli.
- Nomor halaman di API menggunakan 1-based page number agar mudah dipahami user.

## Definition of done

Sebuah task dianggap selesai jika:

- Kode berjalan lokal.
- Tidak ada error TypeScript/Python yang jelas.
- Flow utama sesuai dokumen.
- Ada instruksi testing manual.
- Tidak ada perubahan scope yang tidak diminta.
- UI tetap responsive secara dasar.

## Prioritas MVP

Urutan prioritas:

1. Platform foundation Arnol Works.
2. Tool registry dan routing tools.
3. Halaman tools pertama.
4. Upload PDF.
5. Analyze PDF.
6. Review halaman dengan thumbnail dan manual selection.
7. Split PDF.
8. Download hasil.
9. Error handling, cleanup, dan polish.

## Bahasa dan copywriting

Default UI menggunakan bahasa Indonesia yang natural, sederhana, dan profesional.

Contoh tone:

- â€œPisahkan halaman PDF berwarna dan hitam-putih agar biaya print lebih hemat.â€
- â€œKami sudah menandai halaman yang kemungkinan berwarna. Silakan cek dan ubah pilihan sebelum file dipisahkan.â€
- â€œKeputusan akhir tetap berdasarkan halaman yang kamu pilih.â€

