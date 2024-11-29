import React, { useState, useEffect } from "react";
import axios from "axios";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import config from "../../config";

const PostQuestion = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [approved, setApproved] = useState(false);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = decodeJwt(token);
        setUserId(decodedToken.user_id);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  const decodeJwt = (token) => {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const decodedData = atob(base64);
    return JSON.parse(decodedData);
  };

  const handlePost = async (e) => {
    e.preventDefault();
    try {
      const tagArray = tags.split(",").map((tag) => tag.trim());
      const questionData = {
        title,
        description,
        tags: tagArray,
        approved,
        user_id: userId,
      };
      await axios.post(`${config.API_BASE_URL}/questions`, questionData);
      alert("Question posted!");
      setTitle("");
      setDescription("");
      setTags("");
      setApproved(false);
      setIsDialogOpen(false);
    } catch (error) {
      alert("Failed to post question");
    }
  };

  return (
    <div>
      {/* Trigger Button */}
      <div
        className="bg-gray-50 p-4 rounded-lg shadow-md cursor-pointer flex items-center hover:shadow-lg hover:bg-gray-100 transition-all"
        onClick={() => setIsDialogOpen(true)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-blue-500 mr-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>

        <input
          type="text"
          placeholder="What do you want to talk about?"
          className="w-full border-none outline-none text-gray-600 bg-transparent placeholder-gray-500"
          readOnly
        />
      </div>

      {/* Modal/Dialog */}
      <Transition.Root show={isDialogOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto"
          onClose={setIsDialogOpen}
        >
          <div className="flex items-center justify-center min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
            </Transition.Child>

            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-xl relative">
                {/* Modal Header */}
                <Dialog.Title className="text-2xl font-semibold mb-6 text-gray-800 text-center">
                  Create a Post
                </Dialog.Title>

                {/* Close Button */}
                <button
                  className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition"
                  onClick={() => setIsDialogOpen(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>

                {/* Form */}
                <form onSubmit={handlePost}>
                  {/* Title Input */}
                  <input
                    type="text"
                    placeholder="Enter your question title"
                    className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />

                  {/* Description Textarea */}
                  <textarea
                    placeholder="Enter your question description"
                    className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="4"
                  />

                  {/* Tags Input */}
                  <input
                    type="text"
                    placeholder="Enter tags (comma-separated)"
                    className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                  />

                  {/* Approved Checkbox */}
                  <label className="flex items-center mb-6 text-gray-700">
                    <input
                      type="checkbox"
                      checked={approved}
                      onChange={(e) => setApproved(e.target.checked)}
                      className="mr-2 h-5 w-5 text-blue-600 focus:ring-blue-500 focus:ring-2 border-gray-300 rounded"
                    />
                    Approved
                  </label>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="bg-blue-600 text-white py-3 px-4 rounded-lg w-full font-medium hover:bg-blue-700 transition-all focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    Post
                  </button>
                </form>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
};

export default PostQuestion;
