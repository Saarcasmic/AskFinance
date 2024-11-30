from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.database import db
from app.models.user import User
from app.utils.jwt import create_access_token
import requests

router = APIRouter()

# Request model for Google login
class GoogleLoginRequest(BaseModel):
    token: str

@router.post("/login")
async def google_login(request: GoogleLoginRequest):
    try:
        token = request.token
        print("Received token:", token)  # Debugging log

        # Verify the Google token
        url = "https://oauth2.googleapis.com/tokeninfo"
        response = requests.get(f"{url}?id_token={token}")
        response.raise_for_status()

        # Parse user info
        user_info = response.json()
        print("Google user info:", user_info)  # Debugging log

        email = user_info.get("email")
        if not email:
            raise HTTPException(status_code=400, detail="Email not provided by Google")

        # Check if the user already exists in the database
        existing_user = db.users.find_one({"email": email})
        print("Existing user:", existing_user)  # Debugging log

        if not existing_user:
            # Create a new user
            print("Creating new user for email:", email)  # Debugging log
            new_user = User(
                email=email,
                username=user_info.get("name", "Google User"),
                password=None,
            )
            db.users.insert_one(new_user.dict())
            existing_user = new_user.dict()

        # Generate access token
        access_token = create_access_token(
            data={"sub": existing_user["email"], "user_id": str(existing_user["_id"])}
        )
        return {"access_token": access_token, "token_type": "bearer"}

    except Exception as e:
        print("Error during Google login:", e)  # Debugging log
        raise HTTPException(status_code=400, detail=f"Google login failed: {str(e)}")

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Google login failed: {str(e)}")
