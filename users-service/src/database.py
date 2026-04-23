import os
from motor.motor_asyncio import AsyncIOMotorClient
from redis.asyncio import Redis

MONGO_URL = os.getenv("MONGO_URL", "mongodb://mongodb:27017")
REDIS_URL = os.getenv("REDIS_URL", "redis://redis:6379")
SERVICE_NAME = os.getenv("SERVICE_NAME", "users-service")

mongo_client = AsyncIOMotorClient(MONGO_URL)
db = mongo_client["sports_platform"]
redis_client = Redis.from_url(REDIS_URL, decode_responses=True)


def users_collection():
    return db["users"]
