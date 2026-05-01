from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select

from .config import ALLOW_ORIGINS
from .database import Base, SessionLocal, engine
from .models import User
from .routers import auth
from .security import hash_password


def seed_demo_user() -> None:
    db = SessionLocal()
    try:
        demo_email = "test@sdsu.edu"
        exists = db.scalar(select(User).where(User.email == demo_email))
        if exists:
            return
        demo = User(
            email=demo_email,
            password_hash=hash_password("test123"),
            first_name="Test",
            last_name="User",
            red_id=None,
            major="Computer Science",
            academic_year="Junior",
        )
        db.add(demo)
        db.commit()
    finally:
        db.close()


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    seed_demo_user()
    yield


app = FastAPI(title="Study Group Finder API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOW_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")


@app.get("/api/health")
def health():
    return {"status": "ok"}
