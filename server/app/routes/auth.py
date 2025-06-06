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
from motor.motor_asyncio import AsyncIOMotorClient
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
    try:
        user = await db.users.find_one({"email": email})
        if not user:
            return False
        
        failed_attempts = user.get("failed_login_attempts", 0)
        last_attempt = user.get("last_failed_login", None)
        
        # Reset attempts if last attempt was more than 15 minutes ago
        if last_attempt and (datetime.utcnow() - last_attempt) > timedelta(minutes=15):
            await db.users.update_one(
                {"email": email},
                {"$set": {"failed_login_attempts": 0}}
            )
            return False
            
        return failed_attempts >= 5
    except Exception as e:
        print(f"Error checking login attempts: {e}")
        return False

async def record_login_attempt(email: str, success: bool) -> None:
    """Record login attempt status"""
    try:
        if success:
            await db.users.update_one(
                {"email": email},
                {
                    "$set": {
                        "failed_login_attempts": 0,
                        "last_successful_login": datetime.utcnow()
                    }
                }
            )
        else:
            await db.users.update_one(
                {"email": email},
                {
                    "$inc": {"failed_login_attempts": 1},
                    "$set": {"last_failed_login": datetime.utcnow()}
                }
            )
    except Exception as e:
        print(f"Error recording login attempt: {e}")




# Sign up route
@router.post("/signup", status_code=status.HTTP_201_CREATED)
@limiter.limit("5/minute")
async def signup(request: Request, user_data: UserSignup):
    try:
        # Create index for email if it doesn't exist
        try:
            await db.users.create_index([("email", 1)], unique=True)
        except Exception as index_error:
            print(f"Index creation error: {index_error}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database configuration error"
            )
        
        # Check if user exists using the index
        try:
            existing_user = await db.users.find_one({"email": user_data.email})
            if existing_user:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Email already registered"
                )
        except Exception as find_error:
            print(f"User lookup error: {find_error}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error checking user existence"
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
        
        try:
            await db.users.insert_one(new_user_data)
        except Exception as insert_error:
            print(f"User insertion error: {insert_error}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error creating user account"
            )
        
        # Generate tokens
        try:
            access_token = create_access_token(
                data={"sub": user_data.email, "user_id": str(new_user_data["_id"])}
            )
            refresh_token = create_access_token(
                data={"sub": user_data.email, "user_id": str(new_user_data["_id"])},
                is_refresh_token=True
            )
        except Exception as token_error:
            print(f"Token generation error: {token_error}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error generating authentication tokens"
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
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Unexpected signup error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred during signup"
        )

# Traditional login route (email and password)

@router.post("/login")
@limiter.limit("10/minute")
async def login(request: Request, credentials: LoginRequest):
    try:
        # Find user in database
        user = None
        try:
            user = await db.users.find_one({"email": credentials.email})
            if user:
                user['_id'] = str(user['_id'])
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
        
        # Generate tokens
        try:
            access_token = create_access_token(
                data={"sub": user["email"], "user_id": user["_id"]}
            )
            refresh_token = create_access_token(
                data={"sub": user["email"], "user_id": user["_id"]},
                is_refresh_token=True
            )
        except Exception as jwt_error:
            print(f"JWT generation error: {jwt_error}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Token generation failed"
            )
        
        return LoginResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
            user={
                "email": user["email"],
                "username": user.get("username", ""),
                "id": user["_id"],
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
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    try:
        # Convert ObjectId to string for JSON serialization
        if current_user and "_id" in current_user:
            current_user["_id"] = str(current_user["_id"])
        
        return {
            "email": current_user["email"],
            "username": current_user.get("username", ""),
            "id": current_user["_id"],
            "is_admin": current_user.get("is_admin", False)
        }
    except Exception as e:
        print(f"Error in /me endpoint: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error fetching user information"
        )

@router.post("/logout")
async def logout(user: dict = Depends(get_current_user)):
    # In a production environment, you might want to blacklist the token
    # or implement a token revocation mechanism
    return {"message": "Successfully logged out"}
