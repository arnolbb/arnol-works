from pathlib import Path
from pypdf import PdfReader, PdfWriter


def normalize_pages(selected_pages: list[int], total_pages: int) -> list[int]:
    normalized = sorted(set(selected_pages))
    if any(page < 1 or page > total_pages for page in normalized):
        raise ValueError("INVALID_PAGE_SELECTION")
    return normalized


def split_pdf(input_pdf: Path, outputs_dir: Path, selected_pages: list[int], total_pages: int) -> dict:
    normalized = normalize_pages(selected_pages, total_pages)
    selected_set = set(normalized)
    reader = PdfReader(str(input_pdf))
    color_writer = PdfWriter()
    bw_writer = PdfWriter()

    for index, page in enumerate(reader.pages):
        page_number = index + 1
        if page_number in selected_set:
            color_writer.add_page(page)
        else:
            bw_writer.add_page(page)

    color_url = None
    bw_url = None
    color_path = outputs_dir / "color-pages.pdf"
    bw_path = outputs_dir / "bw-pages.pdf"

    if len(color_writer.pages) > 0:
        with color_path.open("wb") as file:
            color_writer.write(file)
        color_url = "outputs/color-pages.pdf"

    if len(bw_writer.pages) > 0:
        with bw_path.open("wb") as file:
            bw_writer.write(file)
        bw_url = "outputs/bw-pages.pdf"

    return {
        "colorPath": color_url,
        "bwPath": bw_url,
        "colorPageCount": len(color_writer.pages),
        "bwPageCount": len(bw_writer.pages),
    }
