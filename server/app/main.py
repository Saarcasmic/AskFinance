from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, questions
from app.routes.google import router as google_auth_router

app = FastAPI()

# CORS configuration
origins = [
    "http://localhost:3000",  # Your local development frontend URL (if used)
    "https://askfinance.netlify.app",  # Your frontend URL on Netlify
]

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://askfinance.netlify.app"],  # Add your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Include routes
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(questions.router, prefix="/questions", tags=["Questions"])
app.include_router(questions.router, prefix="/comments", tags=["Comments"])

# Google OAuth routes
app.include_router(google_auth_router, prefix="/google-auth", tags=["Google OAuth"])

@app.get("/")
def read_root():
    return {"message": "Hello, World!"}
