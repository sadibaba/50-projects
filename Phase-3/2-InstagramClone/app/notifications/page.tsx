"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { notificationApi } from "@/services";
import type { Notification } from "@/types";
import { useAuth } from "@/context/AuthContext";

export default function NotificationsPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<Notification[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push("/login");
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated) return;
    notificationApi.list().then((data) => setItems(data.notifications)).finally(() => setFetching(false));
  }, [isAuthenticated]);

  const markAll = async () => {
    await notificationApi.markAll();
    setItems((current) => current.map((item) => ({ ...item, read: true })));
  };

  if (loading || fetching) return <div className="spinner" />;

  return (
    <div className="ig-main" style={{ maxWidth: 680 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <h1 style={{ fontSize: 24, margin: 0 }}>Notifications</h1>
        <button className="ig-btn" onClick={markAll}>Mark all read</button>
      </div>
      {items.length === 0 ? <div className="empty">No notifications yet.</div> : (
        <div className="ig-card" style={{ overflow: "hidden" }}>
          {items.map((item) => (
            <Link key={item._id} href={item.post ? `/p/${item.post._id}` : `/u/${item.actor.username}`} style={{ display: "flex", gap: 12, padding: 14, alignItems: "center", borderBottom: "1px solid #f3f3f3", background: item.read ? "#fff" : "#fdf2f4" }}>
              <span className="ig-avatar" style={{ width: 42, height: 42 }}>{item.actor.avatar ? <img src={item.actor.avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : item.actor.username[0].toUpperCase()}</span>
              <span style={{ flex: 1, fontSize: 14 }}>
                <strong>{item.actor.username}</strong>{" "}
                {item.type === "like" && "liked your post"}
                {item.type === "comment" && "commented on your post"}
                {item.type === "follow" && "started following you"}
                {item.type === "save" && "saved your post"}
                <span style={{ display: "block", color: "var(--muted)", fontSize: 12, marginTop: 2 }}>{formatDistanceToNow(new Date(item.createdAt))} ago</span>
              </span>
              {item.post?.imageUrl && <img src={item.post.imageUrl} alt="" style={{ width: 46, height: 46, objectFit: "cover", borderRadius: 6 }} />}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
