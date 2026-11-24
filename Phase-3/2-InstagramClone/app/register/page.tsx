"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { IoCheckmarkCircleOutline } from "react-icons/io5";

export default function RegisterPage() {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form.username.trim().toLowerCase(), form.email.trim(), form.password, form.name.trim());
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 16 }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        <div className="ig-card" style={{ padding: "30px 28px", marginBottom: 12 }}>
          <h1 className="ig-logo" style={{ textAlign: "center", fontSize: 32, marginBottom: 4 }}>Lumen</h1>
          <p style={{ textAlign: "center", color: "var(--muted)", fontSize: 14, marginBottom: 18 }}>Create an account to share moments.</p>
          {error && <div style={{ background: "#fff0f1", color: "#c62828", padding: 10, borderRadius: 8, fontSize: 13, marginBottom: 12 }}>{error}</div>}
          <form onSubmit={submit} style={{ display: "grid", gap: 9 }}>
            <input className="ig-input" placeholder="Name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} maxLength={60} />
            <input className="ig-input" placeholder="Username" value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} pattern="[A-Za-z0-9._]{3,30}" title="3-30 letters, numbers, dots or underscores" required />
            <input className="ig-input" type="email" placeholder="Email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
            <input className="ig-input" type="password" placeholder="Password (8+ characters)" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} minLength={8} required />
            <button className="ig-btn primary" type="submit" disabled={loading}>{loading ? "Creating..." : "Sign up"}</button>
          </form>
          <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 12, lineHeight: 1.5, textAlign: "center" }}>
            <IoCheckmarkCircleOutline /> Passwords are hashed. Sessions use an HttpOnly cookie.
          </p>
        </div>
        <div className="ig-card" style={{ padding: 18, textAlign: "center", fontSize: 14 }}>
          Have an account? <Link href="/login" style={{ color: "#0095f6", fontWeight: 700 }}>Log in</Link>
        </div>
      </div>
    </div>
  );
}
