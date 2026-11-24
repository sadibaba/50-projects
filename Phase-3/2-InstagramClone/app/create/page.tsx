"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { IoCloudUploadOutline, IoClose, IoImagesOutline } from "react-icons/io5";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { postApi, uploadApi } from "@/services";

export default function CreatePage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [image, setImage] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [altText, setAltText] = useState("");
  const [location, setLocation] = useState("");
  const [tags, setTags] = useState("");
  const [uploading, setUploading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [drag, setDrag] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push("/login");
  }, [authLoading, isAuthenticated, router]);

  const upload = async (file: File) => {
    if (!file.type.startsWith("image/")) return toast.error("Choose an image file");
    if (file.size > 8 * 1024 * 1024) return toast.error("Image must be under 8 MB");
    setUploading(true);
    try {
      const { url } = await uploadApi.image(file);
      setImage(url);
      toast.success("Image ready");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  const publish = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!image) return toast.error("Add an image");
    if (!caption.trim() && !altText.trim()) return toast.error("Add a caption or alt text");

    setPublishing(true);
    try {
      const post = await postApi.create({
        imageUrl: image,
        videoUrl: videoUrl.trim() || undefined,
        caption: caption.trim(),
        altText: altText.trim(),
        location: location.trim(),
        tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      });
      toast.success("Posted");
      router.push(`/p/${post._id}`);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setPublishing(false);
    }
  };

  if (authLoading) return <div className="spinner" />;

  return (
    <div className="ig-main" style={{ maxWidth: 900 }}>
      <h1 style={{ fontSize: 26, marginBottom: 16 }}>New post</h1>
      <form onSubmit={publish} className="ig-card" style={{ padding: 18 }}>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 320px", gap: 20 }} className="create-grid">
          <div>
            {image ? (
              <div style={{ position: "relative", background: "#000", borderRadius: 12, overflow: "hidden" }}>
                <img src={image} alt="Preview" style={{ width: "100%", maxHeight: 520, objectFit: "contain" }} />
                <button type="button" onClick={() => setImage("")} className="ig-icon-btn" style={{ position: "absolute", top: 8, right: 8, background: "rgba(255,255,255,.9)" }} aria-label="Remove image"><IoClose /></button>
              </div>
            ) : (
              <div
                onDragOver={(event) => { event.preventDefault(); setDrag(true); }}
                onDragLeave={() => setDrag(false)}
                onDrop={(event) => { event.preventDefault(); setDrag(false); const file = event.dataTransfer.files?.[0]; if (file) upload(file); }}
                onClick={() => fileRef.current?.click()}
                style={{ minHeight: 330, border: `2px dashed ${drag ? "#0095f6" : "#ccc"}`, borderRadius: 12, display: "grid", placeItems: "center", textAlign: "center", cursor: "pointer", background: drag ? "#f0f8ff" : "#fafafa", padding: 24 }}
              >
                <div>
                  <IoImagesOutline size={48} color="#8e8e8e" />
                  <p style={{ fontWeight: 700, margin: "12px 0 4px" }}>{uploading ? "Uploading..." : "Drag a photo here"}</p>
                  <p style={{ color: "var(--muted)", fontSize: 13, margin: 0 }}>or click to choose. JPEG, PNG, WebP, GIF up to 8 MB.</p>
                </div>
                <input ref={fileRef} type="file" accept="image/*" hidden onChange={(event) => event.target.files?.[0] && upload(event.target.files[0])} />
              </div>
            )}
            <button type="button" className="ig-btn" style={{ marginTop: 10 }} onClick={() => fileRef.current?.click()} disabled={uploading}>
              <IoCloudUploadOutline style={{ verticalAlign: "middle", marginRight: 6 }} /> {image ? "Replace image" : "Choose image"}
            </button>
          </div>

          <div style={{ display: "grid", gap: 12, alignContent: "start" }}>
            <div>
              <label className="ig-label">Caption</label>
              <textarea className="ig-textarea" rows={5} maxLength={2200} value={caption} onChange={(event) => setCaption(event.target.value)} placeholder="Write a caption..." />
            </div>
            <div>
              <label className="ig-label">Alt text</label>
              <input className="ig-input" maxLength={300} value={altText} onChange={(event) => setAltText(event.target.value)} placeholder="Describe the image for screen readers" />
            </div>
            <div>
              <label className="ig-label">Location</label>
              <input className="ig-input" maxLength={100} value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Optional" />
            </div>
            <div>
              <label className="ig-label">Tags</label>
              <input className="ig-input" value={tags} onChange={(event) => setTags(event.target.value)} placeholder="travel, light, weekend" />
            </div>
            <div>
              <label className="ig-label">Video URL (optional)</label>
              <input className="ig-input" value={videoUrl} onChange={(event) => setVideoUrl(event.target.value)} placeholder="https://...mp4" />
              <p style={{ fontSize: 11, color: "var(--muted)" }}>Adds this post to Reels.</p>
            </div>
            <button className="ig-btn primary" type="submit" disabled={publishing || uploading}>{publishing ? "Publishing..." : "Share post"}</button>
          </div>
        </div>
      </form>
      <style>{`@media(max-width:720px){.create-grid{grid-template-columns:1fr !important}}`}</style>
    </div>
  );
}
