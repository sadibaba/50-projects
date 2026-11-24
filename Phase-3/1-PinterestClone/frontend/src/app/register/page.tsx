"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";

export default function RegisterPage() {
  const { register } = useAuth();
  const [form, setForm] = useState({ username: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    if (form.password !== form.confirm) {
      setError("Passwords do not match");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    try {
      await register(form.username.trim().toLowerCase(), form.email.trim(), form.password);
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-gradient-to-br from-[#e7f5ff] via-[#fff4e8] to-[#ffe1e6] p-12 lg:flex">
        <div className="flex items-center gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-brand font-black text-white">P</span>
          <span className="text-xl font-bold">Pinboard</span>
        </div>
        <div>
          <h1 className="max-w-md text-5xl font-black leading-tight">Collect what inspires you.</h1>
          <p className="mt-4 max-w-md text-lg text-gray-700">Create boards for trips, projects and everyday ideas. Your data stays yours.</p>
        </div>
        <p className="text-xs text-gray-500">No ads. No tracking pixels. No forced login to browse.</p>
      </div>

      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-brand font-black text-white">P</span>
            <span className="text-lg font-bold">Pinboard</span>
          </div>
          <h2 className="text-3xl font-black tracking-tight">Create your account</h2>
          <p className="mt-2 text-sm text-gray-500">Free, and you can keep browsing without it.</p>

          {error && <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

          <form onSubmit={submit} className="mt-6 space-y-4">
            <Input label="Username" value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} pattern="[A-Za-z0-9_]{3,30}" title="3-30 letters, numbers or underscores" required />
            <Input type="email" label="Email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
            <Input type="password" label="Password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} minLength={8} required />
            <Input type="password" label="Confirm password" value={form.confirm} onChange={(event) => setForm({ ...form, confirm: event.target.value })} minLength={8} required />
            <Button type="submit" fullWidth loading={loading}>Sign up</Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account? <Link href="/login" className="font-semibold text-brand hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
