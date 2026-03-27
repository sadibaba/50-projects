import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPosts, deletePost, unlikePost, getComments, updateUserProfile } from '../api/api';

const UserDashboard = ({ activeTab, blogs: initialBlogs, loading, user, onTabChange, onUserUpdate }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [blogs, setBlogs] = useState(initialBlogs || []);
  const [likedPosts, setLikedPosts] = useState([]);
  const [likedLoading, setLikedLoading] = useState(false);
  const [userComments, setUserComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);

  // Sync blogs from parent
  useEffect(() => {
    setBlogs(initialBlogs || []);
  }, [initialBlogs]);

  // Fetch tab-specific data when tab changes
  useEffect(() => {
    if (activeTab === 'likes') fetchLikedPosts();
    else if (activeTab === 'comments') fetchUserComments();
  }, [activeTab]);

  // ─── Liked Posts ──────────────────────────────────────────────────────────
  // Uses the actual `likes` array on each post (array of user IDs from MongoDB)
  const fetchLikedPosts = async () => {
    setLikedLoading(true);
    try {
      const data = await getPosts();
      const postsArray = Array.isArray(data) ? data : data.data || [];
      const userId = user?._id?.toString();

      const liked = postsArray.filter(post => {
        const likesArr = post.likes || [];
        return likesArr.some(id => id?.toString() === userId);
      });

      setLikedPosts(liked);
    } catch (err) {
      console.error('Error fetching liked posts:', err);
    } finally {
      setLikedLoading(false);
    }
  };

  // ─── Comments ─────────────────────────────────────────────────────────────
  // Only fetches comments for user's own posts (not N calls for all posts)
  const fetchUserComments = async () => {
    if (!blogs.length) return;
    setCommentsLoading(true);
    try {
      const allComments = [];
      for (const blog of blogs.slice(0, 20)) { // cap at 20 posts max
        try {
          const comments = await getComments(blog.id || blog._id);
          const arr = Array.isArray(comments) ? comments : comments.data || [];
          allComments.push(
            ...arr.map(c => ({
              ...c,
              postTitle: blog.title,
              postId: blog.id || blog._id,
            }))
          );
        } catch (_) {}
      }
      setUserComments(allComments);
    } catch (err) {
      console.error('Error fetching comments:', err);
    } finally {
      setCommentsLoading(false);
    }
  };

  // ─── Delete Post ──────────────────────────────────────────────────────────
  const handleDeletePost = async (postId) => {
    setActionLoading(prev => ({ ...prev, [postId]: true }));
    try {
      await deletePost(postId);
      setBlogs(prev => prev.filter(blog => (blog.id || blog._id) !== postId));
      setShowDeleteModal(null);
    } catch (err) {
      alert('Failed to delete post. Please try again.');
    } finally {
      setActionLoading(prev => ({ ...prev, [postId]: false }));
    }
  };

  // ─── Unlike Post ──────────────────────────────────────────────────────────
  const handleUnlikePost = async (postId) => {
    setActionLoading(prev => ({ ...prev, [postId]: true }));
    try {
      await unlikePost(postId);
      setLikedPosts(prev => prev.filter(post => (post._id || post.id) !== postId));
    } catch (err) {
      console.error('Error unliking post:', err);
    } finally {
      setActionLoading(prev => ({ ...prev, [postId]: false }));
    }
  };

  // ─── Avatar Upload ────────────────────────────────────────────────────────
  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be under 5MB.');
      return;
    }

    // Show local preview immediately
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target.result);
    reader.readAsDataURL(file);

    setAvatarUploading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await updateUserProfile(formData, true);
      const newAvatarUrl = response?.user?.avatar || response?.avatar;

      if (newAvatarUrl) {
        localStorage.setItem('userAvatar', newAvatarUrl);
        onUserUpdate?.({ avatar: newAvatarUrl });
      }
    } catch (err) {
      console.error('Avatar upload error:', err);
      setAvatarPreview(null); // revert preview on failure
      alert('Failed to upload avatar. Please try again.');
    } finally {
      setAvatarUploading(false);
    }
  };

  // ─── Helpers ──────────────────────────────────────────────────────────────
  const currentAvatar = avatarPreview || user?.avatar;
  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=8b5cf6&color=fff&size=200`;

  const TabLoader = () => (
    <div className="flex items-center justify-center py-16">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
    </div>
  );

  const EmptyState = ({ icon, title, subtitle, action }) => (
    <div className="text-center py-16">
      <div className="w-16 h-16 mx-auto mb-4 text-gray-700">{icon}</div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 mb-6 text-sm">{subtitle}</p>
      {action}
    </div>
  );

  // ════════════════════════════════════════════════════════════════════════════
  // LOADING SKELETON
  // ════════════════════════════════════════════════════════════════════════════
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-gray-800/50 rounded-xl p-6 animate-pulse">
            <div className="h-48 bg-gray-700 rounded-lg mb-4"></div>
            <div className="h-4 bg-gray-700 rounded w-1/4 mb-3"></div>
            <div className="h-6 bg-gray-700 rounded mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // POSTS TAB
  // ════════════════════════════════════════════════════════════════════════════
  if (activeTab === 'posts') {
    return (
      <div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h2 className="text-2xl font-bold text-white">My Posts
            <span className="ml-2 text-base font-normal text-gray-400">({blogs.length})</span>
          </h2>
          <button
            onClick={() => navigate('/home')}
            className="px-5 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all duration-300 flex items-center gap-2 text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
            </svg>
            New Post
          </button>
        </div>

        {/* Avatar upload section — shown at top of posts tab */}
        <div className="flex items-center gap-5 bg-gray-800/40 rounded-xl p-5 mb-8 border border-gray-700/50">
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-purple-600/50 bg-gray-700">
              <img
                src={currentAvatar || defaultAvatar}
                alt={user?.name}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = defaultAvatar; }}
              />
            </div>
            {/* Upload overlay */}
            <button
              onClick={handleAvatarClick}
              disabled={avatarUploading}
              className="absolute inset-0 rounded-full flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity cursor-pointer disabled:cursor-wait"
            >
              {avatarUploading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
              ) : (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>
          <div>
            <p className="text-white font-semibold">{user?.name}</p>
            <p className="text-gray-400 text-sm mb-2">{user?.email}</p>
            <button
              onClick={handleAvatarClick}
              disabled={avatarUploading}
              className="text-purple-400 hover:text-purple-300 text-xs font-medium transition-colors disabled:opacity-50"
            >
              {avatarUploading ? 'Uploading...' : '📷 Change profile picture'}
            </button>
          </div>
        </div>

        {blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map(blog => {
              const id = blog.id || blog._id;
              return (
                <div key={id} className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-800 hover:border-purple-900/50 transition-all duration-300 flex flex-col">
                  {/* Image */}
                  <div className="relative h-44 overflow-hidden flex-shrink-0">
                    <img
                      src={blog.image?.url || blog.image || 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=800'}
                      alt={blog.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=800';
                      }}
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-1 bg-black/60 backdrop-blur-sm text-purple-300 rounded-full text-xs">
                        {blog.category}
                      </span>
                    </div>
                    <button
                      onClick={() => setShowDeleteModal(id)}
                      className="absolute top-3 right-3 p-1.5 bg-black/60 backdrop-blur-sm rounded-lg hover:bg-red-900/80 transition-colors"
                    >
                      <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-base font-bold text-white mb-1 line-clamp-2">{blog.title}</h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2 flex-1">{blog.excerpt || blog.content?.substring(0, 120)}</p>

                    {/* Stats row */}
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                        {blog.views || 0}
                      </span>
                      <span className="flex items-center gap-1 text-pink-400">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path>
                        </svg>
                        {blog.likes?.length ?? blog.likesCount ?? blog.likes ?? 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                        </svg>
                        {blog.commentsCount ?? blog.comments ?? 0}
                      </span>
                      <span className="ml-auto">
                        {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : blog.date}
                      </span>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/edit-post/${id}`)}
                        className="flex-1 py-1.5 bg-gray-700/80 hover:bg-gray-700 text-white rounded-lg text-xs font-medium transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => navigate(`/blog/${id}`)}
                        className="flex-1 py-1.5 bg-gray-700/80 hover:bg-gray-700 text-white rounded-lg text-xs font-medium transition-colors"
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>}
            title="No posts yet"
            subtitle="Start writing your first blog post!"
            action={
              <button onClick={() => navigate('/home')} className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all duration-300 text-sm">
                Create Your First Post
              </button>
            }
          />
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 max-w-sm w-full">
              <h3 className="text-lg font-bold text-white mb-3">Delete Post?</h3>
              <p className="text-gray-400 text-sm mb-6">This action cannot be undone.</p>
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowDeleteModal(null)} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm">
                  Cancel
                </button>
                <button
                  onClick={() => handleDeletePost(showDeleteModal)}
                  disabled={actionLoading[showDeleteModal]}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm disabled:opacity-50"
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

  // ════════════════════════════════════════════════════════════════════════════
  // LIKES TAB — real data from post.likes array
  // ════════════════════════════════════════════════════════════════════════════
  if (activeTab === 'likes') {
    return (
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Posts You've Liked
          <span className="ml-2 text-base font-normal text-gray-400">({likedPosts.length})</span>
        </h2>

        {likedLoading ? <TabLoader /> : likedPosts.length > 0 ? (
          <div className="space-y-3">
            {likedPosts.map(post => {
              const id = post._id || post.id;
              return (
                <div key={id} className="bg-gray-800/50 rounded-xl p-5 border border-gray-800 hover:border-pink-900/50 transition-colors flex items-center gap-4">
                  {/* Thumbnail */}
                  {(post.image?.url || post.image) && (
                    <div className="w-20 h-16 rounded-lg overflow-hidden flex-shrink-0 hidden sm:block">
                      <img
                        src={post.image?.url || post.image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-white mb-1 truncate">{post.title}</h3>
                    <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
                      <span>By {post.authorName || 'Unknown'}</span>
                      <span>•</span>
                      <span>{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''}</span>
                      <span className="text-pink-400 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path>
                        </svg>
                        {post.likes?.length || post.likesCount || 0}
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs line-clamp-1">{post.excerpt || post.content?.substring(0, 100)}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => navigate(`/blog/${id}`)}
                      className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-xs font-medium"
                    >
                      Read
                    </button>
                    <button
                      onClick={() => handleUnlikePost(id)}
                      disabled={actionLoading[id]}
                      title="Unlike"
                      className="p-1.5 hover:bg-gray-700 rounded-lg transition-colors text-pink-400 hover:text-gray-400 disabled:opacity-50"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>}
            title="No liked posts yet"
            subtitle="Like posts you enjoy and they'll show up here."
            action={<button onClick={() => navigate('/home')} className="px-5 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm">Browse Posts</button>}
          />
        )}
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // COMMENTS TAB — comments on user's own posts
  // ════════════════════════════════════════════════════════════════════════════
  if (activeTab === 'comments') {
    return (
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Comments on Your Posts</h2>
        <p className="text-gray-400 text-sm mb-6">Comments left by readers on your blog posts.</p>

        {commentsLoading ? <TabLoader /> : userComments.length > 0 ? (
          <div className="space-y-3">
            {userComments.map(comment => (
              <div key={comment._id || comment.id} className="bg-gray-800/50 rounded-xl p-5 border border-gray-800 hover:border-blue-900/50 transition-colors">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {(comment.user?.name || comment.author?.name || '?')[0].toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <span className="text-white text-sm font-medium">{comment.user?.name || comment.author?.name || 'Reader'}</span>
                      <span className="text-gray-500 text-xs ml-2">on</span>
                      <button
                        onClick={() => navigate(`/blog/${comment.postId}`)}
                        className="text-blue-400 hover:text-blue-300 text-xs ml-1 truncate font-medium"
                      >
                        {comment.postTitle}
                      </button>
                    </div>
                  </div>
                  <span className="text-gray-500 text-xs flex-shrink-0">
                    {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : ''}
                  </span>
                </div>
                <p className="text-gray-300 text-sm bg-gray-900/50 rounded-lg p-3">{comment.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>}
            title="No comments yet"
            subtitle={blogs.length ? "Your posts haven't received any comments yet." : "Create some posts first to start getting comments."}
            action={<button onClick={() => navigate('/home')} className="px-5 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm">Go to Home</button>}
          />
        )}
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // ACCOUNT TAB
  // ════════════════════════════════════════════════════════════════════════════
  if (activeTab === 'account') {
    return (
      <div>
        <h2 className="text-2xl font-bold text-white mb-8">Account Settings</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            {/* Profile picture */}
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-800">
              <h3 className="text-base font-semibold text-white mb-5">Profile Picture</h3>
              <div className="flex items-center gap-5">
                <div className="relative flex-shrink-0">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-purple-600/50 bg-gray-700">
                    <img
                      src={currentAvatar || defaultAvatar}
                      alt={user?.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = defaultAvatar; }}
                    />
                  </div>
                  {avatarUploading && (
                    <div className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-white font-medium mb-1">{user?.name}</p>
                  <p className="text-gray-400 text-sm mb-3">JPG, PNG or WebP. Max 5MB.</p>
                  <button
                    onClick={handleAvatarClick}
                    disabled={avatarUploading}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    {avatarUploading ? 'Uploading...' : 'Upload New Photo'}
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                </div>
              </div>
            </div>

            {/* Personal info */}
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-800">
              <h3 className="text-base font-semibold text-white mb-4">Personal Information</h3>
              <div className="space-y-3">
                {[
                  { label: 'Full Name', value: user?.name },
                  { label: 'Email Address', value: user?.email },
                  { label: 'Role', value: user?.role },
                  { label: 'Bio', value: user?.bio || 'No bio provided' },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-gray-400 text-xs mb-1">{label}</p>
                    <p className="text-white text-sm bg-gray-900/60 px-3 py-2.5 rounded-lg capitalize">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-800">
              <h3 className="text-base font-semibold text-white mb-4">Your Statistics</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Posts', value: user?.stats?.posts ?? blogs.length },
                  { label: 'Likes Received', value: user?.stats?.likes ?? 0 },
                  { label: 'Comments', value: user?.stats?.comments ?? 0 },
                  { label: 'Followers', value: user?.stats?.followers ?? 0 },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-gray-900/60 p-4 rounded-lg text-center">
                    <div className="text-xl font-bold text-white">{value}</div>
                    <div className="text-gray-400 text-xs mt-1">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-800">
              <h3 className="text-base font-semibold text-white mb-4">Account Actions</h3>
              <div className="space-y-2">
                {['Download My Data', 'Privacy Settings', 'Notification Preferences'].map(label => (
                  <button key={label} className="w-full py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors text-left px-3">
                    {label}
                  </button>
                ))}
                <button className="w-full py-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-lg text-sm font-medium transition-colors">
                  Delete Account
                </button>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-800">
              <h3 className="text-base font-semibold text-white mb-2">Plan</h3>
              <p className="text-gray-400 text-xs mb-4">Upgrade for premium features</p>
              <button className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all duration-300 text-sm">
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default UserDashboard;
