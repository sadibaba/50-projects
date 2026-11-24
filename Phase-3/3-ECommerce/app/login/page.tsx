"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try { await login(form.email, form.password); router.push("/"); }
    catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="vn-main" style={{ maxWidth: 440 }}>
      <div className="vn-card vn-panel" style={{ marginTop: 30 }}>
        <p className="vn-eyebrow">Welcome back</p>
        <h1 style={{ fontSize: 36, margin: "6px 0 18px" }}>Log in to VoltNest</h1>
        {error && <p style={{ color: "var(--danger)", fontSize: 13 }}>{error}</p>}
        <form onSubmit={submit} style={{ display: "grid", gap: 10 }}>
          <input className="vn-input" type="email" placeholder="Email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
          <input className="vn-input" type="password" placeholder="Password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
          <button className="vn-btn" type="submit" disabled={loading}>{loading ? "Signing in..." : "Log in"}</button>
        </form>
        <p style={{ fontSize: 13 }}>New here? <Link href="/register" style={{ textDecoration: "underline" }}>Create an account</Link></p>
        <div style={{ background: "var(--paper)", borderRadius: 8, padding: 10, fontSize: 12 }}>Demo customer: <strong>customer@voltnest.dev</strong> / <strong>demo12345</strong><br />Admin: <strong>admin@voltnest.dev</strong> / <strong>admin12345</strong></div>
      </div>
    </div>
  );
}
