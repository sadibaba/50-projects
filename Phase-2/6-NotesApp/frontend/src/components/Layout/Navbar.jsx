import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';
import { FiHome, FiFileText, FiUser, FiLogOut, FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/dashboard', icon: FiHome, label: 'Dashboard' },
    { path: '/notes', icon: FiFileText, label: 'Notes' },
    { path: '/profile', icon: FiUser, label: 'Profile' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Brand */}
        <Link to="/dashboard" className="navbar-brand">
          <div className="brand-mark">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 2L10 6H14L11 9L12 13L8 11L4 13L5 9L2 6H6L8 2Z" fill="#0d0d14"/>
            </svg>
          </div>
          <span className="brand-name">NoteFlow</span>
        </Link>

        {/* Desktop Nav */}
        <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${isActive ? 'active' : ''}`}
              >
                <Icon size={14} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="nav-divider" />

          <span className="nav-user">{user?.username}</span>

          <button onClick={handleLogout} className="btn-logout" style={{ marginLeft: '8px' }}>
            <FiLogOut size={13} />
            <span>Logout</span>
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="btn-icon"
          style={{ display: 'none' }}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <FiX size={18} /> : <FiMenu size={18} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            style={{
              overflow: 'hidden',
              borderTop: '1px solid var(--border-soft)',
              background: 'var(--ink-soft)',
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
            }}
          >
            <div style={{ padding: '12px 24px 20px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`nav-link ${isActive ? 'active' : ''}`}
                    style={{ width: '100%' }}
                  >
                    <Icon size={14} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              <div className="divider" style={{ margin: '8px 0' }} />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="nav-user">{user?.username}</span>
                <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="btn-logout">
                  <FiLogOut size={13} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
