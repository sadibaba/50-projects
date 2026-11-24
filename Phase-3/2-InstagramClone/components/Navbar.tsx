"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  IoHomeOutline, IoSearchOutline, IoCompassOutline, IoPlayCircleOutline,
  IoAddCircleOutline, IoHeartOutline, IoPersonOutline, IoLogOutOutline,
  IoNotificationsOutline, IoSettingsOutline, IoBookmarkOutline,
} from "react-icons/io5";
import { useAuth } from "@/context/AuthContext";
import { notificationApi } from "@/services";
import type { Notification } from "@/types";
import { formatDistanceToNow } from "date-fns";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, loading, logout } = useAuth();
  const [query, setQuery] = useState("");
  const [unread, setUnread] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [bellOpen, setBellOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const isAuthPage = pathname === "/login" || pathname === "/register";

  useEffect(() => {
    if (!isAuthenticated) return;
    let active = true;
    const load = async () => {
      try {
        const data = await notificationApi.list();
        if (active) {
          setUnread(data.unread);
          setNotifications(data.notifications);
        }
      } catch {
        // notifications are optional for browsing
      }
    };
    load();
    const timer = setInterval(load, 30000);
    return () => { active = false; clearInterval(timer); };
  }, [isAuthenticated]);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setBellOpen(false);
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  if (isAuthPage) return null;

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    router.push(`/search${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ""}`);
  };

  const markAll = async () => {
    try {
      await notificationApi.markAll();
      setUnread(0);
      setNotifications((items) => items.map((item) => ({ ...item, read: true })));
    } catch {
      // keep UI responsive
    }
  };

  return (
    <>
      <header className="ig-topbar">
        <div className="ig-topbar-inner">
          <Link href="/" className="ig-logo" aria-label="Lumen home">
            Lumen<span className="ig-logo-text" />
          </Link>

          <form onSubmit={submit} className="ig-search">
            <IoSearchOutline style={{ position: "absolute", left: 11, top: 10, color: "#8e8e8e" }} size={17} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search people, captions, tags" aria-label="Search" />
          </form>

          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 2 }} ref={panelRef}>
            <Link href="/" className="ig-icon-btn" aria-label="Home"><IoHomeOutline size={23} /></Link>
            <Link href="/explore" className="ig-icon-btn" aria-label="Explore"><IoCompassOutline size={23} /></Link>
            <Link href="/reels" className="ig-icon-btn" aria-label="Reels"><IoPlayCircleOutline size={23} /></Link>
            {isAuthenticated && <Link href="/create" className="ig-icon-btn" aria-label="Create post"><IoAddCircleOutline size={25} /></Link>}

            {isAuthenticated ? (
              <>
                <div style={{ position: "relative" }}>
                  <button className="ig-icon-btn" onClick={() => { setBellOpen((value) => !value); setMenuOpen(false); }} aria-label="Notifications">
                    <IoNotificationsOutline size={23} />
                    {unread > 0 && <span style={{ position: "absolute", top: 5, right: 4, background: "var(--danger)", color: "#fff", borderRadius: 999, fontSize: 10, lineHeight: "16px", minWidth: 16, padding: "0 4px", fontWeight: 700 }}>{unread}</span>}
                  </button>
                  {bellOpen && (
                    <div style={{ position: "absolute", right: 0, top: 48, width: 330, background: "#fff", border: "1px solid var(--border)", borderRadius: 14, boxShadow: "0 14px 40px rgba(0,0,0,.16)", overflow: "hidden", zIndex: 60 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 14px", borderBottom: "1px solid var(--border)", fontWeight: 700 }}>
                        Notifications {unread > 0 && <button onClick={markAll} style={{ border: 0, background: "none", color: "#0095f6", cursor: "pointer", fontWeight: 600 }}>Mark all read</button>}
                      </div>
                      <div style={{ maxHeight: 340, overflowY: "auto" }}>
                        {notifications.length === 0 ? <p style={{ padding: 24, textAlign: "center", color: "var(--muted)", fontSize: 14 }}>No notifications yet.</p> : notifications.slice(0, 7).map((item) => (
                          <Link key={item._id} href={item.post ? `/p/${item.post._id}` : `/u/${item.actor.username}`} onClick={() => setBellOpen(false)} style={{ display: "flex", gap: 10, padding: "10px 14px", background: item.read ? "#fff" : "#fdf2f4", borderBottom: "1px solid #f5f5f5" }}>
                            <span className="ig-avatar" style={{ width: 34, height: 34 }}>
                              {item.actor.avatar ? <img src={item.actor.avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : item.actor.username[0].toUpperCase()}
                            </span>
                            <span style={{ fontSize: 13, lineHeight: 1.35 }}>
                              <strong>{item.actor.username}</strong>{" "}
                              {item.type === "like" && "liked your post"}
                              {item.type === "comment" && "commented on your post"}
                              {item.type === "follow" && "started following you"}
                              {item.type === "save" && "saved your post"}
                              <span style={{ display: "block", fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{formatDistanceToNow(new Date(item.createdAt))} ago</span>
                            </span>
                          </Link>
                        ))}
                      </div>
                      <Link href="/notifications" onClick={() => setBellOpen(false)} style={{ display: "block", textAlign: "center", padding: 12, borderTop: "1px solid var(--border)", fontSize: 13, fontWeight: 600, color: "#0095f6" }}>View all</Link>
                    </div>
                  )}
                </div>

                <div style={{ position: "relative" }}>
                  <button onClick={() => { setMenuOpen((value) => !value); setBellOpen(false); }} className="ig-avatar" style={{ width: 32, height: 32, border: "1px solid var(--border)", cursor: "pointer", marginLeft: 4 }} aria-label="Account menu">
                    {user?.avatar ? <img src={user.avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : (user?.name || user?.username || "U")[0].toUpperCase()}
                  </button>
                  {menuOpen && (
                    <div style={{ position: "absolute", right: 0, top: 44, width: 210, background: "#fff", border: "1px solid var(--border)", borderRadius: 12, boxShadow: "0 14px 40px rgba(0,0,0,.16)", overflow: "hidden", zIndex: 60 }}>
                      <Link href={`/u/${user?.username}`} onClick={() => setMenuOpen(false)} style={{ display: "flex", gap: 9, padding: "11px 14px", fontSize: 14 }}><IoPersonOutline size={17} /> Profile</Link>
                      <Link href="/saved" onClick={() => setMenuOpen(false)} style={{ display: "flex", gap: 9, padding: "11px 14px", fontSize: 14 }}><IoBookmarkOutline size={17} /> Saved</Link>
                      <Link href="/settings" onClick={() => setMenuOpen(false)} style={{ display: "flex", gap: 9, padding: "11px 14px", fontSize: 14 }}><IoSettingsOutline size={17} /> Settings</Link>
                      <button onClick={logout} style={{ display: "flex", gap: 9, width: "100%", padding: "11px 14px", fontSize: 14, border: 0, background: "none", color: "var(--danger)", cursor: "pointer", textAlign: "left" }}><IoLogOutOutline size={17} /> Log out</button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              !loading && (
                <div style={{ display: "flex", gap: 6, marginLeft: 6 }}>
                  <Link href="/login" className="ig-btn">Log in</Link>
                  <Link href="/register" className="ig-btn primary">Sign up</Link>
                </div>
              )
            )}
          </div>
        </div>
      </header>

      <nav className="ig-bottomnav">
        {[
          { href: "/", icon: IoHomeOutline, label: "Home" },
          { href: "/explore", icon: IoCompassOutline, label: "Explore" },
          { href: "/reels", icon: IoPlayCircleOutline, label: "Reels" },
          { href: "/create", icon: IoAddCircleOutline, label: "Create" },
          { href: user ? `/u/${user.username}` : "/login", icon: IoPersonOutline, label: "Profile" },
        ].map((item) => {
          const Icon = item.icon;
          return <Link key={item.label} href={item.href} className="ig-icon-btn" aria-label={item.label}><Icon size={24} /></Link>;
        })}
      </nav>
    </>
  );
}
