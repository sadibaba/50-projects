import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getUserProfile, updateUserProfile, uploadAvatar } from "../api/api";
import EditProfileModal from "./EditProfileModal";

const AccountPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth");
      return;
    }
    fetchProfile();
  }, [navigate]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await getUserProfile();
      setUser(data);
    } catch (err) {
      setError(err.message || "Failed to load account");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be under 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target.result);
    reader.readAsDataURL(file);

    setAvatarUploading(true);
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const response = await uploadAvatar(formData);
      const newAvatarUrl = response?.avatar || response?.user?.avatar;
      if (newAvatarUrl) {
        localStorage.setItem("userAvatar", newAvatarUrl);
        setUser((prev) => ({ ...prev, avatar: newAvatarUrl }));
        setAvatarPreview(null);
      }
    } catch (err) {
      console.error("Avatar upload error:", err);
      setAvatarPreview(null);
      alert("Failed to upload avatar. Please try again.");
    } finally {
      setAvatarUploading(false);
    }
  };

  const avatarUrl = (() => {
    const av = avatarPreview || user?.avatar;
    if (!av) return null;
    if (av.startsWith("http")) return av;
    if (av.startsWith("/uploads")) return `http://localhost:5000${av}`;
    return av;
  })();

  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=B8873E&color=fff&size=200`;

  const handleSaveProfile = (updatedData) => {
    if (updatedData.name) localStorage.setItem("userName", updatedData.name);
    if (updatedData.email) localStorage.setItem("userEmail", updatedData.email);
    if (updatedData.bio !== undefined) localStorage.setItem("userBio", updatedData.bio);
    setUser((prev) => ({ ...prev, ...updatedData }));
    setShowEditModal(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary px-4">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-text-primary mb-2">Error</h3>
          <p className="text-text-secondary mb-6 text-sm">{error}</p>
          <button onClick={() => navigate("/home")} className="px-6 py-2 bg-accent text-primary rounded-full font-medium text-sm">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-primary via-secondary/20 to-primary"></div>
        <div className="absolute top-[-15%] left-[-10%] w-[600px] h-[600px] rounded-full bg-accent/[0.06] blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-accent/[0.04] blur-[100px] animate-pulse-slow" style={{ animationDelay: "2s" }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 pt-32 pb-20 max-w-3xl">
        {/* Back */}
        <button
          onClick={() => navigate("/home")}
          className="inline-flex items-center text-accent hover:text-amber-300 text-sm group mb-8"
        >
          <svg className="w-4 h-4 mr-1.5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </button>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass rounded-3xl p-8 sm:p-10"
        >
          <h1 className="font-display text-3xl text-text-primary mb-8">My Account</h1>

          {/* Avatar */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-10">
            <div className="relative flex-shrink-0">
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-accent/30 bg-secondary">
                <img
                  src={avatarUrl || defaultAvatar}
                  alt={user.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = defaultAvatar; }}
                />
              </div>
              <button
                onClick={handleAvatarClick}
                disabled={avatarUploading}
                className="absolute bottom-0 right-0 p-2 bg-accent rounded-full hover:bg-amber-300 transition-all hover:scale-110 disabled:opacity-50"
              >
                {avatarUploading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-primary"></div>
                ) : (
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            </div>

            <div className="text-center sm:text-left flex-1">
              <h2 className="font-display text-2xl text-text-primary mb-1">{user.name}</h2>
              <p className="text-text-secondary text-sm mb-1">{user.email}</p>
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium capitalize ${
                user.role === 'admin' ? 'bg-red-500/20 text-red-400' : 'bg-accent/20 text-accent'
              }`}>
                {user.role === 'admin' ? '⚡ Admin' : '📖 Reader'}
              </span>
              {user.bio && (
                <p className="text-text-secondary text-sm font-serif italic mt-3">"{user.bio}"</p>
              )}
            </div>

            <button
              onClick={() => setShowEditModal(true)}
              className="px-5 py-2.5 bg-accent text-primary rounded-full font-bold text-sm hover:bg-amber-300 transition-all"
            >
              Edit Profile
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-10">
            <div className="glass rounded-2xl p-5 text-center">
              <div className="font-display text-3xl text-text-primary mb-1">
                {user.stats?.posts || 0}
              </div>
              <div className="text-text-secondary text-xs uppercase tracking-wider">Posts</div>
            </div>
            <div className="glass rounded-2xl p-5 text-center">
              <div className="font-display text-3xl text-text-primary mb-1">
                {user.stats?.comments || 0}
              </div>
              <div className="text-text-secondary text-xs uppercase tracking-wider">Comments</div>
            </div>
          </div>

          {/* Account Info */}
          <div className="space-y-4">
            <h3 className="font-display text-xl text-text-primary">Account Details</h3>
            <div className="space-y-3">
              {[
                { label: "Full Name", value: user.name },
                { label: "Email", value: user.email },
                { label: "Role", value: user.role },
                { label: "Member Since", value: new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" }) },
              ].map((row) => (
                <div key={row.label} className="flex justify-between items-center py-3 border-b border-secondary/30 last:border-0">
                  <span className="text-text-secondary text-sm">{row.label}</span>
                  <span className="text-text-primary font-medium text-sm capitalize">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

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

export default AccountPage;