"""Auth API routes."""
from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse, UserResponse
from app.services.auth_service import auth_service
from app.core.dependencies import get_current_user
from app.models.user import User

router = APIRouter()

@router.post("/register")
def register(data: RegisterRequest, db: Session = Depends(get_db), response: Response = None):
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(status_code=409, detail="Email already registered")
    if db.query(User).filter(User.username == data.username).first():
        raise HTTPException(status_code=409, detail="Username already taken")
    if len(data.password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters")
    user, token = auth_service.register(db, data.username, data.email, data.password)
    response.set_cookie(
        key="mbti-auth",
        value=token,
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=60 * 60 * 24 * 7
    )
    return TokenResponse(access_token=token)

@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db), response: Response = None):
    result = auth_service.login(db, data.email, data.password)
    if not result:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    user, token = result
    response.set_cookie(
        key="mbti-auth",
        value=token,
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=60 * 60 * 24 * 7
    )
    return TokenResponse(access_token=token)

@router.get("/me", response_model=UserResponse)
def get_me(user: User = Depends(get_current_user)):
    return UserResponse(id=str(user.id), username=user.username, email=user.email, is_admin=user.is_admin)

@router.post("/logout")
def logout(response: Response):
    response.delete_cookie("mbti-auth")
    return {"message": "Logged out"}
