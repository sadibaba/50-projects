"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { pinService } from "@/services/pin.service";
import { Pin } from "@/types";
import PinGrid from "@/components/pins/PinGrid";
import SaveToBoardModal from "@/components/pins/SaveToBoardModal";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import Button from "@/components/common/Button";

export default function SavedPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [pins, setPins] = useState<Pin[]>([]);
  const [fetching, setFetching] = useState(true);
  const [savingPin, setSavingPin] = useState<Pin | null>(null);

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push("/login");
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated) return;
    pinService.list({ saved: "me", limit: 50 })
      .then((data) => setPins(data.pins))
      .catch(() => setPins([]))
      .finally(() => setFetching(false));
  }, [isAuthenticated]);

  if (loading || fetching) return <LoadingSpinner size="lg" />;

  return (
    <div className="mx-auto max-w-6xl px-3 py-6 sm:px-5">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Saved pins</h1>
          <p className="mt-1 text-sm text-gray-500">Everything you saved, in one place.</p>
        </div>
        <Button variant="outline" onClick={() => router.push("/boards")}>Manage boards</Button>
      </div>
      <PinGrid pins={pins} onSave={setSavingPin} emptyTitle="Nothing saved yet" emptyHint="Tap Save on any pin to keep it here." />
      {savingPin && <SaveToBoardModal pin={savingPin} onClose={() => setSavingPin(null)} onSaved={(updated) => setPins((items) => items.map((pin) => pin._id === updated._id ? { ...pin, ...updated } : pin))} />}
    </div>
  );
}
