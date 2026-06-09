# Codex Tasks — Arnol Works MVP

Work sequentially. Do not skip phases. Do not add features outside the current task.

## Phase 0 — Project foundation

### Task 0.1 — Create monorepo structure

Create base repository structure:

```text
apps/web
apps/api
docs
```

Add:

- Root README.md.
- AGENTS.md.
- .gitignore.
- docs folder with existing docs.

Acceptance criteria:

- Repository structure exists.
- README explains project.
- No app implementation yet beyond skeleton.

### Task 0.2 — Setup frontend app

Create Next.js app in `apps/web`.

Use:

- TypeScript.
- App Router.
- Tailwind CSS.

Acceptance criteria:

- `npm run dev` starts frontend.
- Homepage displays Arnol Works placeholder.
- Basic global layout exists.

### Task 0.3 — Setup backend app

Create FastAPI app in `apps/api`.

Add:

- `GET /health`.
- requirements.txt.
- Local run instructions.

Acceptance criteria:

- Backend runs locally.
- `/health` returns JSON ok.

## Phase 1 — Platform UI foundation

### Task 1.1 — Build global layout

Implement:

- Header/nav.
- Footer.
- Main container.
- Basic responsive layout.

Routes:

- `/`
- `/tools`
- `/projects`
- `/about`
- `/contact`

Acceptance criteria:

- All routes render.
- Navigation works.
- Mobile layout does not break.

### Task 1.2 — Build tool registry

Create `tools-registry.ts`.

Add PDF tool as first available tool.

Add optional coming soon placeholder tools only if useful, but do not implement them.

Acceptance criteria:

- `/tools` reads from registry.
- Tool card links to `/tools/pdf-color-bw-splitter`.
- Adding a new tool later requires minimal changes.

### Task 1.3 — Homepage content

Build homepage sections:

- Hero.
- Featured tool.
- Portfolio positioning.
- CTA to tools/projects.

Acceptance criteria:

- Branding says Arnol Works.
- Copy does not imply website is only PDF tool.

## Phase 2 — PDF tool frontend shell

### Task 2.1 — Create PDF splitter page shell

Create route:

```text
/tools/pdf-color-bw-splitter
```

Add:

- Intro copy.
- Upload area placeholder.
- Explanation of automatic detection + manual review.

Acceptance criteria:

- Page renders correctly.
- User understands purpose of tool.

### Task 2.2 — Implement file upload UI

Add:

- File picker.
- Drag/drop optional.
- File name preview.
- Client-side validation for PDF and size.
- Button “Analisis PDF”.

Acceptance criteria:

- Non-PDF rejected in UI.
- File >50MB rejected in UI.
- Selected file visible.

## Phase 3 — Backend PDF analyze

### Task 3.1 — Backend storage service

Implement temporary job storage.

Responsibilities:

- Create job folder UUID.
- Save input PDF.
- Create thumbs and outputs folders.
- Safe path helpers.

Acceptance criteria:

- Uploaded file can be saved under temp job folder.
- No path traversal risk in helper functions.

### Task 3.2 — Implement analyze endpoint skeleton

Create:

```text
POST /api/pdf/analyze
```

For now:

- Accept multipart file.
- Validate file type and size.
- Save to job folder.
- Return placeholder jobId.

Acceptance criteria:

- Endpoint accepts PDF.
- Rejects non-PDF.
- Rejects oversized file.

### Task 3.3 — Implement real PDF analysis

Use PyMuPDF to:

- Open PDF.
- Reject encrypted/corrupted PDF.
- Render thumbnails.
- Detect color pages.
- Return JSON per API contract.

Acceptance criteria:

- Analyze returns totalPages.
- Analyze returns detectedColorPages.
- Analyze returns thumbnail URLs.
- Thumbnail URLs can be opened.

### Task 3.4 — Implement file serving endpoint

Create:

```text
GET /api/files/{jobId}/{filePath:path}
```

Acceptance criteria:

- Serves thumbnails.
- Rejects path traversal.
- Returns 404 for missing files.

## Phase 4 — Connect frontend analyze flow

### Task 4.1 — API client

Create frontend API client.

Acceptance criteria:

- Base URL configurable by env.
- Analyze request works from frontend.

### Task 4.2 — Analyze UI states

Implement states:

- idle.
- uploading/analyzing.
- ready.
- error.

Acceptance criteria:

- User sees loading while analyze runs.
- Errors are readable.
- Analyze result displayed.

### Task 4.3 — Page review grid

Display:

- Thumbnail.
- Page number.
- Checkbox.
- Detection badge.

Acceptance criteria:

- Detected color pages are selected by default.
- User can check/uncheck pages.
- Selected page count updates.

### Task 4.4 — Manual page range input

Implement parser for input like:

```text
1, 3, 8-12, 20
```

Acceptance criteria:

- Valid input updates selected pages.
- Invalid input shows error.
- Duplicates removed.
- Out-of-range pages rejected.

### Task 4.5 — Quick selection controls

Add buttons:

- Gunakan hasil deteksi otomatis.
- Pilih semua.
- Hapus semua.

Acceptance criteria:

- Buttons update selected pages correctly.

## Phase 5 — Backend split

### Task 5.1 — Implement split service

Use pypdf to split original PDF pages.

Acceptance criteria:

- Output PDF preserves original pages.
- selectedColorPages go to color PDF.
- Remaining pages go to bw PDF.

### Task 5.2 — Implement split endpoint

Create:

```text
POST /api/pdf/split
```

Acceptance criteria:

- Accepts jobId and selectedColorPages.
- Validates job exists.
- Validates page numbers.
- Returns download URLs and counts.

## Phase 6 — Connect frontend split/download flow

### Task 6.1 — Split action UI

When user clicks “Pisahkan PDF”:

- Send selectedColorPages.
- Show loading.
- Show result.

Acceptance criteria:

- Split request works.
- Download buttons appear.

### Task 6.2 — Result UI

Show:

- Success message.
- Color page count.
- BW page count.
- Download buttons.
- Button to process another PDF.

Acceptance criteria:

- User can download generated PDFs.
- User can reset flow.

## Phase 7 — Error handling, cleanup, and polish

### Task 7.1 — Consistent backend errors

Implement standard error response.

Acceptance criteria:

- Error response follows API contract.
- Frontend maps common errors to readable copy.

### Task 7.2 — Cleanup temporary files

Implement cleanup strategy for old jobs.

MVP options:

- Cleanup on app startup.
- Cleanup before creating new job.
- Delete folders older than configured TTL.

Acceptance criteria:

- Old temporary files do not grow forever.

### Task 7.3 — UI polish

Polish:

- Responsive layout.
- Empty states.
- Better spacing.
- Basic accessibility.

Acceptance criteria:

- MVP feels presentable as portfolio.

## Phase 8 — Documentation and final review

### Task 8.1 — Update README

Add:

- How to install.
- How to run frontend.
- How to run backend.
- Env vars.
- Known limitations.

### Task 8.2 — Manual testing

Use `docs/TESTING_CHECKLIST.md`.

Acceptance criteria:

- Main flow tested.
- Edge cases tested.
- Known bugs documented.

