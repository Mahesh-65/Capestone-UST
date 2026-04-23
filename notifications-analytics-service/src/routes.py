import os
from datetime import datetime
import httpx
from fastapi import APIRouter
from src.database import notifications_collection
from src.schemas import NotificationCreate

router = APIRouter(tags=["NotificationsAnalytics"])


@router.post("/notifications")
async def create_notification(payload: NotificationCreate):
    data = payload.model_dump()
    data["created_at"] = datetime.utcnow()
    data["status"] = "sent"
    res = await notifications_collection().insert_one(data)
    data["id"] = str(res.inserted_id)
    return data


@router.get("/notifications/{user_id}")
async def get_notifications(user_id: str):
    docs = await notifications_collection().find({"user_id": user_id}).sort("created_at", -1).to_list(200)
    for doc in docs:
        doc["id"] = str(doc["_id"])
    return docs


@router.get("/analytics/overview")
async def analytics_overview():
    endpoints = [
        ("users", os.getenv("USERS_SERVICE_URL", "http://users-service:8001") + "/users"),
        ("games", os.getenv("GAMES_SERVICE_URL", "http://players-games-service:8002") + "/games"),
        ("venues", os.getenv("VENUES_SERVICE_URL", "http://venues-booking-service:8003") + "/venues"),
        ("tournaments", os.getenv("TOURNAMENTS_SERVICE_URL", "http://tournaments-leaderboard-service:8004") + "/tournaments"),
        ("products", os.getenv("BILLING_SERVICE_URL", "http://billing-shop-service:8005") + "/products"),
    ]
    result = {"generated_at": datetime.utcnow().isoformat(), "counts": {}}
    async with httpx.AsyncClient(timeout=8.0) as client:
        for name, url in endpoints:
            try:
                response = await client.get(url)
                data = response.json() if response.status_code == 200 else []
                result["counts"][name] = len(data) if isinstance(data, list) else 0
            except Exception:
                result["counts"][name] = 0
    return result
