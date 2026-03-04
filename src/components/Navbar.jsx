import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  FiMenu,
  FiX,
  FiUser,
  FiLogOut,
  FiChevronDown,
  FiHome,
  FiInfo,
  FiPhone,
  FiShield,
} from "react-icons/fi";
import { logout } from "../store/slices/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
    setDropdownOpen(false);
  };

  const navLinks = [
    { name: "Home", path: "/", icon: FiHome },
    { name: "About", path: "/about", icon: FiInfo },
    { name: "Contact", path: "/contact", icon: FiPhone },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-lg py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span
              className={`text-2xl font-bold ${
                scrolled ? "text-primary-600" : "text-white"
              }`}
            >
              Speed-Cash
            </span>
            <span
              className={`text-xs px-2 py-1 rounded ${
                scrolled
                  ? "bg-primary-100 text-primary-800"
                  : "bg-white/20 text-white"
              }`}
            >
              Solutions
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center space-x-1 font-medium transition-colors ${
                  scrolled
                    ? "text-gray-700 hover:text-primary-600"
                    : "text-white hover:text-gray-200"
                }`}
              >
                <link.icon className="text-sm" />
                <span>{link.name}</span>
              </Link>
            ))}

            {/* Admin Login Link - Only show when not authenticated */}
            {!isAuthenticated && (
              <Link
                to="/admin/login"
                className={`flex items-center space-x-1 font-medium transition-colors ${
                  scrolled
                    ? "text-gray-700 hover:text-primary-600"
                    : "text-white hover:text-gray-200"
                }`}
              >
                <FiShield className="text-sm" />
                <span>Admin</span>
              </Link>
            )}

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    scrolled
                      ? "bg-primary-600 text-white hover:bg-primary-700"
                      : "bg-white/20 text-white hover:bg-white/30"
                  }`}
                >
                  {user?.profilePhoto?.url ? (
                    <img
                      src={user.profilePhoto.url}
                      alt="Profile"
                      className="w-6 h-6 rounded-full"
                    />
                  ) : (
                    <FiUser size={16} />
                  )}
                  <span>{user?.firstName || "User"}</span>
                  <FiChevronDown
                    className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2">
                    <Link
                      to={user?.role === "admin" ? "/admin" : "/dashboard"}
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Settings
                    </Link>
                    <hr className="my-2" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <FiLogOut />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    scrolled
                      ? "text-gray-700 hover:text-primary-600"
                      : "text-white hover:text-gray-200"
                  }`}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className={`px-4 py-2 rounded-lg font-medium ${
                    scrolled
                      ? "bg-primary-600 text-white hover:bg-primary-700"
                      : "bg-white text-primary-600 hover:bg-gray-100"
                  }`}
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-2 rounded-lg ${
              scrolled ? "text-gray-700" : "text-white"
            }`}
          >
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium ${
                    scrolled
                      ? "text-gray-700 hover:bg-gray-100"
                      : "text-white hover:bg-white/10"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <link.icon />
                  <span>{link.name}</span>
                </Link>
              ))}

              {/* Admin Link for Mobile */}
              {!isAuthenticated && (
                <Link
                  to="/admin/login"
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium ${
                    scrolled
                      ? "text-gray-700 hover:bg-gray-100"
                      : "text-white hover:bg-white/10"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <FiShield />
                  <span>Admin Login</span>
                </Link>
              )}

              {isAuthenticated ? (
                <>
                  <Link
                    to={user?.role === "admin" ? "/admin" : "/dashboard"}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium ${
                      scrolled
                        ? "text-gray-700 hover:bg-gray-100"
                        : "text-white hover:bg-white/10"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <FiUser />
                    <span>Dashboard</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium ${
                      scrolled
                        ? "text-red-600 hover:bg-gray-100"
                        : "text-white hover:bg-white/10"
                    }`}
                  >
                    <FiLogOut />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-2 pt-2">
                  <Link
                    to="/login"
                    className={`px-4 py-2 rounded-lg font-medium text-center ${
                      scrolled
                        ? "bg-gray-200 text-gray-800"
                        : "bg-white/20 text-white"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className={`px-4 py-2 rounded-lg font-medium text-center ${
                      scrolled
                        ? "bg-primary-600 text-white"
                        : "bg-white text-primary-600"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
