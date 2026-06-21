# Arnol Works

Arnol Works adalah website portfolio interaktif berbasis multi-tools platform di domain `arnol.my.id`.

Website ini bukan website khusus PDF. Arnol Works berisi utilitas dokumen harian untuk PDF dan gambar, dibuat modular agar tools baru mudah ditambahkan.

## Struktur

```text
apps/web  # Next.js frontend
apps/api  # FastAPI backend
docs      # Product, API, UI, PDF processing, dan testing specs
```

## Menjalankan frontend

```powershell
cd "apps/web"
npm.cmd install
npm.cmd run dev -- --hostname 0.0.0.0 --port 3000
```

Buka `http://localhost:3000`.

## Menjalankan backend

```powershell
cd "apps/api"
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Health check: `http://localhost:8000/health`.

## Environment frontend

Opsional buat `apps/web/.env.local`:

```text
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

Jika tidak diisi, frontend memakai `http://localhost:8000`.

## Tools aktif

- Pisah PDF Warna & Hitam Putih.
- Kompres PDF.
- Gabungkan PDF.
- PDF ke Word (DOCX).
- JPG/PNG ke PDF.
- PDF ke JPG.
- Kompres Gambar.
- Resize Gambar.
- Hapus Background Gambar.
- Pas Foto Generator (2x3, 3x4, 4x6).
- Hitung Kata & Karakter.
- QR Code Generator.

## Catatan instalasi backend

Semua dependensi backend sudah tercantum di `requirements.txt` dan dapat diinstall sekaligus dengan:

```powershell
pip install -r requirements.txt
```

### rembg â€” Hapus Background & Pas Foto Generator

`rembg` diinstall sebagai `rembg[cpu]` (menggunakan ONNX Runtime CPU, tanpa GPU).

Model AI untuk deteksi foreground (~170 MB) diunduh otomatis dari internet saat pertama kali fitur Hapus Background atau Pas Foto Generator dipanggil. Model disimpan di folder cache lokal (`~/.u2net/`). Setelah diunduh, tidak perlu koneksi internet lagi.

Dampak startup: panggilan pertama ke `/api/image/remove-bg` atau `/api/image/passport-photo` akan memakan waktu lebih lama dari biasanya karena proses unduh model.

### Docker

Dockerfile sudah mencantumkan `libgomp1` yang diperlukan oleh ONNX Runtime di Linux.

## Batasan saat ini

- File diproses sinkron.
- File upload disimpan sementara di local temp folder backend.
- Temporary storage memiliki cleanup job lama saat startup/sebelum job baru.
- Belum ada auth, payment, database production, admin dashboard, OCR, atau cloud storage permanen.
- PDF ke Word mengekstrak teks dan gambar, bukan layout pixel-perfect.
## Menjalankan backend tests

```powershell
cd "apps/api"
.\.venv\Scripts\Activate.ps1
python -m pytest tests/ -v
```

Test mencakup: per-file size limit, batch file count limit, total upload size limit, dan struktur error response.

## Upload limits (backend)

Semua limit dapat diubah melalui environment variables sebelum menjalankan backend:

| Variable | Default | Keterangan |
|---|---|---|
| `MAX_FILE_SIZE_BYTES` | `52428800` (50 MB) | Batas ukuran satu file upload |
| `MAX_TOTAL_UPLOAD_BYTES` | `157286400` (150 MB) | Batas total ukuran semua file dalam satu request batch |
| `MAX_BATCH_FILES` | `20` | Batas jumlah file dalam satu request batch |
