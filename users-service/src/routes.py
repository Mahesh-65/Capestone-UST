from datetime import datetime
from bson import ObjectId
from fastapi import APIRouter, HTTPException
from src.database import users_collection
from src.schemas import UserCreate, UserLogin, UserOut, UserUpdate

router = APIRouter(prefix="/users", tags=["Users"])


def map_user(doc) -> UserOut:
    return UserOut(
        id=str(doc["_id"]),
        name=doc["name"],
        email=doc["email"],
        role=doc.get("role", "user"),
        sports_interests=doc.get("sports_interests", []),
        availability=doc.get("availability"),
        rating=float(doc.get("rating", 0.0)),
        location=doc.get("location"),
    )


@router.post("/register", response_model=UserOut)
async def register(payload: UserCreate):
    col = users_collection()
    existing = await col.find_one({"email": payload.email})
    if existing:
        raise HTTPException(status_code=409, detail="Email already registered")
    data = payload.model_dump()
    data["rating"] = 0.0
    data["created_at"] = datetime.utcnow()
    result = await col.insert_one(data)
    created = await col.find_one({"_id": result.inserted_id})
    return map_user(created)


@router.post("/login")
async def login(payload: UserLogin):
    user = await users_collection().find_one({"email": payload.email, "password": payload.password})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"message": "Login success", "session_token": f"session-{str(user['_id'])}"}


@router.get("", response_model=list[UserOut])
async def list_users(sport: str | None = None, location: str | None = None):
    filters = {}
    if sport:
        filters["sports_interests"] = {"$in": [sport]}
    if location:
        filters["location"] = {"$regex": location, "$options": "i"}
    docs = await users_collection().find(filters).to_list(500)
    return [map_user(doc) for doc in docs]


@router.get("/{user_id}", response_model=UserOut)
async def get_user(user_id: str):
    user = await users_collection().find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return map_user(user)


@router.put("/{user_id}", response_model=UserOut)
async def update_user(user_id: str, payload: UserUpdate):
    updates = {k: v for k, v in payload.model_dump().items() if v is not None}
    if updates:
        await users_collection().update_one({"_id": ObjectId(user_id)}, {"$set": updates})
    user = await users_collection().find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return map_user(user)
