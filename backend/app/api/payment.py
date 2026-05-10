"""Payment API routes."""
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.payment import (
    CreateOrderRequest, OrderResponse, OrderStatusRequest, OrderStatusResponse, PayCallbackRequest
)
from app.services.payment_service import (
    create_payment_order, generate_pxpay_url, check_order_status, mark_order_paid
)
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/api/payment", tags=["payment"])

@router.post("/create", response_model=OrderResponse)
def api_create_order(
    req: CreateOrderRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user(optional=True)),
):
    """创建支付订单"""
    user_id = str(current_user.id) if current_user else None
    order = create_payment_order(db, user_id, req.result_id, req.amount)
    pay_url = generate_pxpay_url(order)
    
    return OrderResponse(
        order_no=order.order_no,
        amount=order.amount,
        pay_url=pay_url,
        status=order.status,
        expire_minutes=30,
    )

@router.post("/status", response_model=OrderStatusResponse)
def api_order_status(
    req: OrderStatusRequest,
    db: Session = Depends(get_db),
):
    """查询订单支付状态"""
    order = check_order_status(db, req.order_no)
    if not order:
        raise HTTPException(status_code=404, detail="订单不存在")
    
    return OrderStatusResponse(
        order_no=order.order_no,
        status=order.status,
        paid_at=order.paid_at.isoformat() if order.paid_at else None,
    )

@router.post("/callback")
def api_pay_callback(
    req: PayCallbackRequest,
    db: Session = Depends(get_db),
):
    """支付回调（由PxPay调用）"""
    if req.status == "success":
        mark_order_paid(db, req.order_no, req.pay_method or "unknown")
    return {"code": 0, "msg": "ok"}

@router.get("/check-unlock/{result_id}")
def api_check_unlock(
    result_id: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user(optional=True)),
):
    """检查结果是否已解锁付费内容"""
    from app.models.payment import PaymentOrder, UnpaidResultAccess
    
    user_id = str(current_user.id) if current_user else None
    
    # 1. 已登录用户：检查是否有paid订单
    if user_id:
        paid_order = db.query(PaymentOrder).filter(
            PaymentOrder.result_id == result_id,
            PaymentOrder.user_id == uuid.UUID(user_id),
            PaymentOrder.status == "paid"
        ).first()
        if paid_order:
            return {"result_id": result_id, "unlocked": True}
    
    # 2. 未登录用户：检查IP免费次数限制（最多3次）
    # 这里简化处理，实际可记录IP
    
    # 3. 检查结果是否免费赠送（可配置）
    # 默认新用户第一个结果免费
    return {"result_id": result_id, "unlocked": False, "reason": "pay_required"}
