# Study Group Finder (SDSU)

Web app for SDSU students to browse demo courses and join study groups (front-end catalog is mock data; accounts and auth are real). Optional C++ code lives under `packages/core` for coursework or experiments—it is not required to run the site.

## Repository layout

| Path | Purpose |
|------|---------|
| `apps/web` | React (Vite) SPA: landing, sign-in, sign-up, class browser |
| `apps/api` | FastAPI + SQLite: registration, login, JWT, `/api/auth/me` |
| `packages/core` | CMake C++ library (optional build) |

## Prerequisites

- **Node.js** (for `apps/web`)
- **Python 3.10+** (for `apps/api`)
- **CMake** (only if you build `packages/core`)

## Run the app (development)

Use **two terminals**. The Vite dev server proxies `/api` to the backend (see `apps/web/vite.config.ts`).

### Terminal 1 — API

**macOS / Linux**

```bash
cd apps/api
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

**Windows (PowerShell)**

```powershell
cd apps\api
py -3 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Health check: http://127.0.0.1:8000/api/health

### Terminal 2 — Web

```bash
cd apps/web
npm install
npm run dev
```

Open the local URL Vite prints (usually http://localhost:5173).

- **Browse classes** requires a signed-in session; you are redirected to sign-in and then returned to `/classes`.
- **Demo account** (created on first API start if missing): `test@sdsu.edu` / `test123`.

### Production web build

Set `VITE_API_BASE_URL` to your deployed API origin (no trailing slash), then:

```bash
cd apps/web
npm run build
```

## Optional: CMake (`packages/core`)

From the repo root:

```bash
cmake -S . -B build
cmake --build build
```

This builds only the C++ package, not the web app or API.

## Documentation

- API details: [apps/api/README.md](apps/api/README.md)
- Web app: [apps/web/README.md](apps/web/README.md)
