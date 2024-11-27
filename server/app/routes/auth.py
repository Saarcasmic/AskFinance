from fastapi import APIRouter, HTTPException, Depends
from app.database import db
from app.models.user import User
from pydantic import BaseModel
from app.utils.hashing import hash_password, verify_password
from app.utils.jwt import create_access_token, admin_required, get_current_user
import google.auth
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
    print("Received:", user)
    existing_user = db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user.password = hash_password(user.password)
    db.users.insert_one(user.dict())
    return {"message": "User created successfully"}

# Traditional login route (email and password)
@router.post("/login")
async def login(request: LoginRequest):
    print("Received Request:", request)
    user = db.users.find_one({"email": request.email})
    if not user or not verify_password(request.password, user["password"]):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    access_token = create_access_token(data={"sub": user["email"], "user_id": str(user["_id"]), "username": user["username"]})
    return {"access_token": access_token, "token_type": "bearer"}

# Google OAuth login route
@router.post("/google-login")
async def google_login(token: str):
    try:
        # Verify the token with Google
        credentials, project = google.auth.default()
        credentials = google.auth.credentials.Credentials.from_authorized_user_info(info=token)

        if not credentials.valid:
            credentials.refresh(Request())  # Refresh the token if needed

        # Token is valid, proceed with user authentication
        # Get user info
        user_info = await get_google_user_info(credentials.token)
        # Check if the user already exists in the database
        existing_user = db.users.find_one({"email": user_info["email"]})

        if not existing_user:
            # If user doesn't exist, create a new one
            new_user = User(email=user_info["email"], username=user_info["name"])
            db.users.insert_one(new_user.dict())
            existing_user = new_user

        access_token = create_access_token(data={"sub": existing_user.email, "user_id": str(existing_user["_id"]), "username": existing_user.username})
        return {"access_token": access_token, "token_type": "bearer"}
    
    except Exception as e:
        raise HTTPException(status_code=403, detail="Invalid or expired Google token")

# Helper function to fetch user info from Google
async def get_google_user_info(token: str):
    # Using the token to retrieve user info from Google
    url = "https://www.googleapis.com/oauth2/v3/userinfo"
    headers = {"Authorization": f"Bearer {token}"}
    response = await db.client.http_client.get(url, headers=headers)
    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Failed to retrieve user information from Google.")
    return response.json()

# Get current user details
@router.get("/me")
async def get_current_user_details(user: dict = Depends(get_current_user)):
    return {
        "email": user["email"],
        "is_admin": user.get("is_admin", False),
    }
