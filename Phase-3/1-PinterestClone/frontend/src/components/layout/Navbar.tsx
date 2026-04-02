"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoSearchOutline,
  IoNotificationsOutline,
  IoPersonOutline,
  IoCreateOutline,
  IoLogOutOutline,
  IoCloseOutline,
} from "react-icons/io5";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/common/Button";

const Navbar = () => {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md">
        <div className="max-w-[2000px] mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="text-primary font-bold text-2xl">Pinterest</div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md" : "bg-white/80 backdrop-blur-md"
      }`}
    >
      <div className="max-w-[2000px] mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div className="text-primary font-bold text-2xl hover:text-red-700 transition-colors">
              Pinterest
            </div>
          </Link>

          {/* Search Bar - Hide on mobile */}
          <div className="hidden sm:block flex-1 max-w-2xl mx-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for ideas..."
                className="w-full px-10 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
              />
              <IoSearchOutline
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <IoCloseOutline size={20} />
                </button>
              )}
            </form>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <Link href="/create-pin">
                  <Button size="sm" variant="outline">
                    <IoCreateOutline className="mr-2" size={18} />
                    <span className="hidden sm:inline">Create</span>
                  </Button>
                </Link>

                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 hover:bg-gray-100 rounded-full relative"
                  >
                    <IoNotificationsOutline size={24} />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                    )}
                  </button>
                </div>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold overflow-hidden bg-gradient-to-r from-primary to-red-500">
                      {user?.profilePicture ? (
                        <img
                          src={user.profilePicture}
                          alt={user.username}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        user?.username?.[0]?.toUpperCase() || "U"
                      )}
                    </div>
                  </button>
                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 z-50"
                      >
                        <div className="py-2">
                          <div className="px-4 py-2 border-b border-gray-100">
                            <p className="text-sm font-semibold">
                              {user?.username}
                            </p>
                            <p className="text-xs text-gray-500">
                              {user?.email}
                            </p>
                          </div>
                          <Link
  href={`/profile/${user?._id}`}
  className="block px-4 py-2 hover:bg-gray-100 transition-colors"
  onClick={() => setShowUserMenu(false)}
>
  My Profile
</Link>
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors flex items-center gap-2 text-red-600"
                          >
                            <IoLogOutOutline size={18} />
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex gap-2">
                <Link href="/login">
                  <Button variant="outline" size="sm">
                    Log in
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary" size="sm">
                    Sign up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
