from pymongo import MongoClient
from bson.objectid import ObjectId

# MongoDB Atlas connection string
MONGO_URI = "mongodb+srv://saarcasmic:Qw3%23Qw3%23@qna-app.bkinh.mongodb.net/?retryWrites=true&w=majority&appName=QnA-app"
client = MongoClient(MONGO_URI, tls=True)
db = client['qa_app']  # Database name

# Helper to convert MongoDB object to JSON
def to_json(data):
    if "_id" in data:
        data["_id"] = str(data["_id"])
    return data
