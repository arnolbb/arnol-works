from fastapi import HTTPException, status


def api_error(code: str, message: str, http_status: int, details=None) -> HTTPException:
    return HTTPException(
        status_code=http_status,
        detail={"error": {"code": code, "message": message, "details": details}},
    )


def invalid_file_type() -> HTTPException:
    return api_error("INVALID_FILE_TYPE", "File harus berformat PDF.", status.HTTP_400_BAD_REQUEST)


def file_too_large() -> HTTPException:
    return api_error("FILE_TOO_LARGE", "Ukuran file maksimal 50MB.", status.HTTP_413_REQUEST_ENTITY_TOO_LARGE)


def job_not_found() -> HTTPException:
    return api_error("JOB_NOT_FOUND", "Job tidak ditemukan atau sudah kedaluwarsa.", status.HTTP_404_NOT_FOUND)
