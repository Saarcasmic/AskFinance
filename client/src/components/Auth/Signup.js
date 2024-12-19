import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import config from "../../config";
import { User, Mail, Lock } from 'lucide-react';

const Signup = () => {
  const [username, setUsername] = useState(""); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      // eslint-disable-next-line
      const response = await axios.post(`${config.API_BASE_URL}/auth/signup`, {
        username,
        email,
        password,
        is_admin: false,
      });
      // alert("Signup successful");
      navigate("/login");
    } catch (error) {
      alert("Signup failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="relative">
          {/* Decorative background elements */}
          <div className="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-20">
            <div className="blur-[106px] h-56 bg-gradient-to-br from-blue-900 to-gray-900"></div>
            <div className="blur-[106px] h-32 bg-gradient-to-r from-gray-900 to-blue-900"></div>
          </div>

          {/* Main content container */}
          <div className="relative flex flex-col items-center justify-center">
            <div className="w-full max-w-md p-8 bg-zinc-900/80 backdrop-blur-lg rounded-xl border border-zinc-800 shadow-2xl">
              {/* Header section */}
              <div className="text-center space-y-2 mb-8">
                <h1 className="text-4xl font-romie text-white">Create Account</h1>
                <p className="text-gray-400 font-gilroy">Join us to get started</p>
              </div>

              {/* Form section */}
              <form onSubmit={handleSignup} className="space-y-6">
                {/* Username input */}
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-4 pl-12 border border-zinc-700 rounded-lg 
                             bg-black/50 backdrop-blur-sm 
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                             text-white placeholder-gray-400 font-gilroy
                             transition duration-200 ease-in-out"
                  />
                </div>

                {/* Email input */}
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-4 pl-12 border border-zinc-700 rounded-lg 
                             bg-black/50 backdrop-blur-sm 
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                             text-white placeholder-gray-400 font-gilroy
                             transition duration-200 ease-in-out"
                  />
                </div>

                {/* Password input */}
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-4 pl-12 border border-zinc-700 rounded-lg 
                             bg-black/50 backdrop-blur-sm 
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                             text-white placeholder-gray-400 font-gilroy
                             transition duration-200 ease-in-out"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full py-4 bg-white text-black rounded-full text-lg font-gilroy
                           transition duration-300 hover:bg-gray-100
                           focus:outline-none focus:ring-2 focus:ring-white/50
                           transform hover:scale-[1.02]"
                >
                  Create Account
                </button>
              </form>

              {/* Login redirect section */}
              <div className="mt-8 pt-6 border-t border-zinc-800">
                <button
                  onClick={() => navigate("/login")}
                  className="w-full py-4 bg-zinc-800 text-white rounded-full
                           font-gilroy transition duration-300 hover:bg-zinc-700
                           border border-zinc-700 text-lg
                           transform hover:scale-[1.02]"
                >
                  Already have an account? Sign in
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
