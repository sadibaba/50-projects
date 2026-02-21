import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPosts, getUserProfile } from '../api/api';
import UserDashboard from './UserDashboard';
import PublicProfile from './PublicProfile';
import EditProfileModal from './EditProfileModal';

const UserProfile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('posts');
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, [username]);

  const fetchUserData = async () => {
    setLoading(true);
    setError('');

    try {
      // Get current logged in user from localStorage
      const currentUserId = localStorage.getItem('userId');
      const currentUserName = localStorage.getItem('userName');
      const currentUserEmail = localStorage.getItem('userEmail');
      const currentUserRole = localStorage.getItem('userRole');

      // If viewing a specific user profile by username
      if (username) {
        // Check if viewing own profile
        if (username.toLowerCase() === currentUserName?.toLowerCase()) {
          // This is current user's profile
          setIsCurrentUser(true);
          setUser({
            _id: currentUserId,
            name: currentUserName,
            email: currentUserEmail,
            role: currentUserRole,
            joinDate: localStorage.getItem('userJoinDate') || new Date().toISOString(),
            bio: localStorage.getItem('userBio') || 'Passionate writer and reader. Exploring the world one story at a time.',
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUserName || 'User')}&background=8b5cf6&color=fff&size=200`,
            stats: {
              posts: 0,
              likes: 0,
              comments: 0,
              followers: 0,
              following: 0
            }
          });
          await fetchUserBlogs(currentUserName);
        } else {
          // This is someone else's profile - fetch from API
          try {
            // You'll need to create an API endpoint to get user by username
            // For now, we'll use mock data but with real structure
            setIsCurrentUser(false);
            const mockUser = {
              _id: `user-${Date.now()}`,
              name: username.charAt(0).toUpperCase() + username.slice(1),
              email: `${username}@example.com`,
              role: Math.random() > 0.5 ? 'author' : 'reader',
              joinDate: '2023-08-15T00:00:00.000Z',
              bio: 'Passionate writer and reader. Exploring the world one story at a time.',
              avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=8b5cf6&color=fff&size=200`,
              stats: {
                posts: Math.floor(Math.random() * 20),
                likes: Math.floor(Math.random() * 500),
                comments: Math.floor(Math.random() * 100),
                followers: Math.floor(Math.random() * 300),
                following: Math.floor(Math.random() * 150)
              }
            };
            setUser(mockUser);
            await fetchUserBlogs(username);
          } catch (err) {
            setError('User not found');
          }
        }
      } else {
        // No username in URL - show current user's profile
        if (!currentUserId) {
          navigate('/auth');
          return;
        }

        setIsCurrentUser(true);
        setUser({
          _id: currentUserId,
          name: currentUserName,
          email: currentUserEmail,
          role: currentUserRole,
          joinDate: localStorage.getItem('userJoinDate') || new Date().toISOString(),
          bio: localStorage.getItem('userBio') || 'Passionate writer and reader. Exploring the world one story at a time.',
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUserName || 'User')}&background=8b5cf6&color=fff&size=200`,
          stats: {
            posts: 0,
            likes: 0,
            comments: 0,
            followers: 0,
            following: 0
          }
        });
        await fetchUserBlogs(currentUserName);
      }
    } catch (err) {
      setError(err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserBlogs = async (authorName) => {
    try {
      const data = await getPosts();
      
      // Handle different response structures
      const postsArray = data.data || data || [];
      
      // Filter blogs by author name (case insensitive)
      const userBlogs = postsArray.filter(blog => 
        blog.authorName?.toLowerCase() === authorName?.toLowerCase() ||
        blog.author?.name?.toLowerCase() === authorName?.toLowerCase() ||
        blog.author?.toLowerCase() === authorName?.toLowerCase()
      );

      // Process blogs with proper formatting
      const processedBlogs = userBlogs.map(blog => ({
        id: blog._id || blog.id,
        title: blog.title || 'Untitled Post',
        content: blog.content || '',
        excerpt: blog.excerpt || (blog.content?.substring(0, 150) + '...') || 'No description available',
        author: blog.authorName || blog.author?.name || blog.author || 'Anonymous',
        date: blog.createdAt ? new Date(blog.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }) : 'Unknown date',
        category: blog.category || 'Uncategorized',
        image: blog.image?.url || 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=1974',
        readTime: blog.readTime || `${Math.ceil((blog.content?.split(' ').length || 0) / 200) || 5} min read`,
        likes: blog.likes?.length || 0,
        comments: blog.comments?.length || 0,
        views: blog.views || 0,
        createdAt: blog.createdAt
      }));

      setBlogs(processedBlogs);

      // Update user stats with real data
      if (user) {
        const totalLikes = processedBlogs.reduce((sum, blog) => sum + blog.likes, 0);
        const totalComments = processedBlogs.reduce((sum, blog) => sum + blog.comments, 0);
        
        setUser(prev => ({
          ...prev,
          stats: {
            ...prev.stats,
            posts: processedBlogs.length,
            likes: totalLikes,
            comments: totalComments
          }
        }));
      }
    } catch (err) {
      console.error('Error fetching user blogs:', err);
    }
  };

  const handleEditProfile = () => {
    setShowEditModal(true);
  };

  const handleSaveProfile = async (updatedData) => {
    try {
      // Update localStorage
      if (updatedData.name) {
        localStorage.setItem('userName', updatedData.name);
      }
      if (updatedData.email) {
        localStorage.setItem('userEmail', updatedData.email);
      }
      if (updatedData.bio) {
        localStorage.setItem('userBio', updatedData.bio);
      }

      // Update user state
      setUser(prev => ({
        ...prev,
        name: updatedData.name || prev.name,
        email: updatedData.email || prev.email,
        bio: updatedData.bio || prev.bio,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(updatedData.name || prev.name)}&background=8b5cf6&color=fff&size=200`
      }));

      setShowEditModal(false);
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 text-gray-700">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">User not found</h3>
          <p className="text-gray-400 mb-6">{error || 'The user you\'re looking for doesn\'t exist.'}</p>
          <button 
            onClick={() => navigate('/home')}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium"
          >
            Back to Home
          </button>
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
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=8b5cf6&color=fff&size=200`;
                    }}
                  />
                </div>
                {isCurrentUser && (
                  <button 
                    onClick={handleEditProfile}
                    className="absolute bottom-3 right-3 p-2 bg-gray-900 rounded-full hover:bg-gray-800 transition-colors"
                  >
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  {user.role === 'admin' && (
                    <span className="px-3 py-1 bg-gradient-to-r from-red-600 to-orange-600 rounded-full text-sm font-medium">
                      👑 Admin
                    </span>
                  )}
                </div>
                <p className="text-gray-300 mb-4 max-w-2xl">{user.bio}</p>
                <div className="flex flex-wrap gap-4 text-gray-400 text-sm">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    {user.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                    Edit Profile
                  </button>
                  <button 
                    onClick={() => navigate('/home')}
                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all duration-300"
                  >
                    Home
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
        <div className="flex border-b border-gray-800 mb-8 overflow-x-auto">
          <button
            className={`px-6 py-3 font-medium whitespace-nowrap ${activeTab === 'posts' ? 'text-white border-b-2 border-purple-500' : 'text-gray-500 hover:text-gray-300'}`}
            onClick={() => setActiveTab('posts')}
          >
            Posts ({user.stats.posts})
          </button>
          {isCurrentUser && (
            <>
              <button
                className={`px-6 py-3 font-medium whitespace-nowrap ${activeTab === 'likes' ? 'text-white border-b-2 border-pink-500' : 'text-gray-500 hover:text-gray-300'}`}
                onClick={() => setActiveTab('likes')}
              >
                Liked Posts
              </button>
              <button
                className={`px-6 py-3 font-medium whitespace-nowrap ${activeTab === 'comments' ? 'text-white border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-300'}`}
                onClick={() => setActiveTab('comments')}
              >
                Comments
              </button>
              <button
                className={`px-6 py-3 font-medium whitespace-nowrap ${activeTab === 'saved' ? 'text-white border-b-2 border-green-500' : 'text-gray-500 hover:text-gray-300'}`}
                onClick={() => setActiveTab('saved')}
              >
                Saved
              </button>
              <button
                className={`px-6 py-3 font-medium whitespace-nowrap ${activeTab === 'account' ? 'text-white border-b-2 border-yellow-500' : 'text-gray-500 hover:text-gray-300'}`}
                onClick={() => setActiveTab('account')}
              >
                Account
              </button>
            </>
          )}
        </div>

        {isCurrentUser ? (
          <UserDashboard 
            activeTab={activeTab}
            blogs={blogs}
            loading={loading}
            user={user}
            onTabChange={setActiveTab}
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

      {/* Edit Profile Modal */}
      {showEditModal && (
        <EditProfileModal
          user={user}
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveProfile}
        />
      )}
    </div>
  );
};

export default UserProfile;