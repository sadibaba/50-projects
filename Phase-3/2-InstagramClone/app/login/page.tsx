"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { IoLockClosedOutline } from "react-icons/io5";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 16 }}>
      <div style={{ width: "100%", maxWidth: 380 }}>
        <div className="ig-card" style={{ padding: "32px 30px", marginBottom: 12 }}>
          <h1 className="ig-logo" style={{ textAlign: "center", fontSize: 34, marginBottom: 6 }}>Lumen</h1>
          <p style={{ textAlign: "center", color: "var(--muted)", fontSize: 14, marginBottom: 22 }}>Sign in to post, comment and follow.</p>
          {error && <div style={{ background: "#fff0f1", color: "#c62828", padding: 10, borderRadius: 8, fontSize: 13, marginBottom: 12 }}>{error}</div>}
          <form onSubmit={submit} style={{ display: "grid", gap: 10 }}>
            <input className="ig-input" type="email" placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required />
            <input className="ig-input" type="password" placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required />
            <button className="ig-btn primary" type="submit" disabled={loading}>{loading ? "Signing in..." : "Log in"}</button>
          </form>
          <div style={{ marginTop: 16, padding: 10, background: "#f7f7f7", borderRadius: 8, fontSize: 12, color: "var(--muted)", textAlign: "center" }}>
            Demo: <strong>demo@lumen.local</strong> / <strong>demo12345</strong>
          </div>
        </div>
        <div className="ig-card" style={{ padding: 18, textAlign: "center", fontSize: 14 }}>
          New here? <Link href="/register" style={{ color: "#0095f6", fontWeight: 700 }}>Create an account</Link>
        </div>
        <p style={{ textAlign: "center", fontSize: 12, color: "var(--muted)", marginTop: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
          <IoLockClosedOutline /> HttpOnly cookie session. No third-party tracking.
        </p>
        <p style={{ textAlign: "center", fontSize: 12, marginTop: 8 }}><Link href="/" style={{ textDecoration: "underline" }}>Keep browsing as a guest</Link></p>
      </div>
    </div>
  );
}
