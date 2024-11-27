from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import RedirectResponse
import os
from dotenv import load_dotenv
import requests
from pydantic import BaseModel

# Load environment variables from .env
load_dotenv()

# Configuration - Make sure to load these from your environment variables
GOOGLE_CLIENT_ID = os.getenv("1030108090732-7pl8nojvrq5joutvuruqbisnfspfabu6.apps.googleusercontent.com")
GOOGLE_CLIENT_SECRET = os.getenv("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")
REDIRECT_URI = os.getenv("https://askfinance.netlify.app/auth/callback")  # This should be something like 'https://askfinance.netlify.app/auth/callback'

router = APIRouter()

# Define the token response model
class Token(BaseModel):
    access_token: str
    token_type: str

# Route for initiating Google OAuth
@router.get("/google-login")
async def google_login():
    """Redirect the user to Google's OAuth2 authorization page"""
    google_auth_url = (
        f"https://accounts.google.com/o/oauth2/v2/auth?"
        f"client_id={GOOGLE_CLIENT_ID}&redirect_uri={REDIRECT_URI}&"
        f"response_type=code&scope=openid email profile"
    )
    return RedirectResponse(url=google_auth_url)

# Callback route to handle Google OAuth callback
@router.get("/google/callback")
async def google_callback(code: str):
    """Exchanges the authorization code for an access token."""
    try:
        # Exchange the authorization code for an access token
        token_url = "https://oauth2.googleapis.com/token"
        token_data = {
            "code": code,
            "client_id": GOOGLE_CLIENT_ID,
            "client_secret": GOOGLE_CLIENT_SECRET,
            "redirect_uri": REDIRECT_URI,
            "grant_type": "authorization_code"
        }

        # Send a POST request to get the token
        token_response = requests.post(token_url, data=token_data)
        token_response.raise_for_status()  # Raise error if response is unsuccessful
        token_data = token_response.json()

        # Extract the access token from the response
        access_token = token_data.get("access_token")
        if not access_token:
            raise HTTPException(status_code=400, detail="Access token not found")

        # Fetch user info from Google using the access token
        user_info_url = "https://www.googleapis.com/oauth2/v3/userinfo"
        user_info_response = requests.get(user_info_url, headers={"Authorization": f"Bearer {access_token}"})
        user_info_response.raise_for_status()  # Raise error if response is unsuccessful
        user_info = user_info_response.json()

        # Return the access token and user info
        return {
            "access_token": access_token,
            "user_info": user_info
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"OAuth2 error: {str(e)}")

