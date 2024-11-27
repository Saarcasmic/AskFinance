import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext"; // Import AuthContext

const Navbar = () => {
  const { isLoggedIn, setIsLoggedIn, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token
    setIsLoggedIn(false); // Update global login state
    navigate("/login"); // Redirect to login
    window.location.reload(); // Reload the app to reset state
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-green-500 text-white shadow-lg">
      <h1
        className="text-2xl font-bold cursor-pointer"
        onClick={() => navigate("/")}
      >
        Q&A App
      </h1>
      <ul className="flex space-x-6">
        {isLoggedIn ? (
          <>
            <li
              className="cursor-pointer hover:bg-green-600 p-2 rounded-md"
              onClick={() => navigate("/")}
            >
              Home
            </li>
            <li
              className="cursor-pointer hover:bg-green-600 p-2 rounded-md"
              onClick={() => navigate("/pending")}
            >
              Pending Posts
            </li>
            <li
              className="cursor-pointer hover:bg-green-600 p-2 rounded-md"
              onClick={() => navigate("/dashboard")}
            >
              Feed
            </li>

            {isAdmin && (
              <li
                className="cursor-pointer hover:bg-green-600 p-2 rounded-md"
                onClick={() => navigate("/admin")}
              >
                Admin
              </li>
            )}

            <li
              className="cursor-pointer hover:bg-green-600 p-2 rounded-md"
              onClick={handleLogout}
            >
              Logout
            </li>
          </>
        ) : (
          <>
            <li
              className="cursor-pointer hover:bg-green-600 p-2 rounded-md"
              onClick={() => navigate("/login")}
            >
              Login
            </li>
            <li
              className="cursor-pointer hover:bg-green-600 p-2 rounded-md"
              onClick={() => navigate("/signup")}
            >
              Signup
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
