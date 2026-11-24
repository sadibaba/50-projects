"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { IoSearchOutline } from "react-icons/io5";
import { postApi, userApi } from "@/services";
import type { Post, User } from "@/types";
import PostGrid from "@/components/PostGrid";

export default function ExplorePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [people, setPeople] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    Promise.all([
      postApi.list({ scope: "explore", limit: 24 }),
      userApi.suggested(),
    ])
      .then(([postData, users]) => {
        setPosts(postData.posts);
        setPeople(users);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = posts.filter((post) => {
    if (!query.trim()) return true;
    const value = query.toLowerCase();
    return post.caption.toLowerCase().includes(value) || post.tags.some((tag) => tag.includes(value)) || post.author.username.includes(value);
  });

  return (
    <div className="ig-main" style={{ maxWidth: 960 }}>
      <section style={{ marginBottom: 18 }}>
        <h1 style={{ fontSize: 26, margin: "0 0 4px" }}>Explore</h1>
        <p style={{ margin: 0, color: "var(--muted)", fontSize: 14 }}>Public posts, chronological and ad-free.</p>
        <div className="ig-search" style={{ marginTop: 12, maxWidth: "100%" }}>
          <IoSearchOutline style={{ position: "absolute", left: 11, top: 10, color: "#8e8e8e" }} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filter captions, tags or people" />
        </div>
      </section>

      {people.length > 0 && (
        <section style={{ marginBottom: 22 }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: "var(--muted)", marginBottom: 10 }}>People to follow</h2>
          <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4 }}>
            {people.map((person) => (
              <Link key={person._id} href={`/u/${person.username}`} className="ig-card" style={{ padding: 12, minWidth: 150, textAlign: "center" }}>
                <span className="ig-avatar" style={{ width: 56, height: 56, margin: "0 auto 8px" }}>
                  {person.avatar ? <img src={person.avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : person.username[0].toUpperCase()}
                </span>
                <strong style={{ display: "block", fontSize: 13 }}>{person.username}</strong>
                <span style={{ fontSize: 12, color: "var(--muted)" }}>{person.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {loading ? <div className="spinner" /> : <PostGrid posts={filtered} empty="No public posts match that filter." />}
    </div>
  );
}
