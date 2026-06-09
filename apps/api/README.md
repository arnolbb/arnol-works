# Arnol Works API

FastAPI backend app for Arnol Works.

## Local development

```bash
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Health check:

```bash
curl http://localhost:8000/health
```

Expected response:

```json
{"status":"ok","service":"arnol-works-api"}
```

Temporary job files are stored under `.tmp/jobs` and old jobs are cleaned on startup and before new jobs are created.
