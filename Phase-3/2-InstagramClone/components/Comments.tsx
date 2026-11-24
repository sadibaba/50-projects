"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { IoTrashOutline } from "react-icons/io5";
import toast from "react-hot-toast";
import type { Comment } from "@/types";
import { postApi } from "@/services";
import { useAuth } from "@/context/AuthContext";

export default function Comments({ postId, onCountChange }: { postId: string; onCountChange?: (count: number) => void }) {
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  const load = async () => {
    try {
      const data = await postApi.comments(postId);
      setComments(data);
      onCountChange?.(data.length);
    } catch {
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [postId]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isAuthenticated) return toast.error("Sign in to comment");
    if (!text.trim()) return;
    setPosting(true);
    try {
      const created = await postApi.addComment(postId, text.trim());
      setComments((items) => [created, ...items]);
      setText("");
      onCountChange?.(comments.length + 1);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setPosting(false);
    }
  };

  const remove = async (id: string) => {
    try {
      await postApi.removeComment(postId, id);
      setComments((items) => items.filter((item) => item._id !== id));
      onCountChange?.(Math.max(0, comments.length - 1));
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <section>
      {isAuthenticated ? (
        <form onSubmit={submit} style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          <input className="ig-input" value={text} onChange={(event) => setText(event.target.value)} placeholder="Add a comment..." maxLength={1000} />
          <button className="ig-btn primary" type="submit" disabled={posting || !text.trim()}>{posting ? "Posting" : "Post"}</button>
        </form>
      ) : (
        <p style={{ fontSize: 14, color: "var(--muted)", marginBottom: 14 }}><Link href="/login" style={{ color: "#0095f6", fontWeight: 600 }}>Sign in</Link> to comment.</p>
      )}

      {loading ? <div className="spinner" /> : comments.length === 0 ? (
        <p style={{ fontSize: 14, color: "var(--muted)" }}>No comments yet. Start the conversation.</p>
      ) : comments.map((comment) => (
        <div key={comment._id} style={{ display: "flex", gap: 10, padding: "9px 0", borderBottom: "1px solid #f3f3f3" }}>
          <Link href={`/u/${comment.user.username}`} className="ig-avatar" style={{ width: 32, height: 32 }}>
            {comment.user.avatar ? <img src={comment.user.avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : comment.user.username[0].toUpperCase()}
          </Link>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14 }}>
              <Link href={`/u/${comment.user.username}`} style={{ fontWeight: 700, marginRight: 5 }}>{comment.user.username}</Link>
              {comment.text}
            </div>
            <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 3 }}>{formatDistanceToNow(new Date(comment.createdAt))} ago</div>
          </div>
          {user?._id === comment.user._id && (
            <button className="ig-icon-btn" onClick={() => remove(comment._id)} aria-label="Delete comment" style={{ width: 30, height: 30 }}><IoTrashOutline size={15} /></button>
          )}
        </div>
      ))}
    </section>
  );
}
