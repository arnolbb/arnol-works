import shutil
from pathlib import Path

from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import FileResponse
from pydantic import BaseModel

import app.config as _cfg
from app.errors import (
    api_error,
    file_too_large,
    invalid_file_type,
    job_expired,
    job_not_found,
    pdf_too_many_pages,
    too_many_files,
    total_upload_too_large,
)
from app.services.document_tools import compress_pdf, images_to_pdf, merge_pdfs, pdf_to_jpg_zip
from app.services.image_tools import compress_images, resize_images
from app.services.background_remover import remove_background, remove_background_batch
from app.services.passport_photo import generate_passport_photo
from app.services.pdf_converter import pdf_to_docx
from app.services.pdf_analyzer import analyze_pdf
from app.services.pdf_splitter import split_pdf
from app.services.pdf_utils import get_pdf_page_count
from app.services.storage import create_job, get_job_dir, read_metadata, safe_job_path, write_metadata

router = APIRouter()


class SplitRequest(BaseModel):
    jobId: str
    selectedColorPages: list[int]


# ---------------------------------------------------------------------------
# Upload helpers
# ---------------------------------------------------------------------------

async def save_upload(file: UploadFile, destination: Path) -> None:
    """Simpan satu file upload ke destination, tolak jika melebihi MAX_FILE_SIZE_BYTES."""
    limit = _cfg.MAX_FILE_SIZE_BYTES
    max_mb = limit // (1024 * 1024)
    total_size = 0
    exceeded = False
    with destination.open("wb") as output:
        while chunk := await file.read(1024 * 1024):
            total_size += len(chunk)
            if total_size > limit:
                exceeded = True
                break
            output.write(chunk)
    if exceeded:
        destination.unlink(missing_ok=True)
        raise file_too_large(max_mb)


def _validate_batch_count(files: list[UploadFile]) -> None:
    """Tolak request jika jumlah file melebihi MAX_BATCH_FILES."""
    if len(files) > _cfg.MAX_BATCH_FILES:
        raise too_many_files(_cfg.MAX_BATCH_FILES)


def _check_running_total(running: int, added: int, job_dir: Path) -> int:
    """Tambahkan ukuran file ke total; tolak dan bersihkan job_dir jika melampaui batas."""
    new_total = running + added
    if new_total > _cfg.MAX_TOTAL_UPLOAD_BYTES:
        shutil.rmtree(job_dir, ignore_errors=True)
        raise total_upload_too_large(_cfg.MAX_TOTAL_UPLOAD_BYTES // (1024 * 1024))
    return new_total


async def save_batch_uploads(
    files: list[UploadFile],
    input_dir: Path,
    job_dir: Path,
    prefix: str,
    valid_extensions: set[str] | None = None,
) -> list[Path]:
    """
    Simpan beberapa file upload ke input_dir.
    - Validasi count limit sebelum mulai.
    - Validasi per-file size saat streaming.
    - Validasi total size setelah tiap file tersimpan.
    - Bersihkan job_dir jika ada yang gagal.
    """
    _validate_batch_count(files)
    saved: list[Path] = []
    running_total = 0
    for index, file in enumerate(files, start=1):
        filename = (file.filename or "").lower()
        if valid_extensions is not None:
            suffix = Path(filename).suffix
            if suffix not in valid_extensions:
                shutil.rmtree(job_dir, ignore_errors=True)
                raise invalid_file_type()
        dest = input_dir / f"{prefix}-{index}{Path(filename).suffix or '.bin'}"
        await save_upload(file, dest)
        running_total = _check_running_total(running_total, dest.stat().st_size, job_dir)
        saved.append(dest)
    return saved


# ---------------------------------------------------------------------------
# Page count validation helper
# ---------------------------------------------------------------------------

def _check_pdf_pages(pdf_path: Path) -> int:
    """
    Validasi page count PDF terhadap MAX_PDF_PAGES.
    Raise api_error jika melebihi batas atau PDF bermasalah.
    Mengembalikan page count jika valid.
    """
    try:
        page_count = get_pdf_page_count(pdf_path)
    except PermissionError:
        raise api_error("PDF_ENCRYPTED", "PDF ini terkunci atau membutuhkan password.", 400)
    except ValueError:
        raise api_error("PDF_CORRUPTED", "PDF tidak bisa dibuka atau rusak.", 400)

    if page_count > _cfg.MAX_PDF_PAGES:
        raise pdf_too_many_pages(page_count, _cfg.MAX_PDF_PAGES)

    return page_count


# ---------------------------------------------------------------------------
# PDF endpoints
# ---------------------------------------------------------------------------

@router.post("/api/pdf/analyze")
async def analyze_endpoint(file: UploadFile = File(...), mode: str = Form("balanced")):
    if file.content_type != "application/pdf" and not (file.filename or "").lower().endswith(".pdf"):
        raise invalid_file_type()

    job = create_job()
    await save_upload(file, job["input_pdf"])

    # Validasi page count sebelum proses analyze (render thumbnail mahal)
    _check_pdf_pages(job["input_pdf"])

    try:
        result = analyze_pdf(job["input_pdf"], job["thumbs_dir"], job["job_id"], mode)
    except PermissionError:
        raise api_error("PDF_ENCRYPTED", "PDF ini terkunci atau membutuhkan password.", 400)
    except ValueError as exc:
        code = str(exc)
        if code == "PDF_CORRUPTED":
            raise api_error("PDF_CORRUPTED", "PDF tidak bisa dibuka atau rusak.", 400)
        raise api_error("PROCESSING_FAILED", "PDF gagal diproses.", 500)
    except Exception:
        raise api_error("PROCESSING_FAILED", "PDF gagal diproses.", 500)

    write_metadata(job["job_dir"], {"totalPages": result["totalPages"], "inputPdf": "input/original.pdf"})
    return {"jobId": job["job_id"], **result}


@router.post("/api/pdf/split")
def split_endpoint(payload: SplitRequest):
    job_dir = get_job_dir(payload.jobId)
    if job_dir is None:
        raise job_not_found()

    metadata = read_metadata(job_dir)
    if metadata is None:
        raise job_not_found()

    try:
        result = split_pdf(
            job_dir / metadata["inputPdf"],
            job_dir / "outputs",
            payload.selectedColorPages,
            int(metadata["totalPages"]),
        )
    except ValueError:
        raise api_error("INVALID_PAGE_SELECTION", "Pilihan halaman tidak valid.", 400)
    except Exception:
        raise api_error("PROCESSING_FAILED", "PDF gagal dipisahkan.", 500)

    color_url = f"/api/files/{payload.jobId}/{result['colorPath']}" if result["colorPath"] else None
    bw_url = f"/api/files/{payload.jobId}/{result['bwPath']}" if result["bwPath"] else None
    return {
        "jobId": payload.jobId,
        "colorPdfUrl": color_url,
        "bwPdfUrl": bw_url,
        "colorPageCount": result["colorPageCount"],
        "bwPageCount": result["bwPageCount"],
    }


_VALID_COMPRESS_PRESETS = {"balanced", "high_quality", "smallest"}


@router.post("/api/pdf/compress")
async def compress_endpoint(file: UploadFile = File(...), preset: str = Form("balanced")):
    if file.content_type != "application/pdf" and not (file.filename or "").lower().endswith(".pdf"):
        raise invalid_file_type()
    if preset not in _VALID_COMPRESS_PRESETS:
        raise api_error("INVALID_PRESET", "Preset tidak valid. Pilih: balanced, high_quality, atau smallest.", 400)

    job = create_job()
    await save_upload(file, job["input_pdf"])

    # Validasi page count sebelum kompresi
    _check_pdf_pages(job["input_pdf"])

    try:
        result = compress_pdf(job["input_pdf"], job["outputs_dir"] / "compressed.pdf", preset=preset)
    except PermissionError:
        raise api_error("PDF_ENCRYPTED", "PDF ini terkunci atau membutuhkan password.", 400)
    except ValueError:
        raise api_error("PDF_CORRUPTED", "PDF tidak bisa dibuka atau rusak.", 400)
    except Exception:
        raise api_error("PROCESSING_FAILED", "PDF gagal dikompres.", 500)

    return {"jobId": job["job_id"], "downloadUrl": f"/api/files/{job['job_id']}/outputs/compressed.pdf", **result}


@router.post("/api/pdf/merge")
async def merge_endpoint(files: list[UploadFile] = File(...)):
    if len(files) < 2:
        raise api_error("NEED_MULTIPLE_FILES", "Upload minimal dua file PDF untuk digabungkan.", 400)

    job = create_job()
    input_paths = await save_batch_uploads(
        files, job["input_dir"], job["job_dir"],
        prefix="merge", valid_extensions={".pdf"},
    )

    # Validasi total halaman dari semua PDF sebelum merge
    total_pages = 0
    for pdf_path in input_paths:
        total_pages += _check_pdf_pages(pdf_path)

    output_path = job["outputs_dir"] / "merged.pdf"

    try:
        result = merge_pdfs(input_paths, output_path)
    except PermissionError:
        raise api_error("PDF_ENCRYPTED", "Salah satu PDF terkunci atau membutuhkan password.", 400)
    except ValueError:
        raise api_error("PDF_CORRUPTED", "Salah satu PDF tidak bisa dibuka atau rusak.", 400)
    except Exception:
        raise api_error("PROCESSING_FAILED", "PDF gagal digabungkan.", 500)

    return {"jobId": job["job_id"], "downloadUrl": f"/api/files/{job['job_id']}/outputs/merged.pdf", **result}


@router.post("/api/pdf/from-images")
async def images_to_pdf_endpoint(files: list[UploadFile] = File(...)):
    job = create_job()
    input_paths = await save_batch_uploads(
        files, job["input_dir"], job["job_dir"],
        prefix="img", valid_extensions={".jpg", ".jpeg", ".png"},
    )
    output_path = job["outputs_dir"] / "images.pdf"

    try:
        result = images_to_pdf(input_paths, output_path)
    except ValueError:
        raise api_error("INVALID_IMAGE", "Salah satu gambar tidak valid atau format tidak didukung.", 400)
    except Exception:
        raise api_error("PROCESSING_FAILED", "Gagal membuat PDF dari gambar.", 500)

    return {"jobId": job["job_id"], "downloadUrl": f"/api/files/{job['job_id']}/outputs/images.pdf", **result}


@router.post("/api/pdf/to-jpg")
async def pdf_to_jpg_endpoint(file: UploadFile = File(...)):
    if file.content_type != "application/pdf" and not (file.filename or "").lower().endswith(".pdf"):
        raise invalid_file_type()

    job = create_job()
    await save_upload(file, job["input_pdf"])

    # Validasi page count sebelum render (setiap halaman di-render ke JPG, sangat mahal)
    _check_pdf_pages(job["input_pdf"])

    output_path = job["outputs_dir"] / "pages.zip"

    try:
        result = pdf_to_jpg_zip(job["input_pdf"], output_path)
    except PermissionError:
        raise api_error("PDF_ENCRYPTED", "PDF ini terkunci atau membutuhkan password.", 400)
    except ValueError:
        raise api_error("PDF_CORRUPTED", "PDF tidak bisa dibuka atau rusak.", 400)
    except Exception:
        raise api_error("PROCESSING_FAILED", "PDF gagal dikonversi ke JPG.", 500)

    return {"jobId": job["job_id"], "downloadUrl": f"/api/files/{job['job_id']}/outputs/pages.zip", **result}


@router.post("/api/pdf/to-docx")
async def pdf_to_docx_endpoint(file: UploadFile = File(...)):
    if file.content_type != "application/pdf" and not (file.filename or "").lower().endswith(".pdf"):
        raise invalid_file_type()

    job = create_job()
    await save_upload(file, job["input_pdf"])

    # Validasi page count sebelum ekstraksi teks (mahal untuk PDF panjang)
    _check_pdf_pages(job["input_pdf"])

    output_path = job["outputs_dir"] / "converted.docx"

    try:
        result = pdf_to_docx(job["input_pdf"], output_path)
    except RuntimeError as exc:
        raise api_error("DEPENDENCY_MISSING", str(exc), 500)
    except PermissionError:
        raise api_error("PDF_ENCRYPTED", "PDF ini terkunci atau membutuhkan password.", 400)
    except ValueError:
        raise api_error("PDF_CORRUPTED", "PDF tidak bisa dibuka atau rusak.", 400)
    except Exception:
        raise api_error("PROCESSING_FAILED", "PDF gagal dikonversi ke Word.", 500)

    return {"jobId": job["job_id"], "downloadUrl": f"/api/files/{job['job_id']}/outputs/converted.docx", **result}


# ---------------------------------------------------------------------------
# Image endpoints
# ---------------------------------------------------------------------------

_IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}


@router.post("/api/image/compress")
async def compress_image_endpoint(files: list[UploadFile] = File(...), quality: int = Form(78)):
    job = create_job()
    input_paths = await save_batch_uploads(
        files, job["input_dir"], job["job_dir"],
        prefix="img", valid_extensions=_IMAGE_EXTENSIONS,
    )
    output_path = job["outputs_dir"] / "compressed-images.zip"

    try:
        result = compress_images(input_paths, output_path, quality=quality)
    except ValueError:
        raise api_error("INVALID_IMAGE", "Salah satu gambar tidak valid atau tidak bisa dibaca.", 400)
    except Exception:
        raise api_error("PROCESSING_FAILED", "Gambar gagal dikompres.", 500)

    return {"jobId": job["job_id"], "downloadUrl": f"/api/files/{job['job_id']}/outputs/compressed-images.zip", **result}


@router.post("/api/image/resize")
async def resize_image_endpoint(
    files: list[UploadFile] = File(...),
    width: int = Form(...),
    height: int = Form(...),
    keepAspectRatio: bool = Form(True),
):
    job = create_job()
    input_paths = await save_batch_uploads(
        files, job["input_dir"], job["job_dir"],
        prefix="img", valid_extensions=_IMAGE_EXTENSIONS,
    )
    output_path = job["outputs_dir"] / "resized-images.zip"

    try:
        result = resize_images(input_paths, output_path, width=width, height=height, keep_aspect_ratio=keepAspectRatio)
    except ValueError:
        raise api_error("INVALID_IMAGE", "Salah satu gambar tidak valid atau tidak bisa dibaca.", 400)
    except Exception:
        raise api_error("PROCESSING_FAILED", "Gambar gagal di-resize.", 500)

    return {"jobId": job["job_id"], "downloadUrl": f"/api/files/{job['job_id']}/outputs/resized-images.zip", **result}


@router.post("/api/image/remove-bg")
async def remove_bg_endpoint(files: list[UploadFile] = File(...)):
    job = create_job()
    input_paths = await save_batch_uploads(
        files, job["input_dir"], job["job_dir"],
        prefix="img", valid_extensions=_IMAGE_EXTENSIONS,
    )

    if len(input_paths) == 1:
        output_path = job["outputs_dir"] / "no-bg.png"
        try:
            result = remove_background(input_paths[0], output_path)
        except RuntimeError as exc:
            raise api_error("DEPENDENCY_MISSING", str(exc), 500)
        except ValueError:
            raise api_error("INVALID_IMAGE", "Gambar tidak valid atau tidak bisa dibaca.", 400)
        except Exception:
            raise api_error("PROCESSING_FAILED", "Gambar gagal diproses.", 500)
        return {"jobId": job["job_id"], "downloadUrl": f"/api/files/{job['job_id']}/outputs/no-bg.png", **result}
    else:
        output_path = job["outputs_dir"] / "no-bg-images.zip"
        try:
            result = remove_background_batch(input_paths, output_path)
        except RuntimeError as exc:
            raise api_error("DEPENDENCY_MISSING", str(exc), 500)
        except ValueError:
            raise api_error("INVALID_IMAGE", "Gambar tidak valid atau tidak bisa dibaca.", 400)
        except Exception:
            raise api_error("PROCESSING_FAILED", "Gambar gagal diproses.", 500)
        return {"jobId": job["job_id"], "downloadUrl": f"/api/files/{job['job_id']}/outputs/no-bg-images.zip", **result}


@router.post("/api/image/passport-photo")
async def passport_photo_endpoint(
    file: UploadFile = File(...),
    size: str = Form("3x4"),
    bgColor: str = Form("merah"),
):
    filename = (file.filename or "").lower()
    suffix = Path(filename).suffix
    if suffix not in _IMAGE_EXTENSIONS:
        raise invalid_file_type()

    job = create_job()
    input_path = job["input_dir"] / f"photo{suffix or '.jpg'}"
    await save_upload(file, input_path)

    try:
        result = generate_passport_photo(input_path, job["outputs_dir"], size, bgColor)
    except RuntimeError as exc:
        raise api_error("DEPENDENCY_MISSING", str(exc), 500)
    except ValueError as exc:
        msg = str(exc)
        if msg == "INVALID_SIZE":
            raise api_error("INVALID_SIZE", "Ukuran foto tidak valid. Pilih 2x3, 3x4, atau 4x6.", 400)
        if msg == "INVALID_BG_COLOR":
            raise api_error("INVALID_BG_COLOR", "Warna background tidak valid. Pilih merah, biru, atau putih.", 400)
        raise api_error("INVALID_IMAGE", "Gambar tidak valid atau tidak bisa dibaca.", 400)
    except Exception:
        raise api_error("PROCESSING_FAILED", "Gagal membuat pas foto.", 500)

    return {
        "jobId": job["job_id"],
        "downloadUrl": f"/api/files/{job['job_id']}/{result['files']['zip']}",
        "singleUrl": f"/api/files/{job['job_id']}/{result['files']['single']}",
        "sheetUrl": f"/api/files/{job['job_id']}/{result['files']['sheet']}",
        "sizeKey": result["sizeKey"],
        "bgColor": result["bgColor"],
        "outputSize": result["outputSize"],
    }


# ---------------------------------------------------------------------------
# File serving
# ---------------------------------------------------------------------------

@router.get("/api/files/{job_id}/{file_path:path}")
def serve_file(job_id: str, file_path: str):
    from app.services.storage import get_job_dir, is_job_expired
    # Cek expiry secara eksplisit agar pesan error berbeda dari not-found
    job_dir = get_job_dir(job_id)
    if job_dir is not None and is_job_expired(job_dir):
        raise job_expired()
    path = safe_job_path(job_id, file_path)
    if path is None or not path.exists() or not path.is_file():
        raise job_not_found()

    media_types = {
        ".pdf": "application/pdf",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".zip": "application/zip",
        ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    }
    media_type = media_types.get(path.suffix.lower(), "application/octet-stream")
    return FileResponse(
        path,
        media_type=media_type,
        filename=path.name if path.suffix.lower() in {".pdf", ".zip", ".docx"} else None,
    )