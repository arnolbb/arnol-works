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


def _save_optimized(image: Image.Image, output_path: Path, quality: int = 78) -> None:
    if output_path.suffix.lower() == ".png":
        image.save(output_path, optimize=True, compress_level=9)
        return

    if image.mode in {"RGBA", "LA", "P"}:
        background = Image.new("RGB", image.size, "white")
        if image.mode == "P":
            image = image.convert("RGBA")
        background.paste(image, mask=image.getchannel("A") if image.mode in {"RGBA", "LA"} else None)
        image = background
    else:
        image = image.convert("RGB")
    image.save(output_path, format="JPEG", quality=quality, optimize=True, progressive=True)


def compress_images(input_paths: list[Path], output_zip: Path) -> dict:
    if not input_paths:
        raise ValueError("NO_IMAGES")

    original_size = 0
    compressed_size = 0
    with ZipFile(output_zip, "w", ZIP_DEFLATED) as archive:
        for index, input_path in enumerate(input_paths, start=1):
            if input_path.suffix.lower() not in SUPPORTED_IMAGE_EXTENSIONS:
                raise ValueError("INVALID_IMAGE")
            original_size += input_path.stat().st_size
            image = _open_image(input_path)
            output_suffix = ".png" if input_path.suffix.lower() == ".png" else ".jpg"
            temp_output = output_zip.parent / f"compressed-{index}{output_suffix}"
            _save_optimized(image, temp_output)
            compressed_size += temp_output.stat().st_size
            archive.write(temp_output, temp_output.name)
            temp_output.unlink(missing_ok=True)
            image.close()

    reduction = max(0, round((1 - (compressed_size / original_size)) * 100)) if original_size else 0
    return {"imageCount": len(input_paths), "originalSize": original_size, "outputSize": output_zip.stat().st_size, "reductionPercent": reduction}


def resize_images(input_paths: list[Path], output_zip: Path, max_width: int = 1280) -> dict:
    if not input_paths:
        raise ValueError("NO_IMAGES")
    if max_width < 100 or max_width > 5000:
        raise ValueError("INVALID_SIZE")

    original_size = 0
    output_size = 0
    with ZipFile(output_zip, "w", ZIP_DEFLATED) as archive:
        for index, input_path in enumerate(input_paths, start=1):
            if input_path.suffix.lower() not in SUPPORTED_IMAGE_EXTENSIONS:
                raise ValueError("INVALID_IMAGE")
            original_size += input_path.stat().st_size
            image = _open_image(input_path)
            if image.width > max_width:
                next_height = max(1, round(image.height * (max_width / image.width)))
                image = image.resize((max_width, next_height), Image.Resampling.LANCZOS)
            output_suffix = ".png" if input_path.suffix.lower() == ".png" else ".jpg"
            temp_output = output_zip.parent / f"resized-{index}{output_suffix}"
            _save_optimized(image, temp_output, quality=82)
            output_size += temp_output.stat().st_size
            archive.write(temp_output, temp_output.name)
            temp_output.unlink(missing_ok=True)
            image.close()

    reduction = max(0, round((1 - (output_size / original_size)) * 100)) if original_size else 0
    return {"imageCount": len(input_paths), "originalSize": original_size, "outputSize": output_zip.stat().st_size, "reductionPercent": reduction, "maxWidth": max_width}
