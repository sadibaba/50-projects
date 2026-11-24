"use client";

import React, { useEffect, useState } from "react";
import { IoCloseOutline, IoAddOutline, IoLockClosedOutline } from "react-icons/io5";
import toast from "react-hot-toast";
import { Board, Pin } from "@/types";
import { boardService } from "@/services/board.service";
import { pinService } from "@/services/pin.service";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface Props {
  pin: Pin;
  onClose: () => void;
  onSaved: (pin: Pin) => void;
}

export default function SaveToBoardModal({ pin, onClose, onSaved }: Props) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [selected, setSelected] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      onClose();
      return;
    }
    boardService.list({ mine: 1 })
      .then((data) => {
        setBoards(data);
        setSelected(data[0]?._id || "");
      })
      .catch(() => toast.error("Could not load your boards"))
      .finally(() => setLoading(false));
    // The modal is mounted only when opened, so this should run once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const createBoard = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return;
    setCreating(true);
    try {
      const board = await boardService.create({ name: name.trim() });
      setBoards((items) => [board, ...items]);
      setSelected(board._id);
      setName("");
      toast.success("Board created");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setCreating(false);
    }
  };

  const save = async (boardId?: string) => {
    setSaving(true);
    try {
      const data = await pinService.save(pin._id, boardId);
      onSaved({ ...pin, saved: data.saved, savesCount: data.savesCount });
      toast.success(boardId ? "Saved to board" : "Pin saved");
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Could not save pin");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-black/50 p-4" onClick={onClose}>
      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold">Save to board</h2>
            <p className="line-clamp-1 text-xs text-gray-500">{pin.title}</p>
          </div>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full hover:bg-gray-100" aria-label="Close">
            <IoCloseOutline size={22} />
          </button>
        </div>

        <div className="max-h-[55vh] overflow-y-auto p-3">
          {loading ? (
            <div className="space-y-2 p-2">
              {[...Array(3)].map((_, index) => <div key={index} className="h-14 animate-pulse rounded-xl bg-gray-100" />)}
            </div>
          ) : (
            <>
              {boards.map((board) => (
                <button
                  key={board._id}
                  onClick={() => setSelected(board._id)}
                  className={`flex w-full items-center gap-3 rounded-xl p-2 text-left transition ${selected === board._id ? "bg-gray-100" : "hover:bg-gray-50"}`}
                >
                  <span className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-lg bg-gray-200">
                    {board.cover ? <img src={board.cover} alt="" className="h-full w-full object-cover" /> : <span className="font-bold text-gray-400">{board.name[0]}</span>}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1 font-medium">{board.name} {board.isSecret && <IoLockClosedOutline size={13} />}</span>
                    <span className="text-xs text-gray-500">{board.pinsCount} pins</span>
                  </span>
                  <span className={`h-4 w-4 rounded-full border-2 ${selected === board._id ? "border-brand bg-brand" : "border-gray-300"}`} />
                </button>
              ))}
              {boards.length === 0 && <p className="px-2 py-4 text-sm text-gray-500">You have no boards yet. Create one below.</p>}
            </>
          )}
        </div>

        <div className="border-t border-gray-100 p-4">
          <form onSubmit={createBoard} className="flex gap-2">
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="New board name"
              maxLength={60}
              className="min-w-0 flex-1 rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand"
            />
            <button type="submit" disabled={creating} className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-ink text-white disabled:opacity-50" aria-label="Create board">
              <IoAddOutline size={20} />
            </button>
          </form>
          <button
            onClick={() => save(selected || undefined)}
            disabled={saving || (!selected && boards.length > 0)}
            className="mt-3 w-full rounded-xl bg-brand py-3 text-sm font-bold text-white hover:bg-brand-dark disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save pin"}
          </button>
        </div>
      </div>
    </div>
  );
}
