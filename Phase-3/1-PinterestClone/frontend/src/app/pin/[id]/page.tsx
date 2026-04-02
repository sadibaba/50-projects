// frontend/src/app/pin/[id]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { IoHeartOutline, IoHeart, IoBookmarkOutline, IoBookmark, IoArrowBackOutline } from 'react-icons/io5';
import { usePins } from '@/hooks/usePins';
import CommentSection from '@/components/comments/CommentSection';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function PinDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { pins, loading, likePin, unlikePin, savePin, unsavePin } = usePins();
  const [imageError, setImageError] = useState(false);
  
  const pin = pins.find(p => p._id === params.id);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  if (!pin) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold text-gray-900">Pin not found</h2>
        <Button onClick={() => router.push('/')} className="mt-4">
          Go Home
        </Button>
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
      >
        <IoArrowBackOutline size={20} />
        Back
      </button>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="grid md:grid-cols-2 gap-8">
          {/* Image */}
          <div className="relative min-h-[400px] bg-gray-100">
            {!imageError ? (
              <img
                src={pin.imageUrl}
                alt={pin.title}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="flex items-center justify-center h-full min-h-[400px]">
                <p className="text-gray-500">Failed to load image</p>
              </div>
            )}
          </div>
          
          {/* Content */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Link href={`/profile/${pin.createdBy?._id}`}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-red-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                    {pin.createdBy?.username?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{pin.createdBy?.username || 'User'}</p>
                    <p className="text-sm text-gray-500">Creator</p>
                  </div>
                </div>
              </Link>
              
              <div className="flex gap-2">
                <button
                  onClick={() => likePin?.(pin._id)}
                  className="p-3 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <IoHeartOutline size={24} />
                </button>
                <button
                  onClick={() => savePin?.(pin._id)}
                  className="p-3 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <IoBookmarkOutline size={24} />
                </button>
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{pin.title}</h1>
            {pin.description && (
              <p className="text-gray-600 mb-6 leading-relaxed">{pin.description}</p>
            )}
            
            <div className="border-t border-gray-200 pt-6">
              <CommentSection pinId={pin._id} />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}