"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { IoGridOutline, IoBookmarkOutline, IoLockClosedOutline, IoLinkOutline, IoCreateOutline } from "react-icons/io5";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { userApi, uploadApi } from "@/services";
import type { ProfileResponse, User } from "@/types";
import PostGrid from "@/components/PostGrid";

export default function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const { user: current, isAuthenticated, updateUser } = useAuth();
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"posts" | "saved">("posts");
  const [editOpen, setEditOpen] = useState(false);
  const [listOpen, setListOpen] = useState<"followers" | "following" | null>(null);
  const [people, setPeople] = useState<User[]>([]);

  const load = async () => {
    try {
      setProfile(await userApi.profile(username));
    } catch {
      toast.error("Profile not found");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [username]);

  const follow = async () => {
    if (!profile) return;
    if (!isAuthenticated) return toast.error("Sign in to follow");
    try {
      const result = await userApi.follow(profile.user.username);
      setProfile({ ...profile, isFollowing: result.following, followersCount: result.followersCount });
    } catch (error: any) { toast.error(error.message); }
  };

  const openList = async (type: "followers" | "following") => {
    if (!profile) return;
    setListOpen(type);
    try {
      setPeople(type === "followers" ? await userApi.followers(profile.user.username) : await userApi.following(profile.user.username));
    } catch { setPeople([]); }
  };

  if (loading) return <div className="spinner" />;
  if (!profile) return <div className="empty">Profile not found.</div>;

  const isOwn = current?._id === profile.user._id;
  const posts = tab === "saved" ? profile.saved : profile.posts;

  return (
    <div className="ig-main" style={{ maxWidth: 935 }}>
      <section className="profile-head">
        <div className="profile-avatar">
          <span>
            {profile.user.avatar ? <img src={profile.user.avatar} alt={`${profile.user.username} avatar`} /> : <span style={{ display: "grid", placeItems: "center", height: "100%", fontSize: 34, fontWeight: 700 }}>{profile.user.username[0].toUpperCase()}</span>}
          </span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <h1 style={{ fontSize: 22, margin: 0 }}>{profile.user.username}</h1>
            {profile.user.isPrivate && <IoLockClosedOutline size={15} title="Private account" />}
            {isOwn ? (
              <button className="ig-btn" onClick={() => setEditOpen(true)}><IoCreateOutline style={{ verticalAlign: "middle" }} /> Edit profile</button>
            ) : (
              <button className={`ig-btn ${profile.isFollowing ? "" : "primary"}`} onClick={follow}>{profile.isFollowing ? "Following" : "Follow"}</button>
            )}
          </div>
          <div className="profile-stats">
            <span><strong>{profile.posts.length}</strong> posts</span>
            <button onClick={() => openList("followers")} style={{ border: 0, background: "none", cursor: "pointer", padding: 0 }}><strong>{profile.followersCount}</strong> followers</button>
            <button onClick={() => openList("following")} style={{ border: 0, background: "none", cursor: "pointer", padding: 0 }}><strong>{profile.followingCount}</strong> following</button>
          </div>
          <div className="profile-bio">
            <strong>{profile.user.name}</strong>
            {profile.user.bio && <div style={{ marginTop: 2 }}>{profile.user.bio}</div>}
            {profile.user.website && <div style={{ marginTop: 4 }}><a href={profile.user.website} target="_blank" rel="noreferrer" style={{ color: "#00376b", fontWeight: 600 }}><IoLinkOutline style={{ verticalAlign: "middle" }} /> {profile.user.website.replace(/^https?:\/\//, "")}</a></div>}
          </div>
        </div>
      </section>

      <div className="tabs">
        <button className={`tab ${tab === "posts" ? "active" : ""}`} onClick={() => setTab("posts")}><IoGridOutline style={{ verticalAlign: "middle", marginRight: 5 }} /> Posts</button>
        {isOwn && <button className={`tab ${tab === "saved" ? "active" : ""}`} onClick={() => setTab("saved")}><IoBookmarkOutline style={{ verticalAlign: "middle", marginRight: 5 }} /> Saved</button>}
      </div>

      <div style={{ borderTop: "1px solid var(--border)" }}>
        {!profile.canView ? (
          <div className="empty"><IoLockClosedOutline size={38} /><h2 style={{ color: "var(--text)", fontSize: 18, marginTop: 10 }}>This account is private</h2><p>Follow this account to see their posts.</p></div>
        ) : (
          <PostGrid posts={posts} empty={tab === "saved" ? "Nothing saved yet." : "No posts yet."} />
        )}
      </div>

      {editOpen && <EditProfileModal user={profile.user} onClose={() => setEditOpen(false)} onSaved={(next) => { setProfile({ ...profile, user: next }); if (isOwn) updateUser(next); }} />}

      {listOpen && (
        <div className="modal-backdrop" onClick={() => setListOpen(null)}>
          <div className="modal" onClick={(event) => event.stopPropagation()}>
            <h2 style={{ marginTop: 0, textTransform: "capitalize" }}>{listOpen}</h2>
            {people.length === 0 ? <p style={{ color: "var(--muted)" }}>No users yet.</p> : people.map((person) => (
              <Link key={person._id} href={`/u/${person.username}`} onClick={() => setListOpen(null)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid #f3f3f3" }}>
                <span className="ig-avatar" style={{ width: 38, height: 38 }}>{person.avatar ? <img src={person.avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : person.username[0].toUpperCase()}</span>
                <span><strong style={{ display: "block", fontSize: 14 }}>{person.username}</strong><span style={{ fontSize: 12, color: "var(--muted)" }}>{person.name}</span></span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function EditProfileModal({ user, onClose, onSaved }: { user: User; onClose: () => void; onSaved: (user: User) => void }) {
  const [form, setForm] = useState({ name: user.name, username: user.username, bio: user.bio, website: user.website, avatar: user.avatar, isPrivate: user.isPrivate });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const upload = async (file: File) => {
    setUploading(true);
    try {
      const { url } = await uploadApi.image(file);
      setForm((current) => ({ ...current, avatar: url }));
    } catch (error: any) { toast.error(error.message); }
    finally { setUploading(false); }
  };

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      const next = await userApi.updateMe(form);
      onSaved(next);
      toast.success("Profile updated");
      onClose();
    } catch (error: any) { toast.error(error.message); }
    finally { setSaving(false); }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <form className="modal" onSubmit={save} onClick={(event) => event.stopPropagation()}>
        <h2 style={{ marginTop: 0 }}>Edit profile</h2>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
          <span className="ig-avatar" style={{ width: 64, height: 64 }}>{form.avatar ? <img src={form.avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : form.username[0]?.toUpperCase()}</span>
          <label className="ig-btn" style={{ cursor: "pointer" }}>{uploading ? "Uploading..." : "Change photo"}<input type="file" accept="image/*" hidden onChange={(event) => event.target.files?.[0] && upload(event.target.files[0])} /></label>
        </div>
        <label className="ig-label">Name</label>
        <input className="ig-input" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} maxLength={60} />
        <label className="ig-label" style={{ marginTop: 10 }}>Username</label>
        <input className="ig-input" value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} />
        <label className="ig-label" style={{ marginTop: 10 }}>Bio</label>
        <textarea className="ig-textarea" rows={3} value={form.bio} onChange={(event) => setForm({ ...form, bio: event.target.value })} maxLength={200} />
        <label className="ig-label" style={{ marginTop: 10 }}>Website</label>
        <input className="ig-input" value={form.website} onChange={(event) => setForm({ ...form, website: event.target.value })} maxLength={200} />
        <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12, fontSize: 14 }}><input type="checkbox" checked={form.isPrivate} onChange={(event) => setForm({ ...form, isPrivate: event.target.checked })} /> Private account</label>
        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          <button type="button" className="ig-btn" onClick={onClose}>Cancel</button>
          <button type="submit" className="ig-btn primary" disabled={saving}>{saving ? "Saving..." : "Save"}</button>
        </div>
      </form>
    </div>
  );
}
