# PDF Processing Spec — Arnol Works

## 1. Important principle

Do not convert final output PDF pages into images.

Rendering is only used for:

- Thumbnail preview.
- Color detection analysis.

Final split output must copy original PDF pages using pypdf or equivalent so the original layout, text, font, vector objects, and page size are preserved.

## 2. Libraries

Recommended:

- PyMuPDF (`fitz`) for opening/rendering PDF pages.
- Pillow for image pixel processing if needed.
- pypdf for splitting original PDF pages.

## 3. Page numbering

User-facing and API page numbers are 1-based.

Internal library indexes are usually 0-based.

Always convert carefully:

```text
user page 1 = internal index 0
```

## 4. Analyze flow

For each page:

1. Render page to pixmap/image at low/medium resolution.
2. Save thumbnail image.
3. Analyze pixels to decide whether page is likely colored.
4. Return result.

## 5. Suggested color detection algorithm MVP

A pixel is considered colored when RGB channels differ enough.

For each sampled pixel:

```text
max(r, g, b) - min(r, g, b) > color_delta_threshold
```

Also ignore near-white pixels and near-black/gray noise if needed.

Suggested default thresholds:

Balanced mode:

```text
color_delta_threshold = 18
min_saturation_like_pixels_ratio = 0.002
sample_step = 3 or 4
```

Meaning: if more than around 0.2% sampled pixels look meaningfully colored, mark page as color.

Strict mode:

```text
color_delta_threshold = 10
min_saturation_like_pixels_ratio = 0.0005
```

Print-saving mode:

```text
color_delta_threshold = 25
min_saturation_like_pixels_ratio = 0.005
```

These thresholds are starting points and can be tuned.

## 6. Why manual review is required

Automatic detection can be wrong in cases like:

- Tiny colored logo.
- Blue hyperlink.
- Slightly yellow scanned paper.
- Color noise from scanned pages.
- Thin colored chart lines.
- Stamps/signatures.

Therefore:

- Backend detection is only recommendation.
- Frontend must let user manually select pages.
- Backend split must use `selectedColorPages`, not `detectedColorPages`.

## 7. Thumbnail generation

Thumbnail requirements:

- JPG or PNG.
- Small enough for fast loading.
- Good enough for user to identify content.
- Suggested width: 300-500px.
- Store under job folder:

```text
thumbs/page-1.jpg
thumbs/page-2.jpg
```

## 8. PDF split logic

Input:

- Original file path.
- totalPages.
- selectedColorPages.

Process:

1. Normalize selectedColorPages.
2. Remove duplicates.
3. Validate range.
4. Convert selected pages to set.
5. Loop original pages.
6. If page number in selected set → add to color writer.
7. Else → add to bw writer.
8. Save output files.

## 9. Empty output handling

If no color pages selected:

- Do not create color PDF, or return null URL.
- Create bw PDF with all pages.

If all pages selected as color:

- Create color PDF with all pages.
- Return bwPdfUrl null or omit bw file.

Preferred API behavior:

- Return nullable URLs.
- Return counts for both.

## 10. Error cases

Handle:

- PDF cannot be opened.
- PDF encrypted/password protected.
- PDF has zero pages.
- File exceeds size limit.
- Selected page out of range.
- Job folder missing.

## 11. Performance notes

MVP can process synchronously, but avoid rendering too high resolution.

Suggested limits:

- Max file size: 50MB.
- Optional max pages: 300 pages for MVP if needed.
- Render scale: around 1.0 to 1.5.
- Pixel sampling step: analyze every 3rd or 4th pixel to improve speed.

## 12. Privacy notes

- Files are stored temporarily only.
- Add cleanup for old jobs.
- UI should tell user files are not stored permanently.

