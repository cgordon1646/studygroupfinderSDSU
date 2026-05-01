import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

APP_ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = APP_ROOT / "data"
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    f"sqlite:///{DATA_DIR / 'studygroup_finder.db'}",
)

JWT_SECRET_KEY = os.getenv(
    "JWT_SECRET_KEY",
    "dev-only-change-me-use-openssl-rand-hex-32-in-real-deploy",
)
JWT_ALGORITHM = "HS256"
JWT_EXPIRE_DAYS = int(os.getenv("JWT_EXPIRE_DAYS", "7"))

ALLOW_ORIGINS = [
    o.strip()
    for o in os.getenv("ALLOW_ORIGINS", "http://127.0.0.1:5173,http://localhost:5173").split(
        ","
    )
    if o.strip()
]
