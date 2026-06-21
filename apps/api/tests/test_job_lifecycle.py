"""
Test untuk job lifecycle: valid, expired, dan path traversal.
"""
import shutil
import tempfile
import time
from pathlib import Path
from unittest.mock import patch

from fastapi.testclient import TestClient

from app.main import app
from app.services.storage import BASE_TEMP_DIR, create_job, write_metadata


def _error_code(response) -> str:
    try:
        return response.json().get("error", {}).get("code", "")
    except Exception:
        return ""


class TestJobLifecycle:
    def test_valid_job_file_is_accessible(self):
        """File dalam job yang valid dan belum expired harus bisa diakses."""
        with patch("app.config.JOB_TTL_SECONDS", 3600):
            with TestClient(app, raise_server_exceptions=False) as client:
                job = create_job()
                # Buat file output dummy
                output_file = job["outputs_dir"] / "test.txt"
                output_file.write_text("hello")
                response = client.get(f"/api/files/{job['job_id']}/outputs/test.txt")
        assert response.status_code == 200

    def test_expired_job_returns_410(self):
        """File dari job yang expired harus mengembalikan 410 GONE."""
        with patch("app.config.JOB_TTL_SECONDS", 0):
            with TestClient(app, raise_server_exceptions=False) as client:
                job = create_job()
                output_file = job["outputs_dir"] / "test.pdf"
                output_file.write_bytes(b"%PDF-1.4")
                # Paksa mtime sangat lama (expired)
                old_time = time.time() - 10
                import os
                os.utime(job["job_dir"], (old_time, old_time))
                response = client.get(f"/api/files/{job['job_id']}/outputs/test.pdf")
        assert response.status_code == 410, f"expected 410, got {response.status_code}"
        assert _error_code(response) == "JOB_EXPIRED"

    def test_nonexistent_job_returns_404(self):
        """Job ID yang tidak ada harus mengembalikan 404."""
        fake_id = "00000000-0000-0000-0000-000000000000"
        with TestClient(app, raise_server_exceptions=False) as client:
            response = client.get(f"/api/files/{fake_id}/outputs/file.pdf")
        assert response.status_code == 404
        assert _error_code(response) == "JOB_NOT_FOUND"


class TestPathTraversal:
    def test_path_traversal_dot_dot_rejected(self):
        """Path traversal dengan .. harus ditolak."""
        with patch("app.config.JOB_TTL_SECONDS", 3600):
            with TestClient(app, raise_server_exceptions=False) as client:
                job = create_job()
                response = client.get(f"/api/files/{job['job_id']}/../../etc/passwd")
        assert response.status_code in (404, 400)

    def test_path_traversal_absolute_path_rejected(self):
        """Path traversal menuju file di luar job_dir harus ditolak."""
        with patch("app.config.JOB_TTL_SECONDS", 3600):
            with TestClient(app, raise_server_exceptions=False) as client:
                job = create_job()
                # Coba akses file di luar job directory
                response = client.get(f"/api/files/{job['job_id']}/../{job['job_id']}/../../config.py")
        assert response.status_code in (404, 400)

    def test_invalid_job_id_format_rejected(self):
        """Job ID yang bukan UUID valid harus ditolak."""
        with TestClient(app, raise_server_exceptions=False) as client:
            response = client.get("/api/files/not-a-uuid/outputs/file.pdf")
        assert response.status_code == 404
        assert _error_code(response) == "JOB_NOT_FOUND"