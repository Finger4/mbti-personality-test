"""Test question model."""
import uuid
from sqlalchemy import Column, String, Text, Integer, Boolean, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base

class TestQuestion(Base):
    __tablename__ = "test_questions"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    dimension_id = Column(UUID(as_uuid=True), ForeignKey("test_dimensions.id"), nullable=False)
    question_number = Column(Integer, nullable=False)
    content = Column(Text, nullable=False)
    option_a = Column(String(200), nullable=False)
    option_b = Column(String(200), nullable=False)
    weight_a = Column(Integer, default=1)
    weight_b = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default="now()")
    dimension = relationship("TestDimension")
