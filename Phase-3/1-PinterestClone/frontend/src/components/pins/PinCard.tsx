"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { IoHeart, IoHeartOutline, IoBookmark, IoBookmarkOutline, IoShareSocialOutline, IoChatbubbleOutline, IoPlay } from "react-icons/io5";
import toast from "react-hot-toast";
import { Pin } from "@/types";
import { pinService } from "@/services/pin.service";
import { sharePin } from "@/lib/share";

interface PinCardProps {
  pin: Pin;
  onSave: (pin: Pin) => void;
}

export default function PinCard({ pin, onSave }: PinCardProps) {
  const [liked, setLiked] = useState(Boolean(pin.liked));
  const [saved, setSaved] = useState(Boolean(pin.saved));
  const [likes, setLikes] = useState(pin.likesCount ?? pin.likes?.length ?? 0);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setLiked(Boolean(pin.liked));
    setSaved(Boolean(pin.saved));
    setLikes(pin.likesCount ?? pin.likes?.length ?? 0);
  }, [pin]);

  const like = async (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (busy) return;
    setBusy(true);
    try {
      const data = liked ? await pinService.unlike(pin._id) : await pinService.like(pin._id);
      setLiked(data.liked);
      setLikes(data.likesCount);
    } catch (error: any) {
      toast.error(error.message || "Sign in to like pins");
    } finally {
      setBusy(false);
    }
  };

  const save = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    onSave(pin);
  };

  const share = async (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    try {
      const result = await sharePin(pin._id, pin.title);
      if (result === "copied") toast.success("Link copied");
    } catch {
      toast.error("Could not share this pin");
    }
  };

  return (
    <article className="masonry-item">
      <div className="group relative overflow-hidden rounded-2xl bg-gray-100">
        <Link href={`/pin/${pin._id}`} aria-label={pin.title}>
          <img
            src={pin.imageUrl}
            alt={pin.title}
            loading="lazy"
            style={{ aspectRatio: `${pin.width || 600} / ${pin.height || 900}` }}
            className="w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
          <span className="absolute inset-0 bg-black/20 opacity-0 transition group-hover:opacity-100" />
        </Link>

        {pin.type === "video" && (
          <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
            <IoPlay size={10} /> Reel
          </span>
        )}

        <div className="absolute inset-x-2 top-2 flex justify-end gap-1.5 opacity-0 transition group-hover:opacity-100">
          <button onClick={share} className="grid h-9 w-9 place-items-center rounded-full bg-white/95 shadow hover:bg-white" aria-label="Share pin">
            <IoShareSocialOutline size={17} />
          </button>
          <button onClick={save} className="rounded-full bg-brand px-4 py-2 text-sm font-bold text-white shadow hover:bg-brand-dark">
            {saved ? "Saved" : "Save"}
          </button>
        </div>

        <button
          onClick={like}
          className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold shadow hover:bg-white"
          aria-label={liked ? "Unlike" : "Like"}
        >
          {liked ? <IoHeart className="text-brand" size={16} /> : <IoHeartOutline size={16} />}
          {likes}
        </button>
        {pin.saved && (
          <span className="absolute bottom-2 right-2 grid h-7 w-7 place-items-center rounded-full bg-ink text-white" title="Saved">
            <IoBookmark size={14} />
          </span>
        )}
      </div>

      <div className="px-1 pt-2">
        <Link href={`/pin/${pin._id}`} className="line-clamp-1 text-sm font-semibold hover:underline">{pin.title}</Link>
        <div className="mt-1 flex items-center justify-between gap-2">
          <Link href={`/profile/${pin.createdBy?.username}`} className="flex min-w-0 items-center gap-1.5 text-xs text-gray-600 hover:text-ink">
            <span className="grid h-5 w-5 shrink-0 place-items-center overflow-hidden rounded-full bg-gray-200 text-[9px] font-bold">
              {pin.createdBy?.avatar ? <img src={pin.createdBy.avatar} alt="" className="h-full w-full object-cover" /> : pin.createdBy?.username?.[0]?.toUpperCase()}
            </span>
            <span className="truncate">{pin.createdBy?.name || pin.createdBy?.username || "Creator"}</span>
          </Link>
          <span className="flex shrink-0 items-center gap-1 text-xs text-gray-500">
            <IoChatbubbleOutline size={13} /> {pin.commentsCount ?? 0}
          </span>
        </div>
      </div>
    </article>
  );
}
