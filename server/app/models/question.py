from pydantic import BaseModel, Field
from typing import Optional, List

class Question(BaseModel):
    title: str
    description: Optional[str] = None
    tags: List[str]
    approved: bool = False
    user_id: str
    likes: List[str] = Field(default_factory=list)  # List of user IDs who liked
    dislikes: List[str] = Field(default_factory=list)  # List of user IDs who disliked
