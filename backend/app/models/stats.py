"""Stats models."""
from sqlalchemy import Column, String, Integer, DateTime
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base
import uuid

class PageStats(Base):
    __tablename__ = "page_stats"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    page = Column(String(50), unique=True, nullable=False)  # e.g., 'home', 'test'
    views = Column(Integer, default=0)
    updated_at = Column(DateTime, server_default="now()")
