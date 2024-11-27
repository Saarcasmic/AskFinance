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
      await axios.put(`http://127.0.0.1:8000/questions/${questionId}/approve`);
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
      await axios.put(`http://127.0.0.1:8000/questions/${questionId}/reject`);
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
      await axios.delete(`http://127.0.0.1:8000/questions/${questionId}`);
      alert("Question deleted successfully!");
      setQuestions((prevQuestions) =>
        prevQuestions.filter((question) => question._id !== questionId)
      );
    } catch (error) {
      alert("Failed to delete question");
    }
  };

  if (loading) {
    return <div className="text-center text-lg text-blue-600">Loading questions...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Manage Questions</h2>
      {questions.length === 0 ? (
        <p className="text-center text-gray-600">No questions available</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="py-3 px-4 text-left">Title</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((question, index) => (
                <tr
                  key={question._id}
                  className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"} border-b`}
                >
                  <td className="py-3 px-4">{question.title}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded text-sm font-semibold ${
                        question.approved
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {question.approved ? "Approved" : "Pending"}
                    </span>
                  </td>
                  <td className="py-3 px-4 flex space-x-2">
                    {question.approved ? (
                      <button
                        onClick={() => handleReject(question._id)}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                      >
                        Reject
                      </button>
                    ) : (
                      <button
                        onClick={() => handleApprove(question._id)}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                      >
                        Approve
                      </button>
                    )  
                    }
                    <button
                      onClick={() => handleDelete(question._id)}
                      className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
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
