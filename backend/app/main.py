"""FastAPI main entry."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, test, user, admin, contact
from app.database import engine, Base

Base.metadata.create_all(bind=engine)

app = FastAPI(title="MBTI Personality Test API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(test.router, prefix="/api/test", tags=["test"])
app.include_router(user.router, prefix="/api/user", tags=["user"])
app.include_router(admin.router, prefix="/api/admin", tags=["admin"])
app.include_router(contact.router, prefix="/api/contact", tags=["contact"])

@app.get("/api/health")
def health():
    return {"status": "ok"}
