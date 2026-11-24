"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { IoArrowBackOutline, IoLockClosedOutline, IoShareSocialOutline, IoTrashOutline } from "react-icons/io5";
import { useAuth } from "@/context/AuthContext";
import { boardService } from "@/services/board.service";
import { Board, Pin } from "@/types";
import PinGrid from "@/components/pins/PinGrid";
import SaveToBoardModal from "@/components/pins/SaveToBoardModal";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import toast from "react-hot-toast";

export default function BoardPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [board, setBoard] = useState<Board | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingPin, setSavingPin] = useState<Pin | null>(null);

  useEffect(() => {
    boardService.get(id).then(setBoard).catch(() => toast.error("Board not found")).finally(() => setLoading(false));
  }, [id]);

  const removeBoard = async () => {
    if (!board || !window.confirm("Delete this board? Pins stay in your profile.")) return;
    try {
      await boardService.remove(board._id);
      toast.success("Board deleted");
      router.push("/boards");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const share = async () => {
    if (!board) return;
    const url = `${window.location.origin}/board/${board._id}`;
    if (navigator.share) {
      try { await navigator.share({ title: board.name, url }); return; } catch { return; }
    }
    await navigator.clipboard.writeText(url);
    toast.success("Board link copied");
  };

  if (loading) return <LoadingSpinner size="lg" />;
  if (!board) return <div className="py-24 text-center font-semibold">Board not found</div>;

  const isOwner = user?._id === board.createdBy?._id;

  return (
    <div className="mx-auto max-w-6xl px-3 py-5 sm:px-5">
      <button onClick={() => router.back()} className="mb-4 inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"><IoArrowBackOutline /> Back</button>
      <div className="rounded-3xl bg-gradient-to-br from-[#fff0f2] to-[#eef7ff] p-6 text-center sm:p-10">
        <h1 className="flex items-center justify-center gap-2 text-3xl font-black sm:text-4xl">{board.name} {board.isSecret && <IoLockClosedOutline size={20} />}</h1>
        {board.description && <p className="mx-auto mt-2 max-w-xl text-sm text-gray-600">{board.description}</p>}
        <p className="mt-2 text-xs text-gray-500">{board.pinsCount} pins · by @{board.createdBy?.username}</p>
        <div className="mt-4 flex justify-center gap-2">
          <button onClick={share} className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold shadow-sm"><IoShareSocialOutline /> Share</button>
          {isOwner && <button onClick={removeBoard} className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-red-600 shadow-sm"><IoTrashOutline /> Delete</button>}
        </div>
      </div>

      <div className="mt-6">
        <PinGrid pins={board.pins || []} onSave={setSavingPin} emptyTitle="This board is empty" emptyHint="Save pins to this board from any pin." />
      </div>
      {savingPin && <SaveToBoardModal pin={savingPin} onClose={() => setSavingPin(null)} onSaved={() => boardService.get(id).then(setBoard)} />}
    </div>
  );
}
