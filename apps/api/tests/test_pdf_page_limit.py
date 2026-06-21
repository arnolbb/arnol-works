"""
Test untuk PDF page count limit (MAX_PDF_PAGES).
PDF sintetis dibuat dengan PyMuPDF agar tidak bergantung file eksternal.
"""
import io
import tempfile
from pathlib import Path
from unittest.mock import patch

import fitz
import pytest
from fastapi.testclient import TestClient

from app.main import app


# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------

def _make_synthetic_pdf(page_count: int) -> bytes:
    """Buat PDF sintetis dengan jumlah halaman tertentu menggunakan PyMuPDF."""
    doc = fitz.open()
    for i in range(page_count):
        page = doc.new_page()
        page.insert_text((50, 50), f"Page {i + 1}")
    buf = io.BytesIO()
    doc.save(buf)
    doc.close()
    return buf.getvalue()


def _error_code(response) -> str:
    try:
        return response.json().get("error", {}).get("code", "")
    except Exception:
        return ""


# ---------------------------------------------------------------------------
# Test: PDF terlalu banyak halaman ditolak
# ---------------------------------------------------------------------------

class TestPdfPageCountLimit:
    def test_analyze_pdf_exceeds_page_limit_returns_400(self):
        """analyze: PDF dengan halaman > MAX_PDF_PAGES harus ditolak."""
        pdf_bytes = _make_synthetic_pdf(5)
        with patch("app.config.MAX_PDF_PAGES", 3):
            with TestClient(app, raise_server_exceptions=False) as client:
                files = [("file", ("test.pdf", io.BytesIO(pdf_bytes), "application/pdf"))]
                response = client.post("/api/pdf/analyze", files=files, data={"mode": "balanced"})
        assert response.status_code == 400, f"expected 400, got {response.status_code}: {response.text}"
        assert _error_code(response) == "PDF_TOO_MANY_PAGES"

    def test_compress_pdf_exceeds_page_limit_returns_400(self):
        """compress: PDF dengan halaman > MAX_PDF_PAGES harus ditolak."""
        pdf_bytes = _make_synthetic_pdf(5)
        with patch("app.config.MAX_PDF_PAGES", 3):
            with TestClient(app, raise_server_exceptions=False) as client:
                files = [("file", ("test.pdf", io.BytesIO(pdf_bytes), "application/pdf"))]
                response = client.post("/api/pdf/compress", files=files)
        assert response.status_code == 400
        assert _error_code(response) == "PDF_TOO_MANY_PAGES"

    def test_to_jpg_pdf_exceeds_page_limit_returns_400(self):
        """to-jpg: PDF dengan halaman > MAX_PDF_PAGES harus ditolak."""
        pdf_bytes = _make_synthetic_pdf(5)
        with patch("app.config.MAX_PDF_PAGES", 3):
            with TestClient(app, raise_server_exceptions=False) as client:
                files = [("file", ("test.pdf", io.BytesIO(pdf_bytes), "application/pdf"))]
                response = client.post("/api/pdf/to-jpg", files=files)
        assert response.status_code == 400
        assert _error_code(response) == "PDF_TOO_MANY_PAGES"

    def test_to_docx_pdf_exceeds_page_limit_returns_400(self):
        """to-docx: PDF dengan halaman > MAX_PDF_PAGES harus ditolak."""
        pdf_bytes = _make_synthetic_pdf(5)
        with patch("app.config.MAX_PDF_PAGES", 3):
            with TestClient(app, raise_server_exceptions=False) as client:
                files = [("file", ("test.pdf", io.BytesIO(pdf_bytes), "application/pdf"))]
                response = client.post("/api/pdf/to-docx", files=files)
        assert response.status_code == 400
        assert _error_code(response) == "PDF_TOO_MANY_PAGES"

    def test_merge_pdf_total_pages_exceeds_limit_returns_400(self):
        """merge: Salah satu PDF melebihi MAX_PDF_PAGES harus ditolak."""
        pdf_big = _make_synthetic_pdf(5)
        pdf_small = _make_synthetic_pdf(2)
        with patch("app.config.MAX_PDF_PAGES", 3):
            with TestClient(app, raise_server_exceptions=False) as client:
                files = [
                    ("files", ("big.pdf", io.BytesIO(pdf_big), "application/pdf")),
                    ("files", ("small.pdf", io.BytesIO(pdf_small), "application/pdf")),
                ]
                response = client.post("/api/pdf/merge", files=files)
        assert response.status_code == 400
        assert _error_code(response) == "PDF_TOO_MANY_PAGES"


# ---------------------------------------------------------------------------
# Test: PDF dalam batas halaman diterima (validasi tidak memblokir)
# ---------------------------------------------------------------------------

class TestPdfPageCountWithinLimit:
    def test_analyze_pdf_within_limit_passes_validation(self):
        """analyze: PDF dalam batas halaman harus melewati validasi (meski proses mungkin gagal karena alasan lain)."""
        pdf_bytes = _make_synthetic_pdf(2)
        with patch("app.config.MAX_PDF_PAGES", 5):
            with TestClient(app, raise_server_exceptions=False) as client:
                files = [("file", ("test.pdf", io.BytesIO(pdf_bytes), "application/pdf"))]
                response = client.post("/api/pdf/analyze", files=files, data={"mode": "balanced"})
        # Tidak boleh PDF_TOO_MANY_PAGES
        assert _error_code(response) != "PDF_TOO_MANY_PAGES"

    def test_compress_pdf_within_limit_passes_validation(self):
        """compress: PDF dalam batas halaman harus melewati validasi."""
        pdf_bytes = _make_synthetic_pdf(2)
        with patch("app.config.MAX_PDF_PAGES", 5):
            with TestClient(app, raise_server_exceptions=False) as client:
                files = [("file", ("test.pdf", io.BytesIO(pdf_bytes), "application/pdf"))]
                response = client.post("/api/pdf/compress", files=files)
        assert _error_code(response) != "PDF_TOO_MANY_PAGES"


# ---------------------------------------------------------------------------
# Test: struktur error response PDF_TOO_MANY_PAGES
# ---------------------------------------------------------------------------

class TestPdfPageLimitErrorStructure:
    def test_error_response_contains_page_info(self):
        """Pesan error harus menyebut jumlah halaman aktual dan batas maksimal."""
        pdf_bytes = _make_synthetic_pdf(5)
        with patch("app.config.MAX_PDF_PAGES", 3):
            with TestClient(app, raise_server_exceptions=False) as client:
                files = [("file", ("test.pdf", io.BytesIO(pdf_bytes), "application/pdf"))]
                response = client.post("/api/pdf/compress", files=files)
        body = response.json()
        assert "error" in body
        assert body["error"]["code"] == "PDF_TOO_MANY_PAGES"
        message = body["error"]["message"]
        # Pesan harus menyebut angka halaman aktual (5) dan batas (3)
        assert "5" in message
        assert "3" in message