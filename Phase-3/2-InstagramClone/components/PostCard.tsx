"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { IoHeart, IoHeartOutline, IoChatbubbleOutline, IoPaperPlaneOutline, IoBookmark, IoBookmarkOutline, IoEllipsisHorizontal } from "react-icons/io5";
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";
import type { Post } from "@/types";
import { postApi } from "@/services";

interface Props {
  post: Post;
  onChange?: (post: Post) => void;
}

export default function PostCard({ post, onChange }: Props) {
  const [liked, setLiked] = useState(post.liked);
  const [likes, setLikes] = useState(post.likesCount);
  const [saved, setSaved] = useState(post.saved);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setLiked(post.liked);
    setLikes(post.likesCount);
    setSaved(post.saved);
  }, [post]);

  const like = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const result = await postApi.like(post._id);
      setLiked(result.liked);
      setLikes(result.likesCount);
      onChange?.({ ...post, liked: result.liked, likesCount: result.likesCount });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setBusy(false);
    }
  };

  const save = async () => {
    try {
      const result = await postApi.save(post._id);
      setSaved(result.saved);
      onChange?.({ ...post, saved: result.saved });
      toast.success(result.saved ? "Saved" : "Removed from saved");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const share = async () => {
    const url = `${window.location.origin}/p/${post._id}`;
    if (navigator.share) {
      try { await navigator.share({ title: post.caption || "Post", url }); return; } catch { return; }
    }
    await navigator.clipboard.writeText(url);
    toast.success("Link copied");
  };

  return (
    <article className="ig-card post-card">
      <header className="post-head">
        <Link href={`/u/${post.author.username}`} className="ig-avatar" style={{ width: 38, height: 38, padding: 2, background: "linear-gradient(45deg,#833ab4,#e1306c,#f77737)" }}>
          <span style={{ width: "100%", height: "100%", borderRadius: "50%", overflow: "hidden", background: "#fff", padding: 2, display: "block" }}>
            {post.author.avatar ? <img src={post.author.avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} /> : <span style={{ display: "grid", placeItems: "center", height: "100%", fontSize: 13 }}>{post.author.username[0].toUpperCase()}</span>}
          </span>
        </Link>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Link href={`/u/${post.author.username}`} style={{ fontWeight: 700, fontSize: 14 }}>{post.author.username}</Link>
          {post.location && <div style={{ fontSize: 12, color: "var(--muted)" }}>{post.location}</div>}
        </div>
        <Link href={`/p/${post._id}`} className="ig-icon-btn" aria-label="Open post"><IoEllipsisHorizontal size={22} /></Link>
      </header>

      <Link href={`/p/${post._id}`} className="post-media" onDoubleClick={like} aria-label={post.altText || post.caption || "Post"}>
        {post.type === "video" && post.videoUrl ? (
          <video src={post.videoUrl} poster={post.imageUrl} muted loop playsInline controls={false} />
        ) : (
          <img src={post.imageUrl} alt={post.altText || post.caption || "Post image"} loading="lazy" />
        )}
      </Link>

      <div className="post-actions">
        <button className="ig-icon-btn" onClick={like} aria-label={liked ? "Unlike" : "Like"}>
          {liked ? <IoHeart size={26} color="var(--danger)" /> : <IoHeartOutline size={26} />}
        </button>
        <Link href={`/p/${post._id}`} className="ig-icon-btn" aria-label="Comments"><IoChatbubbleOutline size={24} /></Link>
        <button className="ig-icon-btn" onClick={share} aria-label="Share"><IoPaperPlaneOutline size={24} /></button>
        <button className="ig-icon-btn" onClick={save} aria-label={saved ? "Unsave" : "Save"} style={{ marginLeft: "auto" }}>
          {saved ? <IoBookmark size={24} /> : <IoBookmarkOutline size={24} />}
        </button>
      </div>

      <div className="post-body">
        <div style={{ fontWeight: 700, fontSize: 14 }}>{likes.toLocaleString()} likes</div>
        {post.caption && (
          <p className="post-caption">
            <Link href={`/u/${post.author.username}`} style={{ fontWeight: 700, marginRight: 6 }}>{post.author.username}</Link>
            {post.caption}
          </p>
        )}
        {post.commentsCount > 0 && <Link href={`/p/${post._id}`} className="post-comments-link">View all {post.commentsCount} comments</Link>}
        <div className="post-meta">{formatDistanceToNow(new Date(post.createdAt))} ago</div>
      </div>
    </article>
  );
}
