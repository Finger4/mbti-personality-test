"""Test API routes."""
from fastapi import APIRouter, Depends, Request, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.test import TestSubmitRequest, TestSubmitResponse, QuestionResponse, TestResultData
from app.services.test_service import test_service
from app.core.dependencies import get_current_user_optional
from app.models.user import User
from app.models.result import UserTestResult
from typing import Optional

router = APIRouter()

@router.get("/questions", response_model=list[QuestionResponse])
def get_questions(db: Session = Depends(get_db)):
    questions = test_service.get_questions(db)
    return [QuestionResponse(**q) for q in questions]

@router.post("/submit", response_model=TestSubmitResponse)
def submit_test(data: TestSubmitRequest, request: Request, db: Session = Depends(get_db), user: Optional[User] = Depends(get_current_user_optional)):
    answers = [{"question_id": a.question_id, "chosen_option": a.chosen_option} for a in data.answers]
    ip = request.client.host if request.client else None
    user_id = user.id if user else None
    result, result_data = test_service.submit_test(db, user_id, answers, ip, data.duration_seconds)
    return TestSubmitResponse(result_id=str(result.id), result_type=result.result_type)

@router.get("/result/{result_id}", response_model=TestResultData)
def get_result(result_id: str, db: Session = Depends(get_db), user: Optional[User] = Depends(get_current_user_optional)):
    import uuid
    try:
        result_uuid = uuid.UUID(result_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid result ID format")
    result = db.query(UserTestResult).filter(UserTestResult.id == result_uuid).first()
    if not result:
        raise HTTPException(status_code=404, detail="Result not found")
    if result.user_id and (not user or result.user_id != user.id):
        raise HTTPException(status_code=403, detail="Not authorized")
    return TestResultData(**result.result_data, id=str(result.id))
