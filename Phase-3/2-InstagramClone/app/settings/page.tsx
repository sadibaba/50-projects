"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { userApi, uploadApi } from "@/services";
import { api } from "@/services/api";

export default function SettingsPage() {
  const { user, isAuthenticated, loading, updateUser, logout } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", username: "", bio: "", website: "", avatar: "", isPrivate: false });
  const [password, setPassword] = useState({ currentPassword: "", newPassword: "" });
  const [saving, setSaving] = useState(false);
  const [changing, setChanging] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push("/login");
    if (user) setForm({ name: user.name, username: user.username, bio: user.bio, website: user.website, avatar: user.avatar, isPrivate: user.isPrivate });
  }, [user, loading, isAuthenticated, router]);

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
      updateUser(next);
      toast.success("Settings saved");
    } catch (error: any) { toast.error(error.message); }
    finally { setSaving(false); }
  };

  const changePassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setChanging(true);
    try {
      await api.put("/api/auth/password", password);
      setPassword({ currentPassword: "", newPassword: "" });
      toast.success("Password updated");
    } catch (error: any) { toast.error(error.message); }
    finally { setChanging(false); }
  };

  if (loading || !user) return <div className="spinner" />;

  return (
    <div className="ig-main" style={{ maxWidth: 680 }}>
      <h1 style={{ fontSize: 24 }}>Settings</h1>

      <form className="ig-card" style={{ padding: 18, marginBottom: 18 }} onSubmit={save}>
        <h2 style={{ fontSize: 17, marginTop: 0 }}>Profile</h2>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
          <span className="ig-avatar" style={{ width: 64, height: 64 }}>{form.avatar ? <img src={form.avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : user.username[0].toUpperCase()}</span>
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
        <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12, fontSize: 14 }}><input type="checkbox" checked={form.isPrivate} onChange={(event) => setForm({ ...form, isPrivate: event.target.checked })} /> Private account (only followers see posts)</label>
        <button className="ig-btn primary" type="submit" disabled={saving} style={{ marginTop: 14 }}>{saving ? "Saving..." : "Save profile"}</button>
      </form>

      <form className="ig-card" style={{ padding: 18, marginBottom: 18 }} onSubmit={changePassword}>
        <h2 style={{ fontSize: 17, marginTop: 0 }}>Password</h2>
        <label className="ig-label">Current password</label>
        <input className="ig-input" type="password" value={password.currentPassword} onChange={(event) => setPassword({ ...password, currentPassword: event.target.value })} autoComplete="current-password" required />
        <label className="ig-label" style={{ marginTop: 10 }}>New password</label>
        <input className="ig-input" type="password" value={password.newPassword} onChange={(event) => setPassword({ ...password, newPassword: event.target.value })} autoComplete="new-password" minLength={8} required />
        <button className="ig-btn" type="submit" disabled={changing} style={{ marginTop: 14 }}>{changing ? "Updating..." : "Update password"}</button>
      </form>

      <div className="ig-card" style={{ padding: 18 }}>
        <h2 style={{ fontSize: 17, marginTop: 0 }}>Session</h2>
        <p style={{ color: "var(--muted)", fontSize: 13 }}>Signed in as @{user.username}. The session is stored in an HttpOnly cookie and expires after seven days.</p>
        <button className="ig-btn danger" onClick={logout} style={{ border: "1px solid var(--border)" }}>Log out</button>
      </div>
    </div>
  );
}
