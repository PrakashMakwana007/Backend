import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../store/userSlice";
import { Moon, Sun, User, Search, Menu, X } from "lucide-react";

const Header = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    setMenuOpen(false);
  };

  return (
    <header className="bg-gradient-to-r from-blue-900 via-indigo-800 to-gray-900 text-white py-6 px-4 flex justify-between items-center shadow-lg">
      {/* Logo */}
      <Link to="/" className="text-2xl font-bold text-cyan-300">
        VideoTube
      </Link>

      

      {/* Search Bar with Button */}
      <div className="hidden md:flex mx-4 relative w-72"> 
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-10 p-2 pl-10 bg-gray-800 border border-gray-600 rounded-l-md text-white focus:outline-none  "
        />
        <Search className="absolute left-3 top-2 text-gray-400" size={18} />
        <button className="bg-blue-600 px-4 py-2 rounded-r-md hover:bg-blue-700 transition">
          <Search className="text-white" size={20} />
        </button>
      </div>

      {/* Right Side: Dark Mode Toggle & User Menu */}
      <div className="flex items-center gap-4 relative">
        {/* Dark Mode Toggle */}
        <button onClick={toggleDarkMode} className="p-3 bg-gray-800 rounded-full transition">
          {darkMode ? <Sun className="text-yellow-400" size={22} /> : <Moon className="text-gray-300" size={22} />}
        </button>

        {/* User Avatar / Login & Signup Buttons */}
        {user ? (
          <div className="relative">
            <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-2">
              {user.avatar ? (
                <img src={user.avatar} alt="User Avatar" className="w-12 h-12 rounded-full border border-gray-400" />
              ) : (
                <User className="w-12 h-12 text-white" />
              )}
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 bg-gray-800 shadow-lg rounded-md p-4 w-48 z-10">
                <p className="text-white font-semibold">{user.username}</p>
                <p className="text-gray-400 text-sm">{user.email}</p>
                <hr className="my-2 border-gray-700" />
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="hidden md:flex gap-2">
            <Link
              to="/signup"
              className="bg-green-500 text-white px-5 py-2 rounded-md hover:bg-green-600 transition"
            >
              Sign Up
            </Link>
          </div>
        )}

        {/* Mobile Menu Toggle */}
        <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden">
          {mobileMenu ? <X size={28} className="text-white" /> : <Menu size={28} />}
        </button>
      </div>
    </header>
  );
};

export default Header;
