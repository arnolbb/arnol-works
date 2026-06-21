import json
import shutil
import threading
import time
from pathlib import Path
from uuid import UUID, uuid4

import app.config as _cfg

BASE_TEMP_DIR = Path(__file__).resolve().parents[2] / ".tmp" / "jobs"

# ---------------------------------------------------------------------------
# Core helpers
# ---------------------------------------------------------------------------

def cleanup_old_jobs() -> None:
    """Hapus job directory yang sudah melewati TTL."""
    BASE_TEMP_DIR.mkdir(parents=True, exist_ok=True)
    cutoff = time.time() - _cfg.JOB_TTL_SECONDS
    for job_dir in BASE_TEMP_DIR.iterdir():
        if job_dir.is_dir() and job_dir.stat().st_mtime < cutoff:
            shutil.rmtree(job_dir, ignore_errors=True)


def is_job_expired(job_dir: Path) -> bool:
    """
    Cek apakah job sudah melewati TTL berdasarkan mtime directory-nya.
    Enforcement ini bekerja bahkan jika cleanup fisik belum berjalan
    (misal: instance Cloud Run sedang tidak aktif saat TTL berakhir).
    """
    try:
        return job_dir.stat().st_mtime < (time.time() - _cfg.JOB_TTL_SECONDS)
    except OSError:
        return True


def create_job() -> dict[str, Path | str]:
    cleanup_old_jobs()
    job_id = str(uuid4())
    job_dir = BASE_TEMP_DIR / job_id
    input_dir = job_dir / "input"
    thumbs_dir = job_dir / "thumbs"
    outputs_dir = job_dir / "outputs"
    input_dir.mkdir(parents=True)
    thumbs_dir.mkdir()
    outputs_dir.mkdir()
    return {
        "job_id": job_id,
        "job_dir": job_dir,
        "input_dir": input_dir,
        "thumbs_dir": thumbs_dir,
        "outputs_dir": outputs_dir,
        "input_pdf": input_dir / "original.pdf",
    }


def validate_job_id(job_id: str) -> str:
    UUID(job_id)
    return job_id


def get_job_dir(job_id: str) -> Path | None:
    try:
        validate_job_id(job_id)
    except ValueError:
        return None
    job_dir = BASE_TEMP_DIR / job_id
    if not job_dir.exists() or not job_dir.is_dir():
        return None
    return job_dir


def safe_job_path(job_id: str, relative_path: str) -> Path | None:
    """
    Kembalikan path absolut yang aman di dalam job_dir.
    Menolak path traversal (mis. ../../etc/passwd).
    Menolak job yang sudah expired — blokir akses file meski cleanup fisik belum jalan.
    """
    job_dir = get_job_dir(job_id)
    if job_dir is None:
        return None
    if is_job_expired(job_dir):
        return None
    candidate = (job_dir / relative_path).resolve()
    try:
        candidate.relative_to(job_dir.resolve())
    except ValueError:
        return None
    return candidate


def write_metadata(job_dir: Path, metadata: dict) -> None:
    (job_dir / "metadata.json").write_text(json.dumps(metadata), encoding="utf-8")


def read_metadata(job_dir: Path) -> dict | None:
    metadata_path = job_dir / "metadata.json"
    if not metadata_path.exists():
        return None
    return json.loads(metadata_path.read_text(encoding="utf-8"))


# ---------------------------------------------------------------------------
# Background cleanup thread
# ---------------------------------------------------------------------------

_cleanup_thread: threading.Thread | None = None
_stop_cleanup = threading.Event()


def _periodic_cleanup_worker() -> None:
    """Worker thread: jalankan cleanup setiap CLEANUP_INTERVAL_SECONDS."""
    while not _stop_cleanup.wait(timeout=_cfg.CLEANUP_INTERVAL_SECONDS):
        try:
            cleanup_old_jobs()
        except Exception:
            pass  # Jangan crash thread karena error cleanup


def start_periodic_cleanup() -> None:
    """Mulai background thread untuk cleanup periodik. Dipanggil saat startup."""
    global _cleanup_thread
    _stop_cleanup.clear()
    _cleanup_thread = threading.Thread(target=_periodic_cleanup_worker, daemon=True, name="job-cleanup")
    _cleanup_thread.start()


def stop_periodic_cleanup() -> None:
    """Hentikan background cleanup thread. Dipanggil saat shutdown."""
    _stop_cleanup.set()