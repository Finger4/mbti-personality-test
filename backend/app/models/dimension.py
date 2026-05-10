"""Test dimension model."""
import uuid
from sqlalchemy import Column, String, Text, Integer
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base

class TestDimension(Base):
    __tablename__ = "test_dimensions"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    code = Column(String(2), unique=True, nullable=False)
    name_cn = Column(String(20), nullable=False)
    name_en = Column(String(20), nullable=False)
    pole_a = Column(String(10), nullable=False)
    pole_b = Column(String(10), nullable=False)
    description = Column(Text, nullable=True)
    sort_order = Column(Integer, default=0)
