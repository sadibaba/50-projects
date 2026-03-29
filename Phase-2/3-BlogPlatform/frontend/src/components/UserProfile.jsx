import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getPosts, followUser, unfollowUser, getUserProfile, getUserByUsername } from "../api/api";
import EditProfileModal from "./EditProfileModal";

/* ─── Inline UserDashboard ─────────────── */
const UserDashboard = ({
  activeTab,
  blogs,
  loading,
  user,
  onCreatePost,
  onBlogUpdate,
}) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-800/50 rounded-xl p-6 animate-pulse">
            <div className="h-40 bg-gray-700 rounded-lg mb-4" />
            <div className="h-4 bg-gray-700 rounded w-1/3 mb-3" />
            <div className="h-5 bg-gray-700 rounded mb-2" />
            <div className="h-4 bg-gray-700 rounded w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  if (activeTab === "posts") {
    return (
      <div>
        {blogs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-800 hover:border-purple-900/50 transition-all duration-300 cursor-pointer group"
                onClick={() => navigate(`/blog/${blog.id}`)}
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={
                      blog.image ||
                      "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=800"
                    }
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=800";
                    }}
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 bg-purple-900/80 text-purple-300 text-xs font-medium rounded-full backdrop-blur-sm">
                    {blog.category}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="text-white font-bold mb-2 line-clamp-2 group-hover:text-purple-400 transition-colors">
                    {blog.title}
                  </h3>
                  <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                    {blog.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{blog.date}</span>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
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
                        {blog.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          />
                        </svg>
                        {blog.comments}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-5 text-gray-700">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No posts yet
            </h3>
            <p className="text-gray-400 mb-6 text-sm">
              Start sharing your thoughts with the world.
            </p>
            <button
              onClick={onCreatePost}
              className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium text-sm hover:from-purple-700 hover:to-pink-700 transition-all"
            >
              Write Your First Post
            </button>
          </div>
        )}
      </div>
    );
  }

  if (activeTab === "account") {
    return (
      <div className="max-w-2xl space-y-6">
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-800">
          <h3 className="text-lg font-semibold text-white mb-4">
            Account Information
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-700">
              <span className="text-gray-400 text-sm">Name</span>
              <span className="text-white font-medium text-sm">
                {user.name}
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-700">
              <span className="text-gray-400 text-sm">Email</span>
              <span className="text-white font-medium text-sm">
                {user.email}
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-700">
              <span className="text-gray-400 text-sm">Role</span>
              <span className="px-3 py-1 bg-purple-900/40 text-purple-300 rounded-full text-xs font-medium capitalize">
                {user.role || "reader"}
              </span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-gray-400 text-sm">Member Since</span>
              <span className="text-white text-sm">
                {new Date(user.joinDate).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Liked / comments / saved tabs placeholder
  return (
    <div className="text-center py-16">
      <div className="w-20 h-20 mx-auto mb-5 text-gray-700">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1"
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-white mb-2 capitalize">
        {activeTab}
      </h3>
      <p className="text-gray-400 text-sm">
        This section will be available soon.
      </p>
    </div>
  );
};

/* ─── Main UserProfile Component ────────────────────────────────────── */
const UserProfile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("posts");
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [following, setFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [avatarKey, setAvatarKey] = useState(Date.now());
  
  // Add ref to prevent multiple calls
  const fetchingRef = useRef(false);
  const initialLoadDone = useRef(false);

  // Listen for post creation events
  useEffect(() => {
    const handlePostCreated = () => {
      console.log('Post created event received, refreshing blogs...');
      if (isCurrentUser && user?.name) {
        fetchUserBlogs(user.name, true);
      }
    };

    // Add event listener for post creation
    window.addEventListener('postCreated', handlePostCreated);
    
    return () => {
      window.removeEventListener('postCreated', handlePostCreated);
    };
  }, [isCurrentUser, user?.name]);

  useEffect(() => {
    if (!initialLoadDone.current) {
      fetchUserData();
    }
  }, [username]);

  const fetchUserData = async () => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    
    setLoading(true);
    setError("");
    try {
      const currentUserId = localStorage.getItem("userId");
      const currentUserName = localStorage.getItem("userName");
      const currentUserEmail = localStorage.getItem("userEmail");
      const currentUserRole = localStorage.getItem("userRole");
      const currentUserAvatar = localStorage.getItem("userAvatar");

      // If no username in URL, it's the current user's profile
      if (!username) {
        if (!currentUserId) {
          navigate("/auth");
          return;
        }
        setIsCurrentUser(true);
        const currentUser = {
          _id: currentUserId,
          name: currentUserName,
          email: currentUserEmail,
          role: currentUserRole || "reader",
          joinDate: localStorage.getItem("userJoinDate") || new Date().toISOString(),
          bio: localStorage.getItem("userBio") || "Passionate writer and reader.",
          avatar: currentUserAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUserName || "User")}&background=8b5cf6&color=fff&size=200`,
          stats: { posts: 0, likes: 0, comments: 0, followers: 0, following: 0 },
        };
        setUser(currentUser);
        await fetchUserBlogs(currentUserName, true);
        initialLoadDone.current = true;
        setLoading(false);
        fetchingRef.current = false;
        return;
      }

      // Check if viewing own profile by username
      if (username.toLowerCase() === currentUserName?.toLowerCase()) {
        setIsCurrentUser(true);
        const currentUser = {
          _id: currentUserId,
          name: currentUserName,
          email: currentUserEmail,
          role: currentUserRole || "reader",
          joinDate: localStorage.getItem("userJoinDate") || new Date().toISOString(),
          bio: localStorage.getItem("userBio") || "Passionate writer and reader.",
          avatar: currentUserAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUserName || "User")}&background=8b5cf6&color=fff&size=200`,
          stats: { posts: 0, likes: 0, comments: 0, followers: 0, following: 0 },
        };
        setUser(currentUser);
        await fetchUserBlogs(currentUserName, true);
      } else {
        // Viewing someone else's profile
        setIsCurrentUser(false);
        
        try {
          // Fetch the user by username
          const userData = await getUserByUsername(username);
          console.log("Fetched user data:", userData);
          
          setUser({
            _id: userData._id,
            name: userData.name,
            email: userData.email,
            role: userData.role,
            joinDate: userData.createdAt || new Date().toISOString(),
            bio: userData.bio || "Passionate writer and reader.",
            avatar: userData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=8b5cf6&color=fff&size=200`,
            stats: userData.stats || { posts: 0, likes: 0, comments: 0, followers: 0, following: 0 },
          });
          
          // Set following status if available
          if (userData.isFollowing !== undefined) {
            setFollowing(userData.isFollowing);
          }
          
          // Fetch this user's blogs using their username
          await fetchUserBlogs(username, false);
          
        } catch (err) {
          console.error("Error fetching user:", err);
          setError("User not found");
        }
      }
      
      initialLoadDone.current = true;
    } catch (err) {
      console.error("Fetch user error:", err);
      setError(err.message || "Failed to load profile");
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  };

  const fetchUserBlogs = useCallback(async (targetUsername, updateStats = false) => {
    try {
      const data = await getPosts(true);
      const postsArray = Array.isArray(data) ? data : data?.data || data || [];

      // Filter posts by the target username
      const userBlogs = postsArray.filter((blog) => {
        // Match by authorName
        if (blog.authorName && blog.authorName.toLowerCase() === targetUsername.toLowerCase()) {
          return true;
        }
        // Match by author object
        if (blog.author && blog.author.name && blog.author.name.toLowerCase() === targetUsername.toLowerCase()) {
          return true;
        }
        // Match by author string
        if (typeof blog.author === 'string' && blog.author.toLowerCase() === targetUsername.toLowerCase()) {
          return true;
        }
        return false;
      });

      console.log(`Found ${userBlogs.length} blogs for user: ${targetUsername}`);

      const processedBlogs = userBlogs.map((blog) => ({
        id: blog._id || blog.id,
        _id: blog._id || blog.id,
        title: blog.title || "Untitled Post",
        content: blog.content || "",
        excerpt: blog.excerpt || blog.content?.substring(0, 150) + "..." || "",
        authorName: blog.authorName || blog.author?.name || blog.author || "Anonymous",
        authorId: blog.authorId || blog.author?._id,
        date: blog.createdAt
          ? new Date(blog.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "Unknown date",
        category: blog.category || "Uncategorized",
        image: blog.image?.url || blog.image || null,
        readTime: blog.readTime || `${Math.ceil((blog.content?.split(" ").length || 0) / 200) || 5} min read`,
        likes: blog.likes?.length || 0,
        likesArray: blog.likes || [],
        comments: blog.comments?.length || 0,
        views: blog.views || 0,
        createdAt: blog.createdAt,
      }));

      setBlogs(processedBlogs);

      if (updateStats) {
        const totalLikes = processedBlogs.reduce((s, b) => s + b.likes, 0);
        const totalComments = processedBlogs.reduce((s, b) => s + b.comments, 0);
        setUser((prev) =>
          prev
            ? {
                ...prev,
                stats: {
                  ...prev.stats,
                  posts: processedBlogs.length,
                  likes: totalLikes,
                  comments: totalComments,
                },
              }
            : prev,
        );
      }
    } catch (err) {
      console.error("Error fetching user blogs:", err);
    }
  }, []);

  const avatarUrl = (() => {
    const avatar = user?.avatar;
    if (!avatar) return null;
    if (avatar.startsWith("http")) return avatar;
    if (avatar.startsWith("/uploads")) return `http://localhost:5000${avatar}`;
    return avatar;
  })();

  const handleFollow = async () => {
    if (!localStorage.getItem("token")) {
      navigate("/auth");
      return;
    }

    const currentUserId = localStorage.getItem("userId");
    if (user._id === currentUserId) {
      alert("You cannot follow yourself");
      return;
    }

    setFollowLoading(true);
    try {
      if (following) {
        await unfollowUser(user._id);
        setUser((prev) => ({
          ...prev,
          stats: { ...prev.stats, followers: Math.max(0, prev.stats.followers - 1) },
        }));
        setFollowing(false);
      } else {
        await followUser(user._id);
        setUser((prev) => ({
          ...prev,
          stats: { ...prev.stats, followers: prev.stats.followers + 1 },
        }));
        setFollowing(true);
      }
    } catch (err) {
      console.error("Follow error:", err);
      alert(err.message || "Failed to update follow status. Please try again.");
    } finally {
      setFollowLoading(false);
    }
  };

  const handleSaveProfile = (updatedData) => {
    if (updatedData.name) localStorage.setItem("userName", updatedData.name);
    if (updatedData.email) localStorage.setItem("userEmail", updatedData.email);
    if (updatedData.bio !== undefined)
      localStorage.setItem("userBio", updatedData.bio);
    if (updatedData.avatar) {
      let avatarUrl = updatedData.avatar;
      if (avatarUrl && !avatarUrl.startsWith("http")) {
        avatarUrl = `http://localhost:5000${avatarUrl}`;
      }
      localStorage.setItem("userAvatar", avatarUrl);
      setAvatarKey(Date.now());
    }

    setUser((prev) => ({
      ...prev,
      name: updatedData.name || prev.name,
      email: updatedData.email || prev.email,
      bio: updatedData.bio !== undefined ? updatedData.bio : prev.bio,
      avatar: updatedData.avatar
        ? updatedData.avatar.startsWith("http")
          ? updatedData.avatar
          : `http://localhost:5000${updatedData.avatar}`
        : prev.avatar,
    }));

    setShowEditModal(false);

    if (updatedData.name !== user.name) {
      fetchUserBlogs(updatedData.name, true);
    }
  };

  const handleBlogUpdate = useCallback(() => {
    if (user?.name) {
      console.log('Refreshing blogs...');
      fetchUserBlogs(user.name, true);
    }
  }, [user?.name, fetchUserBlogs]);

  /* Loading */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4" />
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  /* Error */
  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-5 text-gray-700">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            User not found
          </h3>
          <p className="text-gray-400 mb-6 text-sm">
            {error || "The user you're looking for doesn't exist."}
          </p>
          <button
            onClick={() => navigate("/home")}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium text-sm"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const tabs = isCurrentUser
    ? ["posts", "likes", "comments", "saved", "account"]
    : ["posts"];

  const tabColors = {
    posts: "border-purple-500",
    likes: "border-pink-500",
    comments: "border-blue-500",
    saved: "border-green-500",
    account: "border-yellow-500",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Back + Nav */}
      <div className="container mx-auto px-4 pt-4">
        <button
          onClick={() => navigate("/home")}
          className="inline-flex items-center text-purple-400 hover:text-purple-300 text-sm group mb-4"
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
          Back to Home
        </button>
      </div>

      {/* Cover */}
      <div className="relative">
        <div className="h-48 sm:h-64 bg-gradient-to-r from-purple-900/40 via-pink-900/30 to-indigo-900/40">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900" />
        </div>

        {/* Profile Info */}
        <div className="container mx-auto px-4 relative -mt-24 sm:-mt-28">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-6">
            {/* Avatar + Info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
              <div className="relative flex-shrink-0">
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-gray-900 overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600">
                  <img
                    src={
                      avatarUrl ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=8b5cf6&color=fff&size=200`
                    }
                    alt={user.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=8b5cf6&color=fff&size=200`;
                    }}
                  />
                </div>
                {isCurrentUser && (
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="absolute bottom-1 right-1 p-1.5 bg-gray-900 rounded-full hover:bg-gray-800 border border-gray-700"
                    title="Edit profile"
                  >
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15.232 5.232l3.536 3.536M9 11l6-6 3 3-6 6H9v-3z"
                      />
                    </svg>
                  </button>
                )}
              </div>

              <div className="text-white pb-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-2xl sm:text-3xl font-bold">{user.name}</h1>
                  {user.role === "author" && (
                    <span className="px-2.5 py-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-xs font-medium">
                      ✍️ Author
                    </span>
                  )}
                  {user.role === "admin" && (
                    <span className="px-2.5 py-0.5 bg-gradient-to-r from-red-600 to-orange-600 rounded-full text-xs font-medium">
                      👑 Admin
                    </span>
                  )}
                </div>
                <p className="text-gray-300 text-sm mb-3 max-w-xl">{user.bio}</p>
                <div className="flex flex-wrap gap-3 text-gray-400 text-xs">
                  {isCurrentUser && (
                    <span className="flex items-center gap-1">
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      {user.email}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    Joined{" "}
                    {new Date(user.joinDate).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 self-start sm:self-end">
              {isCurrentUser ? (
                <>
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium text-sm transition-colors flex items-center gap-1.5"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit Profile
                  </button>
                  <button
                    onClick={() => navigate("/home")}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium text-sm transition-all"
                  >
                    Home
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleFollow}
                    disabled={followLoading}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-1.5 ${
                      following
                        ? "bg-gray-800 hover:bg-gray-700 text-white border border-gray-700"
                        : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                    } disabled:opacity-50`}
                  >
                    {followLoading ? (
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
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    ) : following ? (
                      <>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Following
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                          />
                        </svg>
                        Follow
                      </>
                    )}
                  </button>
                  <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium text-sm transition-colors flex items-center gap-1.5">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    Message
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-8">
            {[
              { label: "Posts", value: user.stats.posts },
              { label: "Likes", value: user.stats.likes },
              { label: "Comments", value: user.stats.comments },
              { label: "Followers", value: user.stats.followers },
              { label: "Following", value: user.stats.following },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-gray-800/50 rounded-xl p-4 text-center border border-gray-800 hover:border-purple-900/50 transition-colors"
              >
                <div className="text-xl sm:text-2xl font-bold text-white mb-0.5">
                  {stat.value}
                </div>
                <div className="text-gray-400 text-xs">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 pb-10">
        {/* Tabs */}
        <div className="flex border-b border-gray-800 mb-8 overflow-x-auto scrollbar-hide gap-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 font-medium whitespace-nowrap text-sm capitalize transition-all ${
                activeTab === tab
                  ? `text-white border-b-2 ${tabColors[tab]}`
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {tab === "posts"
                ? `Posts (${user.stats.posts})`
                : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {isCurrentUser ? (
          <UserDashboard
            activeTab={activeTab}
            blogs={blogs}
            loading={false}
            user={user}
            onCreatePost={() => navigate("/home")}
            onBlogUpdate={handleBlogUpdate}
          />
        ) : activeTab === "posts" ? (
          <div>
            <h2 className="text-xl font-bold text-white mb-6">
              {user.name}'s Posts
            </h2>
            {blogs.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.map((blog) => (
                  <div
                    key={blog.id}
                    className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-800 hover:border-purple-900/50 transition-all cursor-pointer group"
                    onClick={() => navigate(`/blog/${blog.id}`)}
                  >
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={
                          blog.image ||
                          "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=800"
                        }
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src =
                            "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=800";
                        }}
                      />
                      <span className="absolute top-3 left-3 px-2.5 py-1 bg-purple-900/80 text-purple-300 text-xs font-medium rounded-full">
                        {blog.category}
                      </span>
                    </div>
                    <div className="p-5">
                      <h3 className="text-white font-bold mb-2 line-clamp-2 group-hover:text-purple-400 transition-colors">
                        {blog.title}
                      </h3>
                      <p className="text-gray-400 text-sm line-clamp-2 mb-3">
                        {blog.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{blog.date}</span>
                        <span>{blog.readTime}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-400">
                  {user.name} hasn't published any posts yet.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">
              Only {user.name} can view this section.
            </p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
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