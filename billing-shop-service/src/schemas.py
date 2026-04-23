from pydantic import BaseModel


class BillCreate(BaseModel):
    total_amount: float
    player_ids: list[str]
    description: str


class ProductCreate(BaseModel):
    name: str
    category: str
    price: float
    inventory: int
    customizable: bool = False
