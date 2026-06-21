from fastapi import HTTPException, status


def api_error(code: str, message: str, http_status: int, details=None) -> HTTPException:
    return HTTPException(
        status_code=http_status,
        detail={"error": {"code": code, "message": message, "details": details}},
    )


def invalid_file_type() -> HTTPException:
    return api_error("INVALID_FILE_TYPE", "File harus berformat PDF.", status.HTTP_400_BAD_REQUEST)


def file_too_large(max_mb: int = 50) -> HTTPException:
    return api_error(
        "FILE_TOO_LARGE",
        f"Ukuran satu file maksimal {max_mb} MB.",
        status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
    )


def too_many_files(max_files: int) -> HTTPException:
    return api_error(
        "TOO_MANY_FILES",
        f"Maksimal {max_files} file per upload.",
        status.HTTP_400_BAD_REQUEST,
    )


def total_upload_too_large(max_mb: int) -> HTTPException:
    return api_error(
        "TOTAL_UPLOAD_TOO_LARGE",
        f"Total ukuran semua file tidak boleh melebihi {max_mb} MB.",
        status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
    )


def pdf_too_many_pages(page_count: int, max_pages: int) -> HTTPException:
    return api_error(
        "PDF_TOO_MANY_PAGES",
        f"PDF memiliki {page_count} halaman. Maksimal yang diizinkan adalah {max_pages} halaman.",
        status.HTTP_400_BAD_REQUEST,
    )


def job_not_found() -> HTTPException:
    return api_error("JOB_NOT_FOUND", "Job tidak ditemukan atau sudah kedaluwarsa.", status.HTTP_404_NOT_FOUND)


def job_expired() -> HTTPException:
    return api_error(
        "JOB_EXPIRED",
        "File sudah kedaluwarsa dan tidak dapat diakses lagi. Silakan proses ulang file Anda.",
        status.HTTP_410_GONE,
    )