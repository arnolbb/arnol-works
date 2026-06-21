# Arnol Works — Product Evolution Master Plan

> **Purpose:** Dokumen tunggal untuk melanjutkan pengembangan `arnolbb/arnol-works` menggunakan Codex.  
> Dokumen ini menggabungkan hasil review website publik, audit repository, backlog, roadmap, feature specs, release plan, testing checklist, dan changelog template.
>
> **Repository:** `https://github.com/arnolbb/arnol-works.git`  
> **Website:** `https://www.arnol.my.id/`  
> **Status dokumen:** Working plan / single source of truth untuk pengembangan pasca-MVP  
> **Owner:** Arnol Works  
> **Bahasa produk:** Indonesia, dengan istilah teknis English bila diperlukan.

---

## 1. Product Summary

Arnol Works adalah **portfolio interaktif + multi-tools platform** yang dibangun oleh Arnol. Produk ini tidak hanya menampilkan profil, tetapi juga menyediakan tools web yang berguna untuk workflow dokumen dan gambar sehari-hari.

### Current product positioning

> **Useful web tools and product experiments built by Arnol.**

Fokus produk saat ini:
- PDF tools
- Image tools
- Text utilities
- Small generators
- Product experiments / portfolio projects

### Current technical architecture

```text
apps/
├── web/                # Next.js 14 frontend
├── api/                # FastAPI backend
docs/                   # Product and technical documentation
```

### Current stack

| Layer | Current stack |
|---|---|
| Frontend | Next.js 14, React 18, TypeScript, Tailwind CSS |
| Backend | FastAPI, Uvicorn, Python 3.11 |
| PDF | PyMuPDF, pypdf |
| Image | Pillow |
| DOCX | python-docx |
| Deployment direction | Vercel for frontend, Cloud Run for backend |
| File processing | Local temporary job folders per request |

### Current active tools

- PDF Color / BW Splitter
- Compress PDF
- Merge PDF
- PDF to Word
- JPG / PNG to PDF
- PDF to JPG
- Compress Image
- Resize Image
- Remove Background
- Passport Photo Generator
- Word & Character Counter
- QR Code Generator

---

## 2. Audit Snapshot

## 2.1 What is already strong

1. **Product positioning is clear.**  
   Arnol Works already feels like a real utility platform, not an empty portfolio.

2. **The project has a practical, modular base.**  
   Frontend and backend are separated, tools are grouped by function, and the repository has a clean monorepo structure.

3. **The API has a reasonable first safety layer.**
   - Uploads are saved incrementally instead of being read fully into memory.
   - A per-file limit of 50 MB exists.
   - Job folders use UUIDs.
   - Download paths are checked to prevent path traversal.
   - API errors use a predictable JSON structure.

4. **The first unique product idea is strong.**  
   PDF Color / BW Splitter solves a specific real-world cost problem: separating color and black-and-white pages for printing.

5. **The website already proves full-stack capability.**  
   The public product demonstrates UI, upload flow, file processing, output generation, and download.

---

## 2.2 Main gaps to close

### Product / trust gaps
- Privacy and file retention are not yet represented as full public pages.
- The current “Sangat aman” copy is too absolute for a file-processing product.
- Users need clearer explanations about what happens to uploaded files.
- Portfolio proof is still lighter than the quality of the actual build.

### Repository / operational gaps
- `rembg` is used by Remove Background and Passport Photo tools but is not listed in `apps/api/requirements.txt`.
- Temporary files have a 24-hour TTL, but cleanup currently runs only at startup and before a new job is created.
- Batch tools can accept multiple files; total request size and number of files need stricter limits.
- Processing is synchronous; PDF/image operations need timeout and capacity safeguards before traffic grows.
- Production CORS configuration must be explicitly verified with `ALLOWED_ORIGINS`.
- SEO foundations should be expanded beyond the current global metadata.
- CI, automated tests, and release validation should be added before the tool catalog expands further.

### UX / portfolio gaps
- Homepage needs one more decisive primary CTA.
- Project pages should become real case studies.
- Tool output should give users clearer before/after results and relevant controls.
- Build Notes can become a high-value public product journal.
- Important pages need richer metadata, share previews, sitemap, robots, and structured data.

---

## 3. Source-Evidence Reference

Use these repository paths as the code evidence behind this plan.

| Area | Source path | Finding |
|---|---|---|
| Project structure | `README.md` | Documents `apps/web`, `apps/api`, and `docs` structure |
| Frontend stack | `apps/web/package.json` | Next.js 14, React 18, Tailwind CSS |
| Backend dependencies | `apps/api/requirements.txt` | FastAPI, PyMuPDF, pypdf, Pillow, python-docx; `rembg` is absent |
| Dynamic rembg import | `apps/api/app/services/background_remover.py` | Remove Background imports `rembg` at runtime |
| Backend CORS | `apps/api/app/main.py` | Uses `ALLOWED_ORIGINS`, defaults to localhost only |
| File job retention | `apps/api/app/services/storage.py` | Uses UUID job folders and 24-hour TTL; cleanup runs at startup / job creation |
| Upload flow | `apps/api/app/routes/pdf.py` | Streams upload in chunks, checks 50 MB per file, serves job outputs |
| PDF operations | `apps/api/app/services/document_tools.py` | PDF compression, merge, image-to-PDF, PDF-to-JPG |
| Docker deployment | `apps/api/Dockerfile` | Python 3.11 slim image, installs requirements, runs Uvicorn |
| Homepage / FAQ copy | `apps/web/app/page.tsx` | Current positioning, CTA, FAQ, and security wording |
| Global metadata | `apps/web/app/layout.tsx` | Basic global metadata exists; tool-level SEO should be added |

---

## 4. Product Principles

Every new feature should follow these principles.

1. **Useful before fancy**  
   Build only what solves a real workflow problem.

2. **Trust before growth**  
   For a file-processing website, clarity about privacy, retention, limits, and errors is part of the product.

3. **Small releases, visible value**  
   Ship focused improvements that users can immediately understand.

4. **Keep the core simple**  
   Do not add login, payment, database, queue systems, or cloud storage unless they solve a confirmed need.

5. **User control over automation**  
   Detection and automation should always allow manual review when accuracy matters.

6. **Portfolio proof matters**  
   Each major project should explain the problem, the build, the choices, and the output.

---

## 5. Product Goals for the Next Stage

## Primary goals

1. Make Arnol Works feel trustworthy enough for users to upload files.
2. Improve reliability before adding many new tools.
3. Turn existing projects into stronger portfolio proof.
4. Improve SEO and discoverability for individual tools.
5. Create a clear operating workflow for future improvements.

## Non-goals for this stage

Do **not** prioritize these unless there is a confirmed need:
- User accounts
- Paid subscription plans
- Permanent cloud storage for user files
- Complex admin dashboard
- Full PDF editor
- OCR pipeline
- Multi-region infrastructure
- Large queue system
- Native mobile app

---

## 6. Target Release Roadmap

## Phase 0 — Stabilize the current product

**Goal:** Make existing tools safer, more reliable, and easier to trust.

### Deliverables
- Fix `rembg` dependency and production verification.
- Introduce upload constraints for file count, total request size, and page count.
- Improve temporary file cleanup behavior.
- Add Privacy Policy, Terms of Use, and File Retention Policy.
- Replace absolute security wording with accurate product copy.
- Verify production CORS environment configuration.
- Add a shared error / progress UX baseline for all file tools.

### Exit criteria
- Remove Background and Passport Photo work in production.
- Expired files are unavailable after the retention period.
- Users can read how files are processed and when they are deleted.
- Batch uploads cannot exhaust the service with excessive files.
- All core tools have clear loading, success, error, retry, and empty states.

---

## Phase 1 — Strengthen portfolio and product clarity

**Goal:** Let visitors understand both the tools and Arnol’s building capability.

### Deliverables
- Improve About page with personal positioning and links.
- Improve Contact page with a collaboration CTA.
- Create first real case studies:
  - Arnol Works Platform
  - PDF Color / BW Splitter
  - KeyStrike
  - RetroWave
- Turn Build Notes into public articles.
- Improve homepage CTA hierarchy and tool discovery.
- Add screenshots, GIFs, or workflow visuals to projects.

### Exit criteria
- A recruiter or potential client can understand what Arnol builds in under one minute.
- Each flagship project has a documented problem, solution, stack, and outcome.
- Website feels like a living product portfolio, not just a tool directory.

---

## Phase 2 — SEO and discovery

**Goal:** Make individual tools easier to find and share.

### Deliverables
- Unique metadata per page/tool.
- `sitemap.ts`.
- `robots.ts`.
- Open Graph / social preview images.
- Canonical URLs.
- JSON-LD structured data for WebApplication / SoftwareApplication.
- Privacy-friendly analytics event tracking.
- Search/filter for the tools directory.

### Exit criteria
- Every public tool has a unique title and description.
- Search engines can crawl all public routes correctly.
- Sharing a tool link shows a useful preview.

---

## Phase 3 — Tool experience upgrades

**Goal:** Improve the quality of existing tools before adding many new ones.

### Deliverables
- Compress PDF: quality presets and savings summary.
- Merge PDF: reorder files, remove file, preview ordering.
- JPG/PNG to PDF: order controls, page size, orientation, margins.
- QR Code Generator: PNG/SVG download, correction level, test preview.
- PDF to Word: clear limitations and output expectations.
- Image tools: original vs result size summary, file list and batch feedback.
- PDF Splitter: stronger review interface and page-range input validation.

### Exit criteria
- Core tools provide relevant controls instead of only upload → download.
- User sees measurable outcome: file size, count, pages, or quality result.
- Errors are understandable and actionable.

---

## Phase 4 — Engineering quality and operational maturity

**Goal:** Make future development safer and repeatable.

### Deliverables
- Automated frontend lint/build checks.
- Automated backend tests.
- CI workflow on push and pull request.
- Dependency review / security scan.
- Health check monitoring.
- Structured server logging with job IDs.
- Performance and error observability.
- Release checklist.

### Exit criteria
- A broken build cannot be merged silently.
- Important processing failures are traceable by job ID.
- Each release can be validated consistently.

---

## 7. Prioritized Backlog

Priority definitions:
- **P0:** Must fix before promoting or growing usage.
- **P1:** High-value improvement for trust, portfolio, UX, or discovery.
- **P2:** Valuable enhancement after P0/P1 are stable.
- **P3:** Idea bank / later exploration.

## P0 — Reliability, safety, and trust

| ID | Backlog item | Scope | Acceptance criteria |
|---|---|---|---|
| AW-001 | Add `rembg` to backend dependencies | Backend / Docker | `requirements.txt` includes tested `rembg[cpu]` version; Remove Background and Passport Photo work in production |
| AW-002 | Verify Cloud Run resources for rembg | Deployment | Memory, timeout, and startup are tested with real image requests; failure mode is documented |
| AW-003 | Add maximum file count for batch tools | Backend | Batch endpoints reject requests over a configured file-count limit with a clear error |
| AW-004 | Add maximum total upload size per request | Backend | Server rejects total upload payload over a configured threshold |
| AW-005 | Add PDF page-count limits | Backend | Heavy PDF endpoints reject documents over a safe page limit |
| AW-006 | Add processing timeout / request safeguards | Backend / Deployment | Long-running requests fail safely with a helpful response |
| AW-007 | Improve file expiry enforcement | Backend | Download endpoint rejects expired jobs; cleanup can run independently of new user jobs |
| AW-008 | Add Privacy Policy | Website | Public `/privacy` page explains collection, processing, retention, and deletion |
| AW-009 | Add Terms of Use | Website | Public `/terms` page explains acceptable use, limits, and disclaimer |
| AW-010 | Add File Retention Policy | Website / Docs | Public page or privacy section defines retention duration and cleanup behavior |
| AW-011 | Replace absolute security copy | Website | Replace “Sangat aman” with accurate, non-absolute wording |
| AW-012 | Verify production CORS | Backend / Deploy | `ALLOWED_ORIGINS` includes production domains and allows only intended origins |
| AW-013 | Shared loading / error / retry UX | Frontend | Every upload tool has progress, error message, retry, reset, and disabled submit state |

## P1 — Portfolio, UX, and SEO

| ID | Backlog item | Scope | Acceptance criteria |
|---|---|---|---|
| AW-014 | Improve About page | Website | Explains Arnol’s role, focus, strengths, and includes GitHub/LinkedIn/email |
| AW-015 | Improve Contact page | Website | Has clear collaboration CTA and contact pathways |
| AW-016 | Homepage CTA hierarchy | Website | One primary CTA: `Pilih Tool` or `Lihat Tools`; portfolio CTA remains secondary |
| AW-017 | Create Arnol Works case study | Content / Website | Problem, solution, architecture, screenshots, stack, lessons, live links |
| AW-018 | Create PDF Splitter case study | Content / Website | Explains print-cost problem, detection approach, manual override, constraints |
| AW-019 | Create KeyStrike case study | Content / Website | Explains user experience, game loop, design decisions, live link |
| AW-020 | Create RetroWave case study | Content / Website | Explains game mechanics, visual direction, stack, live link |
| AW-021 | Turn Build Notes into article pages | Content / Website | At least 3 publishable build notes with dates and related project links |
| AW-022 | Add project screenshots/GIFs | Website | Each flagship project includes real visual proof |
| AW-023 | Per-tool metadata | SEO | Every tool has unique title, description, canonical URL, OG configuration |
| AW-024 | Add sitemap and robots | SEO | `sitemap.ts` and `robots.ts` exist and include public routes |
| AW-025 | Add structured data | SEO | Valid JSON-LD for website and tool pages |
| AW-026 | Add privacy-friendly analytics | Product | Track tool open, upload start, success, failure, download without storing file contents |
| AW-027 | Tool directory search/filter | Frontend | Users can filter tools by category and search title/keyword |
| AW-028 | Footer legal/navigation upgrade | Website | Footer links to Privacy, Terms, About, Contact, and key tools |

## P2 — Tool improvements

| ID | Backlog item | Scope | Acceptance criteria |
|---|---|---|---|
| AW-029 | Compress PDF presets | Tool UX | Balanced / High Quality / Smallest File options with clear result summary |
| AW-030 | Merge PDF reorder UI | Tool UX | Drag/reorder, remove, file count, and final order are visible before submit |
| AW-031 | JPG/PNG to PDF controls | Tool UX | Order, A4/Letter/custom page, orientation, margins, fit/crop options |
| AW-032 | QR export upgrades | Tool UX | PNG and SVG download, error correction option, scannable preview |
| AW-033 | PDF to Word expectation copy | Tool UX | States that text PDFs work best; layout may differ for scans/complex files |
| AW-034 | Batch image result summary | Tool UX | Shows original size, output size, file count, and download result |
| AW-035 | PDF to JPG export options | Tool UX | DPI/quality option and page-selection option |
| AW-036 | Splitter review polish | Tool UX | Better page range parsing, select all, clear all, reset detection, stronger thumbnail state |
| AW-037 | Tool result history in browser | Frontend | Optional local-only session history without permanent backend storage |
| AW-038 | Download expiry notice | Tool UX | Results clearly show expected expiry time and a “download now” reminder |

## P3 — Later ideas

| ID | Backlog item | Notes |
|---|---|---|
| AW-039 | Optional account system | Only after a real need for saved history/favorites exists |
| AW-040 | Favorite tools | Can be local browser storage first |
| AW-041 | Premium / high-limit processing | Only after stable demand and cost model |
| AW-042 | Queue-based job processing | Add only when synchronous processing becomes a bottleneck |
| AW-043 | Cloud object storage | Add only when local temporary storage is insufficient |
| AW-044 | OCR tools | Separate feature, high complexity and cost |
| AW-045 | More language support | Start only when content and UX are mature in Indonesian |
| AW-046 | Developer API | Only after stable public tool contracts exist |

---

## 8. Feature Specification A — Trust, Privacy, and File Lifecycle

## Objective

Make users comfortable uploading documents by communicating clearly how files are handled and by enforcing real retention behavior.

## User problem

Users hesitate to upload personal documents because they do not know:
- Where files go.
- How long files are kept.
- Whether files are shared.
- What happens if they forget to download output.

## Required pages

### `/privacy`

Must explain:
- What data is processed.
- That files are uploaded only to perform the requested tool action.
- That files are not intended as permanent storage.
- The standard retention window.
- That security controls reduce risk but no system should promise absolute security.
- Basic log/analytics behavior.
- Contact method for privacy questions.

### `/terms`

Must explain:
- Acceptable use.
- User responsibility for their own files.
- Unsupported or prohibited content categories if applicable.
- Service availability disclaimer.
- File-size and processing limits.
- No guarantee of exact output for all file types/layouts.

### `/file-retention` (or section inside `/privacy`)

Must explain:
- Standard deletion target: for example, 24 hours after job creation.
- Download links expire with the job.
- Users should download output immediately.
- The product does not offer permanent storage.

## Backend requirements

1. Each job must store a creation timestamp.
2. `safe_job_path` or file-serving logic must deny access to expired jobs.
3. Cleanup must run:
   - on app startup,
   - on job creation,
   - and via an independent scheduled trigger.
4. Cleanup failures must be logged.
5. The retention TTL must be configurable through environment variables.

Suggested environment variables:

```env
JOB_TTL_SECONDS=86400
MAX_FILE_SIZE_BYTES=52428800
MAX_TOTAL_UPLOAD_BYTES=104857600
MAX_BATCH_FILES=10
MAX_PDF_PAGES=200
ALLOWED_ORIGINS=https://arnol.my.id,https://www.arnol.my.id
```

## Frontend requirements

- Tool result pages show: “Hasil akan tersedia sementara. Download sekarang.”
- Do not state “Sangat aman.”
- Use wording:

> File diproses sementara untuk menyelesaikan permintaan Anda. Kami tidak menyediakan penyimpanan file permanen. Hasil dapat dihapus otomatis setelah masa retensi berakhir.

## Definition of done

- Public policy pages are linked from the footer.
- Expired result URLs return a clear 404/410-style JSON error.
- Scheduled cleanup is tested in staging or local simulation.
- Homepage FAQ uses accurate security language.

---

## 9. Feature Specification B — Upload and Processing Hardening

## Objective

Prevent a small number of heavy requests from exhausting the backend.

## Rules

| Rule | Default proposal | Applies to |
|---|---:|---|
| Max single file | 50 MB | All file tools |
| Max total request | 100 MB | Multi-file tools |
| Max batch file count | 10 | Image/PDF batch tools |
| Max PDF page count | 200 | PDF analysis / split / convert |
| Max job lifetime | 24 hours | All jobs |
| Processing timeout | Configure at deploy layer | Heavy endpoints |
| Concurrent heavy jobs | Start conservative | Cloud Run / backend scaling |

## Endpoint behavior

For each rejected request:
- Return a stable error code.
- Return a user-friendly Indonesian message.
- Include an actionable limit, for example:  
  `Maksimal 10 file untuk sekali proses.`

Suggested error codes:

```text
FILE_TOO_LARGE
TOTAL_UPLOAD_TOO_LARGE
TOO_MANY_FILES
PDF_TOO_MANY_PAGES
PROCESSING_TIMEOUT
JOB_EXPIRED
DEPENDENCY_MISSING
INVALID_FILE_TYPE
INVALID_IMAGE
PDF_ENCRYPTED
PDF_CORRUPTED
```

## Implementation notes

- Track total bytes while saving batch uploads.
- Validate before expensive PDF rendering when possible.
- Limit image dimensions to avoid decompression bombs.
- Ensure temporary files are removed if validation fails halfway through a batch.
- Log `job_id`, endpoint, elapsed milliseconds, result state, and error code.
- Do not log uploaded file contents.

## Definition of done

- All tool endpoints enforce shared limits.
- A batch upload cannot exceed either count or total-size limits.
- User receives understandable errors.
- Failed jobs do not leave unnecessary files behind.

---

## 10. Feature Specification C — Portfolio and Case Studies

## Objective

Turn Arnol Works from a tool directory into proof of product-building ability.

## New pages

```text
/projects/arnol-works
/projects/pdf-color-bw-splitter
/projects/keystrike
/projects/retrowave
/notes/[slug]
```

## Required case study structure

1. Project overview
2. User problem
3. Product solution
4. Target user
5. Key features
6. Screenshots / GIF / interaction images
7. Tech stack
8. Architecture diagram or simple flow
9. Challenges and decisions
10. What was learned
11. Live demo
12. Repository link when appropriate

## Required copy angle

### Arnol Works
Focus on:
- Portfolio that doubles as useful tools.
- Modular tool registry.
- Next.js + FastAPI split.
- File processing lifecycle.
- Product principle: useful before fancy.

### PDF Color / BW Splitter
Focus on:
- Print cost problem.
- Auto-detection is not always perfect.
- User manual override is a core trust feature.
- Output preserves original PDF pages rather than converting to images.

## About page requirements

Include:
- Arnol’s name and builder positioning.
- Focus: useful web tools, mini SaaS, product experiments, AI-assisted building.
- Current interests / strengths.
- GitHub, email, LinkedIn or other professional link.
- CTA: “Punya ide produk atau ingin berkolaborasi?”

## Definition of done

- At least three case studies are publicly available.
- Every flagship project has at least 2 visual proof assets.
- About and Contact pages clearly indicate who built the product and how to reach them.

---

## 11. Feature Specification D — SEO and Sharing Foundations

## Objective

Make each public tool independently discoverable and easy to share.

## Requirements

### Global
- `metadataBase`
- Website title template
- Canonical URLs
- Favicon / app icons
- `sitemap.ts`
- `robots.ts`
- 404 page
- Open Graph defaults

### Tool pages
Each tool needs:
- Unique `title`
- Unique `description`
- Canonical URL
- Open Graph title/description/image
- JSON-LD `SoftwareApplication` or `WebApplication`
- FAQ schema only where a visible FAQ exists

### Example metadata pattern

```ts
export const metadata = {
  title: "Kompres PDF Online Gratis",
  description: "Kompres ukuran file PDF tanpa login. Upload, proses, dan unduh hasilnya dalam beberapa klik.",
  alternates: {
    canonical: "/tools/compress-pdf",
  },
};
```

## Analytics events

Use privacy-friendly events only:
- `tool_viewed`
- `upload_started`
- `upload_failed`
- `processing_completed`
- `download_clicked`
- `tool_error`

Do not send:
- File names
- File contents
- Personal data inside documents

## Definition of done

- Public routes appear in sitemap.
- Every tool has unique metadata.
- Shared links display useful previews.
- Analytics gives product insight without storing document content.

---

## 12. Feature Specification E — Tool Experience Improvements

## Compress PDF

### User need
Users want to know whether compression actually helped.

### Requirements
- Quality presets: Balanced / High Quality / Smallest File.
- Show original size, output size, and savings percentage.
- Warn when output is not significantly smaller.
- Keep upload, progress, result, retry, and reset states consistent.

## Merge PDF

### User need
Users need control over final file order.

### Requirements
- Drag-and-drop reorder.
- Remove individual file.
- Show selected file order.
- Show total page count after processing.
- Reject duplicate / invalid uploads cleanly.

## JPG/PNG to PDF

### User need
Users need printable output, not only raw image pages.

### Requirements
- Reorder images.
- A4, Letter, Original Size.
- Portrait / Landscape / Auto.
- Margin options.
- Fit / contain / crop mode.
- Clear output preview or configuration summary.

## QR Code Generator

### Requirements
- PNG download.
- SVG download.
- Error correction setting.
- Foreground/background validation.
- Easy test preview.
- Clear empty input validation.

## PDF to Word

### Required copy
> Hasil terbaik untuk PDF berbasis teks. PDF scan, layout kompleks, tabel rumit, atau font khusus dapat berubah saat dikonversi.

## PDF Color / BW Splitter

### Requirements
- Clear detected-color indicator.
- Manual selection is clearly described as final source of truth.
- Select all / clear all / reset detection.
- Valid page-range parsing.
- Explicit warning that printed colors may differ depending on printer settings.

---

## 13. Engineering Work Plan for Codex

## Recommended execution order

### Sprint 1 — P0 platform hardening
1. AW-001 through AW-013.
2. Add missing backend dependency.
3. Add limits, expiry logic, cleanup improvements, policies, and consistent UX.
4. Add basic validation tests.

### Sprint 2 — Portfolio proof
1. AW-014 through AW-022.
2. Build About/Contact updates.
3. Add case study routes and content model.
4. Add project visuals and Build Notes pages.

### Sprint 3 — SEO and discovery
1. AW-023 through AW-028.
2. Add tool metadata, sitemap, robots, OG, structured data, analytics.
3. Add tools filtering/search.

### Sprint 4 — Tool quality
1. AW-029 through AW-038.
2. Upgrade the most-used tools first: Compress PDF, Merge PDF, PDF Splitter.
3. Test each upgraded flow before moving to the next.

### Sprint 5 — CI and observability
1. Add automated checks.
2. Add tests.
3. Add logs/monitoring.
4. Add release checklist.

---

## 14. Suggested Git Branch and Commit Convention

### Branch pattern

```text
feat/aw-008-privacy-policy
fix/aw-001-rembg-dependency
chore/aw-024-sitemap-robots
test/pdf-upload-limits
```

### Commit pattern

```text
feat: add privacy and file retention pages
fix: install rembg dependency for image tools
fix: reject expired file jobs
feat: add per-tool SEO metadata
test: cover PDF upload validation
chore: add GitHub Actions CI workflow
```

### Pull request template

```md
## Summary
What changed and why?

## Related backlog
- AW-___

## Screenshots / proof
Add before/after screenshots or test evidence.

## Testing
- [ ] Frontend lint passes
- [ ] Frontend build passes
- [ ] Backend tests pass
- [ ] Manually tested happy path
- [ ] Manually tested failure path
- [ ] Verified mobile layout when UI changed

## Risks / follow-up
Anything intentionally deferred?
```

---

## 15. Testing Checklist

## Backend tests

### Upload validation
- [ ] Reject unsupported file type.
- [ ] Reject file larger than per-file limit.
- [ ] Reject excessive total batch size.
- [ ] Reject excessive number of files.
- [ ] Reject corrupt PDF.
- [ ] Reject encrypted PDF where unsupported.
- [ ] Reject PDF over page-count limit.
- [ ] Reject invalid page selection.
- [ ] Reject expired job access.
- [ ] Prevent path traversal.
- [ ] Clean temporary data after failed upload.

### Tool tests
- [ ] PDF Splitter produces correct color and BW page counts.
- [ ] Merge PDF keeps source order.
- [ ] Compress PDF returns sizes and savings percentage.
- [ ] Image-to-PDF creates readable output.
- [ ] PDF-to-JPG creates downloadable ZIP.
- [ ] Remove Background gracefully reports unavailable dependency.
- [ ] Passport Photo validates size and background color.
- [ ] PDF-to-Word gives output file for supported text PDFs.

## Frontend tests / manual QA

- [ ] Upload state is visible.
- [ ] Processing state disables duplicate submissions.
- [ ] Success state includes clear download action.
- [ ] Error state is understandable and includes retry.
- [ ] Reset starts a new clean job.
- [ ] Mobile layout works at narrow width.
- [ ] Keyboard navigation reaches major controls.
- [ ] Buttons have useful labels.
- [ ] Color contrast remains readable in light and dark mode.
- [ ] Tool metadata and canonical URL are correct.

## Release validation

- [ ] `npm run lint`
- [ ] `npm run build`
- [ ] Backend dependencies install from scratch.
- [ ] Docker image builds successfully.
- [ ] `/health` returns success.
- [ ] Production CORS allows the production frontend.
- [ ] Privacy/Terms links work.
- [ ] Sitemap and robots routes work.
- [ ] At least one real file flow tested in deployed environment.

---

## 16. CI Specification

Create a workflow such as:

```text
.github/workflows/ci.yml
```

### Minimum checks

#### Frontend
- Install dependencies.
- Run lint.
- Run build.

#### Backend
- Create Python environment.
- Install requirements.
- Run tests.
- Optionally run formatting/linting later.

#### Optional checks
- Dependency review.
- Secret scanning.
- Docker build validation.

### CI success criteria

A pull request should not be considered ready unless:
- Frontend build passes.
- Backend test suite passes.
- Dependency installation works from a clean environment.

---

## 17. Documentation Updates

Keep this single master document as the central plan, but keep implementation history compact.

### Required files to add later

```text
docs/
├── ARNOL_WORKS_PRODUCT_EVOLUTION.md    # This master plan
├── CHANGELOG.md                        # Public/release-facing changes
├── SECURITY_AND_FILE_RETENTION.md      # Technical policy details
└── RUNBOOK.md                          # Deploy, rollback, incident notes
```

### Optional feature files only when needed

```text
docs/features/
├── file-processing-hardening.md
├── case-studies.md
├── seo-foundation.md
└── account-system.md
```

Do not create unnecessary documents before they are needed. This master document should be enough for the next development stage.

---

## 18. Changelog Template

Create `docs/CHANGELOG.md` using this format.

```md
# Changelog

All notable changes to Arnol Works are documented here.

## [Unreleased]

### Added
- 

### Changed
- 

### Fixed
- 

### Security
- 

## [0.2.0] - YYYY-MM-DD

### Added
- Privacy Policy, Terms of Use, and File Retention Policy.
- Upload limits for batch file tools.
- Case study pages for flagship projects.

### Changed
- Updated file-handling copy across the site.
- Improved tool error and progress feedback.

### Fixed
- Added `rembg` backend dependency for image tools.
- Improved temporary file expiry handling.

## [0.1.0] - YYYY-MM-DD

### Added
- Initial Arnol Works platform.
- PDF and image utility tools.
- FastAPI processing backend and Next.js frontend.
```

---

## 19. Recommended First Release Scope

Name: **Arnol Works v0.2 — Trust & Stability**

### Include
- AW-001 through AW-013
- AW-014, AW-015, AW-016
- AW-023, AW-024, AW-028
- Basic CI workflow
- Changelog initialization

### Exclude
- Account system
- Payments
- Permanent storage
- Queue architecture
- Large new tool launches
- Complex dashboard work

### Success statement

> Arnol Works v0.2 makes the existing platform safer to use, clearer to understand, easier to trust, and stronger as a public portfolio.

---

## 20. Codex Implementation Instructions

Use this document as the source of truth.

### Rules for implementation

1. Work in small, reviewable commits.
2. Do not rewrite the full architecture unless a task requires it.
3. Keep the current Next.js + FastAPI split.
4. Do not add a database, login, payment system, or permanent storage in the v0.2 scope.
5. Reuse shared UI patterns for uploads, errors, progress, and results.
6. Keep copy in Indonesian for user-facing pages.
7. Update the changelog for user-visible release changes.
8. Add tests when changing backend validation or file lifecycle behavior.
9. Do not claim absolute security in the UI.
10. Preserve existing working tool behavior while adding constraints.

### First instruction for Codex

```text
Read docs/ARNOL_WORKS_PRODUCT_EVOLUTION.md.
Implement the v0.2 Trust & Stability scope in small commits, starting with AW-001 through AW-013.
Before making changes, inspect the current repository structure and identify the exact files affected.
Do not add accounts, payment, permanent storage, or large new tools.
For every completed backlog item:
1) implement it,
2) add or update tests where relevant,
3) update docs/CHANGELOG.md,
4) report changed files, test results, and any deferred follow-up.
```

---

## 21. Final Product Direction

Arnol Works should evolve in this order:

```text
Useful tools
→ Trustworthy file handling
→ Strong project proof
→ Better discovery
→ Better existing-tool UX
→ Engineering maturity
→ Only then consider bigger platform features
```

The next best move is not to add many more tools.  
The next best move is to make the existing product **trustworthy, explainable, well-documented, and technically reliable**.
