import React, { useState } from 'react';

const SignupForm = ({ onSubmit, loading, error }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'reader'
  });
  const [formErrors, setFormErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear field error when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Check password strength
    if (name === 'password') {
      checkPasswordStrength(value);
    }

    // Check password match
    if (name === 'confirmPassword' || (name === 'password' && formData.confirmPassword)) {
      if (value !== formData.password && name === 'confirmPassword') {
        setFormErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
      } else if (formData.confirmPassword && value !== formData.confirmPassword && name === 'password') {
        setFormErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
      } else {
        setFormErrors(prev => ({ ...prev, confirmPassword: '' }));
      }
    }
  };

  const checkPasswordStrength = (password) => {
    let score = 0;
    let message = '';

    if (password.length >= 8) score++;
    if (password.match(/[a-z]/)) score++;
    if (password.match(/[A-Z]/)) score++;
    if (password.match(/[0-9]/)) score++;
    if (password.match(/[^a-zA-Z0-9]/)) score++;

    if (score <= 2) message = 'Weak';
    else if (score <= 3) message = 'Medium';
    else if (score <= 4) message = 'Good';
    else message = 'Strong';

    setPasswordStrength({ score, message });
  };

  const getStrengthColor = () => {
    switch(passwordStrength.message) {
      case 'Weak': return 'bg-red-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Good': return 'bg-blue-500';
      case 'Strong': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name) {
      errors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }
    
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
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
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
    
    onSubmit(formData, false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-gray-400 mb-2" htmlFor="name">
          Full Name
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
            </svg>
          </div>
          <input
            id="name"
            name="name"
            type="text"
            required
            className={`w-full pl-10 pr-4 py-3 bg-gray-800 border ${
              formErrors.name ? 'border-red-500' : 'border-gray-700'
            } rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent text-white placeholder-gray-500`}
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        {formErrors.name && (
          <p className="mt-1 text-sm text-red-400">{formErrors.name}</p>
        )}
      </div>
      
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          
          {/* Password strength indicator */}
          {formData.password && (
            <div className="mt-2">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${getStrengthColor()} transition-all duration-300`}
                    style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                  ></div>
                </div>
                <span className={`text-xs ${
                  passwordStrength.message === 'Weak' ? 'text-red-400' :
                  passwordStrength.message === 'Medium' ? 'text-yellow-400' :
                  passwordStrength.message === 'Good' ? 'text-blue-400' :
                  passwordStrength.message === 'Strong' ? 'text-green-400' : ''
                }`}>
                  {passwordStrength.message}
                </span>
              </div>
            </div>
          )}
          
          {formErrors.password && (
            <p className="mt-1 text-sm text-red-400">{formErrors.password}</p>
          )}
        </div>
        
        <div>
          <label className="block text-gray-400 mb-2" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              className={`w-full pl-10 pr-4 py-3 bg-gray-800 border ${
                formErrors.confirmPassword ? 'border-red-500' : 'border-gray-700'
              } rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent text-white placeholder-gray-500`}
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
          {formErrors.confirmPassword && (
            <p className="mt-1 text-sm text-red-400">{formErrors.confirmPassword}</p>
          )}
        </div>
      </div>
      
      <div>
        <label className="block text-gray-400 mb-2">
          I want to join as a
        </label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            className={`py-3 px-4 rounded-lg border transition-all duration-300 ${
              formData.role === 'reader' 
                ? 'bg-purple-900 border-purple-600 text-white shadow-lg shadow-purple-900/30' 
                : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700'
            }`}
            onClick={() => setFormData(prev => ({ ...prev, role: 'reader' }))}
            disabled={loading}
          >
            <div className="flex flex-col items-center">
              <svg className="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
              </svg>
              <span>Reader</span>
              <p className="text-xs mt-1 text-gray-500">Read & explore blogs</p>
            </div>
          </button>
          <button
            type="button"
            className={`py-3 px-4 rounded-lg border transition-all duration-300 ${
              formData.role === 'author' 
                ? 'bg-pink-900 border-pink-600 text-white shadow-lg shadow-pink-900/30' 
                : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700'
            }`}
            onClick={() => setFormData(prev => ({ ...prev, role: 'author' }))}
            disabled={loading}
          >
            <div className="flex flex-col items-center">
              <svg className="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
              </svg>
              <span>Author</span>
              <p className="text-xs mt-1 text-gray-500">Write & publish blogs</p>
            </div>
          </button>
        </div>
      </div>
      
      <div className="flex items-center">
        <input
          id="terms"
          name="terms"
          type="checkbox"
          required
          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-700 rounded bg-gray-800"
          disabled={loading}
        />
        <label htmlFor="terms" className="ml-2 block text-sm text-gray-400">
          I agree to the <a href="#" className="text-purple-400 hover:text-purple-300">Terms of Service</a> and <a href="#" className="text-purple-400 hover:text-purple-300">Privacy Policy</a>
        </label>
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
            Creating account...
          </>
        ) : (
          'Create your account'
        )}
      </button>
    </form>
  );
};

export default SignupForm;