import React from "react";
import Feed from "../components/Dashboard/Feed";
import PostQuestion from "../components/Dashboard/PostQuestion";

const UserDashboard = () => {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center p-6">
      {/* Main Container */}
      <div className="w-full max-w-4xl">
        {/* Post Question Section */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
          <PostQuestion />
        </div>
        {/* Feed Section */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <Feed />
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
