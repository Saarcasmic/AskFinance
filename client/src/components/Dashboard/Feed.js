import React, { useEffect, useState, useContext } from "react";
import { getApprovedQuestions, deleteQuestion, editQuestion, likeQuestion,dislikeQuestion } from "../../api";
import CommentSection from "./CommentSection";
import { AuthContext } from "../../AuthContext";

const Feed = () => {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", description: "", tags: "" });
  const [expandedComments, setExpandedComments] = useState(null);
  const [error, setError] = useState("");
  const { isAdmin } = useContext(AuthContext);

  const decodeJwt = (token) => {
    if (!token) return null;
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      return JSON.parse(atob(base64));
    } catch (err) {
      console.error("Error decoding token:", err);
      return null;
    }
  };

  const token = localStorage.getItem("token");
  const decodedToken = token ? decodeJwt(token) : null;
  const userId = decodedToken?.user_id;

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await getApprovedQuestions();
        if (Array.isArray(response.questions)) {
          const approvedQuestions = response.questions.filter(
            (question) => question.approved === true
          );
          setQuestions(approvedQuestions);
          setFilteredQuestions(approvedQuestions);
          
          // Extract unique tags
          const tags = new Set();
          approvedQuestions.forEach(question => {
            question.tags.forEach(tag => tags.add(tag));
          });
          setAvailableTags(Array.from(tags));
        } else {
          setQuestions([]);
          setFilteredQuestions([]);
        }
      } catch (err) {
        setError("Failed to load questions. Please try again.");
        console.error(err);
      }
    };
    fetchQuestions();
  }, []);

  // New search and filter functionality
  useEffect(() => {
    const filterQuestions = () => {
      let filtered = [...questions];

      // Filter by search term
      if (searchTerm) {
        filtered = filtered.filter(question =>
          question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          question.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Filter by selected tags
      if (selectedTags.length > 0) {
        filtered = filtered.filter(question =>
          selectedTags.every(tag => question.tags.includes(tag))
        );
      }

      setFilteredQuestions(filtered);
    };

    filterQuestions();
  }, [searchTerm, selectedTags, questions]);

  const handleTagSelect = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  // Search component
  const SearchAndFilter = () => (
    <div className="mb-6">
      <div className="bg-white shadow-md rounded-lg p-4">
        <input
          type="text"
          placeholder="Search questions..."
          className="w-full p-2 border rounded mb-4"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Filter by tags:</h3>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagSelect(tag)}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedTags.includes(tag)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );


  const handleDelete = async (questionId) => {
    const confirmed = window.confirm("Are you sure you want to delete this question?");
    if (!confirmed) return;

    try {
      const response = await deleteQuestion(questionId);
      alert(response.message);
      setQuestions(questions.filter((question) => question._id !== questionId));
    } catch (err) {
      alert("Failed to delete the question. Please try again.");
      console.error(err);
    }
  };

  const handleEdit = (question) => {
    setEditingQuestionId(question._id);
    setEditForm({
      title: question.title,
      description: question.description,
      tags: question.tags.join(", "),
    });
  };

  const handleSave = async (questionId) => {
    try {
      const updatedData = {
        title: editForm.title,
        description: editForm.description,
        tags: editForm.tags.split(",").map((tag) => tag.trim()),
      };
      const response = await editQuestion(questionId, updatedData);
      alert(response.message);

      setQuestions(
        questions.map((question) =>
          question._id === questionId ? { ...question, ...updatedData } : question
        )
      );
      setEditingQuestionId(null);
    } catch (err) {
      alert("Failed to update the question. Please try again.");
      console.error(err);
    }
  };


  const handleLike = async (questionId) => {
    try {
      await likeQuestion(questionId);
      
      setQuestions(questions.map((q) => {
        if (q._id === questionId) {
          // Initialize arrays if they don't exist
          const currentLikes = Array.isArray(q.likes) ? q.likes : [];
          const currentDislikes = Array.isArray(q.dislikes) ? q.dislikes : [];
          
          return {
            ...q,
            likes: currentLikes.includes(userId) ? currentLikes : [...currentLikes, userId],
            dislikes: currentDislikes.filter(id => id !== userId)
          };
        }
        return q;
      }));
    } catch (err) {
      console.error("Error liking the question:", err);
      alert("Failed to like the question.");
    }
  };

  const handleDislike = async (questionId) => {
    try {
      await dislikeQuestion(questionId);
      
      setQuestions(questions.map((q) => {
        if (q._id === questionId) {
          // Initialize arrays if they don't exist
          const currentLikes = Array.isArray(q.likes) ? q.likes : [];
          const currentDislikes = Array.isArray(q.dislikes) ? q.dislikes : [];
          
          return {
            ...q,
            dislikes: currentDislikes.includes(userId) ? currentDislikes : [...currentDislikes, userId],
            likes: currentLikes.filter(id => id !== userId)
          };
        }
        return q;
      }));
    } catch (err) {
      console.error("Error disliking the question:", err);
      alert("Failed to dislike the question.");
    }
  };
  
  

  const handleCancel = () => {
    setEditingQuestionId(null);
  };

  const handleToggleComments = (questionId) => {
    setExpandedComments(expandedComments === questionId ? null : questionId);
  };

  if (error) {
    return <div className="text-center text-red-600 text-lg py-4">{error}</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen py-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Approved Questions
        </h1>
        <SearchAndFilter />
        {filteredQuestions.length > 0 ? (
          filteredQuestions.map((question) => (
            // ... your existing question rendering code ...
            <div key={question._id} className="bg-white shadow-md rounded-lg p-4 mb-6">
              {editingQuestionId === question._id ? (
                <>
                  <input
                    type="text"
                    className="w-full p-2 border rounded mb-2"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  />
                  <textarea
                    className="w-full p-2 border rounded mb-2"
                    value={editForm.description}
                    onChange={(e) =>
                      setEditForm({ ...editForm, description: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    className="w-full p-2 border rounded mb-4"
                    value={editForm.tags}
                    onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
                  />
                  <div className="flex gap-2">
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded"
                      onClick={() => handleSave(question._id)}
                    >
                      Save
                    </button>
                    <button
                      className="bg-gray-500 text-white px-4 py-2 rounded"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-gray-800 mb-2">{question.title}</h2>
                  <p className="text-gray-700 mb-4">{question.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {question.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <button
                      className="text-blue-600 font-semibold hover:text-blue-800 transition"
                      onClick={() => handleToggleComments(question._id)}
                    >
                      {expandedComments === question._id
                        ? "Hide Comments"
                        : `Comments`}
                    </button>
                    <button
                      className={`text-green-600 font-semibold ${
                        question.likes?.includes(userId) ? "text-green-800" : ""
                      }`}
                      onClick={() => handleLike(question._id)}
                    >
                      👍 {question.likes?.length || 0}
                    </button>
                    <button
                      className={`text-red-600 font-semibold ${
                        question.dislikes?.includes(userId) ? "text-red-800" : ""
                      }`}
                      onClick={() => handleDislike(question._id)}
                    >
                      👎 {question.dislikes?.length || 0}
                    </button>

                    {(isAdmin || question.user_id === userId) && (
                      <div className="flex gap-2">
                        <button
                          className="text-gray-600 hover:text-gray-900"
                          onClick={() => handleEdit(question)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900"
                          onClick={() => handleDelete(question._id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                  {expandedComments === question._id && (
                    <div className="mt-4">
                      <CommentSection questionId={question._id} isAdmin={isAdmin} />
                    </div>
                  )}
                </>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">
            {questions.length > 0 
              ? "No questions match your search criteria."
              : "No approved questions available."}
          </p>
        )}
        
        
      </div>
    </div>
  );
};

export default Feed;
