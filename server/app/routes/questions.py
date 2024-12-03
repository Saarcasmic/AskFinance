from fastapi import APIRouter, HTTPException, Depends, Query
from app.database import db, to_json
from app.models.question import Question
from bson.objectid import ObjectId
from app.utils.jwt import admin_required, get_current_user
import asyncio

router = APIRouter()

@router.post("/")
async def post_question(question: Question):
    try:
        question_data = question.dict()
        result = await db["questions"].insert_one(question_data)
        question_data["_id"] = str(result.inserted_id)  # Convert ObjectId to string
        
        return {"message": "Question posted successfully", "question": question_data}
    except Exception as e:
        print("Error occurred:", e)
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/")
async def get_questions(
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=20, ge=1, le=100)
):
    try:
        # Calculate skip value for pagination
        skip = (page - 1) * limit
        
        # Fetch total count first
        total_count = await db["questions"].count_documents({})
        
        # Only fetch questions if there are results
        questions = []
        if total_count > 0:
            questions_cursor = db["questions"].find() \
                .skip(skip) \
                .limit(limit)
            
            # Fetch questions with error handling for cursor
            try:
                questions = [to_json(question) async for question in questions_cursor]
            except Exception as cursor_error:
                print(f"Error fetching from cursor: {cursor_error}")
                raise HTTPException(status_code=500, detail="Error fetching questions from database")
        
        return {
            "questions": questions,
            "total": total_count,
            "page": page,
            "limit": limit
        }
    except Exception as e:
        print(f"Error fetching questions: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while fetching questions")


@router.put("/{question_id}/approve")
async def approve_question(question_id: str):
    try:
        result = await db["questions"].update_one(
            {"_id": ObjectId(question_id)},
            {"$set": {"approved": True}}
        )
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Question not found")

        return {"message": "Question approved"}
    except Exception as e:
        print("Error occurred:", e)
        raise HTTPException(status_code=500, detail="An error occurred while approving the question")

@router.put("/{question_id}/reject")
async def reject_question(question_id: str):
    try:
        result = await db["questions"].update_one(
            {"_id": ObjectId(question_id)},
            {"$set": {"approved": True}}
        )
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Question not found")
        return {"message": "Question rejected"}
    except Exception as e:
        print("Error occurred:", e)
        raise HTTPException(status_code=500, detail="An error occurred while rejecting the question")
    
@router.delete("/{question_id}")
async def delete_question(question_id: str):
    try:
        result = await db["questions"].delete_one({"_id": ObjectId(question_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Question not found")
        return {"message": "Question deleted successfully"}
    except Exception as e:
        print("Error occurred:", e)
        raise HTTPException(status_code=500, detail="An error occurred while deleting the question")

@router.get("/pending")
async def get_pending_questions(user_id: str = None):
    try:
        # If user_id is None or empty, fetch all pending questions
        if user_id:
            questions_cursor = db["questions"].find({"approved": False, "user_id": user_id})
        else:
            # Explicitly set approved to False when fetching all pending questions
            questions_cursor = db["questions"].find({"approved": {"$in": [False, None]}})

        questions = [to_json(question) async for question in questions_cursor]
        
        # Convert to JSON if necessary
        return {"questions": questions}
    except Exception as e:
        print("Error occurred:", e)
        raise HTTPException(status_code=500, detail="An error occurred while fetching pending questions")

@router.post("/{question_id}/comments")
async def add_comment(question_id: str, comment: dict, user: dict = Depends(get_current_user)):
    try:
        # Check if the question exists
        question = await db["questions"].find_one({"_id": ObjectId(question_id)})
        if not question:
            raise HTTPException(status_code=404, detail="Question not found")

        # Authorization: User can comment on their own or approved questions
        if question["user_id"] != str(user["_id"]) and not question.get("approved", False) and not user.get("is_admin"):
            raise HTTPException(status_code=403, detail="You are not allowed to comment on this question")

        # Add user_id and question_id to the comment
        comment["user_id"] = str(user["_id"])
        comment["question_id"] = question_id
        comment["username"] = user["username"]  # Add username to the comment

        # Insert the comment into the database
        result = await db["comments"].insert_one(comment)
        comment["_id"] = str(result.inserted_id)


        return {"message": "Comment added successfully", "comment": comment}
    except Exception as e:
        print("Error occurred:", e)
        raise HTTPException(status_code=500, detail="An error occurred while adding the comment")

@router.get("/{question_id}/comments")
async def get_comments(question_id: str):
    try:
        # Fetch the comments asynchronously
        comments_cursor = db.comments.find({"question_id": question_id})
        
        # Initialize an empty list for enriched comments
        enriched_comments = []

        # Iterate asynchronously through the cursor
        async for comment in comments_cursor:
            # Fetch user information for each comment asynchronously
            user = await db.users.find_one({"_id": ObjectId(comment["user_id"])})
            comment["username"] = user["username"] if user else "Unknown User"
            
            # Append enriched comment to the list
            enriched_comments.append(to_json(comment))

        return {"comments": enriched_comments}
    except Exception as e:
        print("Error occurred:", e)
        raise HTTPException(status_code=500, detail="An error occurred while fetching comments")




@router.get("/feed")
async def get_feed():
    try:
        questions = list(db["questions"].find({"approved": True}))
        return {"feed": [to_json(question) for question in questions]}
    except Exception as e:
        print("Error occurred:", e)
        raise HTTPException(status_code=500, detail="An error occurred while fetching the feed")


@router.put("/{question_id}/edit")
async def edit_question(question_id: str, updated_data: dict):
    try:
        # Perform the update operation
        result = await db["questions"].update_one(
            {"_id": ObjectId(question_id)},
            {"$set": updated_data}
        )
        
        # Check if any document was matched
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Question not found")
        
        return {"message": "Question updated successfully"}
    
    except Exception as e:
        print("Error occurred:", e)
        raise HTTPException(status_code=500, detail="An error occurred while updating the question")


@router.delete("/{question_id}")
async def delete_question(question_id: str, user: dict = Depends(get_current_user)):
    try:
        # Convert question_id to ObjectId
        question_object_id = ObjectId(question_id)

        # Fetch the question from the database asynchronously
        question = await db["questions"].find_one({"_id": question_object_id})
        
        if not question:
            raise HTTPException(status_code=404, detail="Question not found")

        # Allow deletion only if:
        # 1. The user is the question owner, OR
        # 2. The user is an admin
        if question["user_id"] != str(user["_id"]) and not user.get("is_admin"):
            raise HTTPException(status_code=403, detail="You are not allowed to delete this question")

        # Perform the deletion asynchronously and get the result
        result = await db["questions"].delete_one({"_id": question_object_id})
        
        # Verify if the deletion was successful by checking the result
        if (await result).deleted_count == 0:
            raise HTTPException(status_code=404, detail="Question not found during deletion")

        return {"message": "Question deleted successfully"}

    except Exception as e:
        print(f"Error during question deletion: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while deleting the question")





@router.get("/test")
async def test():
    return {"message": "Questions endpoint is working"}


@router.post("/{question_id}/like")
async def like_question(question_id: str, user: dict = Depends(get_current_user)):
    try:
        # Use find_one to fetch a single question
        question = await db["questions"].find_one({"_id": ObjectId(question_id)})
        if not question:
            raise HTTPException(status_code=404, detail="Question not found")

        user_id = str(user["_id"])

        # Remove user from dislikes if they already disliked
        await db["questions"].update_one(
            {"_id": ObjectId(question_id)},
            {"$pull": {"dislikes": user_id}}
        )

        # Add user to likes if not already liked
        if user_id not in question.get("likes", []):
            await db["questions"].update_one(
                {"_id": ObjectId(question_id)},
                {"$addToSet": {"likes": user_id}}
            )
        return {"message": "Liked successfully"}
    except Exception as e:
        print("Error occurred:", e)
        raise HTTPException(status_code=500, detail="An error occurred while liking the question")


@router.post("/{question_id}/dislike")
async def dislike_question(question_id: str, user: dict = Depends(get_current_user)):
    try:
        question = db["questions"].find({"_id": ObjectId(question_id)})
        if not question:
            raise HTTPException(status_code=404, detail="Question not found")

        user_id = str(user["_id"])

        # Remove user from likes if they already liked
        await db["questions"].update_one(
            {"_id": ObjectId(question_id)},
            {"$pull": {"likes": user_id}}
        )

        # Add user to dislikes if not already disliked
        if user_id not in question.get("dislikes", []):
            await db["questions"].update_one(
                {"_id": ObjectId(question_id)},
                {"$addToSet": {"dislikes": user_id}}
            )
        return {"message": "Disliked successfully"}
    except Exception as e:
        print("Error occurred:", e)
        raise HTTPException(status_code=500, detail="An error occurred while disliking the question")
