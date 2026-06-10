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
- JPG/PNG ke PDF.
- PDF ke JPG.
- Kompres Gambar.
- Resize Gambar.

## Batasan saat ini

- File diproses sinkron.
- File upload disimpan sementara di local temp folder backend.
- Temporary storage memiliki cleanup job lama saat startup/sebelum job baru.
- Belum ada auth, payment, database production, admin dashboard, OCR, atau cloud storage permanen.
