// src/app/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IoHeartOutline, IoBookmarkOutline } from 'react-icons/io5';
import { useAuth } from '@/context/AuthContext';
import { usePins } from '@/hooks/usePins';
import PinGrid from '@/components/pins/PinGrid';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function HomePage() {
  const { user, loading: authLoading } = useAuth();
  const { pins, loading: pinsLoading, likePin, unlikePin, savePin, unsavePin } = usePins();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-[2000px] mx-auto px-4">
      {user && (
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.username}!
          </h1>
          <p className="text-gray-600 mt-2">Discover amazing ideas from people you follow</p>
        </div>
      )}
      
      <PinGrid
        pins={pins}
        loading={pinsLoading}
        onLike={likePin}
        onUnlike={unlikePin}
        onSave={savePin}
        onUnsave={unsavePin}
      />
    </div>
  );
}