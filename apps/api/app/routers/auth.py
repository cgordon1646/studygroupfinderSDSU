from fastapi import APIRouter, Depends, Header, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import User
from ..schemas import LoginBody, RegisterBody, TokenResponse, UserPublic
from ..security import create_access_token, decode_access_token, hash_password, verify_password

router = APIRouter(prefix="/auth", tags=["auth"])


def _user_public(u: User) -> UserPublic:
    return UserPublic(
        email=u.email,
        first_name=u.first_name,
        last_name=u.last_name,
        red_id=u.red_id,
        major=u.major,
        academic_year=u.academic_year,
    )


def _token_for(user: User) -> TokenResponse:
    token = create_access_token(subject=user.email)
    return TokenResponse(access_token=token, user=_user_public(user))


@router.post("/register", response_model=TokenResponse)
def register(body: RegisterBody, db: Session = Depends(get_db)):
    normalized_email = body.email.strip().lower()
    exists_email = db.scalar(select(User).where(User.email == normalized_email))
    if exists_email:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account already exists with this SDSU email.",
        )
    exists_rid = db.scalar(select(User).where(User.red_id == body.red_id))
    if exists_rid:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account already exists with this Red ID.",
        )

    user = User(
        email=normalized_email,
        password_hash=hash_password(body.password),
        first_name=body.first_name,
        last_name=body.last_name,
        red_id=body.red_id,
        major="Undeclared",
        academic_year="—",
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return _token_for(user)


@router.post("/login", response_model=TokenResponse)
def login(body: LoginBody, db: Session = Depends(get_db)):
    user = db.scalar(select(User).where(User.email == body.email))
    if not user or not verify_password(body.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )
    return _token_for(user)


@router.get("/me", response_model=UserPublic)
def me(
    authorization: str | None = Header(None),
    db: Session = Depends(get_db),
):
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )
    token = authorization.split(None, 1)[1].strip()
    subject = decode_access_token(token)
    if not subject:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )
    user = db.scalar(select(User).where(User.email == subject))
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )
    return _user_public(user)
