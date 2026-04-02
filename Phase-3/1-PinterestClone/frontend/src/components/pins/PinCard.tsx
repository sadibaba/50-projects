'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { IoHeartOutline, IoHeart, IoBookmarkOutline, IoBookmark, IoShareOutline } from 'react-icons/io5';
import { Pin } from '@/types';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

interface PinCardProps {
  pin: Pin;
  onLike?: (id: string) => void;
  onUnlike?: (id: string) => void;
  onSave?: (id: string) => void;
  onUnsave?: (id: string) => void;
}

const PinCard: React.FC<PinCardProps> = ({
  pin,
  onLike,
  onUnlike,
  onSave,
  onUnsave,
}) => {
  const { isAuthenticated } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Please login to like pins');
      return;
    }
    if (isLiked) {
      onUnlike?.(pin._id);
      setIsLiked(false);
    } else {
      onLike?.(pin._id);
      setIsLiked(true);
    }
  };

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Please login to save pins');
      return;
    }
    if (isSaved) {
      onUnsave?.(pin._id);
      setIsSaved(false);
    } else {
      onSave?.(pin._id);
      setIsSaved(true);
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(`${window.location.origin}/pin/${pin._id}`);
    toast.success('Link copied to clipboard!');
  };

  const handleProfileClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = `/profile/${pin.createdBy._id}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="masonry-item"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/pin/${pin._id}`}>
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group">
          <div className="relative">
            <img
              src={pin.imageUrl}
              alt={pin.title}
              className="w-full h-auto object-cover"
              loading="lazy"
            />
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-black/40 flex items-center justify-center gap-4"
              >
                <button
                  onClick={handleLike}
                  className="p-3 bg-white rounded-full hover:scale-110 transition-transform"
                >
                  {isLiked ? (
                    <IoHeart className="text-red-500" size={24} />
                  ) : (
                    <IoHeartOutline size={24} />
                  )}
                </button>
                <button
                  onClick={handleSave}
                  className="p-3 bg-white rounded-full hover:scale-110 transition-transform"
                >
                  {isSaved ? (
                    <IoBookmark className="text-primary" size={24} />
                  ) : (
                    <IoBookmarkOutline size={24} />
                  )}
                </button>
                <button
                  onClick={handleShare}
                  className="p-3 bg-white rounded-full hover:scale-110 transition-transform"
                >
                  <IoShareOutline size={24} />
                </button>
              </motion.div>
            )}
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 line-clamp-2">{pin.title}</h3>
            {pin.description && (
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{pin.description}</p>
            )}
            <div className="flex items-center justify-between mt-3">
              <div 
                onClick={handleProfileClick}
                className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-red-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {pin.createdBy.username?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="text-sm text-gray-600 hover:text-primary">
                  {pin.createdBy.username}
                </span>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <IoHeartOutline size={16} />
                <span>{pin.likes?.length || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default PinCard;