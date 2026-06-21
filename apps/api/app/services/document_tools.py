from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile

import fitz
from pypdf import PdfReader, PdfWriter

SUPPORTED_IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png"}


def compress_pdf(input_pdf: Path, output_pdf: Path) -> dict:
    try:
        document = fitz.open(input_pdf)
    except Exception as exc:
        raise ValueError("PDF_CORRUPTED") from exc

    try:
        if document.is_encrypted:
            raise PermissionError("PDF_ENCRYPTED")
        document.save(output_pdf, garbage=4, deflate=True, clean=True)
    finally:
        document.close()

    original_size = input_pdf.stat().st_size
    output_size = output_pdf.stat().st_size
    reduction = max(0, round((1 - (output_size / original_size)) * 100)) if original_size else 0
    return {"originalSize": original_size, "outputSize": output_size, "reductionPercent": reduction}


def merge_pdfs(input_pdfs: list[Path], output_pdf: Path) -> dict:
    if len(input_pdfs) < 2:
        raise ValueError("NEED_MULTIPLE_FILES")

    writer = PdfWriter()
    total_pages = 0
    for input_pdf in input_pdfs:
        reader = PdfReader(str(input_pdf))
        if reader.is_encrypted:
            raise PermissionError("PDF_ENCRYPTED")
        for page in reader.pages:
            writer.add_page(page)
            total_pages += 1

    with output_pdf.open("wb") as file:
        writer.write(file)

    return {"fileCount": len(input_pdfs), "totalPages": total_pages, "outputSize": output_pdf.stat().st_size}


def images_to_pdf(image_paths: list[Path], output_pdf: Path) -> dict:
    if not image_paths:
        raise ValueError("NO_IMAGES")

    document = fitz.open()
    try:
        for image_path in image_paths:
            if image_path.suffix.lower() not in SUPPORTED_IMAGE_EXTENSIONS:
                raise ValueError("INVALID_IMAGE")
            pixmap = fitz.Pixmap(str(image_path))
            if pixmap.alpha:
                pixmap = fitz.Pixmap(fitz.csRGB, pixmap)
            width = pixmap.width
            height = pixmap.height
            page = document.new_page(width=width, height=height)
            page.insert_image(fitz.Rect(0, 0, width, height), filename=str(image_path))
        document.save(output_pdf, garbage=4, deflate=True)
    finally:
        document.close()

    return {"imageCount": len(image_paths), "outputSize": output_pdf.stat().st_size}


def pdf_to_jpg_zip(input_pdf: Path, output_zip: Path) -> dict:
    try:
        document = fitz.open(input_pdf)
    except Exception as exc:
        raise ValueError("PDF_CORRUPTED") from exc

    try:
        if document.is_encrypted:
            raise PermissionError("PDF_ENCRYPTED")
        if document.page_count <= 0:
            raise ValueError("PDF_CORRUPTED")
        with ZipFile(output_zip, "w", ZIP_DEFLATED) as archive:
            matrix = fitz.Matrix(2, 2)
            for index in range(document.page_count):
                page_number = index + 1
                page = document.load_page(index)
                pixmap = page.get_pixmap(matrix=matrix, alpha=False)
                archive.writestr(f"page-{page_number}.jpg", pixmap.tobytes("jpg"))
        return {"pageCount": document.page_count, "outputSize": output_zip.stat().st_size}
    finally:
        document.close()
