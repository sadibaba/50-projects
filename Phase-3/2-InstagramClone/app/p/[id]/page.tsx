"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { IoArrowBack, IoHeart, IoHeartOutline, IoBookmark, IoBookmarkOutline, IoPaperPlaneOutline, IoDownloadOutline, IoEllipsisHorizontal } from "react-icons/io5";
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { postApi } from "@/services";
import type { Post } from "@/types";
import Comments from "@/components/Comments";

export default function PostPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [caption, setCaption] = useState("");
  const [altText, setAltText] = useState("");
  const [location, setLocation] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    postApi.get(id)
      .then((data) => {
        setPost(data);
        setCaption(data.caption);
        setAltText(data.altText);
        setLocation(data.location);
      })
      .catch(() => toast.error("Post not found"))
      .finally(() => setLoading(false));
  }, [id]);

  const like = async () => {
    if (!post) return;
    try {
      const result = await postApi.like(post._id);
      setPost({ ...post, liked: result.liked, likesCount: result.likesCount });
    } catch (error: any) { toast.error(error.message); }
  };

  const save = async () => {
    if (!post) return;
    try {
      const result = await postApi.save(post._id);
      setPost({ ...post, saved: result.saved });
      toast.success(result.saved ? "Saved" : "Removed from saved");
    } catch (error: any) { toast.error(error.message); }
  };

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: post?.caption || "Post", url }); return; } catch { return; }
    }
    await navigator.clipboard.writeText(url);
    toast.success("Link copied");
  };

  const download = async () => {
    if (!post) return;
    try {
      const response = await fetch(post.imageUrl);
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${post.author.username}-${post._id}.jpg`;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch {
      window.open(post.imageUrl, "_blank", "noopener");
    }
  };

  const remove = async () => {
    if (!post || !window.confirm("Delete this post?")) return;
    try {
      await postApi.remove(post._id);
      toast.success("Post deleted");
      router.push(`/u/${post.author.username}`);
    } catch (error: any) { toast.error(error.message); }
  };

  const update = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!post) return;
    setSaving(true);
    try {
      const updated = await postApi.update(post._id, { caption, altText, location });
      setPost(updated);
      setEditing(false);
      toast.success("Post updated");
    } catch (error: any) { toast.error(error.message); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="spinner" />;
  if (!post) return <div className="empty">Post not found.</div>;

  return (
    <div className="ig-main" style={{ maxWidth: 1000 }}>
      <button onClick={() => router.back()} className="ig-btn" style={{ marginBottom: 12 }}><IoArrowBack style={{ verticalAlign: "middle", marginRight: 5 }} /> Back</button>
      <div className="ig-card" style={{ overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.2fr) minmax(300px, .8fr)" }} className="post-detail-grid">
          <div style={{ background: "#000", display: "grid", placeItems: "center" }}>
            {post.type === "video" && post.videoUrl ? (
              <video src={post.videoUrl} poster={post.imageUrl} controls playsInline style={{ width: "100%", maxHeight: 720, objectFit: "contain" }} />
            ) : (
              <img src={post.imageUrl} alt={post.altText || post.caption || "Post"} style={{ width: "100%", maxHeight: 720, objectFit: "contain" }} />
            )}
          </div>
          <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
            <header style={{ display: "flex", alignItems: "center", gap: 10, padding: 14, borderBottom: "1px solid var(--border)" }}>
              <Link href={`/u/${post.author.username}`} className="ig-avatar" style={{ width: 38, height: 38 }}>
                {post.author.avatar ? <img src={post.author.avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : post.author.username[0].toUpperCase()}
              </Link>
              <Link href={`/u/${post.author.username}`} style={{ fontWeight: 700, flex: 1 }}>{post.author.username}</Link>
              {user?._id === post.author._id && (
                <div style={{ display: "flex", gap: 4 }}>
                  <button className="ig-btn" style={{ padding: "5px 10px", fontSize: 12 }} onClick={() => setEditing(true)}>Edit</button>
                  <button className="ig-btn danger" style={{ padding: "5px 10px", fontSize: 12 }} onClick={remove}>Delete</button>
                </div>
              )}
            </header>

            <div style={{ padding: 14, flex: 1, overflowY: "auto" }}>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, whiteSpace: "pre-line" }}>
                <Link href={`/u/${post.author.username}`} style={{ fontWeight: 700, marginRight: 6 }}>{post.author.username}</Link>
                {post.caption}
              </p>
              {post.tags.length > 0 && <p style={{ color: "#00376b", fontSize: 13, margin: "6px 0 0" }}>{post.tags.map((tag) => `#${tag}`).join(" ")}</p>}
              <p style={{ color: "var(--muted)", fontSize: 12, marginTop: 8 }}>{formatDistanceToNow(new Date(post.createdAt))} ago{post.location ? ` · ${post.location}` : ""}</p>
              <div style={{ borderTop: "1px solid var(--border)", margin: "14px 0" }} />
              <Comments postId={post._id} onCountChange={(count) => setPost((current) => current ? { ...current, commentsCount: count } : current)} />
            </div>

            <div style={{ borderTop: "1px solid var(--border)", padding: "10px 12px" }}>
              <div style={{ display: "flex", gap: 2 }}>
                <button className="ig-icon-btn" onClick={like} aria-label="Like">{post.liked ? <IoHeart size={26} color="var(--danger)" /> : <IoHeartOutline size={26} />}</button>
                <button className="ig-icon-btn" onClick={share} aria-label="Share"><IoPaperPlaneOutline size={24} /></button>
                <button className="ig-icon-btn" onClick={download} aria-label="Download"><IoDownloadOutline size={24} /></button>
                <button className="ig-icon-btn" onClick={save} aria-label="Save" style={{ marginLeft: "auto" }}>{post.saved ? <IoBookmark size={24} /> : <IoBookmarkOutline size={24} />}</button>
              </div>
              <div style={{ fontWeight: 700, fontSize: 14, padding: "2px 4px 0" }}>{post.likesCount.toLocaleString()} likes</div>
            </div>
          </div>
        </div>
      </div>

      {editing && (
        <div className="modal-backdrop" onClick={() => setEditing(false)}>
          <form className="modal" onSubmit={update} onClick={(event) => event.stopPropagation()}>
            <h2 style={{ marginTop: 0 }}>Edit post</h2>
            <label className="ig-label">Caption</label>
            <textarea className="ig-textarea" rows={5} value={caption} onChange={(event) => setCaption(event.target.value)} maxLength={2200} />
            <label className="ig-label" style={{ marginTop: 10 }}>Alt text</label>
            <input className="ig-input" value={altText} onChange={(event) => setAltText(event.target.value)} maxLength={300} />
            <label className="ig-label" style={{ marginTop: 10 }}>Location</label>
            <input className="ig-input" value={location} onChange={(event) => setLocation(event.target.value)} maxLength={100} />
            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <button type="button" className="ig-btn" onClick={() => setEditing(false)}>Cancel</button>
              <button type="submit" className="ig-btn primary" disabled={saving}>{saving ? "Saving..." : "Save"}</button>
            </div>
          </form>
        </div>
      )}
      <style>{`@media(max-width:760px){.post-detail-grid{grid-template-columns:1fr !important}}`}</style>
    </div>
  );
}
