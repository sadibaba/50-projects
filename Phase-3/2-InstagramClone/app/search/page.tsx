"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { searchApi } from "@/services";
import type { Post, User } from "@/types";
import PostGrid from "@/components/PostGrid";

function Results() {
  const params = useSearchParams();
  const q = params.get("q") || "";
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [tab, setTab] = useState<"people" | "posts">("people");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!q) { setLoading(false); return; }
    setLoading(true);
    searchApi.search(q).then((data) => { setUsers(data.users); setPosts(data.posts); }).finally(() => setLoading(false));
  }, [q]);

  if (!q) return <div className="empty"><h2 style={{ color: "var(--text)" }}>Search Lumen</h2><p>Try a username, a caption, a place or a tag.</p></div>;
  if (loading) return <div className="spinner" />;

  return (
    <div className="ig-main" style={{ maxWidth: 935 }}>
      <h1 style={{ fontSize: 24 }}>Results for “{q}”</h1>
      <div className="tabs" style={{ marginBottom: 14 }}>
        <button className={`tab ${tab === "people" ? "active" : ""}`} onClick={() => setTab("people")}>People ({users.length})</button>
        <button className={`tab ${tab === "posts" ? "active" : ""}`} onClick={() => setTab("posts")}>Posts ({posts.length})</button>
      </div>
      {tab === "people" ? (
        users.length === 0 ? <div className="empty">No people found.</div> : (
          <div className="ig-card" style={{ overflow: "hidden" }}>
            {users.map((person) => (
              <Link key={person._id} href={`/u/${person.username}`} style={{ display: "flex", alignItems: "center", gap: 12, padding: 14, borderBottom: "1px solid #f3f3f3" }}>
                <span className="ig-avatar" style={{ width: 44, height: 44 }}>{person.avatar ? <img src={person.avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : person.username[0].toUpperCase()}</span>
                <span><strong style={{ display: "block" }}>{person.username}</strong><span style={{ fontSize: 13, color: "var(--muted)" }}>{person.name}</span></span>
              </Link>
            ))}
          </div>
        )
      ) : <PostGrid posts={posts} empty="No posts found." />}
    </div>
  );
}

export default function SearchPage() {
  return <Suspense fallback={<div className="spinner" />}><Results /></Suspense>;
}
