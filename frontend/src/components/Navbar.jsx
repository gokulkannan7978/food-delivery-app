// src/components/Navbar.jsx
// Shows user name + logout button when logged in.

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

const Navbar = () => {
  const { cartCount, user, logout } = useApp();
  const location = useLocation();
  const navigate  = useNavigate();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-orange-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <span className="text-white text-lg">🍽</span>
            </div>
            <span className="text-xl font-black tracking-tight text-gray-900">
              swift<span className="text-orange-500">bite</span>
            </span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-1">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                isActive("/") ? "bg-orange-50 text-orange-600" : "text-gray-600 hover:text-orange-500 hover:bg-orange-50"
              }`}
            >
              Home
            </Link>

            {/* Logged-in state */}
            {user ? (
              <div className="flex items-center gap-2">
                <span className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-gray-600 bg-gray-50 rounded-lg">
                  <span>👤</span>
                  <span className="max-w-[100px] truncate">{user.name}</span>
                  {user.role === "admin" && (
                    <span className="text-xs bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-md font-bold">Admin</span>
                  )}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-lg text-sm font-semibold text-gray-600 hover:text-red-500 hover:bg-red-50 transition-all"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isActive("/login") ? "bg-orange-50 text-orange-600" : "text-gray-600 hover:text-orange-500 hover:bg-orange-50"
                }`}
              >
                Login
              </Link>
            )}

            {/* Cart */}
            <Link
              to="/cart"
              className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                isActive("/cart") ? "bg-orange-500 text-white" : "text-gray-600 hover:text-orange-500 hover:bg-orange-50"
              }`}
            >
              <span>🛒</span>
              <span>Cart</span>
              {cartCount > 0 && (
                <span className={`absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center ${
                  isActive("/cart") ? "bg-white text-orange-500" : "bg-orange-500 text-white"
                }`}>
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
