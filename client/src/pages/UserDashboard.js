import React from "react";
import Feed from "../components/Dashboard/Feed";
import PostQuestion from "../components/Dashboard/PostQuestion";

const UserDashboard = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="relative">
          {/* Decorative background */}
          <div className="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-20">
            <div className="blur-[106px] h-56 bg-gradient-to-br from-blue-900 to-gray-900"></div>
            <div className="blur-[106px] h-32 bg-gradient-to-r from-gray-900 to-blue-900"></div>
          </div>

          {/* Main Content */}
          <div className="relative space-y-6">
            {/* Post Question Section */}
            <div className="bg-zinc-900/80 backdrop-blur-lg rounded-xl border border-zinc-800 shadow-xl p-6">
              <h2 className="text-2xl font-romie mb-6">Ask a Question</h2>
              <PostQuestion />
            </div>

            {/* Feed Section */}
            <div className="bg-zinc-900/80 backdrop-blur-lg rounded-xl border border-zinc-800 shadow-xl p-6">
              <h2 className="text-2xl font-romie mb-6">Recent Questions</h2>
              <div className="font-gilroy">
                <Feed />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
