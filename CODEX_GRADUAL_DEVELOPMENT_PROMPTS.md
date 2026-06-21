# Arnol Works — Prompt Codex Bertahap

> **Cara pakai:** Salin **satu prompt saja** ke Codex, tunggu sampai Codex menyelesaikan dan melaporkan hasilnya, lalu lanjut ke prompt berikutnya.  
> **Jangan pernah menjalankan beberapa prompt sekaligus.**
>
> Repository: `arnolbb/arnol-works`  
> Dokumen roadmap lengkap: `docs/ARNOL_WORKS_PRODUCT_EVOLUTION.md`

---

## Aturan kerja untuk setiap tahap

Semua prompt di bawah sudah meminta Codex untuk berhenti setelah satu tahap selesai. Jangan hapus aturan tersebut.

- Kerjakan hanya scope pada prompt yang sedang dijalankan.
- Jangan mengerjakan tahap berikutnya.
- Jangan refactor besar atau mengubah desain yang tidak terkait.
- Jangan membuat akun, payment, database, permanent storage, atau queue system.
- Jangan commit, push, deploy, atau membuat pull request kecuali saya meminta secara eksplisit.
- Setelah selesai, tampilkan:
  1. ringkasan perubahan,
  2. daftar file yang berubah,
  3. hasil test/build,
  4. risiko atau pekerjaan lanjutan,
  5. langkah verifikasi manual.
- Setelah laporan, **berhenti** dan tunggu instruksi berikutnya.

---

# Milestone 0 — Pahami codebase dulu

## Prompt 00 — Audit awal tanpa mengubah kode

```text
Saya sedang mengembangkan repository Arnol Works secara bertahap.

Baca terlebih dahulu:
- README.md
- docs/ARNOL_WORKS_PRODUCT_EVOLUTION.md
- apps/web/package.json
- apps/api/requirements.txt
- apps/api/app/main.py
- apps/api/app/routes/pdf.py
- apps/api/app/services/storage.py
- apps/api/app/services/background_remover.py

Tugas tahap ini hanya audit. Jangan mengubah file apa pun.

Buat laporan singkat berisi:
1. struktur repository dan stack saat ini,
2. daftar tool aktif beserta endpoint backend yang terkait,
3. risiko teknis paling penting yang perlu ditangani lebih dahulu,
4. file-file yang kemungkinan akan berubah pada tahap berikutnya,
5. urutan rekomendasi pengerjaan P0 yang realistis.

Jangan commit, push, deploy, atau mengubah kode. Setelah laporan, berhenti dan tunggu instruksi saya.
```

**Hasil yang diharapkan:** Codex benar-benar memahami struktur project sebelum mulai mengedit.

---

# Milestone 1 — Stabilitas tool yang sudah ada

## Prompt 01 — Perbaiki dependency `rembg`

```text
Kerjakan hanya tahap AW-001: memastikan fitur Remove Background dan Passport Photo dapat berjalan dari clean install dan Docker build.

Konteks:
- apps/api/app/services/background_remover.py mengimpor `rembg` saat runtime.
- README menyebut rembg diperlukan.
- apps/api/requirements.txt saat ini belum mencantumkan rembg.

Tugas:
1. Inspect requirements backend, Dockerfile, dan service yang memakai rembg.
2. Tambahkan dependency rembg yang kompatibel dengan Python 3.11 dan runtime backend saat ini.
3. Tambahkan dependency runtime lain hanya jika memang diperlukan oleh rembg dan bisa dibuktikan dari proses install/test.
4. Pastikan perubahan minimal; jangan mengubah desain frontend atau tool lain.
5. Update README hanya bila instruksi instalasi backend perlu diperbaiki.
6. Jalankan validasi clean install atau test import yang relevan.
7. Jika model rembg diunduh saat runtime, dokumentasikan dampaknya secara singkat tanpa mengubah arsitektur besar.

Batasan:
- Jangan menambahkan akun, database, queue, cloud storage, atau fitur baru.
- Jangan deploy, commit, push, atau lanjut ke tahap upload limits.

Setelah selesai, berikan:
- ringkasan perubahan,
- file berubah,
- hasil validasi,
- catatan kebutuhan memory/startup backend,
- langkah verifikasi manual untuk Remove Background dan Passport Photo.

Lalu berhenti.
```

**Verifikasi manual setelah Codex selesai**
- Jalankan backend dari environment baru.
- Upload satu JPG ke Remove Background.
- Upload satu JPG ke Pas Foto.
- Pastikan tidak muncul error `DEPENDENCY_MISSING`.

---

## Prompt 02 — Batasi batch upload dengan aman

```text
Kerjakan hanya tahap AW-003 dan AW-004: menambahkan batas jumlah file dan total ukuran upload untuk endpoint batch.

Konteks:
- Saat ini tiap file memiliki batas 50 MB.
- Endpoint batch seperti merge PDF, compress image, resize image, dan remove background dapat menerima banyak file.
- Kita perlu mencegah satu request terlalu besar tanpa mengubah behavior tool yang normal.

Tugas:
1. Inspect cara file disimpan pada apps/api/app/routes/pdf.py dan modul storage/config yang ada.
2. Buat konfigurasi limit yang sederhana dan mudah diubah melalui environment variables:
   - MAX_FILE_SIZE_BYTES
   - MAX_TOTAL_UPLOAD_BYTES
   - MAX_BATCH_FILES
3. Terapkan limit pada seluruh endpoint multi-file yang relevan:
   - merge PDF
   - image to PDF
   - compress image
   - resize image
   - remove background
4. Pertahankan limit file tunggal yang sudah ada, tetapi jangan hard-code ulang di banyak tempat.
5. Buat error code dan pesan Bahasa Indonesia yang konsisten untuk:
   - terlalu banyak file,
   - total upload terlalu besar,
   - satu file terlalu besar.
6. Pastikan upload yang gagal di tengah proses tidak meninggalkan file temporary yang tidak perlu.
7. Tambahkan test backend minimal untuk limit file-count dan total-size.

Batasan:
- Jangan mengubah UI besar-besaran.
- Jangan menambah page-count limit, expiry job, privacy page, atau scheduler pada tahap ini.
- Jangan deploy, commit, atau push.

Setelah selesai, laporkan perubahan, file berubah, hasil test, nilai limit default, dan contoh respons error. Lalu berhenti.
```

**Verifikasi manual**
- Upload file melebihi limit satuan.
- Coba batch lebih dari jumlah file maksimum.
- Coba batch dengan total ukuran melebihi batas.
- Pastikan error mudah dipahami.

---

## Prompt 03 — Tambahkan limit jumlah halaman PDF

```text
Kerjakan hanya tahap AW-005: membatasi jumlah halaman PDF untuk proses berat.

Tujuan:
Melindungi backend dari PDF yang sangat panjang pada proses analyze/split, PDF ke JPG, PDF ke Word, kompres, dan merge bila relevan.

Tugas:
1. Inspect endpoint PDF dan service yang menggunakan PyMuPDF/pypdf.
2. Tambahkan environment variable MAX_PDF_PAGES dengan default konservatif yang masuk akal.
3. Validasi page count sebelum proses mahal dilakukan sejauh memungkinkan.
4. Terapkan pada endpoint berikut bila relevan:
   - /api/pdf/analyze
   - /api/pdf/compress
   - /api/pdf/merge
   - /api/pdf/to-jpg
   - /api/pdf/to-docx
5. Buat error code PDF_TOO_MANY_PAGES dengan pesan Bahasa Indonesia yang menyebut batas halaman.
6. Tambahkan test untuk PDF yang melewati limit.
7. Jangan mengubah algoritma tools atau fitur frontend besar.

Batasan:
- Jangan mengerjakan timeout, file expiry, privacy, SEO, ataupun UI upgrade pada tahap ini.
- Jangan deploy, commit, atau push.

Setelah selesai, laporkan perubahan, file berubah, hasil test, limit default, dan cara memverifikasi lokal. Lalu berhenti.
```

---

## Prompt 04 — Tegakkan masa berlaku job dan file hasil

```text
Kerjakan hanya tahap AW-007: memperbaiki lifecycle job dan file sementara.

Konteks:
- Job disimpan di temporary folder dengan UUID.
- TTL saat ini 24 jam.
- Cleanup lama saat ini berjalan pada startup dan ketika job baru dibuat.
- File hasil tidak boleh tetap bisa diakses setelah masa retensi berakhir.

Tugas:
1. Inspect apps/api/app/services/storage.py dan endpoint GET /api/files/{job_id}/{file_path}.
2. Jadikan TTL configurable dengan environment variable JOB_TTL_SECONDS.
3. Pastikan job yang sudah melewati TTL tidak dapat diunduh lagi.
4. Untuk job expired, kembalikan error yang jelas, misalnya JOB_EXPIRED dengan status yang sesuai.
5. Cleanup job lama tetap dijalankan saat startup dan saat job baru dibuat.
6. Tambahkan mekanisme cleanup periodik yang aman selama process backend hidup, tanpa membuat endpoint cleanup publik yang tidak diautentikasi.
7. Pastikan tidak ada path traversal regression.
8. Tambahkan test untuk:
   - job valid,
   - job expired,
   - path traversal tetap ditolak.

Catatan penting:
- Jangan menjanjikan penghapusan tepat waktu jika instance Cloud Run sedang tidak aktif.
- Dokumentasikan secara teknis bahwa enforcement akses file expired harus tetap bekerja walaupun cleanup fisik belum berjalan.
- Jangan membuat scheduler cloud atau konfigurasi infra eksternal pada tahap ini.

Batasan:
- Jangan mengubah desain website, privacy page, atau tool behavior lain.
- Jangan deploy, commit, atau push.

Setelah selesai, laporkan perubahan, file berubah, hasil test, dan catatan deploy yang perlu dilakukan kemudian. Lalu berhenti.
```

---

## Prompt 05 — Standarisasi error, loading, dan retry pada tool upload

```text
Kerjakan hanya tahap AW-013: membuat baseline UX yang konsisten untuk tool berbasis upload.

Tujuan:
Setiap tool harus jelas saat user memilih file, upload, diproses, berhasil, atau gagal.

Tugas:
1. Inspect komponen frontend dan halaman tool yang ada.
2. Identifikasi pattern upload/result/error yang saat ini duplikat atau tidak konsisten.
3. Buat reusable component atau helper yang kecil dan sesuai struktur project saat ini untuk:
   - loading / processing state,
   - error message,
   - retry,
   - reset / proses file baru,
   - disable submit ketika request sedang berjalan.
4. Terapkan minimal pada tiga tool utama:
   - PDF Color / BW Splitter,
   - Compress PDF,
   - Merge PDF.
5. Jangan redesign total homepage atau semua halaman.
6. Pastikan pesan error backend ditampilkan dengan Bahasa Indonesia yang manusiawi.
7. Jangan mengubah kontrak API tanpa alasan kuat.
8. Jalankan lint dan build frontend.

Batasan:
- Jangan menambahkan fitur tool baru.
- Jangan mengerjakan privacy page, SEO, case study, atau sistem akun.
- Jangan deploy, commit, atau push.

Setelah selesai, laporkan perubahan, file berubah, hasil lint/build, dan tool mana saja yang sudah memakai pattern baru. Lalu berhenti.
```

---

# Milestone 2 — Trust publik dan identitas portfolio

## Prompt 06 — Buat Privacy Policy, Terms, dan update copy keamanan

```text
Kerjakan hanya tahap AW-008, AW-009, AW-010, AW-011, dan AW-028.

Tujuan:
Membuat Arnol Works lebih transparan untuk user yang mengunggah file.

Tugas:
1. Tambahkan halaman publik:
   - /privacy
   - /terms
   - /file-retention
2. Tulis konten dalam Bahasa Indonesia yang mudah dipahami dan tidak membuat klaim keamanan absolut.
3. Konten harus sesuai dengan implementasi saat ini:
   - file diproses sementara,
   - hasil tidak ditujukan sebagai penyimpanan permanen,
   - masa retensi mengikuti JOB_TTL_SECONDS/default yang digunakan,
   - file expired dapat tidak tersedia,
   - user dianjurkan mengunduh hasil segera.
4. Update FAQ/homepage: ganti wording “Sangat aman” dengan wording yang akurat dan lebih profesional.
5. Tambahkan link Privacy, Terms, dan File Retention pada footer.
6. Pastikan halaman konsisten dengan desain saat ini dan responsif.
7. Jangan membuat kebijakan legal yang mengklaim sertifikasi, enkripsi, atau compliance yang belum diimplementasikan.
8. Jalankan lint dan build frontend.

Batasan:
- Jangan menambahkan cookie banner kecuali memang sudah ada tracking yang membutuhkan consent.
- Jangan mengubah backend atau membuat sistem akun.
- Jangan deploy, commit, atau push.

Setelah selesai, laporkan perubahan, file berubah, hasil lint/build, dan ringkasan wording file handling yang digunakan. Lalu berhenti.
```

---

## Prompt 07 — Perkuat About, Contact, dan CTA homepage

```text
Kerjakan hanya tahap AW-014, AW-015, dan AW-016.

Tujuan:
Membuat visitor cepat memahami siapa Arnol, apa yang dibangun, dan cara menghubungi atau berkolaborasi.

Tugas:
1. Inspect halaman About, Contact, homepage, header, dan footer yang ada.
2. Perbaiki About page agar menjelaskan:
   - Arnol sebagai product builder,
   - fokus pada useful web tools, mini product, dan eksperimen digital,
   - kemampuan yang dibuktikan melalui Arnol Works,
   - ajakan kolaborasi yang profesional.
3. Perbaiki Contact page agar memiliki CTA yang jelas untuk diskusi project atau kolaborasi.
4. Tambahkan link kontak/profil hanya jika URL atau alamatnya sudah tersedia di repository/config.
   - Jangan mengarang link LinkedIn, GitHub, atau sosial yang belum ada.
   - Bila GitHub tersedia, gunakan repository/profile yang benar.
5. Ubah hierarchy CTA homepage:
   - primary CTA mengarah ke Tools,
   - secondary CTA mengarah ke Projects,
   - pertahankan desain dan layout utama sejauh mungkin.
6. Tulis copy dalam Bahasa Indonesia dengan tone profesional, sederhana, dan tidak berlebihan.
7. Jalankan lint dan build frontend.

Batasan:
- Jangan membuat case study pada tahap ini.
- Jangan mengubah SEO, backend, atau tool logic.
- Jangan deploy, commit, atau push.

Setelah selesai, laporkan perubahan, file berubah, hasil lint/build, serta copy utama yang ditambahkan. Lalu berhenti.
```

---

# Milestone 3 — SEO dan discovery

## Prompt 08 — Fondasi metadata, sitemap, dan robots

```text
Kerjakan hanya tahap AW-023 dan AW-024.

Tujuan:
Membuat halaman publik Arnol Works lebih siap untuk search engine dan share link.

Tugas:
1. Inspect App Router Next.js structure, global metadata, tools registry, dan semua public routes.
2. Tambahkan metadata dasar yang benar:
   - metadataBase untuk domain produksi,
   - title template,
   - default description yang lebih spesifik,
   - canonical URL bila sesuai.
3. Tambahkan metadata unik minimal untuk:
   - homepage,
   - tools directory,
   - halaman tool utama,
   - projects,
   - about,
   - contact,
   - privacy,
   - terms.
4. Tambahkan app/sitemap.ts yang hanya menyertakan route publik yang valid.
5. Tambahkan app/robots.ts yang mengizinkan crawl halaman publik dan menyertakan sitemap.
6. Jangan mengarang URL atau route yang belum ada.
7. Jangan menambahkan analytics, JSON-LD kompleks, atau Open Graph image generator pada tahap ini.
8. Jalankan lint dan build frontend.

Batasan:
- Jangan mengubah UI besar-besaran.
- Jangan mengubah backend.
- Jangan deploy, commit, atau push.

Setelah selesai, laporkan metadata strategy, route yang masuk sitemap, file berubah, dan hasil lint/build. Lalu berhenti.
```

---

## Prompt 09 — Tambahkan structured data dan social sharing dasar

```text
Kerjakan hanya tahap AW-025 dan bagian Open Graph dasar dari AW-023.

Tujuan:
Meningkatkan kualitas preview saat link dibagikan dan memberi search engine konteks website/tool.

Tugas:
1. Inspect metadata yang sudah dibuat pada tahap sebelumnya.
2. Tambahkan Open Graph dan Twitter/X metadata dasar untuk halaman utama dan tool pages.
3. Gunakan image default yang sudah ada di repo bila tersedia.
4. Jika tidak ada asset gambar share yang layak, buat implementasi metadata yang tetap valid tanpa mengarang file image.
5. Tambahkan JSON-LD minimal:
   - WebSite untuk homepage,
   - SoftwareApplication atau WebApplication untuk tool pages bila struktur data tool mendukung.
6. Pastikan JSON-LD tidak membuat klaim palsu seperti rating, jumlah pengguna, atau harga yang tidak nyata.
7. Jalankan lint dan build frontend.

Batasan:
- Jangan membuat generator gambar sosial yang kompleks.
- Jangan mengubah backend atau tool behavior.
- Jangan deploy, commit, atau push.

Setelah selesai, laporkan structured data yang ditambahkan, file berubah, hasil lint/build, dan contoh halaman yang sudah memiliki metadata lengkap. Lalu berhenti.
```

---

# Milestone 4 — Bukti portfolio

## Prompt 10 — Bangun fondasi halaman case study

```text
Kerjakan hanya tahap AW-017, AW-018, dan AW-021 dalam bentuk fondasi konten/route.

Tujuan:
Membuat Arnol Works memiliki halaman case study yang bisa memperkuat portfolio tanpa langsung membuat semua studi kasus.

Tugas:
1. Inspect struktur Projects dan Build Notes yang sudah ada.
2. Buat struktur route atau content model yang sederhana untuk:
   - /projects/arnol-works
   - /projects/pdf-color-bw-splitter
   - /notes/[slug]
3. Isi dua case study awal dengan konten nyata berdasarkan codebase:
   - Arnol Works Platform,
   - PDF Color / BW Splitter.
4. Setiap case study minimal mencakup:
   - problem,
   - solution,
   - target user,
   - key features,
   - stack,
   - arsitektur sederhana,
   - challenge/decision,
   - hasil atau value.
5. Jangan mengklaim metrik pengguna, performa, atau hasil bisnis yang belum terbukti.
6. Untuk Build Notes, buat minimal satu artikel awal yang membahas alasan membangun PDF Splitter.
7. Gunakan placeholder visual yang jujur jika screenshot final belum tersedia; jangan membuat screenshot palsu.
8. Tambahkan navigasi yang jelas dari Projects menuju case study.
9. Jalankan lint dan build frontend.

Batasan:
- Jangan membuat case study KeyStrike dan RetroWave pada tahap ini.
- Jangan redesign seluruh project page.
- Jangan mengubah backend, deploy, commit, atau push.

Setelah selesai, laporkan route baru, file berubah, hasil lint/build, dan daftar asset visual yang masih perlu disiapkan Arnol. Lalu berhenti.
```

---

# Milestone 5 — Engineering quality

## Prompt 11 — Tambahkan backend test baseline

```text
Kerjakan hanya bagian testing backend dari AW-004, AW-005, AW-007, dan AW-013.

Tujuan:
Membuat perubahan keamanan upload dan lifecycle job tidak mudah rusak pada update berikutnya.

Tugas:
1. Inspect apakah project sudah memiliki testing framework Python.
2. Jika belum, tambahkan framework test yang ringan dan umum untuk FastAPI, dengan perubahan minimal.
3. Buat test minimal untuk:
   - file terlalu besar,
   - terlalu banyak file pada batch,
   - total upload terlalu besar,
   - PDF page count terlalu banyak,
   - job expired tidak dapat diakses,
   - path traversal ditolak.
4. Gunakan temporary directory/test configuration agar test tidak memakai folder job production.
5. Jangan membuat test yang bergantung pada external service atau file besar.
6. Dokumentasikan cara menjalankan test di README atau docs yang relevan.
7. Jalankan seluruh test suite.

Batasan:
- Jangan mengubah UI.
- Jangan menambahkan CI pada tahap ini.
- Jangan deploy, commit, atau push.

Setelah selesai, laporkan test framework, file berubah, command test, hasil test, dan test yang masih belum ada. Lalu berhenti.
```

---

## Prompt 12 — Tambahkan GitHub Actions CI minimal

```text
Kerjakan hanya tahap CI dasar.

Tujuan:
Memastikan frontend dan backend tidak rusak tanpa terdeteksi ketika ada perubahan.

Tugas:
1. Inspect scripts frontend dan backend testing command yang sudah ada.
2. Tambahkan workflow GitHub Actions minimal pada .github/workflows/ci.yml.
3. Workflow harus berjalan pada push dan pull request.
4. Job frontend:
   - install dependencies,
   - run lint,
   - run build.
5. Job backend:
   - setup Python,
   - install requirements,
   - install test dependencies bila diperlukan,
   - run test suite.
6. Pastikan versi Node dan Python sesuai dengan codebase saat ini.
7. Jangan menambahkan deploy automation, auto-merge, secrets, atau production changes.
8. Tambahkan dokumentasi singkat tentang CI di README bila perlu.

Batasan:
- Jangan mengubah feature/product UI.
- Jangan deploy, commit, atau push.

Setelah selesai, laporkan isi workflow, file berubah, command yang dicerminkan oleh CI, dan hal yang perlu diverifikasi setelah workflow pertama berjalan di GitHub. Lalu berhenti.
```

---

# Milestone 6 — Upgrade tool, satu per satu

## Prompt 13 — Upgrade Compress PDF saja

```text
Kerjakan hanya tahap AW-029 untuk tool Compress PDF.

Tujuan:
Memberi user kontrol dan hasil yang lebih jelas saat mengecilkan ukuran PDF.

Tugas:
1. Inspect implementation Compress PDF di frontend dan backend.
2. Tambahkan pilihan preset yang sederhana:
   - Balanced,
   - High Quality,
   - Smallest File.
3. Tentukan implementasi teknis yang aman dan realistis sesuai library yang sekarang digunakan.
4. Jika library tidak dapat menjamin perbedaan nyata antar preset, jangan membuat UI palsu.
   - Jelaskan batasannya di UI atau gunakan opsi yang benar-benar didukung.
5. Tampilkan hasil:
   - ukuran awal,
   - ukuran akhir,
   - persentase penghematan,
   - pesan bila ukuran file tidak banyak berubah.
6. Pertahankan file limit dan error state yang sudah ada.
7. Tambahkan backend/front-end test yang relevan.
8. Jalankan lint, build, dan test backend.

Batasan:
- Jangan mengubah Merge PDF, JPG to PDF, atau tool lain.
- Jangan tambah akun, payment, deploy, commit, atau push.

Setelah selesai, laporkan perubahan, file berubah, hasil test/build, dan detail teknis perbedaan antar preset. Lalu berhenti.
```

---

## Prompt 14 — Upgrade Merge PDF saja

```text
Kerjakan hanya tahap AW-030 untuk tool Merge PDF.

Tujuan:
Membuat user bisa mengontrol urutan PDF dengan jelas sebelum digabungkan.

Tugas:
1. Inspect UI Merge PDF dan endpoint backend yang ada.
2. Tambahkan daftar file terpilih yang memperlihatkan urutan final.
3. Tambahkan kemampuan:
   - menghapus file dari daftar,
   - mengubah urutan file,
   - melihat nama dan ukuran dasar file.
4. Gunakan pendekatan drag-and-drop hanya jika sesuai dengan dependensi/codebase saat ini.
   - Bila menambah dependency terlalu berat, gunakan tombol naik/turun yang accessible.
5. Pastikan urutan yang dikirim frontend adalah urutan yang diproses backend.
6. Tampilkan total file dan total page count setelah hasil selesai.
7. Pertahankan limit upload serta error handling yang sudah dibuat.
8. Jalankan lint, build, dan test terkait.

Batasan:
- Jangan mengubah tool lain atau backend architecture.
- Jangan deploy, commit, atau push.

Setelah selesai, laporkan perubahan, file berubah, hasil test/build, dan cara manual untuk memverifikasi urutan PDF. Lalu berhenti.
```

---

# Cara menentukan prompt berikutnya

Gunakan urutan ini:

```text
00 Audit
01 rembg
02 Batch upload limits
03 PDF page limits
04 File expiry
05 Tool UX baseline
06 Privacy + legal
07 About + Contact + CTA
08 SEO metadata/sitemap/robots
09 Open Graph + structured data
10 Case study foundation
11 Backend tests
12 CI
13 Compress PDF upgrade
14 Merge PDF upgrade
```

Setelah tahap 14 selesai, evaluasi hasilnya dulu sebelum mengembangkan fitur besar lain seperti akun user, payment, queue, atau cloud storage.
