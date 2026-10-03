import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../api/api';
import { motion } from 'framer-motion';

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'reader' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      let response;
      if (isLogin) {
        response = await loginUser({ email: formData.email, password: formData.password });
        if (response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('userId', response._id || response.id);
          localStorage.setItem('userName', response.name);
          localStorage.setItem('userEmail', response.email);
          localStorage.setItem('userRole', response.role || 'reader');
          setSuccess('Login successful! Redirecting...');
          setTimeout(() => navigate('/home'), 1500);
        } else {
          setError(response.message || 'Login failed');
        }
      } else {
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match!');
          setLoading(false);
          return;
        }
        const { confirmPassword, ...signupData } = formData;
        response = await registerUser(signupData);
        if (response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('userId', response._id || response.id);
          localStorage.setItem('userName', response.name);
          localStorage.setItem('userEmail', response.email);
          localStorage.setItem('userRole', response.role || formData.role);
          setSuccess('Account created! Redirecting...');
          setTimeout(() => navigate('/home'), 1500);
        } else {
          setSuccess('Account created! Please log in.');
          setTimeout(() => { setIsLogin(true); setSuccess(''); }, 2000);
        }
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-gradient-shift"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/50 rounded-full blur-3xl animate-gradient-shift" style={{ animationDelay: '2s' }}></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="glass rounded-3xl p-8 sm:p-10 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="font-display text-4xl text-text-primary tracking-wider">Anthology</h1>
            <p className="text-text-secondary text-sm mt-2">Stories in motion.</p>
          </div>

          <div className="flex mb-8 bg-primary/50 rounded-full p-1">
            <button
              className={`flex-1 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${isLogin ? 'bg-accent text-primary' : 'text-text-secondary hover:text-text-primary'}`}
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>
            <button
              className={`flex-1 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${!isLogin ? 'bg-accent text-primary' : 'text-text-secondary hover:text-text-primary'}`}
              onClick={() => setIsLogin(false)}
            >
              Sign Up
            </button>
          </div>

          {error && <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded-lg text-red-400 text-sm">{error}</div>}
          {success && <div className="mb-4 p-3 bg-green-900/30 border border-green-800 rounded-lg text-green-400 text-sm">{success}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-text-secondary text-xs mb-2 uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-primary/50 border border-secondary/50 rounded-lg text-text-primary placeholder-text-secondary focus:ring-2 focus:ring-accent focus:border-transparent text-sm transition-all"
                  placeholder="John Doe"
                />
              </div>
            )}
            <div>
              <label className="block text-text-secondary text-xs mb-2 uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-primary/50 border border-secondary/50 rounded-lg text-text-primary placeholder-text-secondary focus:ring-2 focus:ring-accent focus:border-transparent text-sm transition-all"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-text-secondary text-xs mb-2 uppercase tracking-wider">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-primary/50 border border-secondary/50 rounded-lg text-text-primary placeholder-text-secondary focus:ring-2 focus:ring-accent focus:border-transparent text-sm transition-all"
                placeholder="••••••••"
              />
            </div>
            {!isLogin && (
              <>
                <div>
                  <label className="block text-text-secondary text-xs mb-2 uppercase tracking-wider">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-primary/50 border border-secondary/50 rounded-lg text-text-primary placeholder-text-secondary focus:ring-2 focus:ring-accent focus:border-transparent text-sm transition-all"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-text-secondary text-xs mb-2 uppercase tracking-wider">I want to join as a</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button type="button" onClick={() => setFormData(prev => ({ ...prev, role: 'reader' }))} className={`py-3 px-4 rounded-lg border text-sm transition-all ${formData.role === 'reader' ? 'bg-accent/20 border-accent text-accent' : 'bg-primary/50 border-secondary/50 text-text-secondary hover:border-accent/50'}`}>Reader</button>
                    <button type="button" onClick={() => setFormData(prev => ({ ...prev, role: 'author' }))} className={`py-3 px-4 rounded-lg border text-sm transition-all ${formData.role === 'author' ? 'bg-accent/20 border-accent text-accent' : 'bg-primary/50 border-secondary/50 text-text-secondary hover:border-accent/50'}`}>Author</button>
                  </div>
                </div>
              </>
            )}
            <button type="submit" disabled={loading} className="w-full py-3 bg-accent text-primary font-bold rounded-lg hover:bg-amber-300 transition-all duration-300 disabled:opacity-50 text-sm tracking-wider">
              {loading ? 'Processing...' : (isLogin ? 'Login to your account' : 'Create your account')}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginSignup;