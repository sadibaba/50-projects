'use client';

import React from 'react';
import { Pin } from '@/types';
import PinCard from './PinCard';
import PinSkeleton from './PinSkeleton';

interface PinGridProps {
  pins: Pin[];
  loading?: boolean;
  onLike?: (id: string) => void;
  onUnlike?: (id: string) => void;
  onSave?: (id: string) => void;
  onUnsave?: (id: string) => void;
}

const PinGrid: React.FC<PinGridProps> = ({
  pins,
  loading = false,
  onLike,
  onUnlike,
  onSave,
  onUnsave,
}) => {
  if (loading) {
    return (
      <div className="masonry-grid">
        {[...Array(12)].map((_, i) => (
          <PinSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (pins.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-6xl mb-4">📌</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No pins yet</h3>
        <p className="text-gray-500">Be the first to create a pin!</p>
      </div>
    );
  }

  return (
    <div className="masonry-grid">
      {pins.map((pin) => (
        <PinCard
          key={pin._id}
          pin={pin}
          onLike={onLike}
          onUnlike={onUnlike}
          onSave={onSave}
          onUnsave={onUnsave}
        />
      ))}
    </div>
  );
};

export default PinGrid;