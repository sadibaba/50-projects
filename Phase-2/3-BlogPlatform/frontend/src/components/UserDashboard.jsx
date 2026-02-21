import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getPosts, deletePost, likePost, unlikePost, getComments } from '../api/api';

const UserDashboard = ({ activeTab, blogs: initialBlogs, loading, user, onTabChange }) => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState(initialBlogs);
  const [likedPosts, setLikedPosts] = useState([]);
  const [userComments, setUserComments] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [actionLoading, setActionLoading] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(null);

  useEffect(() => {
    setBlogs(initialBlogs);
  }, [initialBlogs]);

  useEffect(() => {
    if (activeTab === 'likes') {
      fetchLikedPosts();
    } else if (activeTab === 'comments') {
      fetchUserComments();
    } else if (activeTab === 'saved') {
      fetchSavedPosts();
    }
  }, [activeTab]);

  const fetchLikedPosts = async () => {
    try {
      const data = await getPosts();
      const postsArray = data.data || data || [];
      
      // Get liked posts from localStorage or API
      const likedPostIds = JSON.parse(localStorage.getItem('likedPosts') || '[]');
      
      const liked = postsArray.filter(post => likedPostIds.includes(post._id || post.id));
      setLikedPosts(liked);
    } catch (err) {
      console.error('Error fetching liked posts:', err);
    }
  };

  const fetchUserComments = async () => {
    try {
      // This would ideally be an API endpoint to get user's comments
      // For now, we'll fetch comments from posts
      const allComments = [];
      for (const blog of blogs) {
        try {
          const comments = await getComments(blog.id);
          const userCommentsForPost = comments.filter(c => c.user?.name === user.name);
          allComments.push(...userCommentsForPost.map(c => ({
            ...c,
            postTitle: blog.title,
            postId: blog.id
          })));
        } catch (err) {
          console.error('Error fetching comments for post:', blog.id);
        }
      }
      setUserComments(allComments);
    } catch (err) {
      console.error('Error fetching user comments:', err);
    }
  };

  const fetchSavedPosts = () => {
    const saved = JSON.parse(localStorage.getItem('savedPosts') || '[]');
    setSavedPosts(saved);
  };

  const handleDeletePost = async (postId) => {
    setActionLoading(prev => ({ ...prev, [postId]: true }));
    try {
      await deletePost(postId);
      setBlogs(prev => prev.filter(blog => blog.id !== postId));
      setShowDeleteModal(null);
    } catch (err) {
      console.error('Error deleting post:', err);
      alert('Failed to delete post. Please try again.');
    } finally {
      setActionLoading(prev => ({ ...prev, [postId]: false }));
    }
  };

  const handleEditPost = (postId) => {
    navigate(`/edit-post/${postId}`);
  };

  const handleViewPost = (postId) => {
    navigate(`/blog/${postId}`);
  };

  const handleUnlikePost = async (postId) => {
    setActionLoading(prev => ({ ...prev, [postId]: true }));
    try {
      await unlikePost(postId);
      
      // Update liked posts
      const likedPostIds = JSON.parse(localStorage.getItem('likedPosts') || '[]');
      const updatedLikes = likedPostIds.filter(id => id !== postId);
      localStorage.setItem('likedPosts', JSON.stringify(updatedLikes));
      
      // Remove from likedPosts state
      setLikedPosts(prev => prev.filter(post => (post._id || post.id) !== postId));
    } catch (err) {
      console.error('Error unliking post:', err);
    } finally {
      setActionLoading(prev => ({ ...prev, [postId]: false }));
    }
  };

  const handleRemoveSaved = (postId) => {
    const saved = JSON.parse(localStorage.getItem('savedPosts') || '[]');
    const updated = saved.filter(id => id !== postId);
    localStorage.setItem('savedPosts', JSON.stringify(updated));
    setSavedPosts(updated);
  };

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

  // Posts Tab
  if (activeTab === 'posts') {
    return (
      <div>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-white">My Posts</h2>
          <button 
            onClick={() => navigate('/home')}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all duration-300 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Create New Post
          </button>
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
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=1974';
                    }}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-gradient-to-r from-purple-900/30 to-pink-900/30 text-purple-300 rounded-full text-sm">
                      {blog.category}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <button 
                      onClick={() => setShowDeleteModal(blog.id)}
                      className="p-2 bg-gray-900/80 backdrop-blur-sm rounded-lg hover:bg-red-900/80 transition-colors"
                    >
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{blog.title}</h3>
                  <p className="text-gray-300 mb-4 line-clamp-2">{blog.excerpt}</p>
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>{blog.date}</span>
                      <span>•</span>
                      <span>{blog.readTime}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-gray-400 text-sm flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                        {blog.views}
                      </span>
                      <span className="text-gray-400 text-sm flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>
                        </svg>
                        {blog.likes}
                      </span>
                      <span className="text-gray-400 text-sm flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                        </svg>
                        {blog.comments}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleEditPost(blog.id)}
                      className="flex-1 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleViewPost(blog.id)}
                      className="flex-1 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 text-gray-700">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No posts yet</h3>
            <p className="text-gray-400 mb-6">Start writing your first blog post!</p>
            <button 
              onClick={() => navigate('/home')}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all duration-300"
            >
              Create Your First Post
            </button>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-white mb-4">Delete Post</h3>
              <p className="text-gray-300 mb-6">Are you sure you want to delete this post? This action cannot be undone.</p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteModal(null)}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeletePost(showDeleteModal)}
                  disabled={actionLoading[showDeleteModal]}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-50"
                >
                  {actionLoading[showDeleteModal] ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Likes Tab
  if (activeTab === 'likes') {
    return (
      <div>
        <h2 className="text-2xl font-bold text-white mb-8">Posts You Liked</h2>
        {likedPosts.length > 0 ? (
          <div className="space-y-4">
            {likedPosts.map(post => (
              <div key={post._id || post.id} className="bg-gray-800/50 rounded-xl p-6 border border-gray-800 hover:border-pink-900/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">{post.title}</h3>
                    <div className="flex items-center gap-4 text-gray-400 text-sm mb-4">
                      <span>By {post.authorName || post.author}</span>
                      <span>•</span>
                      <span>{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Unknown date'}</span>
                    </div>
                    <p className="text-gray-300 mb-4 line-clamp-2">{post.excerpt || post.content?.substring(0, 150)}</p>
                    <div className="flex items-center gap-4">
                      <span className="text-pink-400 text-sm flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path>
                        </svg>
                        {post.likes || post.likesCount || 0} likes
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    <button
                      onClick={() => handleViewPost(post._id || post.id)}
                      className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      Read
                    </button>
                    <button
                      onClick={() => handleUnlikePost(post._id || post.id)}
                      disabled={actionLoading[post._id || post.id]}
                      className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">No liked posts yet</p>
          </div>
        )}
      </div>
    );
  }

  // Comments Tab
  if (activeTab === 'comments') {
    return (
      <div>
        <h2 className="text-2xl font-bold text-white mb-8">Your Comments</h2>
        {userComments.length > 0 ? (
          <div className="space-y-4">
            {userComments.map(comment => (
              <div key={comment._id || comment.id} className="bg-gray-800/50 rounded-xl p-6 border border-gray-800 hover:border-blue-900/50 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">On: {comment.postTitle}</h3>
                    <p className="text-gray-400 text-sm">{new Date(comment.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <p className="text-gray-300 bg-gray-900/50 rounded-lg p-4 mb-4">{comment.content}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-gray-400 text-sm flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>
                      </svg>
                      {comment.likes || 0}
                    </span>
                  </div>
                  <button 
                    onClick={() => handleViewPost(comment.postId)}
                    className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                  >
                    View Post →
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">No comments yet</p>
          </div>
        )}
      </div>
    );
  }

  // Saved Tab
  if (activeTab === 'saved') {
    return (
      <div>
        <h2 className="text-2xl font-bold text-white mb-8">Saved Posts</h2>
        {savedPosts.length > 0 ? (
          <div className="space-y-4">
            {savedPosts.map(postId => {
              const post = blogs.find(b => b.id === postId);
              if (!post) return null;
              
              return (
                <div key={postId} className="bg-gray-800/50 rounded-xl p-6 border border-gray-800 hover:border-green-900/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">{post.title}</h3>
                      <div className="flex items-center gap-4 text-gray-400 text-sm mb-4">
                        <span>By {post.author}</span>
                        <span>•</span>
                        <span>{post.date}</span>
                      </div>
                      <p className="text-gray-300 mb-4 line-clamp-2">{post.excerpt}</p>
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      <button
                        onClick={() => handleViewPost(postId)}
                        className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        Read
                      </button>
                      <button
                        onClick={() => handleRemoveSaved(postId)}
                        className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">No saved posts yet</p>
          </div>
        )}
      </div>
    );
  }

  // Account Tab
  if (activeTab === 'account') {
    return (
      <div>
        <h2 className="text-2xl font-bold text-white mb-8">Account Settings</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-800">
              <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Full Name</label>
                  <p className="text-white bg-gray-900/50 p-3 rounded-lg">{user.name}</p>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Email Address</label>
                  <p className="text-white bg-gray-900/50 p-3 rounded-lg">{user.email}</p>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Role</label>
                  <p className="text-white capitalize bg-gray-900/50 p-3 rounded-lg">{user.role}</p>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Bio</label>
                  <p className="text-white bg-gray-900/50 p-3 rounded-lg">{user.bio || 'No bio provided'}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-800">
              <h3 className="text-lg font-semibold text-white mb-4">Account Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-900/50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-white">{user.stats.posts}</div>
                  <div className="text-gray-400 text-sm">Total Posts</div>
                </div>
                <div className="bg-gray-900/50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-white">{user.stats.likes}</div>
                  <div className="text-gray-400 text-sm">Total Likes</div>
                </div>
                <div className="bg-gray-900/50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-white">{user.stats.comments}</div>
                  <div className="text-gray-400 text-sm">Total Comments</div>
                </div>
                <div className="bg-gray-900/50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-white">{user.stats.followers}</div>
                  <div className="text-gray-400 text-sm">Followers</div>
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
              <h3 className="text-lg font-semibold text-white mb-4">Membership</h3>
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
    );
  }

  return null;
};

export default UserDashboard;