"use client";

import Image from "next/image";
import Link from "next/link";
import { ChangeEvent, DragEvent, useMemo, useState } from "react";
import { ToolIcon } from "@/components/tools/tool-icon";
import { analyzePdf, AnalyzeResult, fileUrl, splitPdf, SplitResult } from "@/lib/api-client";
import { parsePageRange } from "@/lib/page-range";

const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024;
const trustBadges = ["Hanya PDF", "Maks. 50MB", "Privasi Terjaga", "Proses Cepat"];
const steps = ["Upload", "Review Halaman", "Proses", "Selesai"];

type Status = "idle" | "analyzing" | "ready" | "splitting" | "done" | "error";

function formatFileSize(size: number) {
  const sizeInMb = size / (1024 * 1024);
  return `${sizeInMb.toFixed(sizeInMb >= 10 ? 0 : 1)} MB`;
}

function isPdfFile(file: File) {
  return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
}

function validateFile(file: File) {
  if (!isPdfFile(file)) return "File harus berformat PDF.";
  if (file.size > MAX_FILE_SIZE_BYTES) return "Ukuran file maksimal 50MB.";
  return null;
}

function getActiveStep(status: Status, hasAnalyze: boolean) {
  if (status === "done") return 4;
  if (status === "splitting") return 3;
  if (hasAnalyze) return 2;
  return 1;
}

export function PdfUploadForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analyzeResult, setAnalyzeResult] = useState<AnalyzeResult | null>(null);
  const [splitResult, setSplitResult] = useState<SplitResult | null>(null);
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  const [rangeInput, setRangeInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");

  const selectedPageList = useMemo(() => Array.from(selectedPages).sort((a, b) => a - b), [selectedPages]);
  const activeStep = getActiveStep(status, Boolean(analyzeResult));

  function selectFile(file: File) {
    const validationError = validateFile(file);
    if (validationError) {
      setSelectedFile(null);
      setError(validationError);
      return;
    }
    setSelectedFile(file);
    setAnalyzeResult(null);
    setSplitResult(null);
    setSelectedPages(new Set());
    setStatus("idle");
    setError(null);
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) selectFile(file);
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) selectFile(file);
  }

  async function handleAnalyze() {
    if (!selectedFile) return;
    setStatus("analyzing");
    setError(null);
    try {
      const result = await analyzePdf(selectedFile);
      setAnalyzeResult(result);
      setSelectedPages(new Set(result.detectedColorPages));
      setStatus("ready");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analisis PDF gagal.");
      setStatus("error");
    }
  }

  function togglePage(pageNumber: number) {
    setSelectedPages((current) => {
      const next = new Set(current);
      if (next.has(pageNumber)) next.delete(pageNumber);
      else next.add(pageNumber);
      return next;
    });
  }

  function applyRangeInput() {
    if (!analyzeResult) return;
    try {
      setSelectedPages(new Set(parsePageRange(rangeInput, analyzeResult.totalPages)));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Input halaman tidak valid.");
    }
  }

  async function handleSplit() {
    if (!analyzeResult) return;
    setStatus("splitting");
    setError(null);
    try {
      const result = await splitPdf(analyzeResult.jobId, selectedPageList);
      setSplitResult(result);
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Split PDF gagal.");
      setStatus("ready");
    }
  }

  function resetFlow() {
    setSelectedFile(null);
    setAnalyzeResult(null);
    setSplitResult(null);
    setSelectedPages(new Set());
    setRangeInput("");
    setError(null);
    setStatus("idle");
  }

  return (
    <div className="space-y-8">
      <StepIndicator activeStep={activeStep} />

      {!splitResult ? (
        <section className="rounded-[18px] border border-slate-200 dark:border-brand-line bg-white dark:bg-slate-900/70 p-5 sm:p-7">
          {!selectedFile ? (
            <label onDragOver={(event) => event.preventDefault()} onDrop={handleDrop} className="group flex cursor-pointer flex-col items-center justify-center rounded-[18px] border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/70 px-5 py-9 text-center transition hover:border-brand-primary sm:px-6 sm:py-12">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-brand-soft text-brand-primary"><ToolIcon icon="PDF" slug="pdf-color-bw-splitter" className="size-6" /></div>
              <span className="mt-4 text-xl font-medium text-brand-ink dark:text-slate-100">Upload file PDF Anda</span>
              <span className="mt-2 max-w-md text-sm leading-6 text-slate-600 dark:text-slate-300">Tarik & lepas satu file PDF di sini atau klik untuk memilih file.</span>
              <span className="mt-5 rounded-md bg-brand-primary px-6 py-3 text-sm font-semibold text-white transition group-hover:bg-brand-hover">Pilih File PDF</span>
              <span className="mt-3 font-mono text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-300">Maksimal ukuran file 50MB</span>
              <input type="file" accept="application/pdf,.pdf" className="sr-only" onChange={handleFileChange} aria-label="Pilih file PDF" />
            </label>
          ) : (
            <div className="rounded-[18px] border border-slate-200 dark:border-brand-line bg-brand-paper dark:bg-slate-950/70 p-5 sm:p-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg border border-slate-200 dark:border-brand-line bg-white dark:bg-slate-900/70 text-brand-primary"><ToolIcon icon="PDF" slug="pdf-color-bw-splitter" className="size-6" /></div>
                  <div>
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300">File aktif</p>
                    <p className="mt-2 break-all text-lg font-medium text-brand-ink dark:text-slate-100">{selectedFile.name}</p>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{formatFileSize(selectedFile.size)} · satu file PDF siap dianalisis</p>
                  </div>
                </div>
                <label className="inline-flex cursor-pointer justify-center rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/70 px-4 py-2.5 text-sm font-semibold text-brand-ink dark:text-slate-100 transition hover:bg-brand-paper dark:hover:bg-slate-800">
                  Ganti File
                  <input type="file" accept="application/pdf,.pdf" className="sr-only" onChange={handleFileChange} aria-label="Ganti file PDF" />
                </label>
              </div>
            </div>
          )}

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {trustBadges.map((badge) => <div key={badge} className="rounded-lg border border-slate-200 dark:border-brand-line bg-brand-paper dark:bg-slate-950/70 p-3 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-slate-600 dark:text-slate-300">{badge}</div>)}
          </div>

          {error ? <StatusCard tone="error" title="Terjadi kendala" text={error} /> : null}
          {status === "analyzing" ? <StatusCard tone="info" title="Menganalisis PDF" text="Kami sedang mencari halaman yang kemungkinan berwarna dan membuat preview halaman." /> : null}

          <button type="button" aria-busy={status === "analyzing"} disabled={!selectedFile || status === "analyzing" || status === "splitting"} onClick={handleAnalyze} className="mt-6 w-full rounded-md bg-black px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 dark:bg-white dark:text-brand-night dark:hover:bg-slate-200 dark:disabled:bg-slate-800 dark:disabled:text-slate-500">
            {status === "analyzing" ? "Sedang menganalisis PDF..." : "Analisis PDF"}
          </button>
        </section>
      ) : null}
      {analyzeResult && !splitResult ? (
        <section className="space-y-6">
          <div className="rounded-[18px] border border-slate-200 dark:border-brand-line bg-white dark:bg-slate-900/70 p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-slate-500 dark:text-slate-300">Review Halaman</p>
                <h2 className="mt-2 text-2xl font-medium tracking-[-0.02em] text-brand-ink dark:text-slate-100">Cek hasil deteksi sebelum split</h2>
                <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">Deteksi otomatis hanya rekomendasi. Pilihan akhir tetap mengikuti halaman yang Anda centang.</p>
              </div>
              <div className="rounded-full border border-brand-border bg-brand-soft px-4 py-2 text-sm font-semibold text-brand-primary">
                {selectedPages.size} halaman dipilih
              </div>
            </div>
          </div>

          <div className="grid gap-7 lg:grid-cols-[320px_1fr]">
            <aside className="space-y-5 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:self-start lg:overflow-y-auto lg:pr-2">
              <div className="rounded-[18px] border border-slate-200 dark:border-brand-line bg-white dark:bg-slate-900/70 p-6">
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-slate-500 dark:text-slate-300">Ringkasan Analisis</p>
                <div className="mt-5 divide-y divide-slate-200">
                  <Summary label="Total Halaman" value={analyzeResult.totalPages} />
                  <Summary label="Terdeteksi Berwarna" value={analyzeResult.detectedColorPages.length} accent />
                  <Summary label="Dipilih Berwarna" value={selectedPages.size} accent />
                </div>
                <div className="mt-5 rounded-md border border-slate-200 dark:border-brand-line bg-brand-paper dark:bg-slate-950/70 p-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  Halaman yang dipilih masuk ke file <strong className="font-semibold text-brand-ink dark:text-slate-100">PDF berwarna</strong>. Sisanya masuk ke file hitam putih. Panel ini bisa discroll saat halaman PDF banyak.
                </div>
              </div>

              <div className="rounded-[18px] border border-slate-200 dark:border-brand-line bg-white dark:bg-slate-900/70 p-6">
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-slate-500 dark:text-slate-300">Input Rentang Manual</p>
                <div className="mt-5">
                  <label htmlFor="page-range-input" className="mb-2 block text-sm font-medium text-brand-ink dark:text-slate-100">Nomor halaman warna</label>
                  <input id="page-range-input" value={rangeInput} onChange={(event) => setRangeInput(event.target.value)} placeholder="Contoh: 1, 3, 8-12" className="h-12 w-full rounded-md border border-slate-200 bg-white px-4 font-mono text-sm text-brand-ink outline-none transition focus:border-brand-primary dark:border-brand-line dark:bg-slate-950/70 dark:text-slate-100 dark:placeholder:text-slate-500" />
                </div>
                <button type="button" onClick={applyRangeInput} className="mt-3 w-full rounded-md bg-brand-primary px-4 py-3 text-sm font-semibold text-white hover:bg-brand-hover">Terapkan Rentang</button>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button type="button" onClick={() => setSelectedPages(new Set(analyzeResult.pages.map((page) => page.pageNumber)))} className="rounded-md border border-slate-200 dark:border-brand-line bg-white dark:bg-slate-900/70 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-brand-ink dark:text-slate-100 hover:bg-brand-paper dark:hover:bg-slate-800">Pilih Semua</button>
                  <button type="button" onClick={() => setSelectedPages(new Set())} className="rounded-md border border-slate-200 dark:border-brand-line bg-white dark:bg-slate-900/70 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-brand-ink dark:text-slate-100 hover:bg-brand-paper dark:hover:bg-slate-800">Hapus Semua</button>
                </div>
                <button type="button" onClick={() => setSelectedPages(new Set(analyzeResult.detectedColorPages))} className="mt-3 w-full rounded-md border border-brand-border bg-brand-soft px-4 py-3 text-sm font-semibold text-brand-primary hover:border-brand-primary dark:border-indigo-400/30 dark:bg-indigo-400/10 dark:text-indigo-300">Gunakan Hasil Deteksi</button>
                <div className="sticky bottom-0 -mx-6 mt-5 border-t border-slate-200 dark:border-brand-line bg-white dark:bg-slate-900/95 px-6 pb-1 pt-4 backdrop-blur">
                  <button type="button" aria-busy={status === "splitting"} disabled={status === "splitting"} onClick={handleSplit} className="w-full rounded-md bg-black px-5 py-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300 dark:bg-white dark:text-brand-night dark:hover:bg-slate-200 dark:disabled:bg-slate-800 dark:disabled:text-slate-500">{status === "splitting" ? "Memproses..." : "Proses Split"}</button>
                  <p className="mt-2 text-center text-xs text-slate-500 dark:text-slate-300">Pastikan pilihan halaman sudah sesuai.</p>
                </div>
              </div>
            </aside>

            <div>
              <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3 className="text-xl font-medium tracking-[-0.02em] text-brand-ink dark:text-slate-100">Pratinjau Halaman</h3>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Klik kartu halaman untuk memilih atau menghapus dari file warna.</p>
                </div>
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-300">{analyzeResult.pages.length} halaman</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {analyzeResult.pages.map((page) => {
                  const isSelected = selectedPages.has(page.pageNumber);
                  return (
                    <label key={page.pageNumber} aria-label={`Halaman ${page.pageNumber}, ${isSelected ? "masuk PDF warna" : "masuk PDF hitam putih"}`} className={`group overflow-hidden rounded-[14px] border bg-white dark:bg-slate-900/70 transition hover:-translate-y-0.5 ${isSelected ? "border-brand-primary ring-1 ring-brand-soft" : "border-slate-200 dark:border-brand-line hover:border-slate-400"}`}>
                      <div className={`relative border-b border-slate-200 dark:border-brand-line ${isSelected ? "bg-brand-soft" : "bg-slate-50 dark:bg-slate-900"}`}>
                        <Image src={fileUrl(page.thumbnailUrl) ?? ""} alt={`Preview halaman ${page.pageNumber}`} width={360} height={480} className="h-48 w-full bg-white object-contain sm:h-52" unoptimized />
                        {page.isColorDetected ? <span className="absolute bottom-2 left-2 rounded-md bg-brand-primary px-2 py-1 font-mono text-[10px] uppercase tracking-wide text-white">Warna</span> : null}
                        <span aria-hidden="true" className={`absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full border text-xs font-semibold transition ${isSelected ? "border-brand-primary bg-brand-primary text-white" : "border-slate-200 dark:border-brand-line bg-white dark:bg-slate-900/90 text-transparent group-hover:border-slate-400"}`}>{isSelected ? "✓" : ""}</span>
                      </div>
                      <div className="flex items-center justify-between gap-3 p-3">
                        <div>
                          <p className="font-mono text-xs text-brand-ink dark:text-slate-100">Hal. {page.pageNumber}</p>
                          <p className={`mt-1 text-xs ${isSelected ? "font-medium text-brand-primary" : "text-slate-500 dark:text-slate-300"}`}>{isSelected ? "Masuk PDF warna" : "Masuk PDF hitam putih"}</p>
                        </div>
                        <input type="checkbox" checked={isSelected} onChange={() => togglePage(page.pageNumber)} className="sr-only" />
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      ) : null}
      {status === "splitting" ? <ProcessingCard /> : null}
      {splitResult ? <ResultCard result={splitResult} resetFlow={resetFlow} /> : null}
    </div>
  );
}

function StepIndicator({ activeStep }: Readonly<{ activeStep: number }>) {
  return (
    <div className="rounded-[18px] border border-slate-200 dark:border-brand-line bg-white dark:bg-slate-900/70 px-4 py-5 sm:px-6">
      <div className="grid gap-4 sm:grid-cols-4 sm:gap-0">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const active = stepNumber <= activeStep;
          return (
            <div key={step} className="relative flex items-center gap-3 sm:flex-col sm:items-center sm:gap-2">
              {index > 0 ? <span className="absolute left-4 top-[-1rem] h-4 w-px bg-slate-200 sm:left-0 sm:top-4 sm:h-px sm:w-1/2" /> : null}
              {index < steps.length - 1 ? <span className="absolute bottom-[-1rem] left-4 h-4 w-px bg-slate-200 sm:left-1/2 sm:top-4 sm:h-px sm:w-1/2" /> : null}
              <span className={`relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-full border font-mono text-xs transition ${active ? "border-brand-primary bg-brand-primary text-white" : "border-slate-200 dark:border-brand-line bg-white dark:bg-slate-900/70 text-slate-500 dark:text-slate-300"}`}>{stepNumber}</span>
              <span className={`text-sm sm:text-center ${active ? "font-semibold text-brand-ink dark:text-slate-100" : "text-slate-500 dark:text-slate-300"}`}>{step}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatusCard({ tone, title, text }: Readonly<{ tone: "success" | "error" | "info"; title: string; text: string }>) {
  const styles = { success: "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-300", error: "border-red-200 bg-red-50 text-red-700 dark:border-red-400/30 dark:bg-red-400/10 dark:text-red-300", info: "border-slate-200 dark:border-brand-line bg-brand-paper dark:bg-slate-950/70 text-brand-ink dark:text-slate-100" }[tone];
  return <div className={`mt-5 rounded-md border p-4 text-sm ${styles}`}><div className="flex items-start gap-3"><span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand-primary" /><div><p className="font-semibold">{title}</p><p className="mt-1 break-all text-slate-600 dark:text-slate-300">{text}</p></div></div></div>;
}

function Summary({ label, value, accent = false }: Readonly<{ label: string; value: number; accent?: boolean }>) {
  return <div className="flex items-center justify-between py-3"><p className="text-sm text-slate-600 dark:text-slate-300">{label}</p><p className={`text-xl font-semibold ${accent ? "text-brand-primary" : "text-brand-ink dark:text-slate-100"}`}>{value}</p></div>;
}

function ProcessingCard() {
  return (
    <div className="rounded-[18px] border border-slate-200 dark:border-brand-line bg-white dark:bg-slate-900/70 p-6 text-center sm:p-8">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-brand-soft">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-brand-primary border-t-transparent" />
      </div>
      <h2 className="mt-4 text-2xl font-medium text-brand-ink dark:text-slate-100">Memproses PDF...</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400 sm:text-base">Kami sedang membuat file halaman berwarna dan hitam-putih. Tetap buka halaman ini sampai proses selesai.</p>
    </div>
  );
}

function ResultCard({ result, resetFlow }: Readonly<{ result: SplitResult; resetFlow: () => void }>) {
  const totalPages = result.colorPageCount + result.bwPageCount;

  return (
    <section className="rounded-[18px] border border-slate-200 dark:border-brand-line bg-white dark:bg-slate-900/70 p-5 sm:p-7">
      <div className="flex flex-col gap-4 border-b border-slate-200 dark:border-brand-line pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-emerald-500 text-lg text-white">✓</div>
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-emerald-700">Selesai</p>
            <h2 className="mt-1 text-2xl font-medium tracking-[-0.02em] text-brand-ink dark:text-slate-100">File berhasil dipisahkan</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">Total {totalPages} halaman sudah dibagi menjadi file warna dan hitam putih.</p>
          </div>
        </div>
        <button type="button" onClick={resetFlow} className="rounded-md border border-slate-200 dark:border-brand-line bg-white dark:bg-slate-900/70 px-4 py-2.5 text-sm font-semibold text-brand-ink dark:text-slate-100 hover:bg-brand-paper dark:hover:bg-slate-800">
          Proses PDF Lain
        </button>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {result.colorPdfUrl ? <DownloadCard title="Halaman Berwarna" count={result.colorPageCount} href={result.colorPdfUrl} variant="color" /> : <EmptyOutputCard title="Halaman Berwarna" />}
        {result.bwPdfUrl ? <DownloadCard title="Halaman Hitam Putih" count={result.bwPageCount} href={result.bwPdfUrl} variant="bw" /> : <EmptyOutputCard title="Halaman Hitam Putih" />}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_1.15fr]">
        <div className="rounded-[14px] border border-slate-200 dark:border-brand-line bg-brand-paper dark:bg-slate-950/70 p-5">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-300">Ringkasan</p>
          <div className="mt-4 divide-y divide-slate-200 text-sm text-slate-700 dark:text-slate-300">
            <p className="flex justify-between gap-4 py-2"><span>Total Halaman</span><strong className="font-semibold text-brand-ink dark:text-slate-100">{totalPages}</strong></p>
            <p className="flex justify-between gap-4 py-2"><span>Halaman Berwarna</span><strong className="font-semibold text-brand-primary">{result.colorPageCount}</strong></p>
            <p className="flex justify-between gap-4 py-2"><span>Halaman Hitam Putih</span><strong className="font-semibold text-brand-ink dark:text-slate-100">{result.bwPageCount}</strong></p>
          </div>
        </div>
        <div className="rounded-[14px] border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-400/30 dark:bg-emerald-400/10">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">Estimasi Penghematan</p>
          <p className="mt-3 text-sm leading-6 text-emerald-900 dark:text-emerald-100">Dengan mencetak halaman hitam putih sebagai grayscale, Anda dapat menghemat biaya print hingga</p>
          <p className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-emerald-700 dark:text-emerald-300">70% - 85%</p>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 border-t border-slate-200 dark:border-brand-line pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-500 dark:text-slate-300">File akan dihapus otomatis untuk menjaga privasi Anda.</p>
        <Link href="/tools" className="rounded-md border border-slate-200 dark:border-brand-line bg-white dark:bg-slate-900/70 px-4 py-2.5 text-center text-sm font-semibold text-brand-ink dark:text-slate-100 hover:bg-brand-paper dark:hover:bg-slate-800">Kembali ke Tools</Link>
      </div>
    </section>
  );
}

function DownloadCard({ title, count, href, variant }: Readonly<{ title: string; count: number; href: string; variant: "color" | "bw" }>) {
  return (
    <div className={`rounded-[14px] border bg-white dark:bg-slate-900/70 p-5 ${variant === "color" ? "border-brand-primary" : "border-slate-200 dark:border-brand-line"}`}>
      <div className="flex items-start gap-4">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-brand-soft text-brand-primary"><ToolIcon icon="PDF" slug="pdf-color-bw-splitter" className="size-6" /></div>
        <div className="min-w-0">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-300">Output PDF</p>
          <h3 className="mt-1 text-lg font-medium text-brand-ink dark:text-slate-100">{title}</h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{count} halaman siap diunduh</p>
        </div>
      </div>
      <a href={fileUrl(href) ?? "#"} className={`mt-5 inline-flex w-full justify-center rounded-md px-5 py-3 text-sm font-semibold text-white ${variant === "color" ? "bg-brand-primary hover:bg-brand-hover" : "bg-black hover:bg-slate-800"}`}>Unduh PDF</a>
    </div>
  );
}

function EmptyOutputCard({ title }: Readonly<{ title: string }>) {
  return (
    <div className="rounded-[14px] border border-dashed border-slate-300 dark:border-slate-700 bg-brand-paper dark:bg-slate-950/70 p-5">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-300">Tidak dibuat</p>
      <h3 className="mt-2 text-lg font-medium text-slate-500 dark:text-slate-300">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-300">Tidak ada halaman untuk kategori ini.</p>
    </div>
  );
}











