import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FiMail, FiLock } from 'react-icons/fi';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (success) navigate('/dashboard');
  };

  return (
    <div className="auth-page">
      <motion.div
        className="auth-box"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Logo */}
        <div className="auth-logo">
          <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
            <path d="M8 2L10 6H14L11 9L12 13L8 11L4 13L5 9L2 6H6L8 2Z" fill="#0d0d14"/>
          </svg>
        </div>

        <h1 className="auth-heading">Welcome back.</h1>
        <p className="auth-sub">Sign in to continue your journey.</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div className="form-field">
            <label className="form-label">Email Address</label>
            <div className="input-icon-wrap">
              <FiMail className="input-icon" size={14} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div className="form-field">
            <label className="form-label">Password</label>
            <div className="input-icon-wrap">
              <FiLock className="input-icon" size={14} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                placeholder="Your password"
                required
              />
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '13px', marginTop: '6px' }}
            whileHover={{ scale: loading ? 1 : 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            {loading ? <span className="loader" /> : 'Sign In'}
          </motion.button>
        </form>

        <p className="auth-footer">
          Don't have an account?{' '}
          <Link to="/register">Create one →</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
