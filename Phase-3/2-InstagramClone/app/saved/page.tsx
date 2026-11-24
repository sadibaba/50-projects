"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { postApi } from "@/services";
import type { Post } from "@/types";
import { useAuth } from "@/context/AuthContext";
import PostGrid from "@/components/PostGrid";

export default function SavedPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push("/login");
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated) return;
    postApi.list({ scope: "saved", limit: 30 }).then((data) => setPosts(data.posts)).finally(() => setFetching(false));
  }, [isAuthenticated]);

  if (loading || fetching) return <div className="spinner" />;

  return (
    <div className="ig-main" style={{ maxWidth: 935 }}>
      <h1 style={{ fontSize: 24 }}>Saved</h1>
      <p style={{ color: "var(--muted)", fontSize: 14, marginTop: 0 }}>Only you can see this collection.</p>
      <PostGrid posts={posts} empty="Nothing saved yet. Tap the bookmark on any post." />
    </div>
  );
}
