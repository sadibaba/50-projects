import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPosts } from '../api/api';
import UserDashboard from './UserDashboard';
import PublicProfile from './PublicProfile';

const UserProfile = () => {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');
  const [isCurrentUser, setIsCurrentUser] = useState(false);

  useEffect(() => {
    fetchUserData();
    fetchUserBlogs();
  }, [username]);

  const fetchUserData = () => {
    // Get current user from localStorage
    const currentUser = {
      name: localStorage.getItem('userName') || 'User',
      email: localStorage.getItem('userEmail') || 'user@example.com',
      role: localStorage.getItem('userRole') || 'reader',
      joinDate: localStorage.getItem('userJoinDate') || '2024-01-01',
      bio: localStorage.getItem('userBio') || 'Passionate writer and reader. Exploring the world one story at a time.',
      avatar: localStorage.getItem('userAvatar') || `https://ui-avatars.com/api/?name=${localStorage.getItem('userName') || 'User'}&background=8b5cf6&color=fff`,
      stats: {
        posts: 12,
        likes: 245,
        comments: 89,
        followers: 156,
        following: 87
      }
    };

    // If viewing specific user profile, fetch that user's data
    if (username) {
      // In real app, fetch from API
      const mockUser = {
        name: username.charAt(0).toUpperCase() + username.slice(1),
        email: `${username}@example.com`,
        role: Math.random() > 0.5 ? 'author' : 'reader',
        joinDate: '2023-08-15',
        bio: 'Passionate writer and reader. Exploring the world one story at a time.',
        avatar: `https://ui-avatars.com/api/?name=${username}&background=8b5cf6&color=fff`,
        stats: {
          posts: Math.floor(Math.random() * 20),
          likes: Math.floor(Math.random() * 500),
          comments: Math.floor(Math.random() * 100),
          followers: Math.floor(Math.random() * 300),
          following: Math.floor(Math.random() * 150)
        }
      };
      setUser(mockUser);
      setIsCurrentUser(username === localStorage.getItem('userName')?.toLowerCase());
    } else {
      setUser(currentUser);
      setIsCurrentUser(true);
    }
  };

  const fetchUserBlogs = async () => {
    try {
      setLoading(true);
      const data = await getPosts();
      
      // Filter blogs for current user or specific user
      const userBlogs = data.filter(blog => 
        blog.author?.toLowerCase() === (username || localStorage.getItem('userName')?.toLowerCase() || '')
      );
      
      // Add mock data for demonstration
      const mockBlogs = Array.from({ length: 8 }, (_, i) => ({
        id: i + 1,
        title: `Blog Post ${i + 1} by ${username || 'User'}`,
        excerpt: 'This is an amazing blog post about interesting topics that everyone should read.',
        author: username || 'User',
        date: `2024-0${Math.floor(Math.random() * 3) + 1}-${Math.floor(Math.random() * 28) + 1}`,
        category: ['Technology', 'Lifestyle', 'Travel', 'Food'][i % 4],
        image: `https://images.unsplash.com/photo-${150000 + i * 1000}?q=80&w=2070`,
        readTime: `${Math.floor(Math.random() * 10) + 3} min read`,
        likes: Math.floor(Math.random() * 500),
        comments: Math.floor(Math.random() * 50),
        views: Math.floor(Math.random() * 1000)
      }));
      
      setBlogs(userBlogs.length > 0 ? userBlogs : mockBlogs);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      // Fallback mock data
      const mockBlogs = Array.from({ length: 8 }, (_, i) => ({
        id: i + 1,
        title: `Blog Post ${i + 1} by ${username || 'User'}`,
        excerpt: 'This is an amazing blog post about interesting topics that everyone should read.',
        author: username || 'User',
        date: `2024-0${Math.floor(Math.random() * 3) + 1}-${Math.floor(Math.random() * 28) + 1}`,
        category: ['Technology', 'Lifestyle', 'Travel', 'Food'][i % 4],
        image: `https://images.unsplash.com/photo-${150000 + i * 1000}?q=80&w=2070`,
        readTime: `${Math.floor(Math.random() * 10) + 3} min read`,
        likes: Math.floor(Math.random() * 500),
        comments: Math.floor(Math.random() * 50),
        views: Math.floor(Math.random() * 1000)
      }));
      setBlogs(mockBlogs);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    // Open edit profile modal
    console.log('Edit profile clicked');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Profile Header */}
      <div className="relative">
        {/* Cover Photo */}
        <div className="h-64 bg-gradient-to-r from-purple-900/30 via-pink-900/30 to-indigo-900/30">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900"></div>
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-900 to-transparent"></div>
        </div>

        {/* Profile Info */}
        <div className="container mx-auto px-4 relative -mt-32">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-40 h-40 rounded-full border-4 border-gray-900 overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600">
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {isCurrentUser && (
                  <button className="absolute bottom-3 right-3 p-2 bg-gray-900 rounded-full hover:bg-gray-800 transition-colors">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                  </button>
                )}
              </div>

              {/* User Info */}
              <div className="text-white">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">{user.name}</h1>
                  {user.role === 'author' && (
                    <span className="px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-sm font-medium">
                      ✍️ Author
                    </span>
                  )}
                </div>
                <p className="text-gray-300 mb-4 max-w-2xl">{user.bio}</p>
                <div className="flex flex-wrap gap-4 text-gray-400 text-sm">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    {user.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    Joined {new Date(user.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              {isCurrentUser ? (
                <>
                  <button
                    onClick={handleEditProfile}
                    className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                    Edit Profile
                  </button>
                  <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all duration-300">
                    New Post
                  </button>
                </>
              ) : (
                <>
                  <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all duration-300">
                    Follow
                  </button>
                  <button className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors">
                    Message
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-gray-800/50 rounded-xl p-6 text-center border border-gray-800 hover:border-purple-900/50 transition-colors">
              <div className="text-2xl font-bold text-white mb-1">{user.stats.posts}</div>
              <div className="text-gray-400 text-sm">Posts</div>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-6 text-center border border-gray-800 hover:border-purple-900/50 transition-colors">
              <div className="text-2xl font-bold text-white mb-1">{user.stats.likes}</div>
              <div className="text-gray-400 text-sm">Likes</div>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-6 text-center border border-gray-800 hover:border-purple-900/50 transition-colors">
              <div className="text-2xl font-bold text-white mb-1">{user.stats.comments}</div>
              <div className="text-gray-400 text-sm">Comments</div>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-6 text-center border border-gray-800 hover:border-purple-900/50 transition-colors">
              <div className="text-2xl font-bold text-white mb-1">{user.stats.followers}</div>
              <div className="text-gray-400 text-sm">Followers</div>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-6 text-center border border-gray-800 hover:border-purple-900/50 transition-colors">
              <div className="text-2xl font-bold text-white mb-1">{user.stats.following}</div>
              <div className="text-gray-400 text-sm">Following</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex border-b border-gray-800 mb-8">
          <button
            className={`px-6 py-3 font-medium ${activeTab === 'posts' ? 'text-white border-b-2 border-purple-500' : 'text-gray-500 hover:text-gray-300'}`}
            onClick={() => setActiveTab('posts')}
          >
            Posts
          </button>
          <button
            className={`px-6 py-3 font-medium ${activeTab === 'likes' ? 'text-white border-b-2 border-pink-500' : 'text-gray-500 hover:text-gray-300'}`}
            onClick={() => setActiveTab('likes')}
          >
            Liked Posts
          </button>
          <button
            className={`px-6 py-3 font-medium ${activeTab === 'comments' ? 'text-white border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-300'}`}
            onClick={() => setActiveTab('comments')}
          >
            Comments
          </button>
          <button
            className={`px-6 py-3 font-medium ${activeTab === 'saved' ? 'text-white border-b-2 border-green-500' : 'text-gray-500 hover:text-gray-300'}`}
            onClick={() => setActiveTab('saved')}
          >
            Saved
          </button>
          {isCurrentUser && (
            <button
              className={`px-6 py-3 font-medium ${activeTab === 'account' ? 'text-white border-b-2 border-yellow-500' : 'text-gray-500 hover:text-gray-300'}`}
              onClick={() => setActiveTab('account')}
            >
              Account
            </button>
          )}
        </div>

        {isCurrentUser ? (
          <UserDashboard 
            activeTab={activeTab}
            blogs={blogs}
            loading={loading}
            user={user}
          />
        ) : (
          <PublicProfile 
            activeTab={activeTab}
            blogs={blogs}
            loading={loading}
            user={user}
          />
        )}
      </div>
    </div>
  );
};

export default UserProfile;