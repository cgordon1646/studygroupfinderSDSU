import re

from pydantic import BaseModel, EmailStr, Field, field_validator

SDSU_EMAIL = re.compile(r"^[a-zA-Z0-9._%+-]+@sdsu\.edu$", re.I)
RED_ID_FULL = re.compile(r"^\d{9}$")
GRAD_YEAR = re.compile(r"^\d{4}$")
PASSWORD_MIN = 8


class UserPublic(BaseModel):
    email: str
    first_name: str
    last_name: str
    red_id: str | None
    major: str
    academic_year: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "Bearer"
    user: UserPublic


class RegisterBody(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=PASSWORD_MIN)
    first_name: str = Field(..., min_length=1, max_length=100)
    last_name: str = Field(..., min_length=1, max_length=100)
    red_id: str = Field(..., min_length=1)
    major: str = Field(..., min_length=1, max_length=120)
    academic_year: str = Field(..., min_length=4, max_length=4)

    @field_validator("email", mode="before")
    @classmethod
    def lowercase_email(cls, v: object) -> object:
        if isinstance(v, str):
            return v.strip().lower()
        return v

    @field_validator("email")
    @classmethod
    def sdsu_only(cls, v: str) -> str:
        if not SDSU_EMAIL.match(v.strip()):
            raise ValueError("Email must be a valid @sdsu.edu address")
        return v.strip().lower()

    @field_validator("password")
    @classmethod
    def password_len(cls, v: str) -> str:
        if len(v.encode("utf-8")) > 72:
            raise ValueError("Password exceeds maximum supported length")
        return v

    @field_validator("first_name", "last_name")
    @classmethod
    def strip_names(cls, v: str) -> str:
        s = v.strip()
        if not s:
            raise ValueError("Name cannot be empty")
        return s

    @field_validator("major")
    @classmethod
    def strip_major(cls, v: str) -> str:
        s = v.strip()
        if not s:
            raise ValueError("Major cannot be empty")
        return s

    @field_validator("academic_year")
    @classmethod
    def graduation_year_format(cls, v: str) -> str:
        s = v.strip()
        if not GRAD_YEAR.match(s):
            raise ValueError("Graduation year must be a 4-digit year")
        return s

    @field_validator("red_id")
    @classmethod
    def red_id_digits(cls, v: str) -> str:
        d = "".join(c for c in v if c.isdigit())[:9]
        if len(d) != 9 or not RED_ID_FULL.match(d):
            raise ValueError("Red ID must be exactly 9 digits")
        return d


class LoginBody(BaseModel):
    email: str = Field(..., min_length=1)
    password: str

    @field_validator("email")
    @classmethod
    def normalize_login_email(cls, v: str) -> str:
        return v.strip().lower()


class GroupMessageCreate(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)


class GroupMessage(BaseModel):
    id: int
    group_id: str
    user_email: str
    user_name: str
    message: str
    created_at: str
