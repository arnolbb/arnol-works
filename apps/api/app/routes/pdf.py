from pathlib import Path
from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import FileResponse
from pydantic import BaseModel

from app.errors import api_error, file_too_large, invalid_file_type, job_not_found
from app.services.document_tools import compress_pdf, images_to_pdf, merge_pdfs, pdf_to_jpg_zip
from app.services.image_tools import compress_images, resize_images
from app.services.background_remover import remove_background, remove_background_batch
from app.services.passport_photo import generate_passport_photo
from app.services.pdf_converter import pdf_to_docx
from app.services.pdf_analyzer import analyze_pdf
from app.services.pdf_splitter import split_pdf
from app.services.storage import create_job, get_job_dir, read_metadata, safe_job_path, write_metadata

router = APIRouter()
MAX_FILE_SIZE = 50 * 1024 * 1024

class SplitRequest(BaseModel):
    jobId: str
    selectedColorPages: list[int]

async def save_upload(file: UploadFile, destination: Path) -> None:
    total_size = 0
    with destination.open("wb") as output:
        while chunk := await file.read(1024 * 1024):
            total_size += len(chunk)
            if total_size > MAX_FILE_SIZE:
                destination.unlink(missing_ok=True)
                raise file_too_large()
            output.write(chunk)

@router.post("/api/pdf/analyze")
async def analyze_endpoint(file: UploadFile = File(...), mode: str = Form("balanced")):
    if file.content_type != "application/pdf" and not file.filename.lower().endswith(".pdf"):
        raise invalid_file_type()

    job = create_job()
    await save_upload(file, job["input_pdf"])

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

@router.post("/api/pdf/compress")
async def compress_endpoint(file: UploadFile = File(...)):
    if file.content_type != "application/pdf" and not file.filename.lower().endswith(".pdf"):
        raise invalid_file_type()

    job = create_job()
    await save_upload(file, job["input_pdf"])
    output_path = job["outputs_dir"] / "compressed.pdf"

    try:
        result = compress_pdf(job["input_pdf"], output_path)
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
    input_paths = []
    for index, file in enumerate(files, start=1):
        if file.content_type != "application/pdf" and not file.filename.lower().endswith(".pdf"):
            raise invalid_file_type()
        path = job["input_dir"] / f"merge-{index}.pdf"
        await save_upload(file, path)
        input_paths.append(path)

    output_path = job["outputs_dir"] / "merged.pdf"
    try:
        result = merge_pdfs(input_paths, output_path)
    except PermissionError:
        raise api_error("PDF_ENCRYPTED", "Salah satu PDF terkunci atau membutuhkan password.", 400)
    except ValueError:
        raise api_error("PDF_CORRUPTED", "Salah satu PDF rusak atau tidak bisa dibuka.", 400)
    except Exception:
        raise api_error("PROCESSING_FAILED", "PDF gagal digabungkan.", 500)

    return {"jobId": job["job_id"], "downloadUrl": f"/api/files/{job['job_id']}/outputs/merged.pdf", **result}

@router.post("/api/image/to-pdf")
async def image_to_pdf_endpoint(files: list[UploadFile] = File(...)):
    if not files:
        raise api_error("NO_IMAGES", "Upload minimal satu gambar JPG atau PNG.", 400)

    job = create_job()
    input_paths = []
    for index, file in enumerate(files, start=1):
        filename = file.filename.lower()
        if not (filename.endswith(".jpg") or filename.endswith(".jpeg") or filename.endswith(".png")):
            raise invalid_file_type()
        suffix = Path(filename).suffix or ".jpg"
        path = job["input_dir"] / f"image-{index}{suffix}"
        await save_upload(file, path)
        input_paths.append(path)

    output_path = job["outputs_dir"] / "images.pdf"
    try:
        result = images_to_pdf(input_paths, output_path)
    except ValueError:
        raise api_error("INVALID_IMAGE", "Gambar tidak valid atau tidak bisa dibaca.", 400)
    except Exception:
        raise api_error("PROCESSING_FAILED", "Gambar gagal diubah menjadi PDF.", 500)

    return {"jobId": job["job_id"], "downloadUrl": f"/api/files/{job['job_id']}/outputs/images.pdf", **result}

@router.post("/api/pdf/to-jpg")
async def pdf_to_jpg_endpoint(file: UploadFile = File(...)):
    if file.content_type != "application/pdf" and not file.filename.lower().endswith(".pdf"):
        raise invalid_file_type()

    job = create_job()
    await save_upload(file, job["input_pdf"])
    output_path = job["outputs_dir"] / "pages-jpg.zip"

    try:
        result = pdf_to_jpg_zip(job["input_pdf"], output_path)
    except PermissionError:
        raise api_error("PDF_ENCRYPTED", "PDF ini terkunci atau membutuhkan password.", 400)
    except ValueError:
        raise api_error("PDF_CORRUPTED", "PDF tidak bisa dibuka atau rusak.", 400)
    except Exception:
        raise api_error("PROCESSING_FAILED", "PDF gagal diubah menjadi JPG.", 500)

    return {"jobId": job["job_id"], "downloadUrl": f"/api/files/{job['job_id']}/outputs/pages-jpg.zip", **result}


async def save_image_uploads(files: list[UploadFile], input_dir: Path) -> list[Path]:
    if not files:
        raise api_error("NO_IMAGES", "Upload minimal satu gambar JPG, PNG, atau WebP.", 400)
    input_paths = []
    for index, file in enumerate(files, start=1):
        filename = file.filename.lower()
        if not (filename.endswith(".jpg") or filename.endswith(".jpeg") or filename.endswith(".png") or filename.endswith(".webp")):
            raise invalid_file_type()
        suffix = Path(filename).suffix or ".jpg"
        path = input_dir / f"image-{index}{suffix}"
        await save_upload(file, path)
        input_paths.append(path)
    return input_paths

@router.post("/api/image/compress")
async def compress_image_endpoint(files: list[UploadFile] = File(...)):
    job = create_job()
    input_paths = await save_image_uploads(files, job["input_dir"])
    output_path = job["outputs_dir"] / "compressed-images.zip"

    try:
        result = compress_images(input_paths, output_path)
    except ValueError:
        raise api_error("INVALID_IMAGE", "Gambar tidak valid atau tidak bisa dibaca.", 400)
    except Exception:
        raise api_error("PROCESSING_FAILED", "Gambar gagal dikompres.", 500)

    return {"jobId": job["job_id"], "downloadUrl": f"/api/files/{job['job_id']}/outputs/compressed-images.zip", **result}

@router.post("/api/image/resize")
async def resize_image_endpoint(files: list[UploadFile] = File(...), maxWidth: int = Form(1280)):
    job = create_job()
    input_paths = await save_image_uploads(files, job["input_dir"])
    output_path = job["outputs_dir"] / "resized-images.zip"

    try:
        result = resize_images(input_paths, output_path, maxWidth)
    except ValueError as exc:
        if str(exc) == "INVALID_SIZE":
            raise api_error("INVALID_SIZE", "Lebar maksimal harus antara 100 sampai 5000 px.", 400)
        raise api_error("INVALID_IMAGE", "Gambar tidak valid atau tidak bisa dibaca.", 400)
    except Exception:
        raise api_error("PROCESSING_FAILED", "Gambar gagal di-resize.", 500)

    return {"jobId": job["job_id"], "downloadUrl": f"/api/files/{job['job_id']}/outputs/resized-images.zip", **result}


@router.post("/api/image/remove-bg")
async def remove_bg_endpoint(files: list[UploadFile] = File(...)):
    job = create_job()
    input_paths = await save_image_uploads(files, job["input_dir"])

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
    if not (filename.endswith(".jpg") or filename.endswith(".jpeg") or filename.endswith(".png") or filename.endswith(".webp")):
        raise invalid_file_type()

    job = create_job()
    suffix = Path(filename).suffix or ".jpg"
    input_path = job["input_dir"] / f"photo{suffix}"
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


@router.post("/api/pdf/to-docx")
async def pdf_to_docx_endpoint(file: UploadFile = File(...)):
    if file.content_type != "application/pdf" and not (file.filename or "").lower().endswith(".pdf"):
        raise invalid_file_type()

    job = create_job()
    await save_upload(file, job["input_pdf"])
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


@router.get("/api/files/{job_id}/{file_path:path}")
def serve_file(job_id: str, file_path: str):
    path = safe_job_path(job_id, file_path)
    if path is None or not path.exists() or not path.is_file():
        raise job_not_found()

    media_types = {".pdf": "application/pdf", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".zip": "application/zip", ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document"}
    media_type = media_types.get(path.suffix.lower(), "application/octet-stream")
    return FileResponse(path, media_type=media_type, filename=path.name if path.suffix.lower() in {".pdf", ".zip", ".docx"} else None)
