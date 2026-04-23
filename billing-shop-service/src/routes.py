from datetime import datetime
from bson import ObjectId
from fastapi import APIRouter, HTTPException
from src.database import bills_collection, carts_collection, orders_collection, products_collection
from src.schemas import BillCreate, ProductCreate

router = APIRouter(tags=["BillingShop"])


@router.post("/bills/split")
async def split_bill(payload: BillCreate):
    split_amount = round(payload.total_amount / max(1, len(payload.player_ids)), 2)
    data = payload.model_dump()
    data["split_amount"] = split_amount
    data["paid_by"] = []
    data["created_at"] = datetime.utcnow()
    res = await bills_collection().insert_one(data)
    data["id"] = str(res.inserted_id)
    return data


@router.post("/bills/{bill_id}/pay/{user_id}")
async def mark_paid(bill_id: str, user_id: str):
    await bills_collection().update_one({"_id": ObjectId(bill_id)}, {"$addToSet": {"paid_by": user_id}})
    return {"message": "Payment status updated"}


@router.post("/products")
async def create_product(payload: ProductCreate):
    data = payload.model_dump()
    data["created_at"] = datetime.utcnow()
    res = await products_collection().insert_one(data)
    data["id"] = str(res.inserted_id)
    return data


@router.get("/products")
async def list_products(category: str | None = None):
    filters = {"category": {"$regex": category, "$options": "i"}} if category else {}
    docs = await products_collection().find(filters).to_list(400)
    for doc in docs:
        doc["id"] = str(doc["_id"])
    return docs


@router.post("/cart/{user_id}/{product_id}")
async def add_to_cart(user_id: str, product_id: str, qty: int = 1):
    product = await products_collection().find_one({"_id": ObjectId(product_id)})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    await carts_collection().update_one(
        {"user_id": user_id},
        {"$push": {"items": {"product_id": product_id, "qty": qty, "price": product["price"]}}},
        upsert=True,
    )
    return {"message": "Added to cart"}


@router.post("/orders/{user_id}")
async def checkout(user_id: str, team_name: str | None = None, player_name: str | None = None, jersey_number: str | None = None, color: str | None = None):
    cart = await carts_collection().find_one({"user_id": user_id})
    if not cart or not cart.get("items"):
        raise HTTPException(status_code=400, detail="Cart empty")
    total = sum(item["price"] * item["qty"] for item in cart["items"])
    order = {
        "user_id": user_id,
        "items": cart["items"],
        "total": total,
        "status": "placed",
        "custom_jersey": {"team_name": team_name, "player_name": player_name, "jersey_number": jersey_number, "color": color},
        "created_at": datetime.utcnow(),
    }
    result = await orders_collection().insert_one(order)
    await carts_collection().update_one({"user_id": user_id}, {"$set": {"items": []}}, upsert=True)
    order["id"] = str(result.inserted_id)
    return order
