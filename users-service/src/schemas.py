from typing import List, Optional
from pydantic import BaseModel, Field, EmailStr


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str = Field(min_length=6)
    role: str = "user"
    sports_interests: List[str] = []
    availability: Optional[str] = None
    location: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    name: Optional[str] = None
    sports_interests: Optional[List[str]] = None
    availability: Optional[str] = None
    location: Optional[str] = None
    rating: Optional[float] = None


class UserOut(BaseModel):
    id: str
    name: str
    email: EmailStr
    role: str
    sports_interests: List[str]
    availability: Optional[str]
    rating: float
    location: Optional[str]
