from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile

from PIL import Image, ImageOps

SUPPORTED_IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}


def _open_image(path: Path) -> Image.Image:
    try:
        image = Image.open(path)
        return ImageOps.exif_transpose(image)
    except Exception as exc:
        raise ValueError("INVALID_IMAGE") from exc


def remove_background(input_path: Path, output_path: Path) -> dict:
    if input_path.suffix.lower() not in SUPPORTED_IMAGE_EXTENSIONS:
        raise ValueError("INVALID_IMAGE")

    try:
        from rembg import remove as rembg_remove
    except ImportError:
        raise RuntimeError("rembg belum terinstall. Jalankan: pip install rembg[cpu]")

    image = _open_image(input_path)
    result = rembg_remove(image)
    result.save(output_path, format="PNG")

    return {
        "originalSize": input_path.stat().st_size,
        "outputSize": output_path.stat().st_size,
    }


def remove_background_batch(input_paths: list[Path], output_zip: Path) -> dict:
    if not input_paths:
        raise ValueError("NO_IMAGES")

    try:
        from rembg import remove as rembg_remove
    except ImportError:
        raise RuntimeError("rembg belum terinstall. Jalankan: pip install rembg[cpu]")

    original_size = 0
    output_size = 0

    with ZipFile(output_zip, "w", ZIP_DEFLATED) as archive:
        for index, input_path in enumerate(input_paths, start=1):
            if input_path.suffix.lower() not in SUPPORTED_IMAGE_EXTENSIONS:
                raise ValueError("INVALID_IMAGE")
            original_size += input_path.stat().st_size

            image = _open_image(input_path)
            result = rembg_remove(image)
            temp_output = output_zip.parent / f"no-bg-{index}.png"
            result.save(temp_output, format="PNG")
            output_size += temp_output.stat().st_size
            archive.write(temp_output, temp_output.name)
            temp_output.unlink(missing_ok=True)

    return {
        "imageCount": len(input_paths),
        "originalSize": original_size,
        "outputSize": output_zip.stat().st_size,
    }
