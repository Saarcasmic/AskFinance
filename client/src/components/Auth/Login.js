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
      // alert("Login successful");

      const { access_token, refresh_token } = response.data; // Extract refresh_token
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token); // Store refresh_token


      const token = response.data.access_token;
      console.log("Token from normal login:", token);
      localStorage.setItem("token", token);

      setIsLoggedIn(true);

      const userResponse = await axios.get(`${config.API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsAdmin(userResponse.data.is_admin);

      navigate("/dashboard");
    } catch (error) {
      if (error.response?.status === 429) {
        alert("Too many login attempts. Please try again later.");
      } else if (error.response?.status === 401) {
        alert("Invalid credentials. Please try again.");
      } else if (error.response?.status === 403) {
        alert("Your account is inactive. Contact support.");
      } else {
        alert("An unexpected error occurred. Please try again.");
      }
    }
    
  };

  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

  // Handle Google login success
  const handleGoogleLoginSuccess = async (response) => {
    try {
        if (!response.credential) {
            throw new Error("Invalid Google token received.");
        }

        // const token = response.credential;
        // localStorage.setItem("token", token);

        const userResponse = await axios.post(`${config.API_BASE_URL}/google-auth/login`, {
            token: response.credential,  // Send token in the expected format
        });

        
        console.log("User response:", userResponse.data);
        const { access_token, refresh_token } = userResponse.data; // Extract refresh_token
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("refresh_token", refresh_token); // Store refresh_token

        const token = userResponse.data.access_token;
        console.log("Token from googel:", token);
        localStorage.setItem("token", token);

        setIsLoggedIn(true);
        navigate("/dashboard");
    } catch (error) {
      if (error.response?.status === 429) {
        alert("Too many login attempts. Please try again later.");
      } else if (error.response?.status === 403) {
        alert("Your account is inactive. Contact support.");
      } else {
        alert("Google login failed. Please try again.");
      }
    }
    
  };

  // Handle Google login failure
  const handleGoogleLoginFailure = (error) => {
    console.error("Google login error", error);
    alert("Google login failed. Please try again.");
  };

  
  
  

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="relative">
            {/* Background decoration */}
            <div className="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-20">
              <div className="blur-[106px] h-56 bg-gradient-to-br from-blue-900 to-gray-900"></div>
              <div className="blur-[106px] h-32 bg-gradient-to-r from-gray-900 to-blue-900"></div>
            </div>

            {/* Login Form Container */}
            <div className="relative flex flex-col items-center justify-center">
              <div className="w-full max-w-md p-8 bg-zinc-900/80 backdrop-blur-lg rounded-xl border border-zinc-800 shadow-2xl">
                <h1 className="text-4xl font-romie text-center text-white mb-8">Welcome Back</h1>
                <form onSubmit={handleLogin} className="space-y-6">
                  <div>
                    <input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-4 border border-zinc-700 rounded-lg bg-black/50 
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                               text-white placeholder-gray-400 font-gilroy"
                    />
                  </div>
                  <div>
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full p-4 border border-zinc-700 rounded-lg bg-black/50
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                               text-white placeholder-gray-400 font-gilroy"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-4 bg-white text-black rounded-full text-xl font-gilroy
                             transition-colors hover:bg-gray-100
                             focus:outline-none focus:ring-2 focus:ring-white/50"
                  >
                    Sign In
                  </button>
                </form>

                <div className="mt-6">
                  <button
                    onClick={() => navigate("/signup")}
                    className="w-full py-4 bg-zinc-800 text-white rounded-full text-xl
                             font-gilroy transition-colors hover:bg-zinc-700
                             border border-zinc-700"
                  >
                    Create Account
                  </button>
                </div>

                <div className="mt-8 flex justify-center">
                  <GoogleLogin
                    onSuccess={handleGoogleLoginSuccess}
                    onError={handleGoogleLoginFailure}
                    useOneTap
                    theme="filled_black"
                    shape="circle"
                    size="large"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
