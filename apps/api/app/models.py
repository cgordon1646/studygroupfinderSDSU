from typing import Optional

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from .database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    email: Mapped[str] = mapped_column(String(320), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    first_name: Mapped[str] = mapped_column(String(100))
    last_name: Mapped[str] = mapped_column(String(100))
    red_id: Mapped[Optional[str]] = mapped_column(String(9), unique=True, index=True)
    major: Mapped[str] = mapped_column(String(120), default="Undeclared")
    academic_year: Mapped[str] = mapped_column(String(50), default="—")

