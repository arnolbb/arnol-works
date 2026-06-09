from pathlib import Path
from uuid import UUID, uuid4
import json
import shutil
import time

BASE_TEMP_DIR = Path(__file__).resolve().parents[2] / ".tmp" / "jobs"
JOB_TTL_SECONDS = 24 * 60 * 60


def cleanup_old_jobs(ttl_seconds: int = JOB_TTL_SECONDS) -> None:
    BASE_TEMP_DIR.mkdir(parents=True, exist_ok=True)
    cutoff = time.time() - ttl_seconds
    for job_dir in BASE_TEMP_DIR.iterdir():
        if job_dir.is_dir() and job_dir.stat().st_mtime < cutoff:
            shutil.rmtree(job_dir, ignore_errors=True)


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
    job_dir = get_job_dir(job_id)
    if job_dir is None:
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
