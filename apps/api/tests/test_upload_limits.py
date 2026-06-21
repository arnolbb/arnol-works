"""
Test untuk upload limits: file count, total size, per-file size.
Patch dilakukan pada app.config karena routes.pdf membaca via `import app.config as _cfg`.
"""
import io
import pytest
from unittest.mock import patch

from fastapi.testclient import TestClient
from app.main import app

# ---------------------------------------------------------------------------
# Helper factories
# ---------------------------------------------------------------------------

def _make_pdf_file(name: str = "test.pdf", size_bytes: int = 1024) -> tuple:
    """Buat file PDF palsu (header minimal) untuk testing."""
    content = b"%PDF-1.4\n" + b"x" * max(0, size_bytes - 9)
    return ("files", (name, io.BytesIO(content), "application/pdf"))


def _make_image_file(name: str = "test.jpg", size_bytes: int = 512) -> tuple:
    """Buat file gambar palsu untuk testing."""
    content = b"\xff\xd8\xff" + b"x" * max(0, size_bytes - 3)
    return ("files", (name, io.BytesIO(content), "image/jpeg"))


def _error_code(response) -> str:
    try:
        return response.json().get("error", {}).get("code", "")
    except Exception:
        return ""


# ---------------------------------------------------------------------------
# Test: per-file size limit
# ---------------------------------------------------------------------------

class TestPerFileSizeLimit:
    def test_single_pdf_exceeds_limit_returns_413(self):
        """File tunggal melebihi MAX_FILE_SIZE_BYTES harus ditolak dengan 413."""
        with patch("app.config.MAX_FILE_SIZE_BYTES", 100):
            with TestClient(app, raise_server_exceptions=False) as client:
                big_content = b"%PDF-1.4\n" + b"x" * 200
                files = [("file", ("big.pdf", io.BytesIO(big_content), "application/pdf"))]
                response = client.post("/api/pdf/compress", files=files)
        assert response.status_code == 413, f"expected 413, got {response.status_code}: {response.text}"
        assert _error_code(response) == "FILE_TOO_LARGE"

    def test_single_image_exceeds_limit_returns_413(self):
        """Gambar tunggal melebihi batas harus ditolak."""
        with patch("app.config.MAX_FILE_SIZE_BYTES", 50):
            with TestClient(app, raise_server_exceptions=False) as client:
                big_content = b"\xff\xd8\xff" + b"x" * 200
                files = [("file", ("big.jpg", io.BytesIO(big_content), "image/jpeg"))]
                response = client.post(
                    "/api/image/passport-photo",
                    files=files,
                    data={"size": "3x4", "bgColor": "merah"},
                )
        assert response.status_code == 413, f"expected 413, got {response.status_code}: {response.text}"
        assert _error_code(response) == "FILE_TOO_LARGE"


# ---------------------------------------------------------------------------
# Test: batch file count limit
# ---------------------------------------------------------------------------

class TestBatchFileCountLimit:
    def test_merge_pdf_exceeds_max_files_returns_400(self):
        """Batch merge PDF melebihi MAX_BATCH_FILES harus ditolak."""
        with patch("app.config.MAX_BATCH_FILES", 2):
            with TestClient(app, raise_server_exceptions=False) as client:
                files = [_make_pdf_file(f"f{i}.pdf") for i in range(3)]
                response = client.post("/api/pdf/merge", files=files)
        assert response.status_code == 400, f"expected 400, got {response.status_code}: {response.text}"
        assert _error_code(response) == "TOO_MANY_FILES"

    def test_compress_image_exceeds_max_files_returns_400(self):
        """Batch compress gambar melebihi MAX_BATCH_FILES harus ditolak."""
        with patch("app.config.MAX_BATCH_FILES", 2):
            with TestClient(app, raise_server_exceptions=False) as client:
                files = [_make_image_file(f"img{i}.jpg") for i in range(3)]
                response = client.post("/api/image/compress", files=files)
        assert response.status_code == 400, f"expected 400, got {response.status_code}: {response.text}"
        assert _error_code(response) == "TOO_MANY_FILES"

    def test_remove_bg_exceeds_max_files_returns_400(self):
        """Batch remove-bg melebihi MAX_BATCH_FILES harus ditolak."""
        with patch("app.config.MAX_BATCH_FILES", 1):
            with TestClient(app, raise_server_exceptions=False) as client:
                files = [_make_image_file(f"img{i}.jpg") for i in range(2)]
                response = client.post("/api/image/remove-bg", files=files)
        assert response.status_code == 400, f"expected 400, got {response.status_code}: {response.text}"
        assert _error_code(response) == "TOO_MANY_FILES"

    def test_resize_image_exceeds_max_files_returns_400(self):
        """Batch resize melebihi MAX_BATCH_FILES harus ditolak."""
        with patch("app.config.MAX_BATCH_FILES", 1):
            with TestClient(app, raise_server_exceptions=False) as client:
                files = [_make_image_file(f"img{i}.jpg") for i in range(2)]
                response = client.post("/api/image/resize", files=files, data={"width": 100, "height": 100})
        assert response.status_code == 400, f"expected 400, got {response.status_code}: {response.text}"
        assert _error_code(response) == "TOO_MANY_FILES"

    def test_images_to_pdf_exceeds_max_files_returns_400(self):
        """Batch images-to-pdf melebihi MAX_BATCH_FILES harus ditolak."""
        with patch("app.config.MAX_BATCH_FILES", 2):
            with TestClient(app, raise_server_exceptions=False) as client:
                files = [_make_image_file(f"img{i}.jpg") for i in range(3)]
                response = client.post("/api/pdf/from-images", files=files)
        assert response.status_code == 400, f"expected 400, got {response.status_code}: {response.text}"
        assert _error_code(response) == "TOO_MANY_FILES"


# ---------------------------------------------------------------------------
# Test: total upload size limit
# ---------------------------------------------------------------------------

class TestTotalUploadSizeLimit:
    def test_merge_pdf_total_size_exceeded_returns_413(self):
        """Total ukuran batch melebihi MAX_TOTAL_UPLOAD_BYTES harus ditolak."""
        with patch("app.config.MAX_TOTAL_UPLOAD_BYTES", 500):
            with TestClient(app, raise_server_exceptions=False) as client:
                files = [_make_pdf_file(f"f{i}.pdf", size_bytes=300) for i in range(2)]
                response = client.post("/api/pdf/merge", files=files)
        assert response.status_code == 413, f"expected 413, got {response.status_code}: {response.text}"
        assert _error_code(response) == "TOTAL_UPLOAD_TOO_LARGE"

    def test_compress_image_total_size_exceeded_returns_413(self):
        """Total batch gambar melebihi batas harus ditolak."""
        with patch("app.config.MAX_TOTAL_UPLOAD_BYTES", 500):
            with TestClient(app, raise_server_exceptions=False) as client:
                files = [_make_image_file(f"img{i}.jpg", size_bytes=300) for i in range(2)]
                response = client.post("/api/image/compress", files=files)
        assert response.status_code == 413, f"expected 413, got {response.status_code}: {response.text}"
        assert _error_code(response) == "TOTAL_UPLOAD_TOO_LARGE"


# ---------------------------------------------------------------------------
# Test: error response structure
# ---------------------------------------------------------------------------

class TestErrorResponseStructure:
    def test_too_many_files_response_has_correct_shape(self):
        """Response error harus memiliki struktur {error: {code, message}}."""
        with patch("app.config.MAX_BATCH_FILES", 1):
            with TestClient(app, raise_server_exceptions=False) as client:
                files = [_make_pdf_file(f"f{i}.pdf") for i in range(2)]
                response = client.post("/api/pdf/merge", files=files)
        body = response.json()
        assert "error" in body
        assert "code" in body["error"]
        assert "message" in body["error"]
        assert isinstance(body["error"]["message"], str)
        assert len(body["error"]["message"]) > 0

    def test_file_too_large_response_has_correct_shape(self):
        """Response FILE_TOO_LARGE harus memiliki struktur error yang benar."""
        with patch("app.config.MAX_FILE_SIZE_BYTES", 10):
            with TestClient(app, raise_server_exceptions=False) as client:
                content = b"%PDF-1.4\n" + b"x" * 100
                files = [("file", ("big.pdf", io.BytesIO(content), "application/pdf"))]
                response = client.post("/api/pdf/compress", files=files)
        assert response.status_code == 413
        body = response.json()
        assert "error" in body
        assert body["error"]["code"] == "FILE_TOO_LARGE"

    def test_total_too_large_response_has_correct_shape(self):
        """Response TOTAL_UPLOAD_TOO_LARGE harus memiliki struktur error yang benar."""
        with patch("app.config.MAX_TOTAL_UPLOAD_BYTES", 500):
            with TestClient(app, raise_server_exceptions=False) as client:
                files = [_make_image_file(f"img{i}.jpg", size_bytes=300) for i in range(2)]
                response = client.post("/api/image/compress", files=files)
        assert response.status_code == 413
        body = response.json()
        assert "error" in body
        assert body["error"]["code"] == "TOTAL_UPLOAD_TOO_LARGE"
        assert "MB" in body["error"]["message"]