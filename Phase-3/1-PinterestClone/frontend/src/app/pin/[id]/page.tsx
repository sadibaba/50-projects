"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { IoArrowBackOutline, IoHeart, IoHeartOutline, IoBookmark, IoBookmarkOutline, IoShareSocialOutline, IoDownloadOutline, IoChatbubbleOutline, IoEyeOutline } from "react-icons/io5";
import { useAuth } from "@/context/AuthContext";
import { pinService } from "@/services/pin.service";
import { Pin } from "@/types";
import Button from "@/components/common/Button";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import Comments from "@/components/comments/Comments";
import PinGrid from "@/components/pins/PinGrid";
import SaveToBoardModal from "@/components/pins/SaveToBoardModal";
import { downloadImage, sharePin } from "@/lib/share";
import toast from "react-hot-toast";

export default function PinDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [pin, setPin] = useState<Pin | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingPin, setSavingPin] = useState<Pin | null>(null);
  const [saveOpen, setSaveOpen] = useState(false);

  useEffect(() => {
    pinService.get(id)
      .then(setPin)
      .catch(() => toast.error("Pin not found"))
      .finally(() => setLoading(false));
  }, [id]);

  const toggleLike = async () => {
    if (!pin) return;
    try {
      const data = pin.liked ? await pinService.unlike(pin._id) : await pinService.like(pin._id);
      setPin({ ...pin, liked: data.liked, likesCount: data.likesCount });
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const share = async () => {
    if (!pin) return;
    const result = await sharePin(pin._id, pin.title);
    if (result === "copied") toast.success("Link copied");
  };

  if (loading) return <LoadingSpinner size="lg" />;
  if (!pin) return <div className="py-24 text-center"><h1 className="text-2xl font-bold">Pin not found</h1><Button onClick={() => router.push("/")} className="mt-4">Go home</Button></div>;

  return (
    <div className="mx-auto max-w-6xl px-3 py-4 sm:px-5 sm:py-8">
      <button onClick={() => router.back()} className="mb-4 inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100">
        <IoArrowBackOutline /> Back
      </button>

      <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm lg:grid lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative bg-gray-100">
          {pin.type === "video" && pin.videoUrl ? (
            <video src={pin.videoUrl} poster={pin.posterUrl || pin.imageUrl} controls playsInline className="max-h-[80vh] w-full bg-black object-contain" />
          ) : (
            <img src={pin.imageUrl} alt={pin.title} className="max-h-[80vh] w-full object-contain" />
          )}
        </div>

        <div className="flex flex-col p-5 sm:p-7">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button onClick={share} className="grid h-10 w-10 place-items-center rounded-full hover:bg-gray-100" aria-label="Share"><IoShareSocialOutline size={21} /></button>
              <button onClick={() => downloadImage(pin.imageUrl, pin.title)} className="grid h-10 w-10 place-items-center rounded-full hover:bg-gray-100" aria-label="Download"><IoDownloadOutline size={21} /></button>
              <button onClick={toggleLike} className="flex items-center gap-1.5 rounded-full px-3 py-2 hover:bg-gray-100" aria-label="Like">
                {pin.liked ? <IoHeart className="text-brand" size={21} /> : <IoHeartOutline size={21} />} {pin.likesCount}
              </button>
            </div>
            <Button onClick={() => isAuthenticated ? setSaveOpen(true) : router.push("/login")} size="sm">
              {pin.saved ? <><IoBookmark /> Saved</> : "Save"}
            </Button>
          </div>

          <div className="mt-5 flex items-center gap-2 text-xs text-gray-500">
            <span className="flex items-center gap-1"><IoEyeOutline /> {pin.views} views</span>
            <span>·</span>
            <span className="rounded-full bg-gray-100 px-2 py-1 font-medium text-gray-700">{pin.category}</span>
          </div>

          <h1 className="mt-3 text-3xl font-black leading-tight">{pin.title}</h1>
          {pin.description && <p className="mt-3 whitespace-pre-line text-sm leading-6 text-gray-600">{pin.description}</p>}

          <Link href={`/profile/${pin.createdBy?.username}`} className="mt-5 flex items-center gap-3 rounded-2xl p-2 hover:bg-gray-50">
            <span className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full bg-gray-200 font-bold">
              {pin.createdBy?.avatar ? <img src={pin.createdBy.avatar} alt="" className="h-full w-full object-cover" /> : pin.createdBy?.username?.[0]?.toUpperCase()}
            </span>
            <span>
              <span className="block text-sm font-semibold">{pin.createdBy?.name || pin.createdBy?.username}</span>
              <span className="block text-xs text-gray-500">@{pin.createdBy?.username}</span>
            </span>
          </Link>

          {pin.tags?.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {pin.tags.map((tag) => (
                <Link key={tag} href={`/search?q=${encodeURIComponent(tag)}`} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200">#{tag}</Link>
              ))}
            </div>
          )}

          <div className="mt-5 flex items-center gap-2 text-xs text-gray-500">
            <IoChatbubbleOutline /> {pin.commentsCount} comments
            {pin.sourceUrl && <>· <a href={pin.sourceUrl} target="_blank" rel="noreferrer" className="underline">Source: {pin.sourceName}</a></>}
          </div>

          <div className="mt-6 border-t border-gray-100 pt-5">
            <Comments pinId={pin._id} />
          </div>
        </div>
      </div>

      {pin.related && pin.related.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-xl font-bold">More like this</h2>
          <PinGrid pins={pin.related} onSave={setSavingPin} />
        </section>
      )}

      {saveOpen && <SaveToBoardModal pin={pin} onClose={() => setSaveOpen(false)} onSaved={(updated) => setPin({ ...pin, ...updated })} />}
      {savingPin && <SaveToBoardModal pin={savingPin} onClose={() => setSavingPin(null)} onSaved={(updated) => setPin((current) => current ? { ...current, related: current.related?.map((item) => item._id === updated._id ? { ...item, ...updated } : item) } : current)} />}
    </div>
  );
}
