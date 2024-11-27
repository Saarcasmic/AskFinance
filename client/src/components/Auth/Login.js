import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import config from "../../config";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setIsLoggedIn, setIsAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

  // Handle normal login with email and password
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${config.API_BASE_URL}/auth/login`, {
        email,
        password,
      });
      alert("Login successful");

      const token = response.data.access_token;
      localStorage.setItem("token", token);

      setIsLoggedIn(true);

      const userResponse = await axios.get(`${config.API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsAdmin(userResponse.data.is_admin);

      navigate("/dashboard");
    } catch (error) {
      alert("Login failed. Please check your credentials.");
    }
  };

  // Handle Google login success
  const handleGoogleLoginSuccess = async (response) => {
    try {
        if (!response.credential) {
            throw new Error("Invalid Google token received.");
        }

        const token = response.credential;
        localStorage.setItem("token", token);

        const userResponse = await axios.post(`${config.API_BASE_URL}/auth/google-login`, {
            token: token,  // Send token in the expected format
        });

        const { access_token } = userResponse.data;
        localStorage.setItem("token", access_token);
        setIsLoggedIn(true);
        navigate("/dashboard");
    } catch (error) {
        console.error("Google login failed", error);
        alert("Google login failed. Please try again.");
    }
};

  
  
  
  
  
  

  // Handle Google login failure
  const handleGoogleLoginFailure = (error) => {
    console.error("Google login error", error);
    alert("Google login failed. Please try again.");
  };

  return (
    <GoogleOAuthProvider clientId="1030108090732-7pl8nojvrq5joutvuruqbisnfspfabu6.apps.googleusercontent.com">
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-green-500 to-blue-500 text-white">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">Login</h1>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 mb-4 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 mb-6 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              type="submit"
              className="w-full py-4 bg-green-500 text-white rounded-md text-xl font-semibold transition duration-300 hover:bg-green-600"
            >
              Login
            </button>
          </form>
          <div className="mt-6 text-center">
            <button
              className="w-full py-4 bg-blue-500 text-white rounded-md text-xl font-semibold transition duration-300 hover:bg-blue-600"
              onClick={() => navigate("/signup")}
            >
              Signup
            </button>
          </div>

          <div className="mt-6">
            {/* Google OAuth Button */}
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={handleGoogleLoginFailure}
              useOneTap
              theme="filled_blue"
              shape="circle"
              size="large"
            />
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
