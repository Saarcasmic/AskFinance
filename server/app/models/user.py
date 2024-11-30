from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from bson import ObjectId

class User(BaseModel):
    email: str
    username: str
    password: Optional[str] = None
    is_admin: bool = False
    _id: Optional[ObjectId] = Field(default_factory=ObjectId, alias="_id")

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: str
        }

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserSignup(BaseModel):
    email: EmailStr
    username: str
    password: str
