"use client";

import React, { useEffect, useRef, useState } from "react";
import { IoAdd, IoChevronBack, IoChevronForward, IoClose } from "react-icons/io5";
import toast from "react-hot-toast";
import type { Story } from "@/types";
import { storyApi, uploadApi } from "@/services";
import { useAuth } from "@/context/AuthContext";

export default function StoriesBar() {
  const { user, isAuthenticated } = useAuth();
  const [stories, setStories] = useState<Story[]>([]);
  const [viewer, setViewer] = useState<{ items: Story[]; index: number } | null>(null);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    try {
      setStories(await storyApi.list());
    } catch {
      setStories([]);
    }
  };

  useEffect(() => { load(); }, []);

  const grouped = stories.reduce<Record<string, { user: Story["user"]; items: Story[] }>>((acc, story) => {
    const key = story.user?._id || "unknown";
    if (!acc[key]) acc[key] = { user: story.user, items: [] };
    acc[key].items.push(story);
    return acc;
  }, {});

  const addStory = async (file: File) => {
    if (!isAuthenticated) return toast.error("Sign in to add a story");
    setUploading(true);
    try {
      const { url } = await uploadApi.image(file);
      await storyApi.create({ imageUrl: url });
      await load();
      toast.success("Story added");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  const open = (items: Story[]) => setViewer({ items, index: 0 });
  const active = viewer?.items[viewer.index];

  return (
    <>
      <section className="ig-card" style={{ marginBottom: 18, overflow: "hidden" }}>
        <div className="stories">
          {isAuthenticated && (
            <button className="story" onClick={() => inputRef.current?.click()} disabled={uploading}>
              <span style={{ width: 64, height: 64, borderRadius: "50%", border: "1px dashed #bbb", display: "grid", placeItems: "center", background: "#fafafa" }}>
                <IoAdd size={24} />
              </span>
              <span className="story-name">{uploading ? "Uploading" : "Your story"}</span>
              <input ref={inputRef} type="file" accept="image/*" hidden onChange={(event) => event.target.files?.[0] && addStory(event.target.files[0])} />
            </button>
          )}

          {Object.values(grouped).map(({ user: owner, items }) => (
            <button key={owner?._id || Math.random()} className="story" onClick={() => open(items)}>
              <span className="story-ring">
                <span>
                  {owner?.avatar ? <img src={owner.avatar} alt="" /> : <span style={{ display: "grid", placeItems: "center", height: "100%", background: "#eee", fontSize: 18 }}>{owner?.username?.[0]?.toUpperCase()}</span>}
                </span>
              </span>
              <span className="story-name">{owner?.username}</span>
            </button>
          ))}

          {stories.length === 0 && !isAuthenticated && <p style={{ fontSize: 13, color: "var(--muted)", padding: "10px 2px" }}>Stories appear here. Sign in to add one.</p>}
        </div>
      </section>

      {viewer && active && (
        <div className="modal-backdrop" onClick={() => setViewer(null)}>
          <div style={{ position: "relative", width: "min(420px, 92vw)", height: "min(720px, 82vh)", background: "#111", borderRadius: 16, overflow: "hidden" }} onClick={(event) => event.stopPropagation()}>
            <img src={active.imageUrl} alt={active.caption || "Story"} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", inset: "0 0 auto", display: "flex", alignItems: "center", gap: 10, padding: 14, background: "linear-gradient(rgba(0,0,0,.65),transparent)", color: "#fff" }}>
              <span className="ig-avatar" style={{ width: 34, height: 34, background: "#333", color: "#fff" }}>
                {active.user?.avatar ? <img src={active.user.avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : active.user?.username?.[0]?.toUpperCase()}
              </span>
              <strong style={{ fontSize: 14 }}>{active.user?.username}</strong>
              <button onClick={() => setViewer(null)} style={{ marginLeft: "auto", background: "none", border: 0, color: "#fff", cursor: "pointer" }} aria-label="Close story"><IoClose size={24} /></button>
            </div>
            {active.caption && <div style={{ position: "absolute", inset: "auto 0 0", padding: 18, color: "#fff", background: "linear-gradient(transparent,rgba(0,0,0,.7))", fontSize: 14 }}>{active.caption}</div>}
            <button onClick={() => setViewer((current) => current && ({ ...current, index: Math.max(0, current.index - 1) }))} style={{ position: "absolute", left: 8, top: "50%", background: "rgba(0,0,0,.45)", color: "#fff", border: 0, borderRadius: "50%", width: 38, height: 38, cursor: "pointer" }} aria-label="Previous story"><IoChevronBack /></button>
            <button onClick={() => setViewer((current) => current && ({ ...current, index: Math.min(current.items.length - 1, current.index + 1) }))} style={{ position: "absolute", right: 8, top: "50%", background: "rgba(0,0,0,.45)", color: "#fff", border: 0, borderRadius: "50%", width: 38, height: 38, cursor: "pointer" }} aria-label="Next story"><IoChevronForward /></button>
          </div>
        </div>
      )}
    </>
  );
}
