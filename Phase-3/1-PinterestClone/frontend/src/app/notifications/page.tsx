"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/context/AuthContext";
import { notificationService } from "@/services/notification.service";
import { Notification } from "@/types";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import Button from "@/components/common/Button";

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
    notificationService.list().then((data) => setItems(data.notifications)).catch(() => setItems([])).finally(() => setFetching(false));
  }, [isAuthenticated]);

  const markAll = async () => {
    await notificationService.markAllRead();
    setItems((current) => current.map((item) => ({ ...item, read: true })));
  };

  if (loading || fetching) return <LoadingSpinner size="lg" />;

  return (
    <div className="mx-auto max-w-3xl px-3 py-6 sm:px-5">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Notifications</h1>
          <p className="mt-1 text-sm text-gray-500">Likes, saves, comments and new followers.</p>
        </div>
        <Button variant="outline" size="sm" onClick={markAll}>Mark all read</Button>
      </div>

      {items.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-gray-300 p-12 text-center text-gray-500">No notifications yet.</div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
          {items.map((item) => (
            <Link
              key={item._id}
              href={item.pin ? `/pin/${item.pin._id}` : `/profile/${item.actor.username}`}
              className={`flex items-center gap-3 border-b border-gray-100 p-4 last:border-0 hover:bg-gray-50 ${item.read ? "" : "bg-red-50/50"}`}
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full bg-gray-200 text-sm font-bold">
                {item.actor?.avatar ? <img src={item.actor.avatar} alt="" className="h-full w-full object-cover" /> : item.actor?.username?.[0]?.toUpperCase()}
              </span>
              <span className="min-w-0 flex-1 text-sm">
                <span className="font-semibold">{item.actor?.name || item.actor?.username}</span>{" "}
                {item.type === "like" && "liked your pin"}
                {item.type === "save" && "saved your pin"}
                {item.type === "comment" && "commented on your pin"}
                {item.type === "follow" && "started following you"}
                <span className="mt-0.5 block text-xs text-gray-400">{formatDistanceToNow(new Date(item.createdAt))} ago</span>
              </span>
              {item.pin?.imageUrl && <img src={item.pin.imageUrl} alt="" className="h-12 w-12 rounded-lg object-cover" />}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
