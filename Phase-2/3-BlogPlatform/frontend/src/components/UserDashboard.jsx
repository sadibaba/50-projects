import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import EditProfileModal from './EditProfileModal';

const UserDashboard = ({ activeTab, blogs, loading, user }) => {
  const [showEditModal, setShowEditModal] = useState(false);

  // Mock data for likes, comments, and saved posts
  const likedPosts = [
    {
      id: 101,
      title: "The Future of Web Development",
      author: "Sarah Johnson",
      date: "2024-03-10",
      likes: 450
    },
    {
      id: 102,
      title: "Sustainable Living Tips",
      author: "Eco Warrior",
      date: "2024-03-08",
      likes: 320
    },
    {
      id: 103,
      title: "Mastering React Hooks",
      author: "Code Master",
      date: "2024-03-05",
      likes: 890
    }
  ];

  const userComments = [
    {
      id: 1,
      postTitle: "The Future of AI",
      comment: "Great article! I particularly liked the section about ethical AI.",
      date: "2024-03-14",
      likes: 12
    },
    {
      id: 2,
      postTitle: "Healthy Cooking Recipes",
      comment: "Tried this recipe last night and it was amazing!",
      date: "2024-03-12",
      likes: 8
    },
    {
      id: 3,
      postTitle: "Travel Photography Tips",
      comment: "These tips really helped improve my travel photos!",
      date: "2024-03-10",
      likes: 15
    }
  ];

  const savedPosts = [
    {
      id: 201,
      title: "Beginner's Guide to Machine Learning",
      author: "AI Expert",
      date: "2024-02-28"
    },
    {
      id: 202,
      title: "Minimalist Home Design",
      author: "Design Guru",
      date: "2024-02-25"
    },
    {
      id: 203,
      title: "Productivity Hacks for Developers",
      author: "Productivity Pro",
      date: "2024-02-20"
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-gray-800/50 rounded-xl p-6 animate-pulse">
            <div className="h-48 bg-gray-700 rounded-lg mb-4"></div>
            <div className="h-4 bg-gray-700 rounded w-1/4 mb-4"></div>
            <div className="h-6 bg-gray-700 rounded mb-2"></div>
            <div className="h-4 bg-gray-700 rounded mb-4"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      {/* Posts Tab */}
      {activeTab === 'posts' && (
        <div>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-white">My Posts</h2>
            <Link 
              to="/create"
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all duration-300 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
              </svg>
              Create New Post
            </Link>
          </div>

          {blogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map(blog => (
                <div key={blog.id} className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-800 hover:border-purple-900/50 transition-all duration-300">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={blog.image} 
                      alt={blog.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4">
                      <button className="p-2 bg-gray-900/80 backdrop-blur-sm rounded-lg hover:bg-purple-900/80 transition-colors">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <span className="px-3 py-1 bg-gradient-to-r from-purple-900/30 to-pink-900/30 text-purple-300 rounded-full text-sm">
                        {blog.category}
                      </span>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                          </svg>
                          {blog.views}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{blog.title}</h3>
                    <p className="text-gray-300 mb-4 line-clamp-2">{blog.excerpt}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>{blog.date}</span>
                        <span>•</span>
                        <span>{blog.readTime}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-gray-400 text-sm flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>
                          </svg>
                          {blog.likes}
                        </span>
                        <span className="text-gray-400 text-sm flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                          </svg>
                          {blog.comments}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-3 mt-4">
                      <button className="flex-1 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors">
                        Edit
                      </button>
                      <button className="flex-1 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors">
                        View Stats
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-6 text-gray-700">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No posts yet</h3>
              <p className="text-gray-400 mb-6">Start writing your first blog post!</p>
              <Link 
                to="/create"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all duration-300"
              >
                Create Your First Post
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Likes Tab */}
      {activeTab === 'likes' && (
        <div>
          <h2 className="text-2xl font-bold text-white mb-8">Posts You Liked</h2>
          <div className="space-y-4">
            {likedPosts.map(post => (
              <div key={post.id} className="bg-gray-800/50 rounded-xl p-6 border border-gray-800 hover:border-pink-900/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{post.title}</h3>
                    <div className="flex items-center gap-4 text-gray-400 text-sm mb-4">
                      <span>By {post.author}</span>
                      <span>•</span>
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-pink-400 text-sm flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path>
                        </svg>
                        {post.likes} likes
                      </span>
                    </div>
                  </div>
                  <Link 
                    to={`/blog/${post.id}`}
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Read Post
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comments Tab */}
      {activeTab === 'comments' && (
        <div>
          <h2 className="text-2xl font-bold text-white mb-8">Your Comments</h2>
          <div className="space-y-4">
            {userComments.map(comment => (
              <div key={comment.id} className="bg-gray-800/50 rounded-xl p-6 border border-gray-800 hover:border-blue-900/50 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">{comment.postTitle}</h3>
                    <p className="text-gray-400 text-sm">Posted on {comment.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                    </button>
                    <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                </div>
                <p className="text-gray-300 bg-gray-900/50 rounded-lg p-4 mb-4">{comment.comment}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button className="text-gray-400 hover:text-blue-400 text-sm flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>
                      </svg>
                      {comment.likes} likes
                    </button>
                  </div>
                  <Link 
                    to={`/blog/${comment.id}`}
                    className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                  >
                    View Post →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Saved Tab */}
      {activeTab === 'saved' && (
        <div>
          <h2 className="text-2xl font-bold text-white mb-8">Saved Posts</h2>
          <div className="space-y-4">
            {savedPosts.map(post => (
              <div key={post.id} className="bg-gray-800/50 rounded-xl p-6 border border-gray-800 hover:border-green-900/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{post.title}</h3>
                    <div className="flex items-center gap-4 text-gray-400 text-sm mb-4">
                      <span>By {post.author}</span>
                      <span>•</span>
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-green-400 text-sm flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                        </svg>
                        Saved
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link 
                      to={`/blog/${post.id}`}
                      className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      Read
                    </Link>
                    <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Account Tab */}
      {activeTab === 'account' && (
        <div>
          <h2 className="text-2xl font-bold text-white mb-8">Account Settings</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-800">
                <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Full Name</label>
                    <div className="flex items-center justify-between">
                      <p className="text-white">{user.name}</p>
                      <button className="text-purple-400 hover:text-purple-300 text-sm">Edit</button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Email Address</label>
                    <div className="flex items-center justify-between">
                      <p className="text-white">{user.email}</p>
                      <button className="text-purple-400 hover:text-purple-300 text-sm">Edit</button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Role</label>
                    <p className="text-white capitalize">{user.role}</p>
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Bio</label>
                    <p className="text-white">{user.bio}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-800">
                <h3 className="text-lg font-semibold text-white mb-4">Security</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Password</label>
                    <div className="flex items-center justify-between">
                      <p className="text-gray-300">••••••••</p>
                      <button className="text-purple-400 hover:text-purple-300 text-sm">Change Password</button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Two-Factor Authentication</label>
                    <div className="flex items-center justify-between">
                      <p className="text-gray-300">Disabled</p>
                      <button className="text-purple-400 hover:text-purple-300 text-sm">Enable</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-800">
                <h3 className="text-lg font-semibold text-white mb-4">Account Actions</h3>
                <div className="space-y-3">
                  <button className="w-full py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors">
                    Download My Data
                  </button>
                  <button className="w-full py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors">
                    Privacy Settings
                  </button>
                  <button className="w-full py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors">
                    Notification Preferences
                  </button>
                  <button className="w-full py-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-lg text-sm font-medium transition-colors">
                    Delete Account
                  </button>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-800">
                <h3 className="text-lg font-semibold text-white mb-4">Subscription</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-white font-medium">Free Plan</p>
                    <p className="text-gray-400 text-sm">Upgrade to access premium features</p>
                  </div>
                  <button className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all duration-300">
                    Upgrade Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <EditProfileModal
          user={user}
          onClose={() => setShowEditModal(false)}
          onSave={(updatedUser) => {
            // Update user data
            setShowEditModal(false);
          }}
        />
      )}
    </>
  );
};

export default UserDashboard;