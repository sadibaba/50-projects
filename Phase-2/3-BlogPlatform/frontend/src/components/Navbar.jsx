import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("userName");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/auth");
  };

  const isAuthPage = location.pathname === "/auth";
  if (isAuthPage) return null;

  return (
    <nav
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${
        scrolled ? "w-[90%] max-w-4xl" : "w-[95%] max-w-6xl"
      }`}
    >
      <div
        className={`glass rounded-full px-6 py-3 transition-all duration-500 ${
          scrolled ? "shadow-lg shadow-accent/10" : ""
        }`}
      >
        <div className="flex items-center justify-between">
          {/* ── Logo ── */}
          <Link to="/home" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-accent to-amber-300 flex items-center justify-center">
              <svg
                className="w-4 h-4 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <span className="text-xl font-bold text-text-primary hidden sm:inline">
              Chronica
            </span>
          </Link>

          {/* ── Nav Links ── */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/home"
              className="text-text-secondary hover:text-accent transition-colors text-sm font-medium"
            >
              Home
            </Link>
            <Link
              to="/posts"
              className="text-text-secondary hover:text-accent transition-colors text-sm font-medium"
            >
              Stories
            </Link>
            <Link
              to="/details"
              className="text-text-secondary hover:text-accent transition-colors text-sm font-medium"
            >
              Details
            </Link>
            <Link
              to="/about"
              className="text-text-secondary hover:text-accent transition-colors text-sm font-medium"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-text-secondary hover:text-accent transition-colors text-sm font-medium"
            >
              Contact
            </Link>
          </div>

          {/* ── Right Side ── */}
          <div className="flex items-center space-x-3">
            <ThemeToggle />

            {token ? (
              <>
                <Link
                  to="/account"
                  className="flex items-center space-x-2 group"
                  title="My Account"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-accent to-amber-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-primary text-xs font-bold">
                      {userName?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-text-secondary hover:text-accent transition-colors text-sm font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="px-5 py-2 bg-accent text-primary rounded-full text-sm font-bold hover:bg-amber-300 transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;