import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getPosts, getComments, getUserProfile } from "../api/api";

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Unknown";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [commentCount, setCommentCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth");
      return;
    }

    const load = async () => {
      try {
        const [profile, allPosts] = await Promise.all([
          getUserProfile(),
          getPosts(true),
        ]);

        const list = Array.isArray(allPosts) ? allPosts : allPosts?.data || [];
        setUser(profile);
        setPosts(list);

        const own = list.filter(
          (post) =>
            String(post.author?._id || post.author) === String(profile._id)
        );

        const results = await Promise.allSettled(
          own.slice(0, 20).map((post) => getComments(post._id))
        );

        setCommentCount(
          results.reduce((total, result) => {
            if (result.status !== "fulfilled") return total;
            const value = result.value;
            return total + (Array.isArray(value) ? value.length : 0);
          }, 0)
        );
      } catch (err) {
        setError(err.message || "Could not load the dashboard.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [navigate]);

  const ownPosts = useMemo(() => {
    if (!user) return [];
    return posts.filter(
      (post) => String(post.author?._id || post.author) === String(user._id)
    );
  }, [posts, user]);

  const stats = useMemo(() => {
    const likes = ownPosts.reduce(
      (total, post) =>
        total + (post.likesCount ?? post.likes?.length ?? 0),
      0
    );
    const views = ownPosts.reduce((total, post) => total + (post.views || 0), 0);

    return [
      { label: "Posts published", value: ownPosts.length },
      { label: "Likes received", value: likes },
      { label: "Views", value: views },
      { label: "Comments", value: commentCount },
    ];
  }, [ownPosts, commentCount]);

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary pt-32 pb-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display text-5xl text-text-primary mb-2">
            Dashboard
          </h1>
          <p className="text-text-secondary mb-10">
            {user
              ? `Signed in as ${user.name}. Statistics cover your own posts.`
              : "Your publishing overview."}
          </p>
        </motion.div>

        {error && (
          <div className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass rounded-2xl p-6"
            >
              <p className="text-text-secondary text-xs uppercase tracking-wider mb-2">
                {stat.label}
              </p>
              <p className="font-display text-4xl text-text-primary">
                {stat.value}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-2xl p-8"
          >
            <h2 className="font-display text-2xl text-text-primary mb-6">
              Quick actions
            </h2>
            <div className="space-y-3">
              <button
                onClick={() => navigate("/posts")}
                className="w-full py-3 bg-accent text-primary rounded-full font-bold hover:opacity-90 transition-opacity"
              >
                Browse all posts
              </button>
              <button
                onClick={() => navigate("/account")}
                className="w-full py-3 bg-secondary text-text-primary rounded-full font-medium hover:bg-secondary/80 transition-colors"
              >
                Account settings
              </button>
              {user?.role === "admin" && (
                <button
                  onClick={() => navigate("/posts?create=1")}
                  className="w-full py-3 bg-secondary text-text-primary rounded-full font-medium hover:bg-secondary/80 transition-colors"
                >
                  Create a post
                </button>
              )}
              {user?.role !== "admin" && (
                <p className="text-text-secondary text-sm text-center pt-2">
                  Publishing is limited to administrators.
                </p>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass rounded-2xl p-8"
          >
            <h2 className="font-display text-2xl text-text-primary mb-6">
              Your recent posts
            </h2>

            {ownPosts.length === 0 ? (
              <p className="text-text-secondary text-sm">
                You have not published a post yet.
              </p>
            ) : (
              <div className="space-y-4">
                {ownPosts.slice(0, 4).map((post) => (
                  <button
                    key={post._id}
                    onClick={() => navigate(`/blog/${post._id}`)}
                    className="w-full text-left flex items-start gap-3 group"
                  >
                    <div className="w-2 h-2 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                    <div>
                      <p className="text-text-primary text-sm group-hover:text-accent transition-colors">
                        {post.title}
                      </p>
                      <p className="text-text-secondary text-xs mt-1">
                        {formatDate(post.createdAt)} · {post.likesCount ?? post.likes?.length ?? 0} likes ·{" "}
                        {post.views || 0} views
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
