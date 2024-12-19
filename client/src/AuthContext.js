import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import config from "./config";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true); // Track loading state

  // Check login state on app load
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token found:", token);
    if (token) {
      axios
        .get(`${config.API_BASE_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,  // Make sure token is being passed
            'Content-Type': 'application/json'
        },
        withCredentials: true
        })
        .then((response) => {
          setIsLoggedIn(true);
          setIsAdmin(response.data.is_admin); // Assume the API returns `is_admin`
          
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          setIsLoggedIn(false); // Reset state on error
        })
        .finally(() => {
          setLoading(false); // Ensure loading is set to false
        });
    } else {
      setIsLoggedIn(false);
      setLoading(false); // No token, loading is complete
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        isAdmin,
        setIsAdmin,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
