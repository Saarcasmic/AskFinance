from fastapi import FastAPI
from app.routes import auth, questions
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS configuration
origins = [
    "http://localhost:3000",  # Your frontend URL
]


# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://askfinance.netlify.app"],  # Replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(questions.router, prefix="/questions", tags=["Questions"])
app.include_router(questions.router, prefix="/comments")


@app.get("/")
def read_root():
    return {"message": "Hello, World!"}