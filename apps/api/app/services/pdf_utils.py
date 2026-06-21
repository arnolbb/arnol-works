"""
Utilitas ringan untuk validasi PDF yang digunakan bersama oleh route dan service.
Tidak mengimpor app.config secara langsung agar bisa diuji dengan nilai limit kustom.
"""
from pathlib import Path

import fitz


def get_pdf_page_count(pdf_path: Path) -> int:
    """
    Buka PDF dan kembalikan jumlah halaman.
    Raise ValueError("PDF_CORRUPTED") jika tidak bisa dibuka.
    Raise PermissionError("PDF_ENCRYPTED") jika terenkripsi.
    Selalu menutup dokumen setelah selesai.
    """
    try:
        document = fitz.open(pdf_path)
    except Exception as exc:
        raise ValueError("PDF_CORRUPTED") from exc

    try:
        if document.is_encrypted:
            raise PermissionError("PDF_ENCRYPTED")
        return document.page_count
    finally:
        document.close()