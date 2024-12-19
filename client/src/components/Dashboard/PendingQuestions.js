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

  console.log("HEYYYYY");

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        console.log("Fetching pending questions");
        const token = localStorage.getItem("token");
        if (!token) {
          setError("User not logged in.");
          return;
        }

        console.log("Token:", token);

        const decodedToken = decodeJwt(token);
        console.log("Decoded Token:", decodedToken);
        if (!decodedToken || !decodedToken.user_id) {
          setError("Invalid or missing token. Please log in again.");
          localStorage.removeItem("token");
          return;
        }

        console.log("Fetching pending questions with user ID:", decodedToken.user_id);
        console.log("Is admin:", isAdmin);
        
        // Add a guard clause to prevent unnecessary fetches
        if (!decodedToken.user_id) {
          console.warn("Skipping fetch - no user ID available");
          return;
        }

        const response = await getPendingQuestions(decodedToken.user_id);
        
        if (response && Array.isArray(response.questions)) {
          setPendingQuestions(response.questions);
          setError("");
        } else {
          console.warn("Unexpected response format:", response);
          setPendingQuestions([]);
        }
      } catch (err) {
        console.error("Error in fetchQuestions:", err);
        setError("Failed to load pending questions. Please try again later.");
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
      <div className="min-h-screen flex items-center justify-center bg-black">
        <p className="text-lg font-gilroy text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="relative">
          {/* Decorative background */}
          <div className="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-20">
            <div className="blur-[106px] h-56 bg-gradient-to-br from-blue-900 to-gray-900"></div>
            <div className="blur-[106px] h-32 bg-gradient-to-r from-gray-900 to-blue-900"></div>
          </div>

          {/* Main Content */}
          <div className="relative space-y-6">
            <div className="bg-zinc-900/80 backdrop-blur-lg rounded-xl border border-zinc-800 shadow-xl p-6">
              <h1 className="text-3xl font-romie text-white text-center mb-8">
                Your Pending Questions
              </h1>

              {pendingQuestions.length > 0 ? (
                pendingQuestions.map((question) => (
                  <div
                    key={question._id}
                    className="bg-white/80 backdrop-blur-sm shadow-md border border-gray-200 rounded-lg p-6 mb-8 transition hover:shadow-lg"
                  >
                    {/* Question Title */}
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {question.title}
                    </h3>

                    {/* Question Description */}
                    <p className="text-gray-700 text-sm mb-4">
                      {question.description}
                    </p>

                    {/* Buttons and Actions */}
                    <div className="flex items-center justify-between">
                      {/* Comments Toggle Button */}
                      <button
                        className="text-blue-700 font-medium hover:text-blue-900 transition"
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
                            className="text-red-600 hover:text-red-800 transition"
                            onClick={() => handleDelete(question._id)}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Conditionally Render Comment Section */}
                    {expandedComments === question._id && (
                      <div className="mt-6">
                        <CommentSection
                          questionId={question._id}
                          isAdmin={isAdmin}
                        />
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-400 font-gilroy">
                  No pending questions available.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingQuestions;
