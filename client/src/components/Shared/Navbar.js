import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext"; // Import AuthContext

const NavItem = ({ onClick, text }) => (
  <li>
    <button
      onClick={onClick}
      className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/10 hover:shadow-lg active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/50"
    >
      {text}
    </button>
  </li>
);


const Navbar = () => {
  const { isLoggedIn, setIsLoggedIn, isAdmin, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
    window.location.reload();
  };

  if (loading) {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-green-600 to-green-700 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <h1
            className="text-2xl font-bold cursor-pointer transition-transform hover:scale-105 flex items-center space-x-2"
            onClick={() => navigate("/")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            <span>FinanceQ</span>
          </h1>

          <ul className="flex items-center space-x-1 md:space-x-4">
            {isLoggedIn ? (
              <>
                <NavItem onClick={() => navigate("/")} text="Home" />
                <NavItem onClick={() => navigate("/pending")} text="Pending" />
                <NavItem onClick={() => navigate("/dashboard")} text="Feed" />
                {isAdmin && (
                  <NavItem onClick={() => navigate("/admin")} text="Admin" />
                )}
                <NavItem onClick={handleLogout} text="Logout" />
              </>
            ) : (
              <>
                <NavItem onClick={() => navigate("/login")} text="Login" />
                <NavItem onClick={() => navigate("/signup")} text="Sign Up" />
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};


export default Navbar;
