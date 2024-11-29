import React from "react";
import Feed from "../components/Dashboard/Feed";
import PostQuestion from "../components/Dashboard/PostQuestion";
import { MessageSquarePlus, ThumbsUp, ThumbsDown, MessageCircle, Edit2, Trash2, Filter, Search } from 'lucide-react';

const UserDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-500 via-green-600 to-green-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="relative">
          {/* Decorative background */}
          <div className="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-40 dark:opacity-20">
            <div className="blur-[106px] h-56 bg-gradient-to-br from-yellow-100 to-green-200"></div>
            <div className="blur-[106px] h-32 bg-gradient-to-r from-green-200 to-yellow-100"></div>
          </div>

          {/* Main Content */}
          <div className="relative space-y-6">
            {/* Post Question Section */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-xl p-6">
              <PostQuestion />
            </div>
            {/* Feed Section */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-xl p-6">
              <div className="flex justify-between items-center mb-6">
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
