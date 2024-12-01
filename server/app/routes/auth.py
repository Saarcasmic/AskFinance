from fastapi import APIRouter, HTTPException, Depends, Request, status
from fastapi.security import OAuth2PasswordBearer
from typing import Optional
from datetime import datetime, timedelta
from pydantic import BaseModel, EmailStr
from app.database import db
from app.models.user import User, UserSignup
from app.utils.hashing import hash_password, verify_password
from app.utils.jwt import create_access_token, admin_required, get_current_user
from slowapi import Limiter
from slowapi.util import get_remote_address
from fastapi_cache import FastAPICache
from fastapi_cache.decorator import cache
from bson import ObjectId
import jwt
from typing import Dict
from dotenv import load_dotenv
import os

load_dotenv()

JWT_SECRET_KEY = os.getenv("SECRET_KEY", "default-secret-key")
JWT_ALGORITHM = "HS256"

router = APIRouter()

# Rate limiter setup
limiter = Limiter(key_func=get_remote_address)

class LoginRequest(BaseModel):
    email: str
    password: str


class TokenRefreshRequest(BaseModel):
    refresh_token: str

class LoginResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str
    user: Dict

# OAuth2PasswordBearer to manage token authorization
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


# Constants
MAX_LOGIN_ATTEMPTS = 5
LOGIN_ATTEMPT_WINDOW = 15  # minutes
ACCOUNT_LOCKOUT_DURATION = 30  # minutes

async def check_login_attempts(email: str) -> bool:
    """Check if user has exceeded login attempts"""
    current_time = datetime.utcnow()
    window_start = current_time - timedelta(minutes=LOGIN_ATTEMPT_WINDOW)
    
    attempts = db.login_attempts.count_documents({
        "email": email,
        "timestamp": {"$gte": window_start},
        "success": False
    })
    
    return attempts >= MAX_LOGIN_ATTEMPTS

async def record_login_attempt(email: str, success: bool):
    """Record login attempt for rate limiting"""
    db.login_attempts.insert_one({
        "email": email,
        "timestamp": datetime.utcnow(),
        "success": success
    })




# Sign up route
@router.post("/signup", status_code=status.HTTP_201_CREATED)
@limiter.limit("5/minute")
async def signup(request: Request, user_data: UserSignup):
    try:
        # Create index for email if it doesn't exist
        db.users.create_index([("email", 1)], unique=True)
        
        # Check if user exists using the index
        if await db.users.find_one({"email": user_data.email}):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email already registered"
            )
        
        # Create new user with additional security fields
        new_user_data = {
            "_id": ObjectId(),
            "email": user_data.email,
            "username": user_data.username,
            "password": hash_password(user_data.password),
            "is_admin": False,
            "created_at": datetime.utcnow(),
            "last_login": None,
            "account_status": "active"
        }
        
        await db.users.insert_one(new_user_data)
        
        # Generate tokens
        access_token = create_access_token(
            data={"sub": user_data.email, "user_id": str(new_user_data["_id"])}
        )
        refresh_token = create_access_token(
            data={"sub": user_data.email, "user_id": str(new_user_data["_id"])},
            expires_delta=timedelta(days=30)
        )
        
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "user": {
                "email": user_data.email,
                "username": user_data.username,
                "id": str(new_user_data["_id"])
            }
        }
        
    except Exception as e:
        if "duplicate key error" in str(e).lower():
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email already registered"
            )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while creating your account"
        )

# Traditional login route (email and password)

@router.post("/login")
@limiter.limit("10/minute")
async def login(request: Request, credentials: LoginRequest):
    try:
        # Check login attempts
        if await check_login_attempts(credentials.email):
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Too many login attempts. Please try again later."
            )
        
        # Find user in database
        user = None
        try:
            user = await db.users.find_one({"email": credentials.email})
        except Exception as db_error:
            print(f"Database error during login: {db_error}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database error occurred"
            )
        
        # Validate user credentials
        if not user or not user.get("password") or not verify_password(credentials.password, user["password"]):
            await record_login_attempt(credentials.email, False)
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )
        
        # Check account status
        if user.get("account_status", "inactive") != "active":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account is not active"
            )
        
        # Update last login
        await db.users.update_one(
            {"_id": user["_id"]},
            {
                "$set": {
                    "last_login": datetime.utcnow(),
                    "failed_login_attempts": 0
                }
            }
        )
        
        # Generate tokens
        try:
            access_token = create_access_token(
                data={"sub": user["email"], "user_id": str(user["_id"])}
            )
            refresh_token = create_access_token(
                data={"sub": user["email"], "user_id": str(user["_id"])},
                expires_delta=timedelta(days=30)
            )
        except Exception as jwt_error:
            print(f"JWT generation error: {jwt_error}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Token generation failed"
            )
        
        # Record successful login
        try:
            await record_login_attempt(credentials.email, True)
        except Exception as record_error:
            print(f"Error recording login attempt: {record_error}")
        
        return LoginResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
            user={
                "email": user["email"],
                "username": user["username"],
                "id": str(user["_id"]),
                "is_admin": user.get("is_admin", False)
            }
        )
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Unexpected error during login: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during login"
        )


@router.post("/refresh-token")
async def refresh_token(request: TokenRefreshRequest):
    try:
        payload = jwt.decode(
            request.refresh_token,
            JWT_SECRET_KEY,
            algorithms=[JWT_ALGORITHM]
        )
        email = payload.get("sub")
        user_id = payload.get("user_id")
        
        if not email or not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token"
            )
            
        user = await db.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
            
        access_token = create_access_token(
            data={"sub": email, "user_id": user_id}
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer"
        }
        
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token has expired"
        )
    except jwt.JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )

@router.get("/me")
@cache(expire=300)  # Cache for 5 minutes
async def get_current_user_details(user: dict = Depends(get_current_user)):
    return {
        "email": user["email"],
        "username": user["username"],
        "is_admin": user.get("is_admin", False),
        "last_login": user.get("last_login"),
        "account_status": user.get("account_status")
    }

@router.post("/logout")
async def logout(user: dict = Depends(get_current_user)):
    # In a production environment, you might want to blacklist the token
    # or implement a token revocation mechanism
    return {"message": "Successfully logged out"}
