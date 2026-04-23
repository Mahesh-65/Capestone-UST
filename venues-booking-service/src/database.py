import os
from motor.motor_asyncio import AsyncIOMotorClient

mongo_client = AsyncIOMotorClient(os.getenv("MONGO_URL", "mongodb://mongodb:27017"))
db = mongo_client["sports_platform"]


def venues_collection():
    return db["venues"]


def bookings_collection():
    return db["bookings"]
