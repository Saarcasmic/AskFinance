from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import requests
import os
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env

# Configuration
GOOGLE_CLIENT_ID = os.getenv("1030108090732-7pl8nojvrq5joutvuruqbisnfspfabu6.apps.googleusercontent.com")
GOOGLE_CLIENT_SECRET = os.getenv("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")
REDIRECT_URI = os.getenv("https://askfinance.netlify.app/auth/callback")  # Ensure this is correct

router = APIRouter()


# Define a model for the request
class GoogleLoginRequest(BaseModel):
    token: str

# Route for Google login
@router.post("/google-login")
async def google_login(request: GoogleLoginRequest):
    """Exchange the Google OAuth token for a valid session."""
    try:
        token = request.token
        # Validate the token with Google
        token_url = "https://oauth2.googleapis.com/tokeninfo"
        token_info = requests.get(f"{token_url}?id_token={token}")
        token_info.raise_for_status()  # Raise error if the request fails

        # Parse user info from the response
        user_info = token_info.json()

        # Perform any necessary actions like creating a user or logging in
        # For example, find or create the user in the database
        # user = find_or_create_user(user_info)

        return {"message": "Google login successful", "user_info": user_info}

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Google login failed: {str(e)}")
