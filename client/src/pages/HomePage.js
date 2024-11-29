import React from "react";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-500 via-green-600 to-green-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="relative">
          {/* Background decoration */}
          <div className="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-40 dark:opacity-20">
            <div className="blur-[106px] h-56 bg-gradient-to-br from-yellow-100 to-green-200"></div>
            <div className="blur-[106px] h-32 bg-gradient-to-r from-green-200 to-yellow-100"></div>
          </div>

          <div className="relative text-center space-y-12">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in-down">
              Welcome to AskFinance
              <span className="block text-2xl md:text-3xl mt-4 text-green-100 font-normal">
                Your Finance Q&A Community
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed text-green-50">
              Join our vibrant community of finance enthusiasts. Ask questions, share knowledge, 
              and help others navigate the world of finance.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
              <button
                onClick={() => window.location.href = "/login"}
                className="group relative px-8 py-4 text-lg font-semibold text-green-700 bg-white rounded-xl shadow-md overflow-hidden hover:scale-105 transition-all duration-200"
              >
                <span className="relative z-10">Get Started</span>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-200 to-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              </button>
              
              <button
                onClick={() => window.location.href = "/about"}
                className="px-8 py-4 text-lg font-semibold border-2 border-white rounded-xl hover:bg-white/10 transition-all duration-200"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
