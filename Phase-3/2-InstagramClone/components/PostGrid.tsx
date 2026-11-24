"use client";

import Link from "next/link";
import { IoChatbubbleOutline, IoHeartOutline, IoPlayOutline } from "react-icons/io5";
import type { Post } from "@/types";

export default function PostGrid({ posts, empty = "No posts yet." }: { posts: Post[]; empty?: string }) {
  if (posts.length === 0) return <div className="empty">{empty}</div>;
  return (
    <div className="grid-3">
      {posts.map((post) => (
        <Link key={post._id} href={`/p/${post._id}`} className="grid-item">
          {post.type === "video" && post.videoUrl ? (
            <video src={post.videoUrl} poster={post.imageUrl} muted playsInline />
          ) : (
            <img src={post.imageUrl} alt={post.altText || post.caption || "Post"} loading="lazy" />
          )}
          <span className="overlay">
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}><IoHeartOutline size={19} /> {post.likesCount}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}><IoChatbubbleOutline size={18} /> {post.commentsCount}</span>
            {post.type === "video" && <IoPlayOutline size={20} />}
          </span>
        </Link>
      ))}
    </div>
  );
}
