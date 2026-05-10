"""Test result models."""
import uuid
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base

class UserTestResult(Base):
    __tablename__ = "user_test_results"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    result_type = Column(String(4), nullable=False)
    score_e = Column(Integer, default=0)
    score_i = Column(Integer, default=0)
    score_s = Column(Integer, default=0)
    score_n = Column(Integer, default=0)
    score_t = Column(Integer, default=0)
    score_f = Column(Integer, default=0)
    score_j = Column(Integer, default=0)
    score_p = Column(Integer, default=0)
    result_data = Column(JSON, nullable=True)
    ip_address = Column(String(45), nullable=True)
    duration_seconds = Column(Integer, nullable=True)
    created_at = Column(DateTime, server_default="now()")
    user = relationship("User", back_populates="results")
    answers = relationship("UserAnswer", back_populates="result")

class UserAnswer(Base):
    __tablename__ = "user_answers"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    result_id = Column(UUID(as_uuid=True), ForeignKey("user_test_results.id"), nullable=False)
    question_id = Column(UUID(as_uuid=True), ForeignKey("test_questions.id"), nullable=False)
    chosen_option = Column(String(1), nullable=False)
    score = Column(Integer, default=0)
    answered_at = Column(DateTime, server_default="now()")
    result = relationship("UserTestResult", back_populates="answers")
