"""FastAPI main entry."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.api import auth, test, user, contact, admin, payment, result_unlock

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="MBTI Personality Test API",
    version="1.0.0",
    description="MBTI 十六型人格测试后端 API",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router)
app.include_router(test.router)
app.include_router(user.router)
app.include_router(contact.router)
app.include_router(admin.router)
app.include_router(payment.router)
app.include_router(result_unlock.router)

@app.get("/")
def root():
    return {"message": "MBTI Personality Test API", "version": "1.0.0"}

@app.get("/health")
def health():
    return {"status": "ok"}
