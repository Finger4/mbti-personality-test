"""User API routes."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.result import UserTestResult
from app.schemas.user import ProfileUpdate, PasswordChange
from app.core.security import hash_password, verify_password

router = APIRouter()

@router.get("/results")
def get_results(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    results = db.query(UserTestResult).filter(UserTestResult.user_id == user.id).order_by(UserTestResult.created_at.desc()).all()
    return [{"id": str(r.id), "type": r.result_type, "created_at": str(r.created_at), "scores": r.result_data.get("scores", {}) if r.result_data else {}} for r in results]

@router.put("/profile")
def update_profile(data: ProfileUpdate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    if data.username:
        if db.query(User).filter(User.username == data.username, User.id != user.id).first():
            raise HTTPException(status_code=409, detail="Username taken")
        user.username = data.username
    if data.avatar_url:
        user.avatar_url = data.avatar_url
    db.commit()
    return {"success": True}

@router.put("/password")
def change_password(data: PasswordChange, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    if not verify_password(data.old_password, user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect old password")
    user.password_hash = hash_password(data.new_password)
    db.commit()
    return {"success": True}
