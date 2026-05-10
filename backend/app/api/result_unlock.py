"""Result unlock verification - replaces inline unlock check in test.py."""
import uuid
from app.database import get_db
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.payment import PaymentOrder, UnpaidResultAccess
from app.models.result import UserTestResult
from app.core.dependencies import get_current_user, get_current_user_optional

router = APIRouter(prefix="/result", tags=["result_unlock"])

def is_result_unlocked(db: Session, result_id: str, user_id: str | None = None, ip: str = None) -> bool:
    """检查结果是否已解锁付费内容"""
    result_uuid = uuid.UUID(result_id)
    
    # 1. 已登录用户：检查付费订单
    if user_id:
        paid_order = db.query(PaymentOrder).filter(
            PaymentOrder.result_id == result_uuid,
            PaymentOrder.user_id == uuid.UUID(user_id),
            PaymentOrder.status == "paid"
        ).first()
        if paid_order:
            return True
        
        # 检查是否新用户首条免费
        user_orders = db.query(PaymentOrder).filter(
            PaymentOrder.user_id == uuid.UUID(user_id),
            PaymentOrder.status == "paid"
        ).count()
        if user_orders == 0:
            # 第一个结果免费
            return True
    
    # 2. 未登录用户：限制免费次数
    if ip:
        free_access_count = db.query(UnpaidResultAccess).filter(
            UnpaidResultAccess.ip_address == ip
        ).count()
        if free_access_count < 3:
            # 记录访问
            access = UnpaidResultAccess(ip_address=ip, result_id=result_uuid)
            db.add(access)
            db.commit()
            return True
        return False
    
    return False

@router.get("/{result_id}/full")
def api_get_full_result(
    result_id: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user_optional),
    ip_address: str = "127.0.0.1",
):
    """获取完整结果（含付费内容）"""
    result = db.query(UserTestResult).filter(
        UserTestResult.id == uuid.UUID(result_id)
    ).first()
    
    if not result:
        raise HTTPException(status_code=404, detail="结果不存在")
    
    user_id = str(current_user.id) if current_user else None
    
    # 验证是否解锁
    if not is_result_unlocked(db, result_id, user_id, ip_address):
        raise HTTPException(
            status_code=403,
            detail="需要付费解锁",
        )
    
    # 返回完整结果
    return build_full_result_response(result)
