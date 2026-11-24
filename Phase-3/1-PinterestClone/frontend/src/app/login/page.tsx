"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";

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
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-gradient-to-br from-[#ffe1e6] via-[#fff4e8] to-[#e7f5ff] p-12 lg:flex">
        <div className="flex items-center gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-brand font-black text-white">P</span>
          <span className="text-xl font-bold">Pinboard</span>
        </div>
        <div>
          <h1 className="max-w-md text-5xl font-black leading-tight">A calmer place to collect ideas.</h1>
          <p className="mt-4 max-w-md text-lg text-gray-700">Public browsing, private boards when you want them, and zero ads.</p>
          <ul className="mt-8 space-y-3 text-sm text-gray-700">
            <li>Browse without an account</li>
            <li>Save to boards you control</li>
            <li>Export any pin you save</li>
          </ul>
        </div>
        <p className="text-xs text-gray-500">Built as a Phase 3 full-stack project.</p>
      </div>

      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-brand font-black text-white">P</span>
            <span className="text-lg font-bold">Pinboard</span>
          </div>
          <h2 className="text-3xl font-black tracking-tight">Welcome back</h2>
          <p className="mt-2 text-sm text-gray-500">Sign in to save ideas and follow creators.</p>

          {error && <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

          <form onSubmit={submit} className="mt-6 space-y-4">
            <Input type="email" label="Email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required />
            <Input type="password" label="Password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required />
            <Button type="submit" fullWidth loading={loading}>Sign in</Button>
          </form>

          <div className="mt-4 rounded-xl bg-gray-50 p-3 text-xs text-gray-600">
            Demo account: <strong>curator@pinterest.local</strong> / <strong>demo12345</strong>
          </div>

          <p className="mt-6 text-center text-sm text-gray-600">
            New here? <Link href="/register" className="font-semibold text-brand hover:underline">Create an account</Link>
          </p>
          <p className="mt-2 text-center text-sm text-gray-500">
            Or <Link href="/" className="font-medium underline">keep browsing as a guest</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
