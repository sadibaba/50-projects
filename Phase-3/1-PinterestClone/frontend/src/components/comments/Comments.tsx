"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { commentService } from "@/services/comment.service";
import { useAuth } from "@/context/AuthContext";
import { Comment } from "@/types";
import toast from "react-hot-toast";
import { IoTrashOutline } from "react-icons/io5";
import { formatDistanceToNow } from "date-fns";

export default function Comments({ pinId }: { pinId: string }) {
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  const load = async () => {
    try {
      setComments(await commentService.list(pinId));
    } catch {
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [pinId]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isAuthenticated) {
      toast.error("Sign in to comment");
      return;
    }
    if (!text.trim()) return;
    setPosting(true);
    try {
      await commentService.add(pinId, text.trim());
      setText("");
      await load();
      toast.success("Comment added");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setPosting(false);
    }
  };

  const remove = async (id: string) => {
    try {
      await commentService.remove(id);
      setComments((items) => items.filter((item) => item._id !== id));
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <section>
      <h2 className="text-lg font-semibold">Comments {comments.length > 0 && <span className="text-gray-400">({comments.length})</span>}</h2>

      {isAuthenticated ? (
        <form onSubmit={submit} className="mt-3 flex gap-2">
          <input
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Add a comment"
            maxLength={1000}
            className="min-w-0 flex-1 rounded-full border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-brand"
          />
          <button type="submit" disabled={posting || !text.trim()} className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
            {posting ? "Posting" : "Post"}
          </button>
        </form>
      ) : (
        <p className="mt-2 text-sm text-gray-500"><Link href="/login" className="font-semibold text-brand hover:underline">Sign in</Link> to join the conversation.</p>
      )}

      <div className="mt-4 space-y-4">
        {loading ? (
          <div className="h-16 animate-pulse rounded-xl bg-gray-100" />
        ) : comments.length === 0 ? (
          <p className="rounded-xl bg-gray-50 p-4 text-sm text-gray-500">No comments yet. Start the conversation.</p>
        ) : comments.map((comment) => (
          <article key={comment._id} className="flex gap-3">
            <Link href={`/profile/${comment.user?.username}`} className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full bg-gray-200 text-xs font-bold">
              {comment.user?.avatar ? <img src={comment.user.avatar} alt="" className="h-full w-full object-cover" /> : comment.user?.username?.[0]?.toUpperCase()}
            </Link>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm">
                  <Link href={`/profile/${comment.user?.username}`} className="font-semibold hover:underline">{comment.user?.name || comment.user?.username}</Link>
                  <span className="ml-2 text-xs text-gray-400">{formatDistanceToNow(new Date(comment.createdAt))} ago</span>
                </p>
                {user?._id === comment.user?._id && (
                  <button onClick={() => remove(comment._id)} className="text-gray-400 hover:text-red-600" aria-label="Delete comment">
                    <IoTrashOutline size={16} />
                  </button>
                )}
              </div>
              <p className="mt-1 whitespace-pre-line text-sm text-gray-700">{comment.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
