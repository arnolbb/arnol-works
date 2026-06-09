# PRD — Arnol Works

## 1. Ringkasan produk

**Arnol Works** adalah website portfolio interaktif yang berisi kumpulan web tools, mini product, dan eksperimen digital buatan Arnol. Website ini dibuat sebagai portfolio yang tidak hanya menampilkan informasi diri, tetapi juga menunjukkan kemampuan membangun produk nyata yang bisa digunakan oleh user.

Tools pertama yang akan dibuat adalah **PDF Color/BW Splitter**, yaitu alat untuk memisahkan halaman PDF berwarna dan hitam-putih menjadi dua file PDF terpisah.

## 2. Masalah yang diselesaikan

Banyak user, khususnya mahasiswa atau pekerja kantor, mencetak dokumen PDF seperti skripsi, laporan, proposal, atau materi kerja. Dokumen tersebut biasanya mayoritas berisi teks hitam-putih, tetapi memiliki beberapa halaman berwarna seperti gambar, grafik, logo, atau lampiran.

Ketika file diserahkan langsung ke tukang print/fotocopy, ada risiko seluruh halaman dihitung sebagai print warna, atau user harus memeriksa halaman warna secara manual. Ini membuang waktu dan bisa membuat biaya print lebih mahal.

## 3. Solusi

Arnol Works menyediakan tools pertama berupa PDF Color/BW Splitter dengan flow:

1. User upload PDF.
2. Sistem menganalisis halaman yang kemungkinan berwarna.
3. Sistem menampilkan preview thumbnail seluruh halaman.
4. Halaman yang terdeteksi berwarna otomatis ditandai.
5. User bisa mengubah pilihan secara manual.
6. Sistem membuat dua file PDF:
   - File halaman berwarna.
   - File halaman hitam-putih.
7. User download kedua file dan bisa mencetaknya secara terpisah.

## 4. Goals

### Product goals

- Membuat portfolio yang lebih kuat daripada portfolio statis.
- Membuktikan kemampuan membangun full-stack product.
- Menyediakan tools nyata yang berguna untuk user.
- Membangun fondasi multi-tools platform yang scalable.

### MVP goals

- Homepage Arnol Works.
- Tools directory.
- Tool registry modular.
- Halaman tools PDF Color/BW Splitter.
- Upload PDF.
- Analisis warna otomatis.
- Manual review halaman.
- Split PDF menjadi dua file.
- Download hasil.

## 5. Non-goals MVP

Untuk MVP, jangan membuat:

- Login/register.
- Payment/premium plan.
- Database production.
- Admin dashboard.
- Multi-language system kompleks.
- Banyak tools sekaligus.
- OCR.
- PDF editor kompleks.
- Cloud storage permanen.
- Queue system kompleks.

## 6. Target user

Primary users:

- Mahasiswa yang mencetak skripsi/laporan.
- Pelajar yang mencetak tugas.
- Pekerja kantor yang mencetak dokumen panjang.
- Guru/dosen yang mencetak materi.
- User umum yang ingin memisahkan halaman PDF warna dan hitam-putih.

Secondary users:

- Recruiter/client yang melihat kemampuan Arnol sebagai developer.
- Calon pengguna tools lain di masa depan.

## 7. Value proposition

Untuk user umum:

> Hemat biaya print dengan memisahkan halaman PDF berwarna dan hitam-putih secara otomatis, lalu koreksi sendiri sebelum diproses.

Untuk portfolio:

> Arnol Works menunjukkan kemampuan membangun produk web full-stack yang menyelesaikan masalah nyata.

## 8. Branding

Brand utama:

- Nama: Arnol Works
- Domain: arnol.web.id
- Tagline English: Useful web tools and product experiments built by Arnol.
- Tagline Indonesia: Kumpulan tools web dan eksperimen produk digital buatan Arnol.

Tools pertama:

- Nama: Pisah PDF Warna & Hitam Putih
- Nama teknis: PDF Color/BW Splitter
- Deskripsi: Pisahkan halaman PDF berwarna dan hitam-putih agar biaya print lebih hemat.

## 9. Information architecture

Routes MVP:

- `/` — homepage Arnol Works.
- `/tools` — daftar tools.
- `/tools/pdf-color-bw-splitter` — tools pertama.
- `/projects` — portfolio/project list placeholder.
- `/about` — tentang Arnol placeholder.
- `/contact` — kontak placeholder.

Routes backend MVP:

- `GET /health`
- `POST /api/pdf/analyze`
- `POST /api/pdf/split`
- `GET /api/files/{jobId}/{fileName}`

## 10. Core user journey

### Journey: memisahkan PDF

1. User membuka `/tools/pdf-color-bw-splitter`.
2. User membaca manfaat tools.
3. User upload file PDF.
4. Frontend mengirim file ke backend analyze endpoint.
5. Backend mengembalikan job ID, total halaman, detected color pages, dan thumbnail halaman.
6. Frontend menampilkan grid halaman.
7. Halaman terdeteksi warna otomatis terpilih.
8. User review dan ubah pilihan.
9. User bisa memasukkan nomor halaman manual seperti `1, 3, 8-12, 20`.
10. User klik “Pisahkan PDF”.
11. Frontend mengirim selectedColorPages ke backend split endpoint.
12. Backend membuat dua output PDF.
13. User download file warna dan file hitam-putih.

## 11. Functional requirements

### Platform

- Homepage harus menjelaskan Arnol Works sebagai portfolio + tools platform.
- Tools directory harus membaca data dari tool registry.
- Tool registry harus mudah ditambah tools baru.
- Route tools harus modular.

### PDF upload

- User bisa upload file PDF.
- Sistem hanya menerima PDF.
- Max file size MVP: 50MB.
- Tampilkan loading state saat upload/analisis.
- Tampilkan error jika file invalid, terlalu besar, rusak, atau terenkripsi.

### Analyze PDF

- Backend render setiap halaman ke gambar resolusi sedang untuk analisis.
- Backend membuat thumbnail untuk preview.
- Backend mendeteksi apakah halaman kemungkinan berwarna.
- Return data halaman ke frontend.
- Nomor halaman memakai 1-based index.

### Manual selection

- Halaman terdeteksi warna otomatis selected.
- User bisa checklist/uncheck tiap halaman.
- User bisa input manual page range.
- User bisa reset ke hasil deteksi otomatis.
- User bisa pilih semua/hapus semua.
- selectedColorPages adalah sumber kebenaran final untuk split.

### Split PDF

- Backend menerima jobId dan selectedColorPages.
- Backend membuat PDF warna berisi halaman selectedColorPages.
- Backend membuat PDF hitam-putih berisi halaman selain selectedColorPages.
- Output menggunakan halaman PDF asli, bukan render gambar.
- Return download URL untuk kedua file.

### Download

- User bisa download dua file hasil.
- Nama file jelas:
  - `arnol-works-color-pages.pdf`
  - `arnol-works-bw-pages.pdf`

## 12. Non-functional requirements

- UI responsive untuk desktop dan mobile.
- Backend harus menangani error dengan JSON yang konsisten.
- Temporary files harus bisa dibersihkan otomatis.
- Tidak menyimpan file user permanen untuk MVP.
- Kode harus modular dan mudah dikembangkan.
- Project harus bisa dijalankan lokal dengan README.

## 13. Success metrics MVP

- User bisa menyelesaikan flow upload → analyze → review → split → download.
- PDF output tetap mempertahankan layout asli.
- User bisa mengoreksi halaman warna secara manual.
- Codex bisa melanjutkan development dari dokumen ini tanpa kebingungan.
- Project dapat dipakai sebagai portfolio yang layak ditunjukkan.

## 14. Future roadmap

Tools tambahan potensial:

- Compress PDF.
- Merge PDF.
- Split PDF by range.
- Rotate PDF.
- Image to PDF.
- PDF to images.
- Text formatter.
- Case converter.
- Word counter.
- Simple invoice generator.
- QR code generator.

Fitur platform masa depan:

- Search tools.
- Favorite tools.
- Case studies per project.
- Blog/dev notes.
- Analytics privacy-friendly.
- Optional account system.
- Optional premium tools.

