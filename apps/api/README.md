# Study Group Finder API (Python)

FastAPI + SQLite. Passwords are stored with **bcrypt**; clients receive a **JWT** after login or registration.

## Setup (Windows)

From this directory (`apps/api`). Prefer an **explicit venv** so `pip` and `python` stay the same (avoids failures where pip uses one Python but `python` resolves to the **WindowsApps** stub):

```powershell
py -3 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python -c "from app.main import app; print('API import OK')"
```

If `pip` reports download timeouts, retry (`python -m pip install -r requirements.txt`) or use another network/VPN until installs finish.

## Run (development)

With the venv **activated**:

```powershell
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Health check: `http://127.0.0.1:8000/api/health`

The web app (`apps/web`) proxies `/api` to this server when you use `npm run dev`.

When you ship a **static production build**, there is no dev proxy unless you configure one in your host (e.g. nginx). Build the SPA with **`VITE_API_BASE_URL`** set to your deployed API origin (no trailing slash), for example:

`VITE_API_BASE_URL=https://api.example.com npm run build`

## Environment (optional)

Create a `.env` file here:

| Variable | Purpose |
|----------|---------|
| `JWT_SECRET_KEY` | **Required in production** — long random string (PyJWT HS256). |
| `DATABASE_URL` | SQLAlchemy URL (default: SQLite file under `apps/api/data/`). |
| `ALLOW_ORIGINS` | Comma-separated CORS origins (default includes Vite dev ports). |

## Demo account

On first startup a demo user is created if missing:

- Email: `test@sdsu.edu`
- Password: `test123`

Delete `data/studygroup_finder.db` to reset the database and re-seed.
