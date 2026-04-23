import os
from datetime import datetime
from bson import ObjectId
import httpx
from fastapi import APIRouter, HTTPException
from src.database import games_collection
from src.schemas import GameCreate

USERS_SERVICE_URL = os.getenv("USERS_SERVICE_URL", "http://users-service:8001")
VENUES_SERVICE_URL = os.getenv("VENUES_SERVICE_URL", "http://venues-booking-service:8003")

router = APIRouter(prefix="/games", tags=["Games"])


@router.post("")
async def create_game(payload: GameCreate):
    async with httpx.AsyncClient(timeout=8.0) as client:
        user_res = await client.get(f"{USERS_SERVICE_URL}/users/{payload.organizer_id}")
        if user_res.status_code != 200:
            raise HTTPException(status_code=400, detail="Organizer does not exist")
        venue_res = await client.get(f"{VENUES_SERVICE_URL}/venues/{payload.turf_id}")
        if venue_res.status_code != 200:
            raise HTTPException(status_code=400, detail="Turf not found")
    game = payload.model_dump()
    game.update({"players": [], "invited_players": [], "created_at": datetime.utcnow()})
    result = await games_collection().insert_one(game)
    game["_id"] = result.inserted_id
    game["id"] = str(game["_id"])
    return game


@router.get("")
async def search_games(sport: str | None = None, turf_name: str | None = None, area: str | None = None):
    filters = {}
    if sport:
        filters["sport"] = {"$regex": sport, "$options": "i"}
    if area:
        filters["area"] = {"$regex": area, "$options": "i"}
    docs = await games_collection().find(filters).to_list(400)
    response = []
    for item in docs:
        item["id"] = str(item["_id"])
        response.append(item)
    if turf_name:
        response = [g for g in response if turf_name.lower() in g["title"].lower()]
    return response


@router.post("/{game_id}/join/{user_id}")
async def join_game(game_id: str, user_id: str):
    game = await games_collection().find_one({"_id": ObjectId(game_id)})
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")
    if user_id in game["players"]:
        return {"message": "Already joined"}
    if len(game["players"]) >= game["max_players"]:
        raise HTTPException(status_code=400, detail="Game full")
    await games_collection().update_one({"_id": ObjectId(game_id)}, {"$push": {"players": user_id}})
    return {"message": "Joined game"}


@router.post("/{game_id}/leave/{user_id}")
async def leave_game(game_id: str, user_id: str):
    await games_collection().update_one({"_id": ObjectId(game_id)}, {"$pull": {"players": user_id}})
    return {"message": "Left game"}


@router.post("/{game_id}/invite/{user_id}")
async def invite_player(game_id: str, user_id: str):
    await games_collection().update_one({"_id": ObjectId(game_id)}, {"$addToSet": {"invited_players": user_id}})
    return {"message": "Player invited"}
