# Testing Checklist — Arnol Works MVP

## 1. Platform pages

- [ ] `/` loads homepage.
- [ ] `/tools` loads tools directory.
- [ ] `/tools/pdf-color-bw-splitter` loads PDF tool.
- [ ] `/projects` loads placeholder.
- [ ] `/about` loads placeholder.
- [ ] `/contact` loads placeholder.
- [ ] Header navigation works.
- [ ] Footer visible.
- [ ] Mobile layout usable.

## 2. Upload validation

- [ ] PDF file can be selected.
- [ ] Non-PDF file is rejected.
- [ ] File over 50MB is rejected.
- [ ] Selected file name is shown.
- [ ] Error message is readable.

## 3. Analyze endpoint

- [ ] `GET /health` returns ok.
- [ ] `POST /api/pdf/analyze` accepts valid PDF.
- [ ] Invalid file type returns error.
- [ ] Oversized file returns error.
- [ ] Encrypted PDF returns error.
- [ ] Corrupted PDF returns error.
- [ ] Analyze returns jobId.
- [ ] Analyze returns totalPages.
- [ ] Analyze returns pages array.
- [ ] Thumbnail URLs load.

## 4. Color detection

Test with several PDFs:

- [ ] All black-white document.
- [ ] Document with one colored image.
- [ ] Document with colored chart.
- [ ] Document with tiny logo.
- [ ] Document with blue hyperlinks.
- [ ] Scanned yellowish document.

Expected:

- [ ] Detection is helpful but not treated as final truth.
- [ ] User can correct wrong detection.

## 5. Manual selection

- [ ] Detected color pages selected by default.
- [ ] User can check a page.
- [ ] User can uncheck a page.
- [ ] Selected count updates.
- [ ] “Gunakan hasil deteksi otomatis” works.
- [ ] “Pilih semua” works.
- [ ] “Hapus semua” works.

## 6. Manual page range parser

Valid cases:

- [ ] `1`
- [ ] `1,3,5`
- [ ] `1, 3, 8-12, 20`
- [ ] `5-5`
- [ ] Duplicate values are removed.

Invalid cases:

- [ ] `abc`
- [ ] `1--3`
- [ ] `10-2`
- [ ] `0`
- [ ] Page greater than total pages.

## 7. Split endpoint

- [ ] `POST /api/pdf/split` accepts valid jobId and selectedColorPages.
- [ ] Invalid jobId returns JOB_NOT_FOUND.
- [ ] Out-of-range page returns INVALID_PAGE_SELECTION.
- [ ] Duplicate pages do not break split.
- [ ] Empty selectedColorPages handled.
- [ ] All pages selected handled.

## 8. Output PDFs

- [ ] Color PDF contains selected color pages only.
- [ ] BW PDF contains remaining pages only.
- [ ] Page order is preserved.
- [ ] PDF layout is preserved.
- [ ] Text remains selectable if original text was selectable.
- [ ] Page size is preserved.
- [ ] Output files can be opened by common PDF viewers.

## 9. Frontend result flow

- [ ] User can click “Pisahkan PDF”.
- [ ] Loading state appears.
- [ ] Success state appears.
- [ ] Download buttons work.
- [ ] User can process another PDF.

## 10. Security/basic robustness

- [ ] File serving rejects path traversal.
- [ ] Backend does not expose absolute paths.
- [ ] Temporary files are stored under job folder.
- [ ] Cleanup strategy exists.
- [ ] No secrets committed.

## 11. Portfolio quality

- [ ] Homepage clearly says Arnol Works.
- [ ] Website does not look like only one PDF tool.
- [ ] Tools architecture feels expandable.
- [ ] README explains project well.
- [ ] MVP is presentable to client/recruiter.

