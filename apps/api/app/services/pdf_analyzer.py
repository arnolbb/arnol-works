from pathlib import Path
import fitz

THRESHOLDS = {
    "strict": {"delta": 10, "ratio": 0.0005, "step": 3},
    "balanced": {"delta": 18, "ratio": 0.002, "step": 4},
    "print-saving": {"delta": 25, "ratio": 0.005, "step": 4},
}


def _is_color_page(pix: fitz.Pixmap, mode: str) -> bool:
    config = THRESHOLDS.get(mode, THRESHOLDS["balanced"])
    delta = config["delta"]
    ratio = config["ratio"]
    step = config["step"]
    samples = pix.samples
    channels = pix.n
    colored = 0
    total = 0
    for y in range(0, pix.height, step):
        row_start = y * pix.width * channels
        for x in range(0, pix.width, step):
            index = row_start + x * channels
            red = samples[index]
            green = samples[index + 1]
            blue = samples[index + 2]
            if red > 245 and green > 245 and blue > 245:
                continue
            if red < 25 and green < 25 and blue < 25:
                continue
            total += 1
            if max(red, green, blue) - min(red, green, blue) > delta:
                colored += 1
    return total > 0 and (colored / total) >= ratio


def analyze_pdf(input_pdf: Path, thumbs_dir: Path, job_id: str, mode: str = "balanced") -> dict:
    try:
        document = fitz.open(input_pdf)
    except Exception as exc:
        raise ValueError("PDF_CORRUPTED") from exc

    try:
        if document.is_encrypted:
            raise PermissionError("PDF_ENCRYPTED")
        if document.page_count <= 0:
            raise ValueError("PDF_CORRUPTED")

        pages = []
        detected_color_pages = []
        matrix = fitz.Matrix(1.2, 1.2)
        for page_index in range(document.page_count):
            page_number = page_index + 1
            page = document.load_page(page_index)
            pix = page.get_pixmap(matrix=matrix, alpha=False)
            thumbnail_path = thumbs_dir / f"page-{page_number}.jpg"
            pix.save(thumbnail_path)
            is_color = _is_color_page(pix, mode)
            if is_color:
                detected_color_pages.append(page_number)
            pages.append({
                "pageNumber": page_number,
                "isColorDetected": is_color,
                "thumbnailUrl": f"/api/files/{job_id}/thumbs/page-{page_number}.jpg",
            })
        return {"totalPages": document.page_count, "detectedColorPages": detected_color_pages, "pages": pages}
    finally:
        document.close()
