import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getPost, likePost, unlikePost, getComments, addComment } from "../api/api";

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    fetchBlog();
    fetchComments();
  }, [id]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const data = await getPost(id);
      
      // Check if user liked this post
      if (user && data.likes) {
        setLiked(data.likes.includes(user._id));
      }
      
      setBlog(data);
    } catch (error) {
      console.error("Error fetching blog:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const data = await getComments(id);
      setComments(data || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleLike = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    try {
      if (liked) {
        await unlikePost(id);
        setBlog(prev => ({ ...prev, likes: prev.likes.filter(l => l !== user._id) }));
      } else {
        await likePost(id);
        setBlog(prev => ({ ...prev, likes: [...prev.likes, user._id] }));
      }
      setLiked(!liked);
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleAddComment = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (!newComment.trim()) return;

    try {
      setCommentLoading(true);
      const commentData = {
        postId: id,
        content: newComment
      };
      
      const newCommentObj = await addComment(commentData);
      setComments(prev => [newCommentObj, ...prev]);
      setNewComment("");
      setBlog(prev => ({ ...prev, comments: (prev.comments || 0) + 1 }));
    } catch (error) {
      console.error("Error adding comment:", error);
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

  if (!blog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Blog post not found</p>
          <button 
            onClick={() => navigate('/home')}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg"
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
          Back to Home
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
                    {blog.authorName?.charAt(0) || 'A'}
                  </span>
                </div>
                <div>
                  <p className="text-white font-medium">{blog.authorName}</p>
                  <p className="text-gray-400 text-sm">
                    {new Date(blog.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                      })} • {blog.views || 0} views
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    liked ? "bg-pink-900/30 text-pink-400" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                  }`}
                >
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
                  <span>{blog.likes?.length || 0}</span>
                </button>

                <button
                  onClick={() => setSaved(!saved)}
                  className={`p-2 rounded-lg transition-colors ${
                    saved ? "bg-yellow-900/30 text-yellow-400" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill={saved ? "currentColor" : "none"}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                    ></path>
                  </svg>
                </button>
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
            <h2 className="text-2xl font-bold text-white mb-8">
              Comments ({comments.length})
            </h2>

            {/* Add Comment */}
            <div className="mb-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-medium">
                    {user?.name?.charAt(0) || 'G'}
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

            {/* Comments List */}
            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment._id} className="bg-gray-800/50 rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-900 to-pink-900 flex items-center justify-center">
                        <span className="text-white font-medium">
                          {comment.user?.name?.charAt(0) || 'A'}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{comment.user?.name || 'Anonymous'}</p>
                        <p className="text-gray-500 text-sm">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </p>
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