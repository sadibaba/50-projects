"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  IoSearchOutline, IoNotificationsOutline, IoAddCircleOutline,
  IoHomeOutline, IoCompassOutline, IoPlayCircleOutline, IoBookmarkOutline,
  IoPersonOutline, IoLogOutOutline, IoCloseOutline,
} from "react-icons/io5";
import { useAuth } from "@/context/AuthContext";
import { notificationService } from "@/services/notification.service";
import { Notification } from "@/types";
import { formatDistanceToNow } from "date-fns";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout, loading } = useAuth();
  const [query, setQuery] = useState("");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unread, setUnread] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const isAuthPage = pathname === "/login" || pathname === "/register";

  useEffect(() => {
    if (!isAuthenticated) return;
    let active = true;
    const load = async () => {
      try {
        const data = await notificationService.list();
        if (active) {
          setNotifications(data.notifications);
          setUnread(data.unread);
        }
      } catch {
        // Notifications are optional; browsing must keep working.
      }
    };
    load();
    const timer = setInterval(load, 30000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [isAuthenticated]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  if (isAuthPage) return null;

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    router.push(`/search${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ""}`);
  };

  const markAllRead = async () => {
    try {
      await notificationService.markAllRead();
      setNotifications((items) => items.map((item) => ({ ...item, read: true })));
      setUnread(0);
    } catch {
      // Keep the UI responsive.
    }
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-black/5 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1800px] items-center gap-3 px-3 sm:px-5">
          <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="Pinboard home">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-brand text-lg font-black text-white">P</span>
            <span className="hidden text-lg font-bold tracking-tight sm:block">Pinboard</span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            <Link href="/" className={`rounded-full px-3 py-2 text-sm font-semibold ${pathname === "/" ? "bg-ink text-white" : "hover:bg-gray-100"}`}>Home</Link>
            <Link href="/explore" className={`rounded-full px-3 py-2 text-sm font-semibold ${pathname === "/explore" ? "bg-ink text-white" : "hover:bg-gray-100"}`}>Explore</Link>
            <Link href="/reels" className={`rounded-full px-3 py-2 text-sm font-semibold ${pathname === "/reels" ? "bg-ink text-white" : "hover:bg-gray-100"}`}>Reels</Link>
          </nav>

          <form onSubmit={submitSearch} className="relative min-w-0 flex-1">
            <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={19} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search ideas, boards or people"
              className="w-full rounded-full bg-gray-100 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:bg-white focus:ring-2 focus:ring-brand/30"
              aria-label="Search"
            />
          </form>

          <div className="flex items-center gap-1.5" ref={panelRef}>
            {isAuthenticated ? (
              <>
                <Link href="/create-pin" className="hidden items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark sm:flex">
                  <IoAddCircleOutline size={18} /> Create
                </Link>
                <Link href="/create-pin" className="grid h-10 w-10 place-items-center rounded-full hover:bg-gray-100 sm:hidden" aria-label="Create pin">
                  <IoAddCircleOutline size={23} />
                </Link>

                <div className="relative">
                  <button
                    onClick={() => { setShowNotifications((value) => !value); setShowMenu(false); }}
                    className="relative grid h-10 w-10 place-items-center rounded-full hover:bg-gray-100"
                    aria-label="Notifications"
                  >
                    <IoNotificationsOutline size={23} />
                    {unread > 0 && <span className="absolute right-1.5 top-1.5 min-w-4 rounded-full bg-brand px-1 text-[10px] font-bold leading-4 text-white">{unread}</span>}
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-[340px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
                      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                        <p className="font-semibold">Notifications</p>
                        {unread > 0 && <button onClick={markAllRead} className="text-xs font-medium text-brand hover:underline">Mark all read</button>}
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <p className="p-6 text-center text-sm text-gray-500">No notifications yet.</p>
                        ) : notifications.slice(0, 8).map((item) => (
                          <Link
                            key={item._id}
                            href={item.pin ? `/pin/${item.pin._id}` : `/profile/${item.actor.username}`}
                            onClick={() => setShowNotifications(false)}
                            className={`flex gap-3 px-4 py-3 hover:bg-gray-50 ${item.read ? "" : "bg-red-50/60"}`}
                          >
                            <span className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full bg-gray-200 text-xs font-bold">
                              {item.actor?.avatar ? <img src={item.actor.avatar} alt="" className="h-full w-full object-cover" /> : item.actor?.username?.[0]?.toUpperCase()}
                            </span>
                            <span className="min-w-0 text-sm">
                              <span className="font-semibold">{item.actor?.name || item.actor?.username}</span>{" "}
                              {item.type === "like" && "liked your pin"}
                              {item.type === "save" && "saved your pin"}
                              {item.type === "comment" && "commented on your pin"}
                              {item.type === "follow" && "started following you"}
                              <span className="mt-0.5 block text-xs text-gray-400">{formatDistanceToNow(new Date(item.createdAt))} ago</span>
                            </span>
                          </Link>
                        ))}
                      </div>
                      <Link href="/notifications" onClick={() => setShowNotifications(false)} className="block border-t border-gray-100 py-3 text-center text-sm font-semibold text-brand hover:bg-gray-50">
                        View all notifications
                      </Link>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <button
                    onClick={() => { setShowMenu((value) => !value); setShowNotifications(false); }}
                    className="ml-1 grid h-9 w-9 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-brand to-orange-500 text-sm font-bold text-white"
                    aria-label="Account menu"
                  >
                    {user?.avatar ? <img src={user.avatar} alt="" className="h-full w-full object-cover" /> : (user?.name || user?.username || "U")[0].toUpperCase()}
                  </button>
                  {showMenu && (
                    <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-gray-200 bg-white py-1 shadow-2xl">
                      <div className="border-b border-gray-100 px-4 py-3">
                        <p className="truncate font-semibold">{user?.name || user?.username}</p>
                        <p className="truncate text-xs text-gray-500">@{user?.username}</p>
                      </div>
                      <Link href={`/profile/${user?.username}`} onClick={() => setShowMenu(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50"><IoPersonOutline /> Profile</Link>
                      <Link href="/saved" onClick={() => setShowMenu(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50"><IoBookmarkOutline /> Saved</Link>
                      <Link href="/boards" onClick={() => setShowMenu(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50"><IoCompassOutline /> Boards</Link>
                      <button onClick={logout} className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50"><IoLogOutOutline /> Sign out</button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              !loading && (
                <div className="flex items-center gap-1.5">
                  <Link href="/login" className="rounded-full px-3 py-2 text-sm font-semibold hover:bg-gray-100">Log in</Link>
                  <Link href="/register" className="rounded-full bg-brand px-3.5 py-2 text-sm font-semibold text-white hover:bg-brand-dark">Sign up</Link>
                </div>
              )
            )}
          </div>
        </div>
      </header>

      <nav className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-black/5 bg-white px-2 py-1.5 md:hidden">
        {[
          { href: "/", label: "Home", icon: IoHomeOutline },
          { href: "/explore", label: "Explore", icon: IoCompassOutline },
          { href: "/reels", label: "Reels", icon: IoPlayCircleOutline },
          { href: "/saved", label: "Saved", icon: IoBookmarkOutline },
          { href: user ? `/profile/${user.username}` : "/login", label: "You", icon: IoPersonOutline },
        ].map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link key={item.label} href={item.href} className={`flex flex-col items-center gap-0.5 rounded-lg px-3 py-1 text-[10px] font-medium ${active ? "text-ink" : "text-gray-500"}`}>
              <Icon size={21} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
};

export default Navbar;
