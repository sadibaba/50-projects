"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { IoHeart, IoHeartOutline, IoBookmark, IoBookmarkOutline, IoChatbubbleOutline, IoPaperPlaneOutline, IoPlay, IoPause, IoVolumeMuteOutline, IoVolumeHighOutline } from "react-icons/io5";
import toast from "react-hot-toast";
import { postApi } from "@/services";
import type { Post } from "@/types";

export default function ReelsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingPin, setSavingPin] = useState<string | null>(null);

  useEffect(() => {
    postApi.list({ type: "video", limit: 20 }).then((data) => setPosts(data.posts)).finally(() => setLoading(false));
  }, []);

  const like = async (post: Post) => {
    try {
      const result = await postApi.like(post._id);
      setPosts((items) => items.map((item) => item._id === post._id ? { ...item, liked: result.liked, likesCount: result.likesCount } : item));
    } catch (error: any) { toast.error(error.message); }
  };

  const save = async (post: Post) => {
    setSavingPin(post._id);
    try {
      const result = await postApi.save(post._id);
      setPosts((items) => items.map((item) => item._id === post._id ? { ...item, saved: result.saved } : item));
      toast.success(result.saved ? "Saved" : "Removed from saved");
    } catch (error: any) { toast.error(error.message); }
    finally { setSavingPin(null); }
  };

  const share = async (post: Post) => {
    const url = `${window.location.origin}/p/${post._id}`;
    if (navigator.share) {
      try { await navigator.share({ title: post.caption || "Reel", url }); return; } catch { return; }
    }
    await navigator.clipboard.writeText(url);
    toast.success("Link copied");
  };

  if (loading) return <div className="spinner" style={{ paddingTop: 100 }} />;
  if (posts.length === 0) return <div className="empty" style={{ paddingTop: 120 }}><h2 style={{ color: "var(--text)" }}>No reels yet</h2><p>Create a post with a video URL to fill this feed.</p><Link href="/create" className="ig-btn primary" style={{ display: "inline-block", marginTop: 12 }}>Create a reel</Link></div>;

  return (
    <div className="reels-page">
      <div className="reel-scroll">
        {posts.map((post) => (
          <Reel key={post._id} post={post} onLike={like} onSave={save} onShare={share} saving={savingPin === post._id} />
        ))}
      </div>
    </div>
  );
}

function Reel({ post, onLike, onSave, onShare, saving }: { post: Post; onLike: (post: Post) => void; onSave: (post: Post) => void; onShare: (post: Post) => void; saving: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(true);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
      setPaused(false);
    } else {
      video.pause();
      setPaused(true);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

  return (
    <section className="reel">
      <div className="reel-media">
        {post.videoUrl ? (
          <video ref={videoRef} src={post.videoUrl} poster={post.imageUrl} autoPlay muted loop playsInline />
        ) : (
          <img src={post.imageUrl} alt={post.altText || post.caption} />
        )}
      </div>
      <div className="reel-overlay" />

      {post.videoUrl && (
        <>
          <button className="reel-play" onClick={togglePlay} aria-label={paused ? "Play reel" : "Pause reel"}>
            {paused && <span><IoPlay size={28} /></span>}
          </button>
          <button className="reel-mute" onClick={toggleMute} aria-label={muted ? "Unmute reel" : "Mute reel"}>
            {muted ? <IoVolumeMuteOutline size={20} /> : <IoVolumeHighOutline size={20} />}
          </button>
        </>
      )}

      <div className="reel-content">
        <div className="reel-copy">
          <Link href={`/u/${post.author.username}`} style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: 14 }}>
            <span className="ig-avatar" style={{ width: 36, height: 36, border: "1px solid rgba(255,255,255,.5)", background: "rgba(255,255,255,.2)", color: "#fff" }}>
              {post.author.avatar ? <img src={post.author.avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : post.author.username[0].toUpperCase()}
            </span>
            @{post.author.username}
          </Link>
          <p style={{ margin: "10px 0 6px", fontSize: 14, lineHeight: 1.45, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{post.caption}</p>
          <Link href={`/p/${post._id}`} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, background: "rgba(255,255,255,.16)", padding: "6px 10px", borderRadius: 999 }}>
            <IoChatbubbleOutline /> {post.commentsCount} comments
          </Link>
        </div>

        <div className="reel-actions">
          <button className="reel-action" onClick={() => onLike(post)} aria-label="Like">{post.liked ? <IoHeart color="#ed4956" size={23} /> : <IoHeartOutline size={23} />}</button>
          <span>{post.likesCount}</span>
          <button className="reel-action" onClick={() => onSave(post)} disabled={saving} aria-label="Save">{post.saved ? <IoBookmark size={22} /> : <IoBookmarkOutline size={22} />}</button>
          <button className="reel-action" onClick={() => onShare(post)} aria-label="Share"><IoPaperPlaneOutline size={22} /></button>
        </div>
      </div>
    </section>
  );
}
