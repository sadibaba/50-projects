import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userName = localStorage.getItem('userName');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/auth');
  };

  const isAuthPage = location.pathname === '/auth';
  if (isAuthPage) return null;

  return (
    <nav className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${scrolled ? 'w-[90%] max-w-4xl' : 'w-[95%] max-w-6xl'}`}>
      <div className={`glass rounded-full px-6 py-3 transition-all duration-500 ${scrolled ? 'shadow-lg shadow-accent/10' : ''}`}>
        <div className="flex items-center justify-between">
          <Link to="/home" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-accent to-amber-300 flex items-center justify-center">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-text-primary hidden sm:inline">Anthology</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/home" className="text-text-secondary hover:text-accent transition-colors text-sm font-medium">Home</Link>
            <Link to="/posts" className="text-text-secondary hover:text-accent transition-colors text-sm font-medium">Posts</Link>
            <Link to="/home#about" className="text-text-secondary hover:text-accent transition-colors text-sm font-medium">About</Link>
            <Link to="/home#contact" className="text-text-secondary hover:text-accent transition-colors text-sm font-medium">Contact</Link>
          </div>

          <div className="flex items-center space-x-4">
            {token ? (
              <>
                <Link to="/profile" className="flex items-center space-x-2 group">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-accent to-amber-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-primary text-xs font-bold">{userName?.charAt(0).toUpperCase() || 'U'}</span>
                  </div>
                </Link>
                <button onClick={handleLogout} className="text-text-secondary hover:text-accent transition-colors text-sm font-medium">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/auth" className="px-5 py-2 bg-accent text-primary rounded-full text-sm font-bold hover:bg-amber-300 transition-colors">
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