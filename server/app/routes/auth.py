from fastapi import APIRouter, HTTPException, Depends
from app.database import db
from app.models.user import User
from pydantic import BaseModel
from app.utils.hashing import hash_password, verify_password
from app.utils.jwt import create_access_token, admin_required, get_current_user
from google.auth.transport.requests import Request
from fastapi.security import OAuth2PasswordBearer

router = APIRouter()

class LoginRequest(BaseModel):
    email: str
    password: str

# OAuth2PasswordBearer to manage token authorization
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Sign up route
@router.post("/signup")
async def signup(user: User):
    # print("Received:", user)
    existing_user = db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user.password = hash_password(user.password)
    db.users.insert_one(user.dict())
    return {"message": "User created successfully"}

# Traditional login route (email and password)
@router.post("/login")
async def login(request: LoginRequest):
    user = db.users.find_one({"email": request.email})
    if not user or not verify_password(request.password, user["password"]):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    access_token = create_access_token(data={"sub": user["email"], "user_id": str(user["_id"]), "username": user["username"]})
    return {"access_token": access_token, "token_type": "bearer"}

# Get current user details
@router.get("/me")
async def get_current_user_details(user: dict = Depends(get_current_user)):
    return {
        "email": user["email"],
        "is_admin": user.get("is_admin", False),
    }
