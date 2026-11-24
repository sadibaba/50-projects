"use client";

import { Pin } from "@/types";
import PinCard from "./PinCard";
import PinSkeleton from "./PinSkeleton";

interface Props {
  pins: Pin[];
  loading?: boolean;
  onSave: (pin: Pin) => void;
  emptyTitle?: string;
  emptyHint?: string;
}

export default function PinGrid({ pins, loading = false, onSave, emptyTitle = "No pins yet", emptyHint = "Try another search or create the first pin." }: Props) {
  if (loading) {
    return <div className="masonry-grid">{[...Array(10)].map((_, index) => <PinSkeleton key={index} />)}</div>;
  }

  if (pins.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-gray-300 bg-white py-20 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-brand/10 text-2xl font-black text-brand">P</div>
        <h3 className="mt-4 text-xl font-semibold">{emptyTitle}</h3>
        <p className="mt-1 text-sm text-gray-500">{emptyHint}</p>
      </div>
    );
  }

  return (
    <div className="masonry-grid">
      {pins.map((pin) => <PinCard key={pin._id} pin={pin} onSave={onSave} />)}
    </div>
  );
}
