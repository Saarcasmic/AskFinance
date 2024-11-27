from fastapi import APIRouter, HTTPException
from fastapi.responses import RedirectResponse
import os
from dotenv import load_dotenv
from fastapi_oauth2 import OAuth2Authorize, OAuth2AccessToken

load_dotenv()  # Load environment variables from .env

router = APIRouter()

# Configuration
GOOGLE_CLIENT_ID = os.getenv("1030108090732-7pl8nojvrq5joutvuruqbisnfspfabu6.apps.googleusercontent.com")
GOOGLE_CLIENT_SECRET = os.getenv("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")
REDIRECT_URI = os.getenv("https://askfinance.netlify.app/auth/callback")  # e.g., http://localhost:8000/auth/google/callback

google_oauth = OAuth2Authorize(
    client_id=GOOGLE_CLIENT_ID,
    client_secret=GOOGLE_CLIENT_SECRET,
    authorize_url="https://accounts.google.com/o/oauth2/auth",
    access_token_url="https://oauth2.googleapis.com/token",
    scope="openid email profile",
)

# Route for initiating Google OAuth
@router.get("/google/login")
async def google_login():
    url = google_oauth.get_authorize_url(redirect_uri=REDIRECT_URI)
    return RedirectResponse(url)

# Callback route
@router.get("/google/callback")
async def google_callback(code: str):
    try:
        # Exchange authorization code for access token
        token = await google_oauth.get_access_token(
            code=code, redirect_uri=REDIRECT_URI
        )
        user_info = await google_oauth.get_user_info(
            token.access_token,
            user_info_url="https://openidconnect.googleapis.com/v1/userinfo",
        )
        return {
            "access_token": token.access_token,
            "user_info": user_info,
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"OAuth2 error: {str(e)}")
