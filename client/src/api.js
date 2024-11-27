import axios from "axios";

const API = axios.create({ baseURL: "http://127.0.0.1:8000" });

// // Add authorization token to requests
// API.interceptors.request.use((req) => {
//   if (localStorage.getItem("token")) {
//     req.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
//   }
//   return req;
// });

const API_BASE_URL = 'http://127.0.0.1:8000'; 

// Auth APIs
export const login = (formData) => API.post("/auth/login", formData);
export const signup = (formData) => API.post("/auth/signup", formData);

// Question APIs
export const getApprovedQuestions = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/questions`);
      return response.data; // Ensure this returns the correct structure
    } catch (error) {
      throw new Error("Error fetching approved questions");
    }
  };
export const postQuestion = (data) => API.post("/questions", data);
export const getPendingQuestions = async (userId) => {
  try {
    const response = await axios.get(`http://127.0.0.1:8000/questions/pending?user_id=${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching pending questions", error);
    throw error;
  }
};

export const approveQuestion = (id) => API.put(`/questions/${id}/approve`);
export const deleteQuestion = async (questionId) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("User is not authenticated");

  const response = await axios.delete(`http://127.0.0.1:8000/questions/${questionId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};

export const editQuestion = async (questionId, updatedData) => {
  const token = localStorage.getItem("token");
  const response = await axios.put(
    `http://127.0.0.1:8000/questions/${questionId}/edit`,
    updatedData,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

