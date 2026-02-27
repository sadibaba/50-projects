import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPost, likePost, unlikePost, getComments, addComment } from "../api/api";

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [liked, setLiked] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [likeLoading, setLikeLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Get user from localStorage
    const token = localStorage.getItem('token');
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');
    const userId = localStorage.getItem('userId');
    
    if (token && userName) {
      setUser({
        token,
        name: userName,
        email: userEmail,
        id: userId
      });
    }

    fetchBlog();
    fetchComments();
  }, [id]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getPost(id);
      
      // Handle different response structures
      const blogData = response.data || response;
      
      if (!blogData) {
        setError('Blog post not found');
        return;
      }

      // Check if user liked this post
      const userId = localStorage.getItem('userId');
      if (userId && blogData.likes) {
        setLiked(blogData.likes.includes(userId));
      }
      
      // Format the blog data
      const formattedBlog = {
        ...blogData,
        id: blogData._id || blogData.id,
        authorName: blogData.authorName || blogData.author?.name || 'Anonymous',
        date: blogData.createdAt ? new Date(blogData.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }) : 'Unknown date',
        readTime: blogData.readTime || `${Math.ceil((blogData.content?.split(' ').length || 0) / 200) || 3} min read`,
        likesCount: blogData.likes?.length || 0,
        commentsCount: blogData.comments?.length || 0
      };
      
      setBlog(formattedBlog);
    } catch (err) {
      console.error("Error fetching blog:", err);
      setError('Failed to load blog post');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await getComments(id);
      const commentsData = response.data || response || [];
      
      // Format comments
      const formattedComments = commentsData.map(comment => ({
        ...comment,
        id: comment._id || comment.id,
        authorName: comment.user?.name || comment.authorName || 'Anonymous',
        date: comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : 'Unknown date'
      }));
      
      setComments(formattedComments);
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  const handleLike = async () => {
    // Check if user is logged in
    if (!user) {
      // Redirect to login with return URL
      navigate(`/auth?redirect=/blog/${id}`);
      return;
    }

    setLikeLoading(true);
    try {
      if (liked) {
        await unlikePost(id);
        setBlog(prev => ({ 
          ...prev, 
          likes: prev.likes.filter(l => l !== user.id),
          likesCount: prev.likesCount - 1 
        }));
      } else {
        await likePost(id);
        setBlog(prev => ({ 
          ...prev, 
          likes: [...(prev.likes || []), user.id],
          likesCount: prev.likesCount + 1 
        }));
      }
      setLiked(!liked);
    } catch (err) {
      console.error("Error toggling like:", err);
      alert('Failed to like/unlike post. Please try again.');
    } finally {
      setLikeLoading(false);
    }
  };

  const handleAddComment = async () => {
    // Check if user is logged in
    if (!user) {
      navigate(`/auth?redirect=/blog/${id}`);
      return;
    }

    if (!newComment.trim()) return;

    setCommentLoading(true);
    try {
      const commentData = {
        postId: id,
        content: newComment.trim()
      };
      
      const response = await addComment(commentData);
      const newCommentObj = response.data || response;
      
      // Add new comment to list with formatted data
      const formattedComment = {
        ...newCommentObj,
        id: newCommentObj._id || newCommentObj.id,
        authorName: user.name,
        date: 'Just now'
      };
      
      setComments(prev => [formattedComment, ...prev]);
      setNewComment("");
      setBlog(prev => ({ 
        ...prev, 
        commentsCount: prev.commentsCount + 1 
      }));
    } catch (err) {
      console.error("Error adding comment:", err);
      alert('Failed to add comment. Please try again.');
    } finally {
      setCommentLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 text-gray-700">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Blog post not found</h3>
          <p className="text-gray-400 mb-6">{error || 'The blog post you\'re looking for doesn\'t exist.'}</p>
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
      {/* Back Button */}
      <div className="container mx-auto px-4 py-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-6 group"
        >
          <svg
            className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            ></path>
          </svg>
          Back
        </button>
      </div>

      <main className="container mx-auto px-4 pb-8">
        <article className="max-w-4xl mx-auto">
          {/* Blog Header */}
          <div className="mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-900/30 to-pink-900/30 text-purple-300 rounded-full text-sm font-medium mb-4">
              {blog.category}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {blog.title}
            </h1>

            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {blog.authorName?.charAt(0).toUpperCase() || 'A'}
                  </span>
                </div>
                <div>
                  <p className="text-white font-medium">{blog.authorName}</p>
                  <p className="text-gray-400 text-sm">
                    {blog.date} • {blog.views || 0} views
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleLike}
                  disabled={likeLoading}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    liked ? "bg-pink-900/30 text-pink-400" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                  } disabled:opacity-50`}
                >
                  {likeLoading ? (
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <>
                      <svg
                        className={`w-5 h-5 ${liked ? "fill-pink-400" : ""}`}
                        fill={liked ? "currentColor" : "none"}
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                        ></path>
                      </svg>
                      <span>{blog.likesCount || 0}</span>
                    </>
                  )}
                </button>

                <Link
                  to={`/profile/${blog.authorName}`}
                  className="p-2 bg-gray-800 text-gray-400 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          {blog.image?.url && (
            <div className="relative h-96 rounded-2xl overflow-hidden mb-12">
              <img
                src={blog.image.url}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent"></div>
            </div>
          )}

          {/* Blog Content */}
          <div className="prose prose-lg prose-invert max-w-none mb-12">
            <div className="text-gray-300 leading-relaxed text-lg whitespace-pre-line">
              {blog.content}
            </div>
          </div>

          {/* Comments Section */}
          <div className="border-t border-gray-800 pt-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white">
                Comments ({comments.length})
              </h2>
            </div>

            {/* Add Comment - Show login prompt if not logged in */}
            {!user ? (
              <div className="mb-8 p-6 bg-gray-800/50 rounded-lg text-center">
                <p className="text-gray-300 mb-4">Please login to add a comment</p>
                <Link
                  to={`/auth?redirect=/blog/${id}`}
                  className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium"
                >
                  Login to Comment
                </Link>
              </div>
            ) : (
              <div className="mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-medium">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-600 resize-none"
                      rows="3"
                    />
                    <div className="flex justify-end mt-3">
                      <button
                        onClick={handleAddComment}
                        disabled={commentLoading || !newComment.trim()}
                        className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 text-white rounded-lg font-medium"
                      >
                        {commentLoading ? 'Posting...' : 'Post Comment'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-gray-800/50 rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-900 to-pink-900 flex items-center justify-center">
                        <span className="text-white font-medium">
                          {comment.authorName?.charAt(0).toUpperCase() || 'A'}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{comment.authorName}</p>
                        <p className="text-gray-500 text-sm">{comment.date}</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-300">{comment.content}</p>
                </div>
              ))}

              {comments.length === 0 && (
                <p className="text-gray-400 text-center py-8">No comments yet. Be the first to comment!</p>
              )}
            </div>
          </div>
        </article>
      </main>
    </div>
  );
};

export default BlogDetail;