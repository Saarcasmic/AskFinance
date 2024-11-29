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

        const userResponse = await axios.post(`${config.API_BASE_URL}/google-auth/login`, {
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
      <div className="min-h-screen bg-gradient-to-b from-green-500 via-green-600 to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="relative">
            {/* Background decoration */}
            <div className="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-40 dark:opacity-20">
              <div className="blur-[106px] h-56 bg-gradient-to-br from-yellow-100 to-green-200"></div>
              <div className="blur-[106px] h-32 bg-gradient-to-r from-green-200 to-yellow-100"></div>
            </div>

            {/* Login Form Container */}
            <div className="relative flex flex-col items-center justify-center">
              <div className="w-full max-w-md p-8 bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl">
                <h1 className="text-4xl font-bold text-center text-white mb-8">Welcome Back</h1>
                <form onSubmit={handleLogin} className="space-y-6">
                  <div>
                    <input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-4 border-2 border-white/20 rounded-lg bg-white/10 backdrop-blur-sm 
                               focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent
                               text-white placeholder-white/60"
                    />
                  </div>
                  <div>
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full p-4 border-2 border-white/20 rounded-lg bg-white/10 backdrop-blur-sm
                               focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent
                               text-white placeholder-white/60"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-4 bg-green-400 text-white rounded-lg text-xl font-semibold
                             transition duration-300 hover:bg-green-300 hover:shadow-lg
                             focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    Sign In
                  </button>
                </form>

                <div className="mt-6">
                  <button
                    onClick={() => navigate("/signup")}
                    className="w-full py-4 bg-white/10 backdrop-blur-sm text-white rounded-lg text-xl
                             font-semibold transition duration-300 hover:bg-white/20
                             border-2 border-white/20"
                  >
                    Create Account
                  </button>
                </div>

                <div className="mt-8 flex justify-center">
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
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
