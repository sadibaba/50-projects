"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IoCloudUploadOutline, IoImagesOutline, IoLinkOutline, IoCloseOutline } from "react-icons/io5";
import { useAuth } from "@/context/AuthContext";
import { pinService } from "@/services/pin.service";
import { boardService } from "@/services/board.service";
import { discoverService } from "@/services/discover.service";
import { Board, FreeImage } from "@/types";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import FreeImagePicker from "@/components/pins/FreeImagePicker";
import toast from "react-hot-toast";

const categories = ["Inspiration", "Travel", "Interiors", "Food", "Fashion", "Art", "Nature", "Tech", "Wellness", "Photography", "Architecture", "Plants", "Books"];

export default function CreatePinPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  const [form, setForm] = useState({ title: "", description: "", imageUrl: "", videoUrl: "", category: "Inspiration", tags: "", boardId: "" });
  const [source, setSource] = useState({ sourceName: "Uploaded", sourceUrl: "", width: 600, height: 900 });
  const [boards, setBoards] = useState<Board[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [mode, setMode] = useState<"free" | "upload" | "url">("free");

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push("/login");
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) boardService.list({ mine: 1 }).then(setBoards).catch(() => setBoards([]));
  }, [isAuthenticated]);

  const upload = async (file: File) => {
    if (!file.type.startsWith("image/")) return toast.error("Choose an image file");
    setUploading(true);
    try {
      const data = await discoverService.upload(file);
      setForm((current) => ({ ...current, imageUrl: data.url }));
      setSource({ sourceName: "Uploaded", sourceUrl: "", width: 600, height: 900 });
      toast.success("Image uploaded");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  const chooseFree = (image: FreeImage) => {
    setForm((current) => ({ ...current, imageUrl: image.urls.regular }));
    setSource({ sourceName: image.sourceName, sourceUrl: image.sourceUrl, width: image.width, height: image.height });
    setPickerOpen(false);
  };

  const publish = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.title.trim()) return toast.error("Add a title");
    if (!form.imageUrl) return toast.error("Add an image");

    setPublishing(true);
    try {
      const pin = await pinService.create({
        title: form.title.trim(),
        description: form.description.trim(),
        imageUrl: form.imageUrl,
        category: form.category,
        tags: form.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
        boardId: form.boardId || undefined,
        videoUrl: form.videoUrl.trim() || undefined,
        sourceName: source.sourceName,
        sourceUrl: source.sourceUrl,
        width: source.width,
        height: source.height,
      });
      toast.success("Pin published");
      router.push(`/pin/${pin._id}`);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setPublishing(false);
    }
  };

  if (loading) return null;

  return (
    <div className="mx-auto max-w-6xl px-3 py-5 sm:px-5 sm:py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-black tracking-tight">Create a pin</h1>
        <p className="mt-1 text-sm text-gray-500">Use a free image, upload your own, or paste an image URL.</p>
      </div>

      <form onSubmit={publish} className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-4 flex rounded-full bg-gray-100 p-1 text-sm">
            {[
              { id: "free", label: "Free images", icon: IoImagesOutline },
              { id: "upload", label: "Upload", icon: IoCloudUploadOutline },
              { id: "url", label: "URL", icon: IoLinkOutline },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button key={item.id} type="button" onClick={() => setMode(item.id as typeof mode)} className={`flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-2 font-semibold ${mode === item.id ? "bg-white shadow" : "text-gray-500"}`}>
                  <Icon size={16} /> {item.label}
                </button>
              );
            })}
          </div>

          {form.imageUrl ? (
            <div className="relative overflow-hidden rounded-2xl bg-gray-100">
              <img src={form.imageUrl} alt="Preview" className="max-h-[560px] w-full object-contain" />
              <button type="button" onClick={() => setForm({ ...form, imageUrl: "" })} className="absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-full bg-white shadow" aria-label="Remove image">
                <IoCloseOutline size={20} />
              </button>
            </div>
          ) : (
            <div className="grid min-h-[320px] place-items-center rounded-2xl border-2 border-dashed border-gray-300 p-6 text-center">
              {mode === "free" && <div><p className="font-semibold">Find a free image</p><p className="mt-1 text-sm text-gray-500">Picsum, no key required.</p><Button type="button" className="mt-4" onClick={() => setPickerOpen(true)}>Browse free images</Button></div>}
              {mode === "upload" && (
                <label className="cursor-pointer">
                  <IoCloudUploadOutline className="mx-auto text-4xl text-gray-400" />
                  <p className="mt-3 font-semibold">{uploading ? "Uploading..." : "Upload an image"}</p>
                  <p className="text-sm text-gray-500">PNG, JPG or WebP up to 8 MB</p>
                  <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={(event) => event.target.files?.[0] && upload(event.target.files[0])} />
                </label>
              )}
              {mode === "url" && (
                <div className="w-full max-w-sm text-left">
                  <label className="mb-1.5 block text-sm font-medium">Image URL</label>
                  <input value={form.imageUrl} onChange={(event) => setForm({ ...form, imageUrl: event.target.value })} placeholder="https://..." className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-brand" />
                </div>
              )}
            </div>
          )}

          <p className="mt-3 text-xs text-gray-500">Source: {source.sourceName}{source.sourceUrl && <> · <a href={source.sourceUrl} target="_blank" rel="noreferrer" className="underline">original</a></>}</p>
        </section>

        <section className="space-y-4 rounded-3xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
          <Input label="Title" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="A clear, useful title" maxLength={160} required />
          <div>
            <label className="mb-1.5 block text-sm font-medium">Description</label>
            <textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} rows={5} maxLength={1000} placeholder="What makes this idea useful?" className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-brand" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Category</label>
              <select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand">
                {categories.map((category) => <option key={category}>{category}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Board</label>
              <select value={form.boardId} onChange={(event) => setForm({ ...form, boardId: event.target.value })} className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand">
                <option value="">No board</option>
                {boards.map((board) => <option key={board._id} value={board._id}>{board.name}</option>)}
              </select>
            </div>
          </div>
          <Input label="Tags" value={form.tags} onChange={(event) => setForm({ ...form, tags: event.target.value })} placeholder="interior, minimal, small space" />
          <Input label="Video URL (optional)" value={form.videoUrl} onChange={(event) => setForm({ ...form, videoUrl: event.target.value })} placeholder="https://...mp4 — makes this a Reel" />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
            <Button type="submit" loading={publishing} fullWidth>Publish pin</Button>
          </div>
        </section>
      </form>

      {pickerOpen && <FreeImagePicker onSelect={chooseFree} onClose={() => setPickerOpen(false)} />}
    </div>
  );
}
