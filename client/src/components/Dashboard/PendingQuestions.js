import React, { useEffect, useState, useContext } from "react";
import { getPendingQuestions, deleteQuestion } from "../../api";
import CommentSection from "./CommentSection";
import { AuthContext } from "../../AuthContext";

const PendingQuestions = () => {
  const [pendingQuestions, setPendingQuestions] = useState([]);
  const [expandedComments, setExpandedComments] = useState(null); // Track expanded comment sections
  const [error, setError] = useState("");
  const { isAdmin } = useContext(AuthContext);

  const decodeJwt = (token) => {
    if (!token) {
      console.warn("No token found for decoding.");
      return null;
    }

    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const decodedData = atob(base64);
      return JSON.parse(decodedData);
    } catch (err) {
      console.error("Error decoding JWT token:", err);
      return null;
    }
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("User not logged in.");
          return;
        }

        const decodedToken = decodeJwt(token);
        if (!decodedToken || !decodedToken.user_id) {
          setError("Invalid or missing token. Please log in again.");
          return;
        }

        const userId = decodedToken.user_id;
        const response = await getPendingQuestions(isAdmin ? null : userId);

        if (Array.isArray(response.questions)) {
          setPendingQuestions(response.questions);
        } else {
          setPendingQuestions([]);
        }
      } catch (err) {
        setError("Failed to load pending questions. Please try again later.");
        console.error(err);
      }
    };

    fetchQuestions();
  }, [isAdmin]);

  const handleToggleComments = (questionId) => {
    setExpandedComments((prev) => (prev === questionId ? null : questionId));
  };

  const handleDelete = async (questionId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this question?"
    );
    if (!confirmed) return;

    try {
      const response = await deleteQuestion(questionId);
      alert(response.message);
      setPendingQuestions(
        pendingQuestions.filter((question) => question._id !== questionId)
      );
    } catch (err) {
      alert("Failed to delete the question. Please try again.");
      console.error(err);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg font-medium text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Your Pending Questions
        </h1>
        {pendingQuestions.length > 0 ? (
          pendingQuestions.map((question) => (
            <div
              key={question._id}
              className="bg-white shadow-sm border border-gray-200 rounded-lg p-4 mb-6"
            >
              {/* Question Title */}
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {question.title}
              </h3>

              {/* Question Description */}
              <p className="text-gray-700 text-sm mb-4">{question.description}</p>

              {/* Buttons and Actions */}
              <div className="flex items-center justify-between">
                {/* Comments Toggle Button */}
                <button
                  className="text-blue-600 font-semibold hover:text-blue-800 transition"
                  onClick={() => handleToggleComments(question._id)}
                >
                  {expandedComments === question._id
                    ? "Hide Comments"
                    : "Comments"}
                </button>

                {/* Edit and Delete Buttons */}
                {(isAdmin ||
                  question.user_id ===
                    decodeJwt(localStorage.getItem("token"))?.user_id) && (
                  <div className="flex gap-4">
                    <button
                      className="text-red-600 hover:text-red-900 transition"
                      onClick={() => handleDelete(question._id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>

              {/* Conditionally Render Comment Section */}
              {expandedComments === question._id && (
                <div className="mt-4">
                  <CommentSection
                    questionId={question._id}
                    isAdmin={isAdmin}
                  />
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No pending questions available.</p>
        )}
      </div>
    </div>
  );
};

export default PendingQuestions;
