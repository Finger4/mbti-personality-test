"""Contact message model."""
import uuid
from sqlalchemy import Column, String, Text, Boolean, DateTime
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base

class ContactMessage(Base):
    __tablename__ = "contact_messages"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(50), nullable=False)
    email = Column(String(255), nullable=False)
    subject = Column(String(50), nullable=False)
    content = Column(Text, nullable=False)
    ip_address = Column(String(45), nullable=True)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default="now()")
