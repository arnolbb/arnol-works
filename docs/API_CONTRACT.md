# API Contract — Arnol Works MVP

Base URL local example:

```text
http://localhost:8000
```

Frontend should read backend base URL from environment variable, for example:

```text
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

## 1. Health check

### `GET /health`

Response 200:

```json
{
  "status": "ok",
  "service": "arnol-works-api"
}
```

## 2. Analyze PDF

### `POST /api/pdf/analyze`

Content-Type: `multipart/form-data`

Form fields:

| Field | Type | Required | Description |
|---|---|---:|---|
| file | File | yes | PDF file to analyze |
| mode | string | no | `strict`, `balanced`, or `print-saving`. Default: `balanced` |

Validation:

- Only PDF.
- Max file size 50MB.
- Reject encrypted/password protected PDF.
- Reject corrupted/unreadable PDF.

Response 200:

```json
{
  "jobId": "7b35a2be-9d6a-4f0c-9f6a-2f6f28bb39e7",
  "totalPages": 4,
  "detectedColorPages": [2, 4],
  "pages": [
    {
      "pageNumber": 1,
      "isColorDetected": false,
      "thumbnailUrl": "/api/files/7b35a2be-9d6a-4f0c-9f6a-2f6f28bb39e7/thumbs/page-1.jpg"
    },
    {
      "pageNumber": 2,
      "isColorDetected": true,
      "thumbnailUrl": "/api/files/7b35a2be-9d6a-4f0c-9f6a-2f6f28bb39e7/thumbs/page-2.jpg"
    }
  ]
}
```

Error response:

```json
{
  "error": {
    "code": "PDF_ENCRYPTED",
    "message": "PDF ini terkunci atau membutuhkan password.",
    "details": null
  }
}
```

## 3. Split PDF

### `POST /api/pdf/split`

Content-Type: `application/json`

Request:

```json
{
  "jobId": "7b35a2be-9d6a-4f0c-9f6a-2f6f28bb39e7",
  "selectedColorPages": [2, 4]
}
```

Rules:

- `selectedColorPages` uses 1-based page numbers.
- Empty array is allowed. In that case color file may be omitted or generated as empty only if implementation supports it. Preferred MVP behavior: return `colorPdfUrl: null` and `colorPageCount: 0`.
- Page number must be between 1 and totalPages.
- Duplicates should be removed.
- Pages should be sorted before split.

Response 200:

```json
{
  "jobId": "7b35a2be-9d6a-4f0c-9f6a-2f6f28bb39e7",
  "colorPdfUrl": "/api/files/7b35a2be-9d6a-4f0c-9f6a-2f6f28bb39e7/outputs/color-pages.pdf",
  "bwPdfUrl": "/api/files/7b35a2be-9d6a-4f0c-9f6a-2f6f28bb39e7/outputs/bw-pages.pdf",
  "colorPageCount": 2,
  "bwPageCount": 2
}
```

If no color pages selected:

```json
{
  "jobId": "7b35a2be-9d6a-4f0c-9f6a-2f6f28bb39e7",
  "colorPdfUrl": null,
  "bwPdfUrl": "/api/files/7b35a2be-9d6a-4f0c-9f6a-2f6f28bb39e7/outputs/bw-pages.pdf",
  "colorPageCount": 0,
  "bwPageCount": 4
}
```

## 4. File serving

### `GET /api/files/{jobId}/{filePath:path}`

Examples:

```text
/api/files/{jobId}/thumbs/page-1.jpg
/api/files/{jobId}/outputs/color-pages.pdf
/api/files/{jobId}/outputs/bw-pages.pdf
```

Rules:

- Must only serve files inside the specific job folder.
- Must reject `../` and path traversal attempts.
- Must return 404 if file does not exist.
- PDF downloads should use appropriate content type.

## 5. Error codes

| Code | HTTP | Meaning |
|---|---:|---|
| INVALID_FILE_TYPE | 400 | Uploaded file is not PDF |
| FILE_TOO_LARGE | 413 | File exceeds max size |
| PDF_ENCRYPTED | 400 | PDF needs password/encrypted |
| PDF_CORRUPTED | 400 | PDF cannot be opened/read |
| JOB_NOT_FOUND | 404 | Job ID does not exist or expired |
| INVALID_PAGE_SELECTION | 400 | Page selection is invalid |
| PROCESSING_FAILED | 500 | Unexpected processing failure |

