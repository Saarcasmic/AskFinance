import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../../config";

const CommentSection = ({ questionId, isAdmin }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `${config.API_BASE_URL}/questions/${questionId}/comments`
        );
        setComments(response.data.comments);
      } catch (err) {
        setError("Failed to load comments.");
        console.error(err);
      }
    };
    fetchComments();
  }, [questionId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User is not authenticated.");

      const response = await axios.post(
        `${config.API_BASE_URL}/questions/${questionId}/comments`,
        { content: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setComments([...comments, response.data.comment]);
      setNewComment("");
    } catch (err) {
      setError("Failed to post comment. Please ensure you are logged in.");
      console.error(err);
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Comments</h3>

      {/* Error message */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Comments list */}
      <ul className="space-y-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <li
              key={comment._id}
              className="border-b pb-4 last:border-b-0 flex flex-col"
            >
              <div className="flex items-center space-x-2 mb-2">
                <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold">
                  {comment.username?.charAt(0).toUpperCase() || "U"}
                </div>
                <p className="text-sm font-medium text-gray-600">
                  {comment.username || "Unknown User"}
                </p>
              </div>
              <p className="text-gray-800 text-sm">{comment.content}</p>
            </li>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No comments yet.</p>
        )}
      </ul>

      {/* New comment form */}
      <form
        onSubmit={handleCommentSubmit}
        className="mt-6 flex flex-col space-y-4"
      >
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment"
          required
          className="w-full p-3 border rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          type="submit"
          className="self-end bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-600 transition duration-200"
        >
          Post Comment
        </button>
      </form>
    </div>
  );
};

export default CommentSection;
