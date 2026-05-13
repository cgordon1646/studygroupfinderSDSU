from fastapi import APIRouter, Depends, Header, HTTPException, status
from sqlalchemy import desc, select
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import GroupMessage as GroupMessageModel
from ..models import User
from ..schemas import GroupMessage, GroupMessageCreate
from ..security import decode_access_token

router = APIRouter(prefix="/groups", tags=["groups"])


def _get_current_email(authorization: str | None = Header(None)) -> str:
    """Extract and validate the current user's email from the JWT token."""
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
    return subject


def _get_current_user(
    authorization: str | None = Header(None), db: Session = Depends(get_db)
) -> User:
    """Get the current authenticated user."""
    email = _get_current_email(authorization)
    user = db.scalar(select(User).where(User.email == email))
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )
    return user


@router.get("/{group_id}/messages", response_model=list[GroupMessage])
def get_messages(
    group_id: str,
    limit: int = 100,
    db: Session = Depends(get_db),
    authorization: str | None = Header(None),
):
    """Get all messages for a group. Requires authentication."""
    _get_current_email(authorization)
    
    messages = db.scalars(
        select(GroupMessageModel)
        .where(GroupMessageModel.group_id == group_id)
        .order_by(desc(GroupMessageModel.created_at))
        .limit(limit)
    ).all()
    
    return [
        GroupMessage(
            id=m.id,
            group_id=m.group_id,
            user_email=m.user_email,
            user_name=m.user_name,
            message=m.message,
            created_at=m.created_at.isoformat() if m.created_at else "",
        )
        for m in reversed(messages)
    ]


@router.post("/{group_id}/messages", response_model=GroupMessage)
def post_message(
    group_id: str,
    body: GroupMessageCreate,
    db: Session = Depends(get_db),
    user: User = Depends(_get_current_user),
):
    """Post a message to a group."""
    msg = GroupMessageModel(
        group_id=group_id,
        user_email=user.email,
        user_name=f"{user.first_name} {user.last_name}".strip(),
        message=body.message,
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)
    
    return GroupMessage(
        id=msg.id,
        group_id=msg.group_id,
        user_email=msg.user_email,
        user_name=msg.user_name,
        message=msg.message,
        created_at=msg.created_at.isoformat() if msg.created_at else "",
    )
