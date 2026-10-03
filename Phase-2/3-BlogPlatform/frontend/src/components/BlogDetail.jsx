import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  getPost,
  likePost,
  unlikePost,
  getComments,
  addComment,
  getImageUrl,
} from "../api/api";
import { motion } from "framer-motion";

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
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userName = localStorage.getItem("userName");
    const userEmail = localStorage.getItem("userEmail");
    const userId = localStorage.getItem("userId");
    if (token && userName) {
      setUser({ token, name: userName, email: userEmail, id: userId });
    }
    fetchBlog();
    fetchComments();
  }, [id]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getPost(id);
      const blogData = response?.data || response;
      if (!blogData) {
        setError("Blog post not found");
        return;
      }
      const userId = localStorage.getItem("userId");
      if (userId && blogData.likes) setLiked(blogData.likes.includes(userId));
      setBlog({
        ...blogData,
        id: blogData._id || blogData.id,
        authorName: blogData.authorName || blogData.author?.name || "Anonymous",
        date: blogData.createdAt
          ? new Date(blogData.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : "Unknown date",
        readTime:
          blogData.readTime ||
          `${Math.ceil((blogData.content?.split(" ").length || 0) / 200) || 3} min read`,
        likesCount: blogData.likes?.length || 0,
        commentsCount: blogData.comments?.length || 0,
      });
    } catch (err) {
      console.error("Error fetching blog:", err);
      setError("Failed to load blog post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await getComments(id);
      const data = response?.data || response || [];
      setComments(
        data.map((c) => ({
          ...c,
          id: c._id || c.id,
          authorName: c.user?.name || c.authorName || "Anonymous",
          date: c.createdAt
            ? new Date(c.createdAt).toLocaleDateString()
            : "Unknown date",
        })),
      );
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  const handleLike = async () => {
    if (!user) {
      navigate(`/auth`);
      return;
    }
    setLikeLoading(true);
    try {
      if (liked) {
        await unlikePost(id);
      } else {
        await likePost(id);
      }
      setLiked(!liked);
      setBlog((prev) => ({
        ...prev,
        likesCount: liked ? prev.likesCount - 1 : prev.likesCount + 1,
      }));
    } catch (err) {
      console.error("Error toggling like:", err);
    } finally {
      setLikeLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!user) {
      navigate(`/auth`);
      return;
    }
    if (!newComment.trim()) return;
    setCommentLoading(true);
    try {
      await addComment({ postId: id, content: newComment.trim() });
      setNewComment("");
      await fetchComments();
      setBlog((prev) => ({ ...prev, commentsCount: prev.commentsCount + 1 }));
    } catch (err) {
      console.error("Error adding comment:", err);
      alert("Failed to add comment. Please try again.");
    } finally {
      setCommentLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent mx-auto mb-4" />
          <p className="text-text-secondary">Loading story...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-5 text-text-secondary">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-text-primary mb-2">
            Post not found
          </h3>
          <p className="text-text-secondary mb-6 text-sm">
            {error || "This blog post doesn't exist."}
          </p>
          <button
            onClick={() => navigate("/home")}
            className="px-6 py-2 bg-accent text-primary rounded-full font-medium text-sm hover:bg-amber-300 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary">
      <div className="container mx-auto px-4 pt-8 pb-12">
        <button
          onClick={() => navigate("/home")}
          className="inline-flex items-center text-accent hover:text-amber-300 text-sm group mb-8"
        >
          <svg
            className="w-4 h-4 mr-1.5 group-hover:-translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Collection
        </button>
        <motion.article
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl mx-auto"
        >
          <div className="mb-8">
            <span className="inline-flex items-center px-3 py-1 bg-secondary text-accent rounded-full text-xs font-medium mb-4">
              {blog.category}
            </span>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-text-primary mb-6 leading-tight">
              {blog.title}
            </h1>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-accent to-amber-300 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold">
                    {blog.authorName?.charAt(0).toUpperCase() || "A"}
                  </span>
                </div>
                <div>
                  <p className="text-text-primary font-medium text-sm">
                    {blog.authorName}
                  </p>
                  <p className="text-text-secondary text-xs">
                    {blog.date} · {blog.readTime}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLike}
                disabled={likeLoading}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all text-sm disabled:opacity-50 ${liked ? "bg-accent/20 text-accent" : "bg-secondary text-text-secondary hover:bg-secondary/80"}`}
              >
                {likeLoading ? (
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                ) : (
                  <>
                    <svg
                      className={`w-4 h-4 ${liked ? "fill-accent" : ""}`}
                      fill={liked ? "currentColor" : "none"}
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                      />
                    </svg>
                    <span>{blog.likesCount || 0}</span>
                  </>
                )}
              </button>
            </div>
          </div>
          {/* {blog.image && (
            <div className="relative h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden mb-10">
              <img src={typeof blog.image === "string" ? blog.image : blog.image.url} alt={blog.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
            </div>
          )} */}
          {getImageUrl(blog.image) && (
            <div className="relative h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden mb-10">
              <img
                src={getImageUrl(blog.image)}
                alt={blog.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=1974";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
            </div>
          )}
          <div className="text-text-secondary leading-relaxed text-base sm:text-lg whitespace-pre-line mb-12 font-serif">
            {blog.content}
          </div>
          <div className="border-t border-secondary pt-10">
            <h2 className="font-display text-2xl text-text-primary mb-8">
              Comments ({comments.length})
            </h2>
            {!user ? (
              <div className="mb-8 p-6 bg-secondary/50 rounded-xl text-center">
                <p className="text-text-secondary mb-4 text-sm">
                  Please log in to leave a comment
                </p>
                <Link
                  to={`/auth`}
                  className="inline-flex items-center px-5 py-2 bg-accent text-primary rounded-full font-medium text-sm hover:bg-amber-300 transition-colors"
                >
                  Login to Comment
                </Link>
              </div>
            ) : (
              <div className="mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-r from-accent to-amber-300 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary text-sm font-bold">
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Share your thoughts..."
                      className="w-full px-4 py-3 bg-secondary border border-secondary/50 rounded-lg text-text-primary placeholder-text-secondary focus:ring-2 focus:ring-accent focus:outline-none resize-none text-sm"
                      rows="3"
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={handleAddComment}
                        disabled={commentLoading || !newComment.trim()}
                        className="px-5 py-2 bg-accent text-primary rounded-full font-bold text-sm hover:bg-amber-300 transition-colors disabled:opacity-50"
                      >
                        {commentLoading ? "Posting..." : "Post Comment"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="space-y-5">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-secondary/50 rounded-xl p-5"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-r from-accent to-amber-300 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary text-sm font-bold">
                        {comment.authorName?.charAt(0).toUpperCase() || "A"}
                      </span>
                    </div>
                    <div>
                      <p className="text-text-primary font-medium text-sm">
                        {comment.authorName}
                      </p>
                      <p className="text-text-secondary text-xs">
                        {comment.date}
                      </p>
                    </div>
                  </div>
                  <p className="text-text-secondary text-sm leading-relaxed font-serif">
                    {comment.content}
                  </p>
                </div>
              ))}
              {comments.length === 0 && (
                <p className="text-text-secondary text-center py-8 text-sm">
                  No comments yet — be the first!
                </p>
              )}
            </div>
          </div>
        </motion.article>
      </div>
    </div>
  );
};

export default BlogDetail;
