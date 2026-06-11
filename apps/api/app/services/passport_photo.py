from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile

from PIL import Image, ImageOps

SUPPORTED_IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}

PHOTO_SIZES = {
    "2x3": (200, 300),
    "3x4": (300, 400),
    "4x6": (400, 600),
}

BACKGROUND_COLORS = {
    "merah": (255, 0, 0),
    "biru": (0, 0, 255),
    "putih": (255, 255, 255),
}


def _open_image(path: Path) -> Image.Image:
    try:
        image = Image.open(path)
        return ImageOps.exif_transpose(image)
    except Exception as exc:
        raise ValueError("INVALID_IMAGE") from exc


def _crop_center(image: Image.Image, target_ratio: float) -> Image.Image:
    """Crop image to target aspect ratio from center."""
    current_ratio = image.width / image.height
    if current_ratio > target_ratio:
        new_width = int(image.height * target_ratio)
        offset = (image.width - new_width) // 2
        return image.crop((offset, 0, offset + new_width, image.height))
    else:
        new_height = int(image.width / target_ratio)
        offset = (image.height - new_height) // 2
        return image.crop((0, offset, image.width, offset + new_height))


def _make_passport_photo(
    image: Image.Image,
    size_key: str,
    bg_color_key: str,
    use_rembg: bool = True,
) -> Image.Image:
    if size_key not in PHOTO_SIZES:
        raise ValueError("INVALID_SIZE")
    if bg_color_key not in BACKGROUND_COLORS:
        raise ValueError("INVALID_BG_COLOR")

    target_w, target_h = PHOTO_SIZES[size_key]
    dpi_scale = 4
    render_w = target_w * dpi_scale
    render_h = target_h * dpi_scale
    bg_rgb = BACKGROUND_COLORS[bg_color_key]
    target_ratio = target_w / target_h

    if use_rembg:
        try:
            from rembg import remove as rembg_remove
            image = rembg_remove(image)
        except ImportError:
            pass

    cropped = _crop_center(image, target_ratio)
    resized = cropped.resize((render_w, render_h), Image.Resampling.LANCZOS)

    background = Image.new("RGBA", (render_w, render_h), (*bg_rgb, 255))
    if resized.mode == "RGBA":
        background.paste(resized, (0, 0), resized)
    else:
        background.paste(resized, (0, 0))

    return background.convert("RGB")


def _create_print_sheet(photo: Image.Image, size_key: str) -> Image.Image:
    """Create a 4x6 inch print sheet (4R photo paper) filled with passport photos."""
    dpi = 300
    sheet_w = int(6 * dpi)
    sheet_h = int(4 * dpi)
    photo_w, photo_h = photo.size

    cols = sheet_w // photo_w
    rows = sheet_h // photo_h
    if cols < 1:
        cols = 1
    if rows < 1:
        rows = 1

    sheet = Image.new("RGB", (sheet_w, sheet_h), (255, 255, 255))
    offset_x = (sheet_w - cols * photo_w) // 2
    offset_y = (sheet_h - rows * photo_h) // 2

    for r in range(rows):
        for c in range(cols):
            sheet.paste(photo, (offset_x + c * photo_w, offset_y + r * photo_h))

    return sheet


def generate_passport_photo(
    input_path: Path,
    output_dir: Path,
    size_key: str = "3x4",
    bg_color_key: str = "merah",
) -> dict:
    if input_path.suffix.lower() not in SUPPORTED_IMAGE_EXTENSIONS:
        raise ValueError("INVALID_IMAGE")

    image = _open_image(input_path)
    photo = _make_passport_photo(image, size_key, bg_color_key, use_rembg=True)

    single_path = output_dir / f"pas-foto-{size_key}.jpg"
    photo.save(single_path, format="JPEG", quality=95)

    sheet = _create_print_sheet(photo, size_key)
    sheet_path = output_dir / f"lembar-cetak-{size_key}.jpg"
    sheet.save(sheet_path, format="JPEG", quality=95)

    output_zip = output_dir / "pas-foto.zip"
    with ZipFile(output_zip, "w", ZIP_DEFLATED) as archive:
        archive.write(single_path, single_path.name)
        archive.write(sheet_path, sheet_path.name)

    return {
        "sizeKey": size_key,
        "bgColor": bg_color_key,
        "outputSize": output_zip.stat().st_size,
        "files": {
            "single": f"outputs/{single_path.name}",
            "sheet": f"outputs/{sheet_path.name}",
            "zip": f"outputs/{output_zip.name}",
        },
    }
