import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/auth');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-8">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Dashboard cards */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-800">
            <h3 className="text-xl font-bold text-white mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Posts Published</span>
                <span className="text-white font-bold">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total Likes</span>
                <span className="text-white font-bold">245</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Comments</span>
                <span className="text-white font-bold">89</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-800">
            <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button 
                onClick={() => navigate('/home')}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all duration-300"
              >
                Go to Home
              </button>
              <button 
                onClick={() => navigate('/profile')}
                className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
              >
                View Profile
              </button>
              <button className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors">
                Create New Post
              </button>
            </div>
          </div>
          
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-800">
            <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="text-gray-400 text-sm">
                <p>You liked "The Future of AI"</p>
                <p className="text-xs">2 hours ago</p>
              </div>
              <div className="text-gray-400 text-sm">
                <p>New comment on your post</p>
                <p className="text-xs">Yesterday</p>
              </div>
              <div className="text-gray-400 text-sm">
                <p>You published "React Hooks Guide"</p>
                <p className="text-xs">3 days ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;