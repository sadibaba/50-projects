"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { IoSparklesOutline } from "react-icons/io5";
import { useAuth } from "@/context/AuthContext";
import { postApi, userApi } from "@/services";
import type { Post, User } from "@/types";
import PostCard from "@/components/PostCard";
import StoriesBar from "@/components/StoriesBar";
import toast from "react-hot-toast";

export default function HomePage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [suggested, setSuggested] = useState<User[]>([]);
  const [scope, setScope] = useState<"feed" | "explore">("feed");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [followingBusy, setFollowingBusy] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    setLoading(true);
    setPage(1);
    const queryScope = isAuthenticated ? scope : "explore";
    postApi.list({ scope: queryScope, page: 1, limit: 8 })
      .then((data) => {
        setPosts(data.posts);
        setHasMore(data.hasMore);
      })
      .catch((error) => toast.error(error.message))
      .finally(() => setLoading(false));
  }, [scope, isAuthenticated, authLoading]);

  useEffect(() => {
    if (isAuthenticated) userApi.suggested().then(setSuggested).catch(() => setSuggested([]));
  }, [isAuthenticated]);

  const loadMore = async () => {
    const next = page + 1;
    try {
      const data = await postApi.list({ scope: isAuthenticated ? scope : "explore", page: next, limit: 8 });
      setPosts((items) => [...items, ...data.posts]);
      setPage(next);
      setHasMore(data.hasMore);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const follow = async (username: string) => {
    setFollowingBusy(username);
    try {
      await userApi.follow(username);
      setSuggested((items) => items.filter((item) => item.username !== username));
      toast.success(`Following ${username}`);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setFollowingBusy(null);
    }
  };

  if (authLoading) return <div className="spinner" />;

  return (
    <div className="ig-main">
      {!isAuthenticated ? (
        <>
          <section style={{ textAlign: "center", padding: "36px 14px 30px" }}>
            <p style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#fff0f3", color: "#c2185b", fontSize: 12, fontWeight: 700, padding: "6px 12px", borderRadius: 999 }}>
              <IoSparklesOutline /> No login wall
            </p>
            <h1 style={{ fontSize: "clamp(32px, 6vw, 54px)", lineHeight: 1.05, margin: "14px 0 8px", letterSpacing: -1 }}>Share moments. Skip the noise.</h1>
            <p style={{ maxWidth: 560, margin: "0 auto", color: "var(--muted)", fontSize: 16 }}>A chronological, ad-free photo community. Browse now, sign in only when you want to post or follow.</p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 20 }}>
              <Link href="/register" className="ig-btn accent">Create account</Link>
              <Link href="/login" className="ig-btn">Log in</Link>
            </div>
          </section>
          <StoriesBar />
        </>
      ) : (
        <>
          <StoriesBar />
          <div style={{ display: "flex", gap: 4, borderBottom: "1px solid var(--border)", marginBottom: 16 }}>
            {(["feed", "explore"] as const).map((value) => (
              <button key={value} onClick={() => setScope(value)} className="tab" style={{ borderTop: 0, borderBottom: scope === value ? "2px solid var(--text)" : "2px solid transparent", color: scope === value ? "var(--text)" : "#999", maxWidth: 160 }}>
                {value === "feed" ? "Following" : "For you"}
              </button>
            ))}
          </div>
        </>
      )}

      <div className="feed">
        <div>
          {loading ? <div className="spinner" /> : posts.length === 0 ? (
            <div className="empty">
              <h2 style={{ color: "var(--text)", fontSize: 20 }}>Your feed is quiet</h2>
              <p style={{ marginTop: 6 }}>Follow a few people or explore public posts.</p>
              <Link href="/explore" className="ig-btn primary" style={{ display: "inline-block", marginTop: 12 }}>Explore</Link>
            </div>
          ) : posts.map((post) => <PostCard key={post._id} post={post} />)}
          {hasMore && <div style={{ textAlign: "center", padding: 16 }}><button className="ig-btn" onClick={loadMore}>Load more</button></div>}
        </div>

        {isAuthenticated && (
          <aside>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
              <Link href={`/u/${user?.username}`} className="ig-avatar" style={{ width: 48, height: 48 }}>
                {user?.avatar ? <img src={user.avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : user?.username?.[0]?.toUpperCase()}
              </Link>
              <div><Link href={`/u/${user?.username}`} style={{ fontWeight: 700 }}>{user?.username}</Link><div style={{ fontSize: 13, color: "var(--muted)" }}>{user?.name}</div></div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 700, color: "var(--muted)", marginBottom: 10 }}>
              <span>Suggested for you</span><Link href="/explore" style={{ color: "#0095f6" }}>See all</Link>
            </div>
            {suggested.map((person) => (
              <div key={person._id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0" }}>
                <Link href={`/u/${person.username}`} className="ig-avatar" style={{ width: 36, height: 36 }}>
                  {person.avatar ? <img src={person.avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : person.username[0].toUpperCase()}
                </Link>
                <div style={{ flex: 1, minWidth: 0 }}><Link href={`/u/${person.username}`} style={{ fontSize: 13, fontWeight: 700 }}>{person.username}</Link><div style={{ fontSize: 12, color: "var(--muted)" }}>{person.name}</div></div>
                <button className="ig-btn" style={{ padding: "4px 10px", fontSize: 12 }} disabled={followingBusy === person.username} onClick={() => follow(person.username)}>Follow</button>
              </div>
            ))}
            <p style={{ fontSize: 11, color: "#aaa", marginTop: 22, lineHeight: 1.5 }}>Chronological feed. No ads. No suggested posts disguised as friends.</p>
          </aside>
        )}
      </div>
    </div>
  );
}
