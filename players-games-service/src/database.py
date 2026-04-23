import os
from motor.motor_asyncio import AsyncIOMotorClient

mongo_client = AsyncIOMotorClient(os.getenv("MONGO_URL", "mongodb://mongodb:27017"))
db = mongo_client["sports_platform"]


def games_collection():
    return db["games"]
