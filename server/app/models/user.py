from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class User(BaseModel):
    username: str
    email: EmailStr
    password: Optional[str] = Field(None)  # Password is now optional
    is_admin: bool = False

class UserLogin(BaseModel):
    email: EmailStr
    password: str
