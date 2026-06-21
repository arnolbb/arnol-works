import os


def _int_env(name: str, default: int) -> int:
    try:
        return int(os.environ[name])
    except (KeyError, ValueError):
        return default


# Batas ukuran satu file upload (bytes). Default: 50 MB.
MAX_FILE_SIZE_BYTES: int = _int_env("MAX_FILE_SIZE_BYTES", 50 * 1024 * 1024)

# Batas total ukuran semua file dalam satu batch request (bytes). Default: 150 MB.
MAX_TOTAL_UPLOAD_BYTES: int = _int_env("MAX_TOTAL_UPLOAD_BYTES", 150 * 1024 * 1024)

# Batas jumlah file dalam satu batch request. Default: 20 file.
MAX_BATCH_FILES: int = _int_env("MAX_BATCH_FILES", 20)

# Batas jumlah halaman PDF per dokumen untuk proses berat. Default: 300 halaman.
MAX_PDF_PAGES: int = _int_env("MAX_PDF_PAGES", 300)

# TTL job temporary (detik). Default: 24 jam.
JOB_TTL_SECONDS: int = _int_env("JOB_TTL_SECONDS", 24 * 60 * 60)

# Interval cleanup periodik background thread (detik). Default: 1 jam.
CLEANUP_INTERVAL_SECONDS: int = _int_env("CLEANUP_INTERVAL_SECONDS", 60 * 60)