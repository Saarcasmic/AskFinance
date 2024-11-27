import React from "react";

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center bg-gradient-to-b from-green-500 to-green-700 text-white">
      <h1 className="text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg">
        Welcome to the Q&A App
      </h1>
      <p className="text-lg md:text-xl max-w-2xl leading-relaxed mb-8">
        Post finance-related questions, get answers, and help others! Join a
        vibrant community of finance enthusiasts and share your knowledge.
      </p>
      <button
        className="bg-yellow-400 text-black font-semibold px-8 py-4 rounded-lg shadow-md transform transition duration-300 hover:bg-yellow-500 hover:scale-105"
        onClick={() => (window.location.href = "/dashboard")}
      >
        Get Started
      </button>
    </div>
  );
};

export default HomePage;
