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

# Define a model for the request that expects the token in the body
class GoogleLoginRequest(BaseModel):
    token: str  # token will be received in the request body

# Route for Google login
@router.post("/google-login")
async def google_login(request: GoogleLoginRequest):
    if not request.token:
        raise HTTPException(status_code=422, detail="Token field is required.")
    
    try:
        # Validate token with Google
        token_url = "https://oauth2.googleapis.com/tokeninfo"
        token_info = requests.get(f"{token_url}?id_token={request.token}")
        token_info.raise_for_status()

        user_info = token_info.json()
        return {"message": "Google login successful", "user_info": user_info}
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=400, detail=f"Google token validation failed: {str(e)}")
