"""Admin API routes."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.core.dependencies import require_admin
from app.models.user import User
from app.models.question import TestQuestion
from app.models.dimension import TestDimension
from app.models.result import UserTestResult
from app.models.contact import ContactMessage
from pydantic import BaseModel
from typing import Optional, List

router = APIRouter()

class DimensionCreate(BaseModel):
    code: str
    name_cn: str
    name_en: str
    pole_a: str
    pole_b: str
    description: Optional[str] = None
    sort_order: int = 0

class QuestionCreate(BaseModel):
    dimension_id: str
    question_number: int
    content: str
    option_a: str
    option_b: str
    weight_a: int = 1
    weight_b: int = 0

class QuestionUpdate(BaseModel):
    content: Optional[str] = None
    option_a: Optional[str] = None
    option_b: Optional[str] = None
    weight_a: Optional[int] = None
    weight_b: Optional[int] = None
    is_active: Optional[bool] = None

@router.get("/dashboard")
def get_dashboard(db: Session = Depends(get_db), user: User = Depends(require_admin)):
    total_users = db.query(User).count()
    type_dist = db.query(UserTestResult.result_type, db.func.count(UserTestResult.id)).group_by(UserTestResult.result_type).all()
    recent = db.query(UserTestResult).order_by(UserTestResult.created_at.desc()).limit(10).all()
    return {
        "total_users": total_users,
        "type_distribution": [{"type": t, "count": c} for t, c in type_dist],
        "recent_tests": [{"user": str(r.user_id) if r.user_id else "guest", "type": r.result_type, "at": str(r.created_at)} for r in recent],
    }

@router.get("/questions")
def list_questions(db: Session = Depends(get_db), user: User = Depends(require_admin)):
    questions = db.query(TestQuestion).all()
    return [{"id": str(q.id), "dimension": q.dimension.code if q.dimension else "", "question_number": q.question_number, "content": q.content, "option_a": q.option_a, "option_b": q.option_b, "is_active": q.is_active} for q in questions]

@router.post("/questions")
def create_question(data: QuestionCreate, db: Session = Depends(get_db), user: User = Depends(require_admin)):
    q = TestQuestion(**data.model_dump())
    db.add(q)
    db.commit()
    return {"id": str(q.id)}

@router.put("/questions/{question_id}")
def update_question(question_id: str, data: QuestionUpdate, db: Session = Depends(get_db), user: User = Depends(require_admin)):
    q = db.query(TestQuestion).filter(TestQuestion.id == question_id).first()
    if not q:
        raise HTTPException(status_code=404, detail="Question not found")
    for field, value in data.model_dump(exclude_none=True).items():
        setattr(q, field, value)
    db.commit()
    return {"success": True}

@router.delete("/questions/{question_id}")
def delete_question(question_id: str, db: Session = Depends(get_db), user: User = Depends(require_admin)):
    q = db.query(TestQuestion).filter(TestQuestion.id == question_id).first()
    if not q:
        raise HTTPException(status_code=404, detail="Question not found")
    q.is_active = False
    db.commit()
    return {"success": True}

@router.get("/users")
def list_users(db: Session = Depends(get_db), user: User = Depends(require_admin)):
    users = db.query(User).all()
    return [{"id": str(u.id), "username": u.username, "email": u.email, "is_admin": u.is_admin, "is_active": u.is_active, "created_at": str(u.created_at)} for u in users]

@router.put("/users/{user_id}/toggle")
def toggle_user(user_id: str, db: Session = Depends(get_db), user: User = Depends(require_admin)):
    u = db.query(User).filter(User.id == user_id).first()
    if not u:
        raise HTTPException(status_code=404, detail="User not found")
    u.is_active = not u.is_active
    db.commit()
    return {"success": True}

@router.get("/dimensions")
def list_dimensions(db: Session = Depends(get_db)):
    dims = db.query(TestDimension).order_by(TestDimension.sort_order).all()
    return [{"code": d.code, "name_cn": d.name_cn, "name_en": d.name_en, "pole_a": d.pole_a, "pole_b": d.pole_b, "description": d.description, "sort_order": d.sort_order} for d in dims]

@router.post("/dimensions")
def create_dimension(data: DimensionCreate, db: Session = Depends(get_db), user: User = Depends(require_admin)):
    d = TestDimension(**data.model_dump())
    db.add(d)
    db.commit()
    return {"code": d.code}

@router.get("/contacts")
def list_contacts(db: Session = Depends(get_db), user: User = Depends(require_admin)):
    msgs = db.query(ContactMessage).order_by(ContactMessage.created_at.desc()).all()
    return [{"id": str(m.id), "name": m.name, "email": m.email, "subject": m.subject, "content": m.content, "is_read": m.is_read, "created_at": str(m.created_at)} for m in msgs]

@router.put("/contacts/{msg_id}/read")
def mark_read(msg_id: str, db: Session = Depends(get_db), user: User = Depends(require_admin)):
    msg = db.query(ContactMessage).filter(ContactMessage.id == msg_id).first()
    if msg:
        msg.is_read = True
        db.commit()
    return {"success": True}
