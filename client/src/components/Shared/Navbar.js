import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../AuthContext"; // Import AuthContext

const NavItem = ({ onClick, text, isActive }) => (
  <li>
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium relative transition-colors duration-200
        ${isActive ? 'text-white' : 'text-zinc-400 hover:text-white'}`}
    >
      {text}
      {isActive && (
        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white"></span>
      )}
    </button>
  </li>
);

const Navbar = () => {
  const { isLoggedIn, setIsLoggedIn, isAdmin, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
    window.location.reload();
  };

  const isActive = (path) => location.pathname === path;

  if (loading) {
    return null;
  }

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300
      ${scrolled ? 'bg-zinc-900/95 backdrop-blur-md shadow-xl shadow-black/10' : 'bg-transparent'}
      border-b border-white/5`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="relative w-8 h-8 flex items-center justify-center">
              <div className="absolute inset-0 bg-white rounded-sm transform transition-transform duration-200 hover:rotate-45"></div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-zinc-900 relative z-10" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-xl font-medium text-white">
              AskFinance
            </h1>
          </div>

          {/* Navigation Items */}
          <ul className="flex items-center space-x-2">
            {isLoggedIn ? (
              <>
                <NavItem onClick={() => navigate("/")} text="Home" isActive={isActive("/")} />
                <NavItem onClick={() => navigate("/pending")} text="Pending" isActive={isActive("/pending")} />
                <NavItem onClick={() => navigate("/dashboard")} text="Feed" isActive={isActive("/dashboard")} />
                {isAdmin && (
                  <NavItem onClick={() => navigate("/admin")} text="Admin" isActive={isActive("/admin")} />
                )}
                <li>
                  <button
                    onClick={handleLogout}
                    className="ml-6 px-4 py-2 text-sm font-medium text-white bg-zinc-800 
                    rounded-md hover:bg-zinc-700 transition-colors duration-200"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <NavItem onClick={() => navigate("/login")} text="Login" isActive={isActive("/login")} />
                <li>
                  <button
                    onClick={() => navigate("/signup")}
                    className="ml-6 px-4 py-2 text-sm font-medium text-white bg-zinc-800 
                    rounded-md hover:bg-zinc-700 transition-colors duration-200"
                  >
                    Sign Up
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
