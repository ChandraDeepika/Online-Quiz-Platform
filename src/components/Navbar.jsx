import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { currentUser, logout } = useAuth();

  return (
    <nav className="bg-pink-700 text-white px-6 py-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Left: Title */}
        <div className="text-2xl font-extrabold tracking-wide">
          Quiz Platform
        </div>

        {/* Right: Nav Links */}
        <div className="flex space-x-4 items-center text-lg">
          <Link
            to="/"
            className="px-2 py-1 rounded-md hover:bg-white/20 transition duration-200"
          >
            Home
          </Link>
          {currentUser ? (
            <>
              <Link
                to="/dashboard"
                className="px-2 py-1 rounded-md hover:bg-white/20 transition duration-200"
              >
                Dashboard
              </Link>
              <Link
                to="/leaderboard"
                className="px-2 py-1 rounded-md hover:bg-white/20 transition duration-200"
              >
                Leaderboard
              </Link>
              <Link
                to="/analytics"
                className="px-2 py-1 rounded-md hover:bg-white/20 transition duration-200"
              >
                Analytics
              </Link>
              <button
                onClick={logout}
                className="px-2 py-1 rounded-md hover:bg-red-200/30 transition duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="px-2 py-1 rounded-md hover:bg-white/20 transition duration-200"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
