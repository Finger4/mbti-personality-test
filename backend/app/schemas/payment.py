"""Payment schemas."""
from pydantic import BaseModel
from typing import Optional, List

class CreateOrderRequest(BaseModel):
    result_id: str
    amount: int = 990  # 默认9.9元（分）

class OrderResponse(BaseModel):
    order_no: str
    amount: int
    pay_url: Optional[str] = None
    qrcode_url: Optional[str] = None
    status: str
    expire_minutes: int = 30

class OrderStatusRequest(BaseModel):
    order_no: str

class OrderStatusResponse(BaseModel):
    order_no: str
    status: str  # pending/paid/cancelled/expired
    paid_at: Optional[str] = None

class PayCallbackRequest(BaseModel):
    order_no: str
    status: str
    pay_method: Optional[str] = None

class UnlockedResultResponse(BaseModel):
    result_id: str
    unlocked: bool
    reason: Optional[str] = None
