"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { IoSparklesOutline } from "react-icons/io5";
import { discoverService } from "@/services/discover.service";
import { pinService } from "@/services/pin.service";
import { Pin } from "@/types";
import PinGrid from "@/components/pins/PinGrid";
import SaveToBoardModal from "@/components/pins/SaveToBoardModal";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import toast from "react-hot-toast";

export default function ExplorePage() {
  const [categories, setCategories] = useState<{ name: string; count: number }[]>([]);
  const [category, setCategory] = useState("All");
  const [pins, setPins] = useState<Pin[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingPin, setSavingPin] = useState<Pin | null>(null);

  useEffect(() => {
    discoverService.categories().then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    setLoading(true);
    pinService.list({ page: 1, limit: 40, category: category === "All" ? undefined : category, sort: "popular" })
      .then((data) => setPins(data.pins))
      .catch((error) => toast.error(error.message))
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <div className="mx-auto max-w-[1600px] px-3 py-5 sm:px-5">
      <div className="rounded-3xl bg-gradient-to-br from-[#e9f7ff] via-[#fff4e8] to-[#ffe8ec] p-6 sm:p-10">
        <p className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-brand"><IoSparklesOutline /> Explore</p>
        <h1 className="mt-3 max-w-2xl text-4xl font-black leading-tight sm:text-5xl">Browse by feeling, room, recipe or place.</h1>
        <p className="mt-3 max-w-xl text-sm text-gray-700 sm:text-base">No login, no ads, no algorithm hiding the good stuff.</p>
        <Link href="/create-pin" className="mt-5 inline-flex rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white">Create from a free image</Link>
      </div>

      <div className="scrollbar-hide -mx-3 mt-6 flex gap-2 overflow-x-auto px-3 pb-1 sm:mx-0 sm:px-0">
        {categories.map((item) => (
          <button key={item.name} onClick={() => setCategory(item.name)} className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${category === item.name ? "bg-ink text-white" : "bg-white text-gray-700 ring-1 ring-gray-200"}`}>
            {item.name} <span className="text-xs opacity-60">{item.count}</span>
          </button>
        ))}
      </div>

      <div className="mt-5">
        {loading ? <LoadingSpinner size="lg" /> : <PinGrid pins={pins} onSave={setSavingPin} emptyTitle="No pins in this category" emptyHint="Try another category." />}
      </div>
      {savingPin && <SaveToBoardModal pin={savingPin} onClose={() => setSavingPin(null)} onSaved={(updated) => setPins((items) => items.map((pin) => pin._id === updated._id ? { ...pin, ...updated } : pin))} />}
    </div>
  );
}
