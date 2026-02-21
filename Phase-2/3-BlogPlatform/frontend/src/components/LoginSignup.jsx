import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../api/api';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleAuthSubmit = async (formData, isLoginForm) => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      let response;
      
      if (isLoginForm) {
        // Login API call
        response = await loginUser({
          email: formData.email,
          password: formData.password
        });
        
        // Handle different response structures
        const userData = response.data || response;
        
        if (userData.token) {
          setSuccess('Login successful! Redirecting...');
          
          // Store user data in localStorage
          localStorage.setItem('token', userData.token);
          localStorage.setItem('userId', userData._id || userData.id);
          localStorage.setItem('userName', userData.name);
          localStorage.setItem('userEmail', userData.email);
          localStorage.setItem('userRole', userData.role || 'reader');
          localStorage.setItem('userJoinDate', new Date().toISOString());
          
          // Redirect to home page
          setTimeout(() => {
            navigate('/home');
          }, 1500);
        } else {
          setError(userData.message || 'Login failed. Please try again.');
        }
      } else {
        // Signup API call
        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match!');
          setLoading(false);
          return;
        }

        // Remove confirmPassword before sending to API
        const { confirmPassword, ...signupData } = formData;
        
        response = await registerUser(signupData);
        
        // Handle different response structures
        const userData = response.data || response;
        
        if (userData.token || userData._id) {
          setSuccess('Account created successfully! Redirecting to login...');
          
          // Store user data if automatically logged in
          if (userData.token) {
            localStorage.setItem('token', userData.token);
            localStorage.setItem('userId', userData._id || userData.id);
            localStorage.setItem('userName', userData.name);
            localStorage.setItem('userEmail', userData.email);
            localStorage.setItem('userRole', userData.role || formData.role);
            localStorage.setItem('userJoinDate', new Date().toISOString());
            
            setTimeout(() => {
              navigate('/home');
            }, 1500);
          } else {
            // If not automatically logged in, switch to login form
            setTimeout(() => {
              setIsLogin(true);
              setSuccess('');
            }, 2000);
          }
        } else {
          setError(userData.message || 'Signup failed. Please try again.');
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      
      // Handle different error formats
      if (err.message) {
        try {
          const errorData = JSON.parse(err.message);
          setError(errorData.message || 'Authentication failed. Please try again.');
        } catch {
          setError(err.message || 'Authentication failed. Please try again.');
        }
      } else {
        setError('Network error. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-500"></div>
      </div>
      
      {/* Background pattern */}
      <div className="absolute inset-0 z-0 opacity-5" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>
      
      <div className="relative z-10 w-full max-w-6xl flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-2xl">
        {/* Left side with blog theme */}
        <div className="md:w-1/2 bg-gradient-to-br from-gray-900 to-gray-800 p-8 md:p-12 flex flex-col justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">BlogSphere</span>
            </h1>
            <p className="text-gray-300 text-lg mb-8">
              A creative space for authors to share stories and readers to explore new worlds.
            </p>
            
            <div className="flex items-center space-x-4 mb-8">
              <div className="flex -space-x-4">
                <div className="w-12 h-12 rounded-full border-2 border-gray-800 bg-gradient-to-r from-blue-500 to-teal-400"></div>
                <div className="w-12 h-12 rounded-full border-2 border-gray-800 bg-gradient-to-r from-purple-500 to-pink-400"></div>
                <div className="w-12 h-12 rounded-full border-2 border-gray-800 bg-gradient-to-r from-yellow-500 to-orange-400"></div>
              </div>
              <p className="text-gray-400">Join our community of 500+ writers and readers</p>
            </div>
          </div>
          
          {/* Features list */}
          <div className="mt-8">
            <div className="flex items-center text-gray-400">
              <div className="w-8 h-8 mr-3 flex items-center justify-center rounded-full bg-gray-800">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                </svg>
              </div>
              <span>Create and manage your blog posts</span>
            </div>
            <div className="flex items-center text-gray-400 mt-3">
              <div className="w-8 h-8 mr-3 flex items-center justify-center rounded-full bg-gray-800">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                </svg>
              </div>
              <span>Engage with readers through comments</span>
            </div>
            <div className="flex items-center text-gray-400 mt-3">
              <div className="w-8 h-8 mr-3 flex items-center justify-center rounded-full bg-gray-800">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                </svg>
              </div>
              <span>Discover amazing stories from talented authors</span>
            </div>
          </div>
        </div>
        
        {/* Right side with login/signup form */}
        <div className="md:w-1/2 bg-gray-900 p-8 md:p-12">
          <div className="flex mb-8">
            <button 
              className={`flex-1 py-3 font-medium text-lg ${isLogin ? 'text-white border-b-2 border-purple-500' : 'text-gray-500'}`}
              onClick={() => {
                setIsLogin(true);
                setError('');
                setSuccess('');
              }}
            >
              Login
            </button>
            <button 
              className={`flex-1 py-3 font-medium text-lg ${!isLogin ? 'text-white border-b-2 border-pink-500' : 'text-gray-500'}`}
              onClick={() => {
                setIsLogin(false);
                setError('');
                setSuccess('');
              }}
            >
              Sign Up
            </button>
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-800 rounded-lg">
              <div className="flex items-center text-red-400">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}
          
          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-900/30 border border-green-800 rounded-lg">
              <div className="flex items-center text-green-400">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>{success}</span>
              </div>
            </div>
          )}
          
          {isLogin ? (
            <LoginForm onSubmit={handleAuthSubmit} loading={loading} error={error} />
          ) : (
            <SignupForm onSubmit={handleAuthSubmit} loading={loading} error={error} />
          )}
          
          <div className="mt-8 pt-6 border-t border-gray-800">
            <p className="text-center text-gray-500">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                className="text-purple-400 hover:text-purple-300 font-medium"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setSuccess('');
                }}
              >
                {isLogin ? 'Sign Up' : 'Login'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;