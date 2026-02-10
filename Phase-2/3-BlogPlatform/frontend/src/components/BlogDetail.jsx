import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getPosts } from "../api/api.js";

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchBlog();
    fetchComments();

    // Check if user liked or saved this blog
    const likedBlogs = JSON.parse(localStorage.getItem("likedBlogs") || "[]");
    const savedBlogs = JSON.parse(localStorage.getItem("savedBlogs") || "[]");
    setLiked(likedBlogs.includes(id));
    setSaved(savedBlogs.includes(id));
  }, [id]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const data = await getPosts();

      // Try to find the blog by id
      const foundBlog = data.find(
        (b) =>
          b.id === parseInt(id) ||
          b._id === id ||
          String(b.id) === id ||
          String(b._id) === id,
      );

      if (foundBlog) {
        setBlog(foundBlog);
      } else {
        // If not found, use first blog as fallback
        setBlog(data[0] || getFallbackBlog());
      }
    } catch (error) {
      console.error("Error fetching blog:", error);
      setBlog(getFallbackBlog());
    } finally {
      setLoading(false);
    }
  };

  const getFallbackBlog = () => ({
    id: id,
    title: "Amazing Blog Post",
    content: `# Welcome to This Amazing Blog Post!

This is a sample blog post content. In a real application, this would be fetched from your backend server.

## About This Blog
This blog post demonstrates the layout and features of the blog detail page. You can read, like, comment, and share posts.

## Features Included:
- **Rich text formatting** with Markdown support
- **Like system** to show appreciation
- **Comments section** for discussions
- **Read time** estimation
- **Category tags** for better organization

## How to Use:
1. **Like** posts you enjoy
2. **Comment** to share your thoughts
3. **Save** posts for later reading
4. **Share** with friends

---

*Start writing your own amazing stories by clicking the "Write Blog" button on the home page!*`,
    author: "BlogSphere Team",
    date: new Date().toISOString().split("T")[0],
    category: "Featured",
    image:
      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=2072",
    readTime: "5 min read",
    likes: 156,
    comments: 24,
    views: 1024,
  });

  const fetchComments = () => {
    // Mock comments data
    const mockComments = [
      {
        id: 1,
        author: "Sarah Johnson",
        avatar: "SJ",
        content:
          "Great article! I learned a lot from this post. Looking forward to reading more from this author.",
        date: "2 days ago",
        likes: 12,
      },
      {
        id: 2,
        author: "Mike Chen",
        avatar: "MC",
        content:
          "Very insightful post. The examples were particularly helpful. Thanks for sharing!",
        date: "3 days ago",
        likes: 8,
      },
      {
        id: 3,
        author: "Emma Wilson",
        avatar: "EW",
        content:
          "I've been looking for information on this topic for weeks. This post answered all my questions!",
        date: "1 week ago",
        likes: 15,
      },
    ];
    setComments(mockComments);
  };

  const handleLike = () => {
    if (!blog) return;

    const updatedLikes = liked ? blog.likes - 1 : blog.likes + 1;
    setBlog({ ...blog, likes: updatedLikes });
    setLiked(!liked);

    // Save liked state to localStorage
    const likedBlogs = JSON.parse(localStorage.getItem("likedBlogs") || "[]");
    if (liked) {
      const filtered = likedBlogs.filter((blogId) => blogId !== id);
      localStorage.setItem("likedBlogs", JSON.stringify(filtered));
    } else {
      localStorage.setItem("likedBlogs", JSON.stringify([...likedBlogs, id]));
    }
  };

  const handleSave = () => {
    setSaved(!saved);

    // Save to localStorage
    const savedBlogs = JSON.parse(localStorage.getItem("savedBlogs") || "[]");
    if (saved) {
      const filtered = savedBlogs.filter((blogId) => blogId !== id);
      localStorage.setItem("savedBlogs", JSON.stringify(filtered));
    } else {
      localStorage.setItem("savedBlogs", JSON.stringify([...savedBlogs, id]));
    }
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const userName = localStorage.getItem("userName") || "Anonymous";
    const newCommentObj = {
      id: comments.length + 1,
      author: userName,
      avatar: userName.charAt(0).toUpperCase(),
      content: newComment,
      date: "Just now",
      likes: 0,
    };

    setComments([newCommentObj, ...comments]);
    setNewComment("");

    // Update blog comments count
    setBlog({ ...blog, comments: blog.comments + 1 });
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

  const getAuthorName = (author) => {
  if (!author) return 'Anonymous';
  if (typeof author === 'string') return author;
  if (author.name) return author.name;
  if (author.username) return author.username;
  if (author.email) return author.email.split('@')[0];
  return 'Author';
};

const getAuthorInitial = (author) => {
  const name = getAuthorName(author);
  return name.charAt(0).toUpperCase();
};

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
            xmlns="http://www.w3.org/2000/svg"
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
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {getAuthorInitial(blog.author)}
                    </span>
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      {getAuthorName(blog.author)}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {blog.date} • {blog.readTime || "5 min read"} •{" "}
                      {blog.views || 0} views
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${liked ? "bg-pink-900/30 text-pink-400" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}
                >
                  <svg
                    className={`w-5 h-5 ${liked ? "fill-pink-400" : ""}`}
                    fill={liked ? "currentColor" : "none"}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                    ></path>
                  </svg>
                  <span>{blog.likes}</span>
                </button>

                <button
                  onClick={handleSave}
                  className={`p-2 rounded-lg transition-colors ${saved ? "bg-yellow-900/30 text-yellow-400" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}
                >
                  <svg
                    className="w-5 h-5"
                    fill={saved ? "currentColor" : "none"}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                    ></path>
                  </svg>
                </button>

                <button className="p-2 bg-gray-800 text-gray-400 hover:bg-gray-700 rounded-lg transition-colors">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="relative h-96 rounded-2xl overflow-hidden mb-12">
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src =
                  "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=1974";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent"></div>
          </div>

          {/* Blog Content */}
          <div className="prose prose-lg prose-invert max-w-none mb-12">
            <div className="text-gray-300 leading-relaxed text-lg space-y-6 whitespace-pre-line">
              {blog.content}
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-3 mb-12">
  <span className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg text-sm">
    #{blog.category?.toLowerCase() || 'uncategorized'}
  </span>
  <span className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg text-sm">
    #blogging
  </span>
  <span className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg text-sm">
    #community
  </span>
</div>

          {/* Comments Section */}
          <div className="border-t border-gray-800 pt-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white">
                Comments ({comments.length})
              </h2>
              <div className="text-gray-400 text-sm">
                {blog.comments} total comments
              </div>
            </div>

            {/* Add Comment */}
            <div className="mb-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-medium">
                    {localStorage.getItem("userName")?.charAt(0) || "Y"}
                  </span>
                </div>
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-600 focus:border-transparent resize-none"
                    rows="3"
                  />
                  <div className="flex justify-end mt-3">
                    <button
                      onClick={handleAddComment}
                      disabled={!newComment.trim()}
                      className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all duration-300"
                    >
                      Post Comment
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-gray-800/50 rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-900 to-pink-900 flex items-center justify-center">
                        <span className="text-white font-medium">
                          {comment.avatar}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-medium">
                          {comment.author}
                        </p>
                        <p className="text-gray-500 text-sm">{comment.date}</p>
                      </div>
                    </div>
                    <button className="text-gray-500 hover:text-white">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                        ></path>
                      </svg>
                    </button>
                  </div>
                  <p className="text-gray-300 mb-4">{comment.content}</p>
                  <div className="flex items-center gap-4">
                    <button className="text-gray-500 hover:text-pink-400 text-sm flex items-center gap-1">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                        ></path>
                      </svg>
                      {comment.likes}
                    </button>
                    <button className="text-gray-500 hover:text-blue-400 text-sm">
                      Reply
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </article>
      </main>

      {/* Bottom Navigation */}
      <div className="sticky bottom-0 bg-gray-900/90 backdrop-blur-lg border-t border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium"
            >
              ← Back
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={handleLike}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${liked ? "bg-pink-900/30 text-pink-400" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}
              >
                {liked ? "Liked" : "Like"} ({blog.likes})
              </button>
              <button
                onClick={() => navigate("/home")}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium"
              >
                Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
