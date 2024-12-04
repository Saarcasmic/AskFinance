import React from "react";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-black text-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="relative">
          {/* Background decoration */}
          <div className="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-20">
            <div className="blur-[106px] h-56 bg-gradient-to-br from-blue-900 to-gray-900"></div>
            <div className="blur-[106px] h-32 bg-gradient-to-r from-gray-900 to-blue-900"></div>
          </div>

          <div className="relative text-center space-y-12">
            <div className="animated-text-container">
              <h1 className="animated-title text-7xl md:text-8xl font-bold mb-6">
                AskFinance
                <span className="block text-2xl md:text-3xl mt-4 text-gray-400 font-normal">
                  Your Finance Q&A Community
                </span>
              </h1>
            </div>
            
            <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed text-gray-300">
              Join our vibrant community of finance enthusiasts. Ask questions, share knowledge, 
              and help others navigate the world of finance.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
              <button
                onClick={() => window.location.href = "/login"}
                className="group relative px-8 py-4 text-lg font-semibold text-white bg-transparent border-2 border-blue-500 rounded-xl overflow-hidden hover:scale-105 transition-all duration-200"
              >
                <span className="relative z-10">Get Started</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              </button>
              
              <button
                onClick={() => window.location.href = "/about"}
                className="px-8 py-4 text-lg font-semibold border-2 border-gray-500 rounded-xl hover:bg-gray-800 transition-all duration-200"
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
