# UI/UX Spec — Arnol Works

## 1. Design direction

Arnol Works harus terasa seperti portfolio developer yang profesional, bersih, dan berguna.

Style direction:

- Clean.
- Modern.
- Minimal.
- Responsive.
- Tidak terlalu ramai.
- Fokus pada kegunaan tools.

Tone copywriting:

- Bahasa Indonesia natural.
- Ramah, jelas, tidak lebay.
- Menjelaskan manfaat secara langsung.

## 2. Global layout

Komponen global:

- Header/nav.
- Main content container.
- Footer.
- Responsive mobile nav sederhana.

Navigation items:

- Home
- Tools
- Projects
- About
- Contact

Brand text:

```text
Arnol Works
```

## 3. Homepage `/`

### Hero section

Headline:

```text
Arnol Works
```

Subheadline:

```text
Kumpulan tools web dan eksperimen produk digital buatan Arnol.
```

Supporting text:

```text
Website portfolio interaktif yang berisi tools praktis untuk menyelesaikan masalah sehari-hari.
```

CTA:

- Lihat Tools
- Lihat Project

### Featured tool section

Title:

```text
Tools pertama
```

Card:

```text
Pisah PDF Warna & Hitam Putih
Pisahkan halaman PDF berwarna dan hitam-putih agar biaya print lebih hemat.
```

CTA:

```text
Coba Tools
```

### Portfolio positioning section

Text:

```text
Arnol Works dibuat sebagai portfolio yang tidak hanya menampilkan project, tetapi juga produk kecil yang benar-benar bisa digunakan.
```

## 4. Tools directory `/tools`

Page title:

```text
Tools
```

Description:

```text
Kumpulan tools web sederhana yang dibuat untuk membantu pekerjaan harian.
```

Tool card fields:

- Name.
- Description.
- Category badge.
- Status badge.
- CTA.

Available status:

```text
Tersedia
```

Coming soon status:

```text
Segera hadir
```

## 5. PDF splitter page `/tools/pdf-color-bw-splitter`

### Intro section

Title:

```text
Pisah PDF Warna & Hitam Putih
```

Description:

```text
Pisahkan halaman PDF berwarna dan hitam-putih menjadi dua file agar biaya print lebih hemat.
```

Helper text:

```text
Sistem akan menandai halaman yang kemungkinan berwarna. Kamu tetap bisa mengecek dan mengubah pilihan sebelum file dipisahkan.
```

### Upload area

Requirements:

- Drag and drop area.
- File picker button.
- Show selected file name.
- Show max size info.

Copy:

```text
Upload file PDF
Maksimal 50MB. File hanya diproses sementara dan tidak disimpan permanen.
```

Button:

```text
Analisis PDF
```

### Analyze loading state

Copy:

```text
Sedang menganalisis halaman PDF...
```

Subcopy:

```text
Kami sedang mencari halaman yang kemungkinan berwarna dan membuat preview halaman.
```

### Review state

Summary card:

- Total halaman.
- Terdeteksi berwarna.
- Dipilih sebagai file warna.

Copy:

```text
Kami sudah menandai halaman yang kemungkinan berwarna. Silakan cek dan ubah pilihan sebelum file dipisahkan.
```

Controls:

- Input manual page range.
- Apply input.
- Gunakan hasil deteksi otomatis.
- Pilih semua.
- Hapus semua.

Manual input placeholder:

```text
Contoh: 1, 3, 8-12, 20
```

Grid page card:

- Thumbnail.
- Page number.
- Checkbox.
- Badge:
  - Terdeteksi warna.
  - Hitam putih.
  - Dipilih manual if possible.

CTA:

```text
Pisahkan PDF
```

### Splitting loading state

Copy:

```text
Sedang membuat file hasil...
```

### Result state

Title:

```text
PDF berhasil dipisahkan
```

Download buttons:

```text
Download halaman berwarna
Download halaman hitam-putih
```

Show page counts.

### Error state

General error copy:

```text
Terjadi kesalahan saat memproses PDF.
```

Specific error examples:

- File bukan PDF.
- File terlalu besar.
- PDF terkunci atau membutuhkan password.
- PDF rusak atau tidak bisa dibaca.
- Sesi file sudah kedaluwarsa. Silakan upload ulang.

## 6. Manual page range UX

Input accepts:

```text
1, 3, 8-12, 20
```

Rules:

- Spaces are allowed.
- Duplicates removed.
- Ranges expanded.
- Invalid values show error.
- Page numbers must be within total pages.

Examples:

- `1,3,5` → `[1,3,5]`
- `8-12` → `[8,9,10,11,12]`
- `1, 3, 8-10` → `[1,3,8,9,10]`

## 7. Responsive behavior

Desktop:

- Thumbnail grid 4-6 columns depending width.

Tablet:

- 3-4 columns.

Mobile:

- 2 columns.
- Controls stacked vertically.
- CTA sticky bottom optional but not required for MVP.

## 8. Accessibility basics

- Buttons must have clear labels.
- Inputs must have labels.
- Checkbox must be keyboard accessible.
- Loading state must be visible as text, not only spinner.
- Error messages must be readable.

