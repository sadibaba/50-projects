"use client";

import React, { useEffect, useState } from "react";
import { IoCloseOutline, IoSearchOutline } from "react-icons/io5";
import { discoverService } from "@/services/discover.service";
import { FreeImage } from "@/types";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import toast from "react-hot-toast";

interface Props {
  onSelect: (image: FreeImage) => void;
  onClose: () => void;
}

export default function FreeImagePicker({ onSelect, onClose }: Props) {
  const [images, setImages] = useState<FreeImage[]>([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);

  const load = async (nextPage: number, search: string, append = false) => {
    setLoading(true);
    try {
      const data = await discoverService.images({ q: search || "inspiration", page: nextPage, limit: 24 });
      setImages((items) => append ? [...items, ...data.results] : data.results);
      setHasMore(data.hasMore);
      setPage(nextPage);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(1, ""); }, []);

  const search = (event: React.FormEvent) => {
    event.preventDefault();
    load(1, query.trim(), false);
  };

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-black/60 p-3" onClick={onClose}>
      <div className="flex h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl bg-white" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div>
            <h2 className="text-lg font-bold">Free images</h2>
            <p className="text-xs text-gray-500">Picsum photos. No API key or registration.</p>
          </div>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full hover:bg-gray-100" aria-label="Close"><IoCloseOutline size={22} /></button>
        </div>

        <form onSubmit={search} className="border-b border-gray-100 p-4">
          <div className="relative">
            <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Describe the image you need" className="w-full rounded-full bg-gray-100 py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-brand/30" />
          </div>
        </form>

        <div className="flex-1 overflow-y-auto p-4">
          {loading && images.length === 0 ? <LoadingSpinner size="lg" /> : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {images.map((image) => (
                <button key={image.id} onClick={() => onSelect(image)} className="group relative overflow-hidden rounded-xl bg-gray-100 text-left">
                  <img src={image.urls.small} alt={image.alt_description} loading="lazy" className="h-44 w-full object-cover transition group-hover:scale-105" />
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 text-xs text-white">{image.user.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
          <p className="text-xs text-gray-500">Images load from Picsum. Attribute when reposting.</p>
          <button onClick={() => hasMore && load(page + 1, query.trim(), true)} disabled={!hasMore || loading} className="rounded-full bg-ink px-5 py-2 text-sm font-semibold text-white disabled:opacity-50">
            {loading ? "Loading..." : hasMore ? "Load more" : "No more"}
          </button>
        </div>
      </div>
    </div>
  );
}
