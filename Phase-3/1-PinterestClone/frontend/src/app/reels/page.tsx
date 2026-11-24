"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { IoHeart, IoHeartOutline, IoBookmark, IoShareSocialOutline, IoChatbubbleOutline, IoVolumeMuteOutline } from "react-icons/io5";
import { pinService } from "@/services/pin.service";
import { Pin } from "@/types";
import SaveToBoardModal from "@/components/pins/SaveToBoardModal";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { sharePin } from "@/lib/share";
import toast from "react-hot-toast";

export default function ReelsPage() {
  const [pins, setPins] = useState<Pin[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingPin, setSavingPin] = useState<Pin | null>(null);

  useEffect(() => {
    pinService.list({ type: "video", limit: 20 })
      .then((data) => setPins(data.pins))
      .catch(() => setPins([]))
      .finally(() => setLoading(false));
  }, []);

  const like = async (pin: Pin) => {
    try {
      const data = pin.liked ? await pinService.unlike(pin._id) : await pinService.like(pin._id);
      setPins((items) => items.map((item) => item._id === pin._id ? { ...item, liked: data.liked, likesCount: data.likesCount } : item));
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (loading) return <LoadingSpinner size="lg" />;

  if (pins.length === 0) {
    return <div className="grid min-h-[70vh] place-items-center px-4 text-center"><div><h1 className="text-3xl font-black">Reels are loading</h1><p className="mt-2 text-gray-500">Create a video pin to start the vertical feed.</p></div></div>;
  }

  return (
    <div className="reel-scroll h-[calc(100dvh-64px)] snap-y snap-mandatory overflow-y-auto bg-black pb-16 md:pb-0">
      {pins.map((pin) => (
        <section key={pin._id} className="reel-slide relative mx-auto flex h-[calc(100dvh-64px)] max-w-[520px] items-end justify-center overflow-hidden">
          {pin.videoUrl ? (
            <video
              src={pin.videoUrl}
              poster={pin.posterUrl || pin.imageUrl}
              autoPlay
              muted
              loop
              playsInline
              controls={false}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <img src={pin.imageUrl} alt={pin.title} className="absolute inset-0 h-full w-full object-cover" />
          )}
          <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/20" />

          <div className="relative z-10 flex w-full items-end justify-between gap-4 p-5 pb-8 text-white">
            <div className="min-w-0">
              <Link href={`/profile/${pin.createdBy?.username}`} className="flex items-center gap-2 text-sm font-semibold">
                <span className="grid h-9 w-9 place-items-center overflow-hidden rounded-full bg-white/20">
                  {pin.createdBy?.avatar ? <img src={pin.createdBy.avatar} alt="" className="h-full w-full object-cover" /> : pin.createdBy?.username?.[0]?.toUpperCase()}
                </span>
                @{pin.createdBy?.username}
              </Link>
              <h2 className="mt-3 line-clamp-2 text-xl font-bold">{pin.title}</h2>
              <p className="mt-1 line-clamp-2 text-sm text-white/70">{pin.description}</p>
              <Link href={`/pin/${pin._id}`} className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium backdrop-blur">
                <IoChatbubbleOutline /> {pin.commentsCount} comments
              </Link>
            </div>

            <div className="flex shrink-0 flex-col items-center gap-4">
              <button onClick={() => like(pin)} className="flex flex-col items-center gap-1 text-xs" aria-label="Like">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-white/15 backdrop-blur">
                  {pin.liked ? <IoHeart className="text-brand" size={24} /> : <IoHeartOutline size={24} />}
                </span>
                {pin.likesCount}
              </button>
              <button onClick={() => setSavingPin(pin)} className="flex flex-col items-center gap-1 text-xs" aria-label="Save">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-white/15 backdrop-blur"><IoBookmark size={22} /></span>
                {pin.savesCount}
              </button>
              <button onClick={async () => { const result = await sharePin(pin._id, pin.title); if (result === "copied") toast.success("Link copied"); }} className="flex flex-col items-center gap-1 text-xs" aria-label="Share">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-white/15 backdrop-blur"><IoShareSocialOutline size={22} /></span>
                Share
              </button>
              <span className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white/70" title="Muted by default"><IoVolumeMuteOutline size={16} /></span>
            </div>
          </div>
        </section>
      ))}
      {savingPin && <SaveToBoardModal pin={savingPin} onClose={() => setSavingPin(null)} onSaved={(updated) => setPins((items) => items.map((pin) => pin._id === updated._id ? { ...pin, ...updated } : pin))} />}
    </div>
  );
}
