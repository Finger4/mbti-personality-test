"""Contact schemas."""
from pydantic import BaseModel, EmailStr

class ContactSubmitRequest(BaseModel):
    name: str
    email: EmailStr
    subject: str
    content: str

class ContactSubmitResponse(BaseModel):
    success: bool
    message: str
