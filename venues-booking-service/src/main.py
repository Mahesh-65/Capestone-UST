import os
from fastapi import FastAPI
from src.routes import router

app = FastAPI(title="Venues Booking Service", version="1.0.0")
app.include_router(router)


@app.get("/health")
async def health():
    return {"status": "ok", "service": os.getenv("SERVICE_NAME", "venues-booking-service")}
