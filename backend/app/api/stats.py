"""Stats API."""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.stats import PageStats
import redis
from app.config import settings

router = APIRouter()

def get_redis():
    return redis.from_url(settings.REDIS_URL, decode_responses=True)

@router.post("/track")
def track_page(page: str = "home"):
    r = get_redis()
    key = f"stats:{page}"
    views = r.incr(key)
    return {"page": page, "views": views}

@router.get("/stats")
def get_stats():
    r = get_redis()
    home_views = int(r.get("stats:home") or 0)
    test_views = int(r.get("stats:test") or 0)
    return {
        "home_views": home_views,
        "test_views": test_views,
        "total_views": home_views + test_views
    }
