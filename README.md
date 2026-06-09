# Arnol Works

Arnol Works adalah website portfolio interaktif berbasis multi-tools platform di domain `arnol.web.id`.

Website ini bukan website khusus PDF. Tools pertama yang dibangun adalah **Pisah PDF Warna & Hitam Putih / PDF Color/BW Splitter**, dengan arsitektur yang disiapkan agar tools lain mudah ditambahkan.

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

Jika `python` tidak ada di PATH, gunakan Python bundled Codex atau Python lokal yang tersedia.

```powershell
cd "apps/api"
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

## Fitur MVP

- Homepage Arnol Works.
- Tools directory berbasis registry.
- PDF Color/BW Splitter.
- Upload PDF dengan validasi client-side 50MB.
- Analyze PDF backend: deteksi warna + thumbnail.
- Review manual halaman warna.
- Parser halaman manual seperti `1, 3, 8-12, 20`.
- Split PDF dengan pypdf agar halaman asli tetap terjaga.
- Download PDF warna dan hitam-putih.
- Temporary storage dengan cleanup job lama saat startup/sebelum job baru.

## Batasan MVP

- File diproses sinkron.
- File upload disimpan sementara di local temp folder backend.
- Deteksi warna otomatis hanya rekomendasi dan bisa salah.
- Belum ada auth, payment, database production, admin dashboard, OCR, atau cloud storage permanen.
