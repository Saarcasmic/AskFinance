from pymongo import MongoClient
from bson.objectid import ObjectId
from dotenv import load_dotenv
import os

load_dotenv()

# MongoDB Atlas connection string
MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI, tls=True)
db = client['qa_app']  # Database name

# Helper to convert MongoDB object to JSON
def to_json(data):
    if "_id" in data:
        data["_id"] = str(data["_id"])
    return data
