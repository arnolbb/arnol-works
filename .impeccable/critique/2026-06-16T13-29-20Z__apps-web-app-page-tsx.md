---
score: 85
p0Count: 0
p1Count: 0
timestamp: 2026-06-16T13-29-20Z
slug: apps-web-app-page-tsx
---
# Design Critique: Arnol Works Landing Page

## Slop Verdict
**Clean & Authentic.** Tampilan website memiliki identitas unik sebagai portfolio pengembang (developer portfolio) yang profesional dan minimalis. Menggunakan glassmorphism halus, skema warna berimbang, dan tidak terlihat seperti template SaaS pasaran atau keluaran AI generik yang slop.

## Heuristics Scoring
1. **Visibility of System Status**: 4/4 (Sistem menyajikan indikator status tools aktif dan status "Siap" yang jelas).
2. **Match Between System and Real World**: 4/4 (Semua istilah menggunakan bahasa Indonesia yang natural dan familier).
3. **User Control and Freedom**: 3/4 (Navigasi bebas hambatan, pengguna dapat berpindah sub-halaman dengan instan).
4. **Consistency and Standards**: 4/4 (Konsistensi desain kartu Panel, StatusBadge, dan tombol di semua halaman terjaga sangat baik).
5. **Error Prevention**: 4/4 (Validasi tipe berkas dan ukuran file langsung dicegah di sisi klien).
6. **Recognition Rather Than Recall**: 4/4 (Redesain ikon semantik baru mempermudah identifikasi fungsi alat tanpa perlu membaca deskripsinya secara detail).
7. **Flexibility and Efficiency of Use**: 4/4 (Menampilkan komparasi tools, metadata halaman, dan akses cepat ke tools yang paling dicari).
8. **Aesthetic and Minimalist Design**: 4/4 (Layout bersih, spasi memadai, efek blur glassmorphic, dan grid latar belakang terasa sangat premium).
9. **Help Users Recognize, Diagnose, and Recover from Errors**: 3/4 (Sistem error-handling sudah ada di tools utama, tetapi pesan error global dapat dirinci lebih jauh).
10. **Help and Documentation**: 3/4 (Menyediakan Build Notes sebagai dokumentasi, namun belum ada kolom bantuan FAQ terstruktur).

**Rata-rata Skor: 34/40 (85/100)**

## Cognitive Load
- **Decision Points**: Rendah. Pilihan aksi terfokus pada dua tombol CTA utama ("Lihat Tools" dan "Lihat Proyek") serta navigasi yang ringkas.
- **Visual Noise**: Rendah. Informasi terkelompok dengan rapi menggunakan border tipis dan grid teratur.

## Emotional Journey
- **Entry**: Tenang dan percaya diri (kesan visual minimalis dengan gradasi lembut).
- **Interaksi**: Taktil dan memuaskan (efek hover kartu dinamis dan ikon yang merefleksikan fungsinya).
- **Exit**: Jelas (arah jalan keluar atau navigasi balik terstruktur dengan baik).

## Strengths
1. **Glassmorphism Visual Style**: Efek transparansi kabur (`backdrop-blur-md`) pada kartu Panel berpadu anggun dengan grid dan gradasi latar belakang.
2. **Semantic Icon Design**: Ikon-ikon representasi visual buatan sendiri (PDF split, QR generator, dll.) terlihat jauh lebih estetis dibandingkan ikon teks polos.

## Priority Issues
- **P0 (Critical)**: Nihil.
- **P1 (High)**: Nihil.
- **P2 (Normal)**:
  1. Tambahkan bagian bantuan singkat (FAQ) atau panduan ringkas cara pakai tools di bagian bawah beranda untuk meningkatkan kemudahan pengguna pertama.

## Minor Observations
- Skema warna mode gelap memiliki kegelapan malam yang nyaman di mata tanpa mengurangi kontras keterbacaan teks abu-abu terang.
