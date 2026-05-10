"""Schemas."""
from app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse, UserResponse
from app.schemas.test import (
    AnswerSubmit, TestSubmitRequest, TestSubmitResponse,
    QuestionResponse, TestResultData, TestHistoryItem
)
from app.schemas.payment import (
    CreateOrderRequest, OrderResponse, OrderStatusRequest,
    OrderStatusResponse, PayCallbackRequest, UnlockedResultResponse
)
