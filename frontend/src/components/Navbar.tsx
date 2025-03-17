import { useState } from "react";
import { FaHome, FaUser, FaSignInAlt, FaBars, FaTimes, FaUserFriends, FaSignOutAlt, FaThLarge } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuth, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/signin");
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-blue-600 text-white shadow-md z-50">
      <div className="container mx-auto flex justify-between items-center p-4">
        <h1 className="text-2xl font-bold">
          <Link to="/">FastReact</Link>
        </h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8">
          {!isAuth ? (
            <>
              <Link to="/" className="flex items-center gap-2 hover:text-gray-300">
                <FaHome /> Home
              </Link>
              <Link
                to="/signup"
                className="flex items-center gap-2 hover:text-gray-300"
              >
                <FaUser /> Sign Up
              </Link>
              <Link
                to="/signin"
                className="flex items-center gap-2 hover:text-gray-300"
              >
                <FaSignInAlt /> Sign In
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/dashboard"
                className="flex items-center gap-2 hover:text-gray-300"
              >
                <FaThLarge /> Dashboard
              </Link>
              <Link
                to="/users"
                className="flex items-center gap-2 hover:text-gray-300"
              >
                <FaUserFriends /> Users
              </Link>
              <Link
                to="/profile"
                className="flex items-center gap-2 hover:text-gray-300"
              >
                <FaUser /> Profile
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 hover:text-gray-300"
              >
                <FaSignOutAlt /> Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-blue-700">
          {!isAuth ? (
            <>
              <Link
                to="/"
                className="block px-4 py-2 hover:bg-blue-800"
                onClick={() => setMenuOpen(false)}
              >
                <FaHome className="inline mr-2" /> Home
              </Link>
              <Link
                to="/signup"
                className="block px-4 py-2 hover:bg-blue-800"
                onClick={() => setMenuOpen(false)}
              >
                <FaUser className="inline mr-2" /> Sign Up
              </Link>
              <Link
                to="/signin"
                className="block px-4 py-2 hover:bg-blue-800"
                onClick={() => setMenuOpen(false)}
              >
                <FaSignInAlt className="inline mr-2" /> Sign In
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/dashboard"
                className="block px-4 py-2 hover:bg-blue-800"
                onClick={() => setMenuOpen(false)}
              >
                <FaThLarge className="inline mr-2" /> Dashboard
              </Link>
              <Link
                to="/users"
                className="block px-4 py-2 hover:bg-blue-800"
                onClick={() => setMenuOpen(false)}
              >
                <FaUserFriends className="inline mr-2" /> Users
              </Link>
              <Link
                to="/profile"
                className="block px-4 py-2 hover:bg-blue-800"
                onClick={() => setMenuOpen(false)}
              >
                <FaUser className="inline mr-2" /> Profile
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 hover:bg-blue-800"
              >
                <FaSignOutAlt className="inline mr-2" /> Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
