import os
from fastapi import FastAPI
from src.routes import router

app = FastAPI(title="Users Service", version="1.0.0")
app.include_router(router)


@app.get("/health")
async def health():
    return {"status": "ok", "service": os.getenv("SERVICE_NAME", "users-service")}
