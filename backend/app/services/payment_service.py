"""Payment service - PxPay integration."""
import uuid
import time
import hashlib
import httpx
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.models.payment import PaymentOrder

# PxPay 配置（需替换为真实商户号）
PXPAY_CONFIG = {
    "app_id": "YOUR_APP_ID",       # 商户号
    "app_key": "YOUR_APP_KEY",     # 商户密钥
    "gateway": "https://api.pxpay.com/pay",  # PxPay网关
    "notify_url": "YOUR_NOTIFY_URL", # 回调地址
}

def generate_order_no() -> str:
    """生成唯一订单号：时间戳+随机"""
    return f"MBTI{int(time.time()*1000)}{uuid.uuid4().hex[:6].upper()}"

def calculate_sign(params: dict, app_key: str) -> str:
    """计算签名"""
    sorted_params = sorted(params.items())
    sign_str = "&".join([f"{k}={v}" for k, v in sorted_params])
    sign_str += f"&key={app_key}"
    return hashlib.md5(sign_str.encode()).hexdigest().upper()

def create_payment_order(
    db: Session,
    user_id: str | None,
    result_id: str,
    amount: int = 990
) -> PaymentOrder:
    """创建支付订单"""
    order_no = generate_order_no()
    order = PaymentOrder(
        order_no=order_no,
        user_id=uuid.UUID(user_id) if user_id else None,
        result_id=uuid.UUID(result_id),
        amount=amount,
        status="pending",
        expire_at=datetime.utcnow() + timedelta(minutes=30),
    )
    db.add(order)
    db.commit()
    db.refresh(order)
    return order

def generate_pxpay_url(order: PaymentOrder, pay_method: str = "wechat") -> str:
    """生成 PxPay 支付链接"""
    params = {
        "app_id": PXPAY_CONFIG["app_id"],
        "out_trade_no": order.order_no,
        "total_fee": order.amount,
        "trade_type": "NATIVE",
        "body": "MBTI深度分析报告",
        "notify_url": PXPAY_CONFIG["notify_url"],
        "mch_create_ip": "127.0.0.1",
    }
    sign = calculate_sign(params, PXPAY_CONFIG["app_key"])
    params["sign"] = sign
    
    # 返回支付URL（实际应调用PxPay API获取）
    # 这里返回模拟链接，实际需替换为真实API调用
    pay_url = f'{PXPAY_CONFIG["gateway"]}?app_id={params["app_id"]}&out_trade_no={order.order_no}&total_fee={order.amount}&trade_type=NATIVE&body={params["body"]}&sign={sign}'
    return pay_url

def verify_pxpay_callback(params: dict) -> bool:
    """验证PxPay回调签名"""
    received_sign = params.get("sign", "")
    sign = calculate_sign({k: v for k, v in params.items() if k != "sign"}, PXPAY_CONFIG["app_key"])
    return sign == received_sign

def check_order_status(db: Session, order_no: str) -> PaymentOrder | None:
    """查询订单状态"""
    return db.query(PaymentOrder).filter(PaymentOrder.order_no == order_no).first()

def mark_order_paid(db: Session, order_no: str, pay_method: str = "unknown") -> bool:
    """标记订单为已支付"""
    order = check_order_status(db, order_no)
    if not order or order.status != "pending":
        return False
    order.status = "paid"
    order.pay_method = pay_method
    order.paid_at = datetime.utcnow()
    db.commit()
    return True
