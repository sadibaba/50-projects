"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { discoverService } from "@/services/discover.service";
import { Pin, User } from "@/types";
import PinGrid from "@/components/pins/PinGrid";
import SaveToBoardModal from "@/components/pins/SaveToBoardModal";
import LoadingSpinner from "@/components/common/LoadingSpinner";

type BoardResult = { _id: string; name: string; cover: string; pinsCount: number; createdBy?: User };

function SearchResults() {
  const params = useSearchParams();
  const q = params.get("q") || "";
  const [pins, setPins] = useState<Pin[]>([]);
  const [boards, setBoards] = useState<BoardResult[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [tab, setTab] = useState<"pins" | "boards" | "people">("pins");
  const [loading, setLoading] = useState(true);
  const [savingPin, setSavingPin] = useState<Pin | null>(null);

  useEffect(() => {
    if (!q) {
      setLoading(false);
      return;
    }
    setLoading(true);
    discoverService.search(q)
      .then((data) => {
        setPins(data.pins as Pin[]);
        setBoards(data.boards as BoardResult[]);
        setUsers(data.users as User[]);
      })
      .catch(() => {
        setPins([]);
        setBoards([]);
        setUsers([]);
      })
      .finally(() => setLoading(false));
  }, [q]);

  if (!q) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-3xl font-black">Search for an idea</h1>
        <p className="mt-2 text-gray-500">Try “small kitchen”, “weekend travel”, “desk setup” or a creator name.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {["small kitchen", "weekend travel", "desk setup", "autumn fashion", "plants"].map((term) => (
            <Link key={term} href={`/search?q=${encodeURIComponent(term)}`} className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium hover:bg-gray-200">{term}</Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1600px] px-3 py-5 sm:px-5">
      <h1 className="text-2xl font-black sm:text-3xl">Results for “{q}”</h1>
      <div className="mt-4 flex gap-1 border-b border-gray-200">
        {(["pins", "boards", "people"] as const).map((value) => (
          <button key={value} onClick={() => setTab(value)} className={`border-b-2 px-4 py-3 text-sm font-semibold capitalize ${tab === value ? "border-ink text-ink" : "border-transparent text-gray-500"}`}>
            {value} {value === "pins" ? `(${pins.length})` : value === "boards" ? `(${boards.length})` : `(${users.length})`}
          </button>
        ))}
      </div>

      <div className="mt-5">
        {loading ? <LoadingSpinner size="lg" /> : tab === "pins" ? (
          <PinGrid pins={pins} onSave={setSavingPin} emptyTitle="No pins matched" emptyHint="Try a broader search or create a pin from a free image." />
        ) : tab === "boards" ? (
          boards.length === 0 ? <p className="rounded-2xl bg-white p-8 text-center text-gray-500">No boards matched.</p> : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {boards.map((board) => (
                <Link key={board._id} href={`/board/${board._id}`} className="overflow-hidden rounded-2xl border border-gray-200 bg-white hover:shadow-md">
                  <div className="h-32 bg-gray-100">{board.cover && <img src={board.cover} alt="" className="h-full w-full object-cover" />}</div>
                  <div className="p-4"><h2 className="font-semibold">{board.name}</h2><p className="text-xs text-gray-500">{board.pinsCount} pins · @{board.createdBy?.username}</p></div>
                </Link>
              ))}
            </div>
          )
        ) : (
          users.length === 0 ? <p className="rounded-2xl bg-white p-8 text-center text-gray-500">No people matched.</p> : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {users.map((user) => (
                <Link key={user._id} href={`/profile/${user.username}`} className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 hover:shadow-md">
                  <span className="grid h-12 w-12 place-items-center overflow-hidden rounded-full bg-gray-200 font-bold">{user.avatar ? <img src={user.avatar} alt="" className="h-full w-full object-cover" /> : user.username[0].toUpperCase()}</span>
                  <span><span className="block font-semibold">{user.name || user.username}</span><span className="block text-xs text-gray-500">@{user.username} · {user.followers?.length || 0} followers</span></span>
                </Link>
              ))}
            </div>
          )
        )}
      </div>
      {savingPin && <SaveToBoardModal pin={savingPin} onClose={() => setSavingPin(null)} onSaved={(updated) => setPins((items) => items.map((pin) => pin._id === updated._id ? { ...pin, ...updated } : pin))} />}
    </div>
  );
}

export default function SearchPage() {
  return <Suspense fallback={<LoadingSpinner size="lg" />}><SearchResults /></Suspense>;
}
