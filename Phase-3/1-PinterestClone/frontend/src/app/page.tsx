"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { IoArrowForward, IoSparklesOutline } from "react-icons/io5";
import { useAuth } from "@/context/AuthContext";
import { pinService } from "@/services/pin.service";
import { discoverService } from "@/services/discover.service";
import { Pin } from "@/types";
import PinGrid from "@/components/pins/PinGrid";
import SaveToBoardModal from "@/components/pins/SaveToBoardModal";
import toast from "react-hot-toast";

export default function HomePage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [pins, setPins] = useState<Pin[]>([]);
  const [categories, setCategories] = useState<{ name: string; count: number }[]>([]);
  const [category, setCategory] = useState("All");
  const [feed, setFeed] = useState<"for-you" | "following">("for-you");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [savingPin, setSavingPin] = useState<Pin | null>(null);

  useEffect(() => {
    discoverService.categories().then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setPins([]);
    setPage(1);

    pinService.list({
      page: 1,
      limit: 24,
      category: category === "All" ? undefined : category,
      following: feed === "following" && isAuthenticated ? "me" : undefined,
      sort: "latest",
    })
      .then((data) => {
        if (!active) return;
        setPins(data.pins);
        setHasMore(data.hasMore);
      })
      .catch((error) => toast.error(error.message))
      .finally(() => active && setLoading(false));

    return () => { active = false; };
  }, [category, feed, isAuthenticated]);

  const loadMore = async () => {
    const next = page + 1;
    try {
      const data = await pinService.list({
        page: next,
        limit: 24,
        category: category === "All" ? undefined : category,
        following: feed === "following" && isAuthenticated ? "me" : undefined,
        sort: "latest",
      });
      setPins((items) => [...items, ...data.pins]);
      setPage(next);
      setHasMore(data.hasMore);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleSaved = (updated: Pin) => {
    setPins((items) => items.map((pin) => (pin._id === updated._id ? { ...pin, ...updated } : pin)));
  };

  return (
    <div className="mx-auto max-w-[1800px] px-3 py-4 sm:px-5 sm:py-6">
      {!isAuthenticated && !authLoading && (
        <section className="mb-6 overflow-hidden rounded-3xl bg-gradient-to-br from-[#ffe3e7] via-[#fff5e9] to-[#e8f6ff] px-6 py-10 sm:px-12 sm:py-14">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-brand">
              <IoSparklesOutline /> No account needed to browse
            </p>
            <h1 className="mt-4 text-balance text-4xl font-black leading-tight tracking-tight sm:text-6xl">
              Ideas for every part of your life.
            </h1>
            <p className="mt-4 max-w-xl text-base text-gray-700 sm:text-lg">
              Search millions of visual ideas, save them to boards, and share what inspires you.
              Sign in only when you want to post or save.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/explore" className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 font-semibold text-white hover:bg-brand-dark">
                Start exploring <IoArrowForward />
              </Link>
              <Link href="/register" className="rounded-full border border-black/10 bg-white/80 px-6 py-3 font-semibold hover:bg-white">
                Create a free account
              </Link>
            </div>
          </div>
        </section>
      )}

      {isAuthenticated && (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">Welcome back, {user?.name || user?.username}</h1>
            <p className="text-sm text-gray-500">Your next idea is one scroll away.</p>
          </div>
          <div className="flex rounded-full bg-gray-100 p-1">
            {(["for-you", "following"] as const).map((value) => (
              <button
                key={value}
                onClick={() => setFeed(value)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${feed === value ? "bg-white shadow" : "text-gray-500 hover:text-ink"}`}
              >
                {value === "for-you" ? "For you" : "Following"}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="scrollbar-hide -mx-3 mb-5 flex gap-2 overflow-x-auto px-3 pb-1 sm:mx-0 sm:px-0">
        {categories.map((item) => (
          <button
            key={item.name}
            onClick={() => setCategory(item.name)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${category === item.name ? "bg-ink text-white" : "bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50"}`}
          >
            {item.name}
          </button>
        ))}
      </div>

      <PinGrid pins={pins} loading={loading} onSave={setSavingPin} emptyTitle="Nothing here yet" emptyHint="Try a different category or feed." />

      {!loading && hasMore && (
        <div className="mt-8 flex justify-center">
          <button onClick={loadMore} className="rounded-full bg-ink px-7 py-3 text-sm font-semibold text-white hover:bg-black">
            Load more ideas
          </button>
        </div>
      )}

      {savingPin && (
        <SaveToBoardModal pin={savingPin} onClose={() => setSavingPin(null)} onSaved={handleSaved} />
      )}
    </div>
  );
}
