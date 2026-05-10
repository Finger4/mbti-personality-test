"""Payment order model."""
import uuid
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, JSON, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base

class PaymentOrder(Base):
    __tablename__ = "payment_orders"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_no = Column(String(64), unique=True, nullable=False, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    result_id = Column(UUID(as_uuid=True), ForeignKey("user_test_results.id"), nullable=True)
    amount = Column(Integer, nullable=False)  # 单位：分，990=9.9元
    status = Column(String(20), default="pending")  # pending/paid/cancelled/expired
    pay_method = Column(String(20), nullable=True)  # wechat/alipay
    pay_url = Column(String(500), nullable=True)   # 支付链接
    paid_at = Column(DateTime, nullable=True)
    expire_at = Column(DateTime, nullable=True)
    metadata = Column(JSON, nullable=True)
    created_at = Column(DateTime, server_default="now()")
    user = relationship("User")
    result = relationship("UserTestResult")

class UnpaidResultAccess(Base):
    """记录未登录用户通过IP免费访问结果的次数"""
    __tablename__ = "unpaid_result_access"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    ip_address = Column(String(45), nullable=False, index=True)
    result_id = Column(UUID(as_uuid=True), ForeignKey("user_test_results.id"), nullable=False)
    accessed_at = Column(DateTime, server_default="now()")
