"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { IoAddOutline, IoLockClosedOutline } from "react-icons/io5";
import { useAuth } from "@/context/AuthContext";
import { boardService } from "@/services/board.service";
import { Board } from "@/types";
import Button from "@/components/common/Button";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import toast from "react-hot-toast";

export default function BoardsPage() {
  const { isAuthenticated, loading } = useAuth();
  const [boards, setBoards] = useState<Board[]>([]);
  const [fetching, setFetching] = useState(true);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [secret, setSecret] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setFetching(true);
    try {
      setBoards(await boardService.list(isAuthenticated ? { mine: 1 } : {}));
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => { if (!loading) load(); }, [loading, isAuthenticated]);

  const create = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      const board = await boardService.create({ name: name.trim(), description: description.trim(), isSecret: secret });
      setBoards((items) => [board, ...items]);
      setOpen(false);
      setName("");
      setDescription("");
      setSecret(false);
      toast.success("Board created");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-3 py-6 sm:px-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black tracking-tight">{isAuthenticated ? "Your boards" : "Public boards"}</h1>
          <p className="mt-1 text-sm text-gray-500">{isAuthenticated ? "Group ideas the way you think about them." : "See how other people organise their ideas."}</p>
        </div>
        {isAuthenticated && <Button onClick={() => setOpen(true)}><IoAddOutline /> New board</Button>}
      </div>

      {fetching ? <LoadingSpinner size="lg" /> : boards.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-dashed border-gray-300 p-12 text-center">
          <p className="text-lg font-semibold">No boards yet</p>
          <p className="mt-1 text-sm text-gray-500">Create a board for a trip, a room, a project or anything else.</p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {boards.map((board) => (
            <Link key={board._id} href={`/board/${board._id}`} className="group overflow-hidden rounded-2xl border border-gray-200 bg-white hover:shadow-md">
              <div className="grid h-44 grid-cols-2 gap-0.5 bg-gray-100">
                {board.pins?.slice(0, 4).map((pin: any) => <img key={pin._id} src={pin.imageUrl} alt="" className="h-[86px] w-full object-cover" />)}
                {(!board.pins || board.pins.length === 0) && <div className="col-span-2 grid place-items-center text-sm text-gray-400">Empty board</div>}
              </div>
              <div className="p-4">
                <h2 className="flex items-center gap-1.5 font-semibold">{board.name} {board.isSecret && <IoLockClosedOutline size={13} />}</h2>
                <p className="text-xs text-gray-500">{board.pinsCount} pins {board.createdBy?.username && <>· @{board.createdBy.username}</>}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-black/50 p-4" onClick={() => setOpen(false)}>
          <form onSubmit={create} className="w-full max-w-md rounded-3xl bg-white p-6" onClick={(event) => event.stopPropagation()}>
            <h2 className="text-xl font-bold">Create board</h2>
            <div className="mt-4 space-y-3">
              <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Board name" maxLength={60} required className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-brand" />
              <textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="What is this board for?" rows={3} maxLength={300} className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-brand" />
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={secret} onChange={(event) => setSecret(event.target.checked)} /> Keep this board private</label>
            </div>
            <div className="mt-5 flex gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} fullWidth>Cancel</Button>
              <Button type="submit" loading={saving} fullWidth>Create</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
