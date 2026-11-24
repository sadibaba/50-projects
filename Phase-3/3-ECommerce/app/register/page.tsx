"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try { await register(form); router.push("/"); }
    catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="vn-main" style={{ maxWidth: 440 }}>
      <div className="vn-card vn-panel" style={{ marginTop: 30 }}>
        <p className="vn-eyebrow">New account</p>
        <h1 style={{ fontSize: 36, margin: "6px 0 18px" }}>Join VoltNest</h1>
        {error && <p style={{ color: "var(--danger)", fontSize: 13 }}>{error}</p>}
        <form onSubmit={submit} style={{ display: "grid", gap: 10 }}>
          <input className="vn-input" placeholder="Name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          <input className="vn-input" placeholder="Username" value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} required />
          <input className="vn-input" type="email" placeholder="Email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
          <input className="vn-input" type="password" placeholder="Password (8+ characters)" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} minLength={8} required />
          <button className="vn-btn" type="submit" disabled={loading}>{loading ? "Creating..." : "Create account"}</button>
        </form>
        <p style={{ fontSize: 13 }}>Already have an account? <Link href="/login" style={{ textDecoration: "underline" }}>Log in</Link></p>
      </div>
    </div>
  );
}
