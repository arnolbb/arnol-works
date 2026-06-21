import os
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.routes.pdf import router as pdf_router
from app.services.storage import cleanup_old_jobs, start_periodic_cleanup, stop_periodic_cleanup


@asynccontextmanager
async def lifespan(application: FastAPI):
    cleanup_old_jobs()
    start_periodic_cleanup()
    yield
    stop_periodic_cleanup()


app = FastAPI(
    title="Arnol Works API",
    description="Backend API for Arnol Works portfolio and multi-tools platform.",
    version="0.1.0",
    lifespan=lifespan,
)

allowed_origins = [
    origin.strip()
    for origin in os.getenv(
        "ALLOWED_ORIGINS",
        "http://localhost:3000,http://127.0.0.1:3000",
    ).split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException) -> JSONResponse:
    if isinstance(exc.detail, dict) and "error" in exc.detail:
        return JSONResponse(status_code=exc.status_code, content=exc.detail)
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": {"code": "PROCESSING_FAILED", "message": str(exc.detail), "details": None}},
    )


app.include_router(pdf_router)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "arnol-works-api"}