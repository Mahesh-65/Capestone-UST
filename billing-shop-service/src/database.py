import os
from motor.motor_asyncio import AsyncIOMotorClient

mongo_client = AsyncIOMotorClient(os.getenv("MONGO_URL", "mongodb://mongodb:27017"))
db = mongo_client["sports_platform"]


def bills_collection():
    return db["bills"]


def products_collection():
    return db["products"]


def carts_collection():
    return db["carts"]


def orders_collection():
    return db["orders"]
