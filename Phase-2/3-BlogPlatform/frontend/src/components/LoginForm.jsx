import React, { useState } from 'react';

const LoginForm = ({ onSubmit, loading, error }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear field error when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    onSubmit(formData, true);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-gray-400 mb-2" htmlFor="email">
          Email Address
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
            </svg>
          </div>
          <input
            id="email"
            name="email"
            type="email"
            required
            className={`w-full pl-10 pr-4 py-3 bg-gray-800 border ${
              formErrors.email ? 'border-red-500' : 'border-gray-700'
            } rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent text-white placeholder-gray-500`}
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        {formErrors.email && (
          <p className="mt-1 text-sm text-red-400">{formErrors.email}</p>
        )}
      </div>
      
      <div>
        <label className="block text-gray-400 mb-2" htmlFor="password">
          Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            required
            className={`w-full pl-10 pr-4 py-3 bg-gray-800 border ${
              formErrors.password ? 'border-red-500' : 'border-gray-700'
            } rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent text-white placeholder-gray-500`}
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        {formErrors.password && (
          <p className="mt-1 text-sm text-red-400">{formErrors.password}</p>
        )}
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-700 rounded bg-gray-800"
            disabled={loading}
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
            Remember me
          </label>
        </div>
        <button 
          type="button" 
          className="text-sm text-purple-400 hover:text-purple-300 disabled:opacity-50"
          disabled={loading}
        >
          Forgot password?
        </button>
      </div>
      
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-lg transition duration-300 flex items-center justify-center disabled:opacity-50"
      >
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Logging in...
          </>
        ) : (
          'Login to your account'
        )}
      </button>

      {/* Demo credentials for testing */}
      <div className="mt-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
        <p className="text-gray-400 text-sm mb-2">Demo Credentials:</p>
        <p className="text-gray-300 text-xs">Email: test@example.com</p>
        <p className="text-gray-300 text-xs">Password: password123</p>
      </div>
    </form>
  );
};

export default LoginForm;