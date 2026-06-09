from pathlib import Path
from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import FileResponse
from pydantic import BaseModel

from app.errors import api_error, file_too_large, invalid_file_type, job_not_found
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


@router.get("/api/files/{job_id}/{file_path:path}")
def serve_file(job_id: str, file_path: str):
    path = safe_job_path(job_id, file_path)
    if path is None or not path.exists() or not path.is_file():
        raise job_not_found()

    media_type = "application/pdf" if path.suffix.lower() == ".pdf" else "image/jpeg"
    return FileResponse(path, media_type=media_type, filename=path.name if path.suffix.lower() == ".pdf" else None)
