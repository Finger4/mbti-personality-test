"""Contact API routes."""
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.contact import ContactSubmitRequest, ContactSubmitResponse
from app.models.contact import ContactMessage

router = APIRouter()

@router.post("/submit", response_model=ContactSubmitResponse)
def submit_contact(data: ContactSubmitRequest, request: Request, db: Session = Depends(get_db)):
    if len(data.content) < 20:
        raise HTTPException(status_code=400, detail="Content must be at least 20 characters")
    ip = request.client.host if request.client else None
    msg = ContactMessage(name=data.name, email=data.email, subject=data.subject, content=data.content, ip_address=ip)
    db.add(msg)
    db.commit()
    return ContactSubmitResponse(success=True, message="Message sent successfully")
