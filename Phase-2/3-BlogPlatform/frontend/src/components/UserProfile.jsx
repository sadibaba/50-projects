import React, { useState, useEffect, useCallback, useRef, useLayoutEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPosts, followUser, unfollowUser, getUserByUsername, getImageUrl } from "../api/api";
import EditProfileModal from "./EditProfileModal";
import { motion, AnimatePresence, animate } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PostOrbitalWheel from "./PostOrbitalWheel";

gsap.registerPlugin(ScrollTrigger);

/* ─── Inline UserDashboard (profile-owner view) ─────────────── */
const UserDashboard = ({ activeTab, blogs, loading, user, onCreatePost }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-secondary/40 backdrop-blur-sm rounded-2xl p-6 animate-pulse border border-secondary/30">
            <div className="h-40 bg-secondary rounded-lg mb-4" />
            <div className="h-4 bg-secondary rounded w-1/3 mb-3" />
            <div className="h-5 bg-secondary rounded mb-2" />
            <div className="h-4 bg-secondary rounded w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  if (activeTab === "posts") {
    if (blogs.length > 0) {
      return <PostOrbitalWheel posts={blogs} />;
    }
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 mx-auto mb-5 text-text-secondary">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
        </div>
        <h3 className="text-xl font-semibold text-text-primary mb-2">No posts yet</h3>
        <p className="text-text-secondary mb-6 text-sm">Start sharing your thoughts with the world.</p>
        <button onClick={onCreatePost} className="px-6 py-2.5 bg-accent text-primary rounded-full font-bold text-sm hover:bg-amber-300 transition-all">Write Your First Post</button>
      </div>
    );
  }

  if (activeTab === "account") {
    return (
      <div className="max-w-2xl space-y-6">
        <div className="bg-secondary/50 backdrop-blur-sm rounded-xl p-6 border border-secondary/50">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Account Information</h3>
          <div className="space-y-4">
            {[
              { label: "Name", value: user.name },
              { label: "Email", value: user.email },
              { label: "Role", value: user.role || "reader", badge: true },
              { label: "Member Since", value: new Date(user.joinDate).toLocaleDateString("en-US", { month: "long", year: "numeric" }) },
            ].map((row, i, arr) => (
              <div key={row.label} className={`flex justify-between items-center py-3 ${i !== arr.length - 1 ? "border-b border-secondary/50" : ""}`}>
                <span className="text-text-secondary text-sm">{row.label}</span>
                {row.badge ? (
                  <span className="px-3 py-1 bg-accent/20 text-accent rounded-full text-xs font-medium capitalize">{row.value}</span>
                ) : (
                  <span className="text-text-primary font-medium text-sm">{row.value}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-16">
      <div className="w-20 h-20 mx-auto mb-5 text-text-secondary">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
      </div>
      <h3 className="text-xl font-semibold text-text-primary mb-2 capitalize">{activeTab}</h3>
      <p className="text-text-secondary text-sm">This section will be available soon.</p>
    </div>
  );
};

/* ─── Cute helpers ─────────────────────────────────────────── */
const SPARKLES = [
  { ch: "✦", l: "8%", t: "22%", s: 14, d: 4, delay: 0 },
  { ch: "✿", l: "20%", t: "58%", s: 18, d: 5, delay: 0.6 },
  { ch: "☾", l: "34%", t: "16%", s: 16, d: 6, delay: 1.2 },
  { ch: "✧", l: "48%", t: "52%", s: 12, d: 4.5, delay: 0.3 },
  { ch: "❀", l: "63%", t: "24%", s: 18, d: 5.5, delay: 1.8 },
  { ch: "✦", l: "76%", t: "60%", s: 14, d: 4.2, delay: 0.9 },
  { ch: "✿", l: "88%", t: "20%", s: 16, d: 6.2, delay: 1.5 },
  { ch: "✧", l: "94%", t: "50%", s: 12, d: 5, delay: 2.1 },
];

const STAT_META = {
  Posts: { icon: "posts", tint: "hover:bg-amber-300/10" },
  Likes: { icon: "likes", tint: "hover:bg-pink-400/10" },
  Comments: { icon: "comments", tint: "hover:bg-sky-400/10" },
  Followers: { icon: "followers", tint: "hover:bg-fuchsia-400/10" },
  Following: { icon: "following", tint: "hover:bg-emerald-400/10" },
};

const ICON_PATHS = {
  posts: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  likes: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
  comments: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
  followers: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
  following: "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z",
  saved: "M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z",
  account: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
  reader: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
  author: "M15.232 5.232l3.536 3.536M9 11l6-6 3 3-6 6H9v-3z",
  admin: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  calendar: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  lock: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
  moon: "M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z",
};

const Icon = ({ name, className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" d={ICON_PATHS[name]} />
  </svg>
);

const CountUp = ({ value }) => {
  const [n, setN] = useState(0);
  useEffect(() => {
    const c = animate(0, Number(value) || 0, {
      duration: 1.1, ease: "easeOut", onUpdate: (v) => setN(Math.round(v)),
    });
    return () => c.stop();
  }, [value]);
  return <>{n}</>;
};

/* ─── Main UserProfile Component ─────────────────────────────── */
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

  const fetchingRef = useRef(false);
  const initialLoadDone = useRef(false);
  const pageRef = useRef(null);

  /* Listen for post creation events */
  useEffect(() => {
    const handlePostCreated = () => {
      if (isCurrentUser && user?.name) { fetchUserBlogs(user.name, true); }
    };
    window.addEventListener('postCreated', handlePostCreated);
    return () => { window.removeEventListener('postCreated', handlePostCreated); };
  }, [isCurrentUser, user?.name]);

  useEffect(() => {
    if (!initialLoadDone.current) { fetchUserData(); }
  }, [username]);

  /* GSAP: profile cover parallax + info block shift */
  useLayoutEffect(() => {
    if (loading || !user) return;
    const ctx = gsap.context(() => {
      gsap.to('.profile-cover-inner', {
        scrollTrigger: {
          trigger: '.profile-cover',
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
        y: 80,
        scale: 1.1,
      });

      gsap.to('.profile-info-block', {
        scrollTrigger: {
          trigger: '.profile-info-block',
          start: 'top 90%',
          end: 'top 40%',
          scrub: 1,
        },
        y: -20,
      });
    }, pageRef);
    return () => ctx.revert();
  }, [loading, user]);

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

      if (!username) {
        if (!currentUserId) { navigate("/auth"); return; }
        setIsCurrentUser(true);
        const currentUser = {
          _id: currentUserId, name: currentUserName, email: currentUserEmail, role: currentUserRole || "reader",
          joinDate: localStorage.getItem("userJoinDate") || new Date().toISOString(),
          bio: localStorage.getItem("userBio") || "Passionate writer and reader.",
          avatar: currentUserAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUserName || "User")}&background=1C2B27&color=D4A15D&size=200`,
          stats: { posts: 0, likes: 0, comments: 0, followers: 0, following: 0 },
        };
        setUser(currentUser);
        await fetchUserBlogs(currentUserName, true);
        initialLoadDone.current = true;
        setLoading(false);
        fetchingRef.current = false;
        return;
      }

      if (username.toLowerCase() === currentUserName?.toLowerCase()) {
        setIsCurrentUser(true);
        const currentUser = {
          _id: currentUserId, name: currentUserName, email: currentUserEmail, role: currentUserRole || "reader",
          joinDate: localStorage.getItem("userJoinDate") || new Date().toISOString(),
          bio: localStorage.getItem("userBio") || "Passionate writer and reader.",
          avatar: currentUserAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUserName || "User")}&background=1C2B27&color=D4A15D&size=200`,
          stats: { posts: 0, likes: 0, comments: 0, followers: 0, following: 0 },
        };
        setUser(currentUser);
        await fetchUserBlogs(currentUserName, true);
      } else {
        setIsCurrentUser(false);
        try {
          const userData = await getUserByUsername(username);
          setUser({
            _id: userData._id, name: userData.name, email: userData.email, role: userData.role,
            joinDate: userData.createdAt || new Date().toISOString(),
            bio: userData.bio || "Passionate writer and reader.",
            avatar: userData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=1C2B27&color=D4A15D&size=200`,
            stats: userData.stats || { posts: 0, likes: 0, comments: 0, followers: 0, following: 0 },
          });
          if (userData.isFollowing !== undefined) { setFollowing(userData.isFollowing); }
          await fetchUserBlogs(username, false);
        } catch (err) {
          setError("User not found");
        }
      }
      initialLoadDone.current = true;
    } catch (err) {
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
      const userBlogs = postsArray.filter((blog) => {
        if (blog.authorName && blog.authorName.toLowerCase() === targetUsername.toLowerCase()) return true;
        if (blog.author && blog.author.name && blog.author.name.toLowerCase() === targetUsername.toLowerCase()) return true;
        if (typeof blog.author === 'string' && blog.author.toLowerCase() === targetUsername.toLowerCase()) return true;
        return false;
      });
      const processedBlogs = userBlogs.map((blog) => ({
        id: blog._id || blog.id, _id: blog._id || blog.id, title: blog.title || "Untitled Post",
        content: blog.content || "", excerpt: blog.excerpt || blog.content?.substring(0, 150) + "..." || "",
        authorName: blog.authorName || blog.author?.name || blog.author || "Anonymous",
        authorId: blog.authorId || blog.author?._id,
        date: blog.createdAt ? new Date(blog.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "Unknown date",
        // category: blog.category || "Uncategorized", image: blog.image?.url || blog.image || null,
        category: blog.category || "Uncategorized", image: getImageUrl(blog.image),
        readTime: blog.readTime || `${Math.ceil((blog.content?.split(" ").length || 0) / 200) || 5} min read`,
        likes: blog.likes?.length || 0, likesArray: blog.likes || [], comments: blog.comments?.length || 0,
        views: blog.views || 0, createdAt: blog.createdAt,
      }));
      setBlogs(processedBlogs);
      if (updateStats) {
        const totalLikes = processedBlogs.reduce((s, b) => s + b.likes, 0);
        const totalComments = processedBlogs.reduce((s, b) => s + b.comments, 0);
        setUser((prev) => prev ? { ...prev, stats: { ...prev.stats, posts: processedBlogs.length, likes: totalLikes, comments: totalComments } } : prev);
      }
    } catch (err) { console.error("Error fetching user blogs:", err); }
  }, []);

  const avatarUrl = (() => {
    const avatar = user?.avatar;
    if (!avatar) return null;
    if (avatar.startsWith("http")) return avatar;
    if (avatar.startsWith("/uploads")) return `http://localhost:5000${avatar}`;
    return avatar;
  })();

  const handleFollow = async () => {
    if (!localStorage.getItem("token")) { navigate("/auth"); return; }
    const currentUserId = localStorage.getItem("userId");
    if (user._id === currentUserId) { alert("You cannot follow yourself"); return; }
    setFollowLoading(true);
    try {
      if (following) {
        await unfollowUser(user._id);
        setUser((prev) => ({ ...prev, stats: { ...prev.stats, followers: Math.max(0, prev.stats.followers - 1) } }));
        setFollowing(false);
      } else {
        await followUser(user._id);
        setUser((prev) => ({ ...prev, stats: { ...prev.stats, followers: prev.stats.followers + 1 } }));
        setFollowing(true);
      }
    } catch (err) { alert(err.message || "Failed to update follow status."); } finally { setFollowLoading(false); }
  };

  const handleSaveProfile = (updatedData) => {
    if (updatedData.name) localStorage.setItem("userName", updatedData.name);
    if (updatedData.email) localStorage.setItem("userEmail", updatedData.email);
    if (updatedData.bio !== undefined) localStorage.setItem("userBio", updatedData.bio);
    if (updatedData.avatar) {
      let url = updatedData.avatar;
      if (url && !url.startsWith("http")) { url = `http://localhost:5000${url}`; }
      localStorage.setItem("userAvatar", url);
    }
    setUser((prev) => ({
      ...prev,
      name: updatedData.name || prev.name,
      email: updatedData.email || prev.email,
      bio: updatedData.bio !== undefined ? updatedData.bio : prev.bio,
      avatar: updatedData.avatar ? (updatedData.avatar.startsWith("http") ? updatedData.avatar : `http://localhost:5000${updatedData.avatar}`) : prev.avatar,
    }));
    setShowEditModal(false);
    if (updatedData.name !== user.name) { fetchUserBlogs(updatedData.name, true); }
  };

  /* Loading */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent mx-auto mb-4" />
          <p className="text-text-secondary">Loading profile...</p>
        </div>
      </div>
    );
  }

  /* Error */
  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary px-4">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-5 text-text-secondary">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h3 className="text-xl font-semibold text-text-primary mb-2">User not found</h3>
          <p className="text-text-secondary mb-6 text-sm">{error || "The user you're looking for doesn't exist."}</p>
          <button onClick={() => navigate("/home")} className="px-6 py-2 bg-accent text-primary rounded-full font-medium text-sm hover:bg-amber-300 transition-colors">Back to Home</button>
        </div>
      </div>
    );
  }

  const tabs = isCurrentUser ? ["posts", "likes", "comments", "saved", "account"] : ["posts"];
  
  const tabColors = { posts: "border-accent", likes: "border-pink-500", comments: "border-blue-500", saved: "border-green-500", account: "border-yellow-500" };

  return (
    <div ref={pageRef} className="min-h-screen bg-primary relative" style={{ overflowX: "clip" }}>
      {/* ════════ CINEMATIC BACKGROUND ════════ */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-primary via-[#0d1412] to-primary"></div>
        <div className="absolute top-[-15%] left-[-10%] w-[600px] h-[600px] rounded-full bg-accent/[0.06] blur-[120px] animate-pulse-slow"></div>
        <div className="absolute top-[40%] right-[-15%] w-[700px] h-[700px] rounded-full bg-secondary/60 blur-[140px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] rounded-full bg-accent/[0.04] blur-[100px] animate-pulse-slow" style={{ animationDelay: '4s' }}></div>

        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        ></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)]"></div>
        <div className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(212,161,93,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(212,161,93,0.3) 1px, transparent 1px)`,
            backgroundSize: '80px 80px',
          }}
        ></div>
      </div>

      {/* ════════ CONTENT ════════ */}
      <div className="relative z-10">
        {/* Back button */}
        <div className="container mx-auto px-4 pt-32 pb-4">
          <button onClick={() => navigate("/home")} className="inline-flex items-center text-accent hover:text-amber-300 text-sm group">
            <svg className="w-4 h-4 mr-1.5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to Home
          </button>
        </div>

        {/* Cover — soft aurora + floating sparkles */}
        <div className="profile-cover relative h-56 sm:h-72 overflow-hidden">
          <div className="profile-cover-inner absolute inset-0 bg-gradient-to-br from-accent/25 via-secondary to-accent/10">
            <motion.div className="absolute -top-24 left-[6%] h-72 w-72 rounded-full bg-accent/30 blur-3xl"
              animate={{ x: [0, 50, 0], y: [0, 24, 0] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }} />
            <motion.div className="absolute -bottom-24 right-[10%] h-80 w-80 rounded-full bg-pink-300/15 blur-3xl"
              animate={{ x: [0, -40, 0], y: [0, -20, 0] }} transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }} />
            <motion.div className="absolute top-4 left-[45%] h-56 w-56 rounded-full bg-emerald-300/10 blur-3xl"
              animate={{ scale: [1, 1.25, 1] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
            {SPARKLES.map((s, i) => (
              <motion.span key={i} aria-hidden className="absolute select-none text-accent/80"
                style={{ left: s.l, top: s.t, fontSize: s.s }}
                animate={{ y: [0, -12, 0], opacity: [0.25, 0.95, 0.25], rotate: [0, 18, 0] }}
                transition={{ duration: s.d, repeat: Infinity, delay: s.delay, ease: "easeInOut" }}>
                {s.ch}
              </motion.span>
            ))}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-primary"></div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="container mx-auto px-4 relative z-10 -mt-32 sm:-mt-44">
          <div className="profile-info-block flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
            {/* Avatar + Info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
              <motion.div className="relative flex-shrink-0"
                initial={{ scale: 0.6, opacity: 0, rotate: -8 }} animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 180, damping: 14 }}>
                <motion.div className="absolute -inset-1.5 rounded-full"
                  style={{ background: "conic-gradient(from 0deg, #D4A15D, #f9a8d4, #86efac, #93c5fd, #D4A15D)" }}
                  animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} />
                <motion.div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-primary overflow-hidden bg-primary"
                  animate={{ y: [0, -4, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
                  <img src={avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=1C2B27&color=D4A15D&size=200`} alt={user.name} className="w-full h-full object-cover" onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=1C2B27&color=D4A15D&size=200`; }} />
                </motion.div>
                <span className="absolute -bottom-1 -left-1 grid h-9 w-9 place-items-center rounded-full border border-secondary bg-primary text-lg shadow-lg" title={user.role}>
                  <Icon name={user.role === "admin" ? "admin" : user.role === "author" ? "author" : "reader"} className="w-4 h-4 text-accent" />
                </span>
                {isCurrentUser && (
                  <button onClick={() => setShowEditModal(true)} className="absolute bottom-1 right-1 p-2 bg-primary rounded-full hover:bg-secondary border border-secondary transition-all hover:scale-110 hover:rotate-12" title="Edit profile">
                    <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536M9 11l6-6 3 3-6 6H9v-3z" /></svg>
                  </button>
                )}
              </motion.div>

              <div className="text-text-primary pb-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h1 className="font-display text-3xl sm:text-5xl tracking-wide">{user.name}</h1>
                  {user.role === "author" && (<span className="-rotate-3 inline-flex items-center gap-1 px-2.5 py-0.5 bg-gradient-to-r from-accent to-amber-300 text-primary rounded-full text-xs font-bold shadow"><Icon name="author" className="w-3 h-3" />Author</span>)}
                  {user.role === "admin" && (<span className="-rotate-3 inline-flex items-center gap-1 px-2.5 py-0.5 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-full text-xs font-bold shadow"><Icon name="admin" className="w-3 h-3" />Admin</span>)}
                </div>
                {/* bio as a little speech bubble */}
                <div className="relative mb-3 inline-block max-w-xl rounded-2xl rounded-bl-sm border border-secondary/60 bg-secondary/50 px-4 py-2 backdrop-blur-sm">
                  <p className="font-serif text-sm italic text-text-secondary">“{user.bio}”</p>
                </div>
                <div className="flex flex-wrap gap-2 text-text-secondary text-xs">
                  {isCurrentUser && (
                    <span className="flex items-center gap-1.5 rounded-full border border-secondary/50 bg-secondary/40 px-3 py-1">
                      <svg className="w-3.5 h-3.5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      {user.email}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5 rounded-full border border-secondary/50 bg-secondary/40 px-3 py-1">
                    <Icon name="calendar" className="w-3.5 h-3.5 text-accent" /> Joined {new Date(user.joinDate).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 self-start sm:self-end">
              {isCurrentUser ? (
                <>
                  <button onClick={() => setShowEditModal(true)} className="px-4 py-2 bg-secondary/60 backdrop-blur-sm hover:bg-secondary text-text-primary rounded-full font-medium text-sm transition-all flex items-center gap-1.5 border border-secondary/50">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    Edit Profile
                  </button>
                  <button onClick={() => navigate("/home")} className="px-4 py-2 bg-accent text-primary rounded-full font-bold text-sm hover:bg-amber-300 transition-all">Home</button>
                </>
              ) : (
                <>
                  <button onClick={handleFollow} disabled={followLoading} className={`px-5 py-2 rounded-full font-bold text-sm transition-all flex items-center gap-1.5 hover:scale-105 ${following ? "bg-secondary/60 backdrop-blur-sm text-text-primary border border-secondary/50" : "bg-accent text-primary hover:bg-amber-300"} disabled:opacity-50`}>
                    {followLoading ? (
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                    ) : following ? (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                        Following
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                        Follow
                      </>
                    )}
                  </button>
                  <button className="px-4 py-2 bg-secondary/60 backdrop-blur-sm hover:bg-secondary text-text-primary rounded-full font-medium text-sm transition-colors flex items-center gap-1.5 border border-secondary/50">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                    Message
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-10">
            {[
              { label: "Posts", value: user.stats.posts },
              { label: "Likes", value: user.stats.likes },
              { label: "Comments", value: user.stats.comments },
              { label: "Followers", value: user.stats.followers },
              { label: "Following", value: user.stats.following },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 24, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 220, damping: 16, delay: 0.1 + i * 0.07 }}
                whileHover={{ y: -4, rotate: i % 2 ? 1.5 : -1.5 }}
                className={`group rounded-3xl border border-secondary/50 bg-secondary/40 p-4 text-center backdrop-blur-sm transition-colors duration-300 hover:border-accent/40 ${STAT_META[stat.label].tint}`}
              >
                <div className="mb-1.5 flex justify-center text-accent transition-transform duration-300 group-hover:scale-125"><Icon name={STAT_META[stat.label].icon} className="w-6 h-6" /></div>
                <div className="font-display text-2xl sm:text-3xl text-text-primary mb-0.5 group-hover:text-accent transition-colors"><CountUp value={stat.value} /></div>
                <div className="text-text-secondary text-xs">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 pb-20">
          {/* Tabs — sliding pill */}
          <div className="mb-10 flex w-fit max-w-full gap-1 overflow-x-auto scrollbar-hide rounded-full border border-secondary/50 bg-secondary/40 p-1 backdrop-blur-sm">
            {tabs.map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className="relative whitespace-nowrap rounded-full px-5 py-2 text-sm font-medium capitalize">
                {activeTab === tab && (
                  <motion.span layoutId="tab-pill" className="absolute inset-0 rounded-full bg-accent" transition={{ type: "spring", stiffness: 380, damping: 30 }} />
                )}
                <span className={`relative z-10 inline-flex items-center gap-1.5 transition-colors ${activeTab === tab ? "font-bold text-primary" : "text-text-secondary hover:text-text-primary"}`}>
                  <Icon name={tab} className="w-4 h-4" />{tab === "posts" ? `Posts (${user.stats.posts})` : tab}
                </span>
              </button>
            ))}
          </div>

          {/* Tab content (sirf opacity animate — transform sticky/ScrollTrigger ko kharab karta hai) */}
          <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>
            {isCurrentUser ? (
              <UserDashboard activeTab={activeTab} blogs={blogs} loading={false} user={user} onCreatePost={() => navigate("/home")} />
            ) : activeTab === "posts" ? (
              <div>
                {blogs.length > 0 ? (
                  <PostOrbitalWheel posts={blogs} />
                ) : (
                  <div className="text-center py-16 bg-secondary/30 backdrop-blur-sm rounded-3xl border border-secondary/40">
                    <p className="inline-flex items-center gap-2 text-text-secondary"><Icon name="moon" className="w-4 h-4" />{user.name} hasn't published any posts yet.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 bg-secondary/30 backdrop-blur-sm rounded-3xl border border-secondary/40">
                <p className="inline-flex items-center gap-2 text-text-secondary"><Icon name="lock" className="w-4 h-4" />Only {user.name} can view this section.</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {showEditModal && (
          <EditProfileModal user={user} onClose={() => setShowEditModal(false)} onSave={handleSaveProfile} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserProfile;