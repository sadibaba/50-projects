import React, { useState, useEffect } from 'react';
import { postData } from '../api/api';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleAuthSubmit = async (formData, isLoginForm) => {
  setLoading(true);
  setMessage({ text: '', type: '' });
  
  try {
    const endpoint = isLoginForm ? 'login' : 'signup';
    const response = await postData(endpoint, formData);
    
    if (response.success) {
      setMessage({ 
        text: isLoginForm ? 'Login successful! Redirecting...' : 'Account created successfully!', 
        type: 'success' 
      });
      
      // Store user data
      localStorage.setItem('token', response.token);
      localStorage.setItem('userName', response.user?.name || formData.name);
      localStorage.setItem('userEmail', response.user?.email || formData.email);
      localStorage.setItem('userRole', response.user?.role || formData.role || 'reader');
      localStorage.setItem('userJoinDate', new Date().toISOString().split('T')[0]);
      
      // Redirect to HOME instead of DASHBOARD
      setTimeout(() => {
        window.location.href = '/home';
      }, 1500);
    } else {
      setMessage({ text: response.message || 'Authentication failed', type: 'error' });
    }
  } catch (error) {
    console.error('Auth error:', error);
    // Even if there's an error, mock response should work
    setMessage({ 
      text: 'Server not responding. Using demo mode.', 
      type: 'warning' 
    });
    
    // Auto-login with mock data after delay
    setTimeout(() => {
      localStorage.setItem('token', 'mock-token');
      localStorage.setItem('userName', formData.name || 'Demo User');
      localStorage.setItem('userEmail', formData.email || 'demo@example.com');
      localStorage.setItem('userRole', formData.role || 'reader');
      localStorage.setItem('userJoinDate', new Date().toISOString().split('T')[0]);
      window.location.href = '/home'; // Redirect to home
    }, 2000);
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
          
          {/* Animated writing GIF simulation */}
          <div className="hidden md:block relative h-48 rounded-xl overflow-hidden border border-gray-700">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
              <div className="text-center">
                <div className="inline-block mb-4">
                  <div className="w-16 h-16 mx-auto flex items-center justify-center bg-gradient-to-r from-purple-600 to-pink-500 rounded-full">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </div>
                </div>
                <p className="text-gray-300 font-medium">Write. Share. Inspire.</p>
                <p className="text-gray-500 text-sm">Join as an author to start your blogging journey</p>
              </div>
            </div>
            
            {/* Animated cursor effect */}
            <div className="absolute top-1/2 left-1/4 w-0.5 h-8 bg-pink-500 animate-pulse"></div>
            <div className="absolute top-1/3 right-1/3 w-0.5 h-6 bg-blue-500 animate-pulse delay-300"></div>
          </div>
          
          <div className="mt-8">
            <div className="flex items-center text-gray-400">
              <div className="w-8 h-8 mr-3 flex items-center justify-center rounded-full bg-gray-800">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                </svg>
              </div>
              <span>Create and manage your blog posts</span>
            </div>
            <div className="flex items-center text-gray-400 mt-3">
              <div className="w-8 h-8 mr-3 flex items-center justify-center rounded-full bg-gray-800">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                </svg>
              </div>
              <span>Engage with readers through comments</span>
            </div>
            <div className="flex items-center text-gray-400 mt-3">
              <div className="w-8 h-8 mr-3 flex items-center justify-center rounded-full bg-gray-800">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
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
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>
            <button 
              className={`flex-1 py-3 font-medium text-lg ${!isLogin ? 'text-white border-b-2 border-pink-500' : 'text-gray-500'}`}
              onClick={() => setIsLogin(false)}
            >
              Sign Up
            </button>
          </div>
          
          {message.text && (
            <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
              {message.text}
            </div>
          )}
          
          {isLogin ? (
            <LoginForm onSubmit={handleAuthSubmit} loading={loading} />
          ) : (
            <SignupForm onSubmit={handleAuthSubmit} loading={loading} />
          )}
          
          <div className="mt-8 pt-6 border-t border-gray-800">
            <p className="text-center text-gray-500">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                className="text-purple-400 hover:text-purple-300 font-medium"
                onClick={() => setIsLogin(!isLogin)}
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