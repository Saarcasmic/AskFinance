import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "../../config";

const ManageQuestions = () => {
  const [questions, setQuestions] = useState([]); // Ensure it's an array
  const [loading, setLoading] = useState(true);

  // Fetch questions on component mount
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`${config.API_BASE_URL}/questions`);
        if (Array.isArray(response.data.questions)) {
          setQuestions(response.data.questions);
        } else {
          console.error("Expected an array of questions but got:", response.data);
          setQuestions([]); // Set an empty array if response is not as expected
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
        setQuestions([]); // Set an empty array in case of an error
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  // Approve a question
  const handleApprove = async (questionId) => {
    try {
      await axios.put(`${config.API_BASE_URL}/questions/${questionId}/approve`);
      alert("Question approved successfully!");
      setQuestions((prevQuestions) =>
        prevQuestions.map((question) =>
          question._id === questionId ? { ...question, approved: true } : question
        )
      );
    } catch (error) {
      alert("Failed to approve question");
    }
  };

  // Reject a question
  const handleReject = async (questionId) => {
    try {
      await axios.put(`${config.API_BASE_URL}/questions/${questionId}/reject`);
      alert("Question rejected successfully!");
      setQuestions((prevQuestions) =>
        prevQuestions.map((question) =>
          question._id === questionId ? { ...question, approved: false } : question
        )
      );
    } catch (error) {
      alert("Failed to reject question");
    }
  };

  // Delete a question
  const handleDelete = async (questionId) => {
    try {
      await axios.delete(`${config.API_BASE_URL}/questions/${questionId}`);
      alert("Question deleted successfully!");
      setQuestions((prevQuestions) =>
        prevQuestions.filter((question) => question._id !== questionId)
      );
    } catch (error) {
      alert("Failed to delete question");
    }
  };

  if (loading) {
    return (
      <div className="text-center text-lg text-blue-400 font-gilroy">
        Loading questions...
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 min-h-screen bg-black">
      <h2 className="text-3xl font-romie text-center text-white mb-6">
        Manage Questions
      </h2>
      
      {questions.length === 0 ? (
        <p className="text-center text-gray-400 font-gilroy">
          No questions available
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-zinc-900/80 backdrop-blur-lg shadow-xl rounded-lg overflow-hidden border border-zinc-800">
            <thead className="bg-black/60">
              <tr className="font-gilroy">
                <th className="py-4 px-4 text-left text-white">Title</th>
                <th className="py-4 px-4 text-left text-white">Status</th>
                <th className="py-4 px-4 text-left text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((question, index) => (
                <tr
                  key={question._id}
                  className={`${
                    index % 2 === 0 ? "bg-black/40" : "bg-zinc-900/40"
                  } border-b border-zinc-800 font-gilroy`}
                >
                  <td className="py-4 px-4 text-gray-300">
                    {question.title}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        question.approved
                          ? "bg-blue-900/50 text-blue-300"
                          : "bg-yellow-900/50 text-yellow-300"
                      }`}
                    >
                      {question.approved ? "Approved" : "Pending"}
                    </span>
                  </td>
                  <td className="py-4 px-4 flex space-x-2">
                    {question.approved ? (
                      <button
                        onClick={() => handleReject(question._id)}
                        className="px-4 py-2 bg-red-900/50 text-red-300 rounded-lg 
                                 hover:bg-red-800/50 transition-colors border border-red-800"
                      >
                        Reject
                      </button>
                    ) : (
                      <button
                        onClick={() => handleApprove(question._id)}
                        className="px-4 py-2 bg-blue-900/50 text-blue-300 rounded-lg 
                                 hover:bg-blue-800/50 transition-colors border border-blue-800"
                      >
                        Approve
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(question._id)}
                      className="px-4 py-2 bg-zinc-800 text-gray-300 rounded-lg 
                               hover:bg-zinc-700 transition-colors border border-zinc-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageQuestions;
