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
    const token = localStorage.getItem("token");
    const endpoint = userId ? `/questions/pending?user_id=${userId}` : '/questions/pending';
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching pending questions:', error);
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

const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refresh_token");
    const response = await API.post(`/auth/refresh-token`, {
      refresh_token: refreshToken,
    });
    const { access_token } = response.data;
    localStorage.setItem("access_token", access_token); // Update the access token
    return access_token;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    throw error;
  }
};

axios.interceptors.response.use(
  (response) => response, // Pass through for successful responses
  async (error) => {
    if (error.response.status === 401) {
      try {
        const newAccessToken = await refreshAccessToken();
        error.config.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axios(error.config); // Retry the failed request with the new token
      } catch (refreshError) {
        console.error("Error refreshing token:", refreshError);
        localStorage.clear(); // Clear tokens and logout user
        window.location.href = "/login";
        throw refreshError;
      }
    }
    return Promise.reject(error);
  }
);
