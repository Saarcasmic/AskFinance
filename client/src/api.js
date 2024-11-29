import axios from "axios";
// import config from "./config";

// Create an instance of Axios with the backend URL
const API = axios.create({ baseURL: "https://askfinance.onrender.com" });

// Add authorization token to requests (optional for protected endpoints)
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Auth APIs
export const login = (formData) => API.post(`/auth/login`, formData);
export const signup = (formData) => API.post(`/auth/signup`, formData);

// Question APIs
export const getApprovedQuestions = async () => {
  try {
    const response = await API.get(`/questions`);
    return response.data; // Ensure this returns the correct structure
  } catch (error) {
    console.error("Error fetching approved questions", error);
    throw error;
  }
};

export const postQuestion = (data) => API.post(`/questions`, data);

export const getPendingQuestions = async (userId) => {
  try {
    // Check if the user is an admin, and pass null if they are
    const response = await API.get(`/questions/pending?user_id=${userId || null}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching pending questions", error);
    throw error;
  }
};

export const approveQuestion = (id) => API.put(`/questions/${id}/approve`);

export const deleteQuestion = async (questionId) => {
  try {
    const response = await API.delete(`/questions/${questionId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting question", error);
    throw error;
  }
};

export const editQuestion = async (questionId, updatedData) => {
  try {
    const response = await API.put(`/questions/${questionId}/edit`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Error editing question", error);
    throw error;
  }
};

export const likeQuestion = async (questionId) => {
  try {
    const response = await API.post(`/questions/${questionId}/like`);
    return response.data;
  } catch (error) {
    console.error("Error liking question", error);
    throw error;
  }
};

export const dislikeQuestion = async (questionId) => {
  try {
    const response = await API.post(`/questions/${questionId}/dislike`);
    return response.data;
  } catch (error) {
    console.error("Error disliking question", error);
    throw error;
  }
};
