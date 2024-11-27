from pydantic import BaseModel
from typing import Optional, List

class Question(BaseModel):
    title: str
    description: Optional[str] = None
    tags: List[str]
    approved: bool = False
    user_id: str
