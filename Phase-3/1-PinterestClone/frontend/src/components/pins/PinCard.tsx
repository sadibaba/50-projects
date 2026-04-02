'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { IoHeartOutline, IoHeart, IoBookmarkOutline, IoBookmark, IoShareOutline } from 'react-icons/io5';
import { Pin } from '@/types';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { pinService } from '@/services/pin.service';

interface PinCardProps {
  pin: Pin;
  onLike?: (id: string) => Promise<void>;
  onUnlike?: (id: string) => Promise<void>;
  onSave?: (id: string) => Promise<void>;
  onUnsave?: (id: string) => Promise<void>;
}

const PinCard: React.FC<PinCardProps> = ({
  pin,
  onLike,
  onUnlike,
  onSave,
  onUnsave,
}) => {
  const { user, isAuthenticated } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(pin.likes?.length || 0);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Check if current user has liked this pin
    if (user && pin.likes) {
      const liked = pin.likes.includes(user._id);
      setIsLiked(liked);
    }
    setLikeCount(pin.likes?.length || 0);
  }, [pin.likes, user]);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error('Please login to like pins');
      return;
    }
    
    if (isProcessing) return;
    setIsProcessing(true);
    
    try {
      if (isLiked) {
        await pinService.unlikePin(pin._id);
        setIsLiked(false);
        setLikeCount(prev => prev - 1);
        toast.success('Unliked!');
      } else {
        await pinService.likePin(pin._id);
        setIsLiked(true);
        setLikeCount(prev => prev + 1);
        toast.success('Liked!');
      }
    } catch (error) {
      console.error('Like action failed:', error);
      toast.error('Something went wrong');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error('Please login to save pins');
      return;
    }
    
    if (isProcessing) return;
    setIsProcessing(true);
    
    try {
      if (isSaved) {
        await pinService.unsavePin(pin._id);
        setIsSaved(false);
        toast.success('Removed from saved');
      } else {
        await pinService.savePin(pin._id);
        setIsSaved(true);
        toast.success('Saved!');
      }
    } catch (error) {
      console.error('Save action failed:', error);
      toast.error('Something went wrong');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(`${window.location.origin}/pin/${pin._id}`);
    toast.success('Link copied to clipboard!');
  };

  const handleProfileClick = (e: React.MouseEvent, userId: string) => {
  e.preventDefault();
  e.stopPropagation();
  router.push(`/profile/${userId}`);
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
                  disabled={isProcessing}
                  className="p-3 bg-white rounded-full hover:scale-110 transition-transform disabled:opacity-50"
                >
                  {isLiked ? (
                    <IoHeart className="text-red-500" size={24} />
                  ) : (
                    <IoHeartOutline size={24} />
                  )}
                </button>
                <button
                  onClick={handleSave}
                  disabled={isProcessing}
                  className="p-3 bg-white rounded-full hover:scale-110 transition-transform disabled:opacity-50"
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
  onClick={(e) => handleProfileClick(e, pin.createdBy._id)}
  className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
>
  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold overflow-hidden bg-gradient-to-r from-primary to-red-500">
    {pin.createdBy.profilePicture ? (
      <img 
        src={pin.createdBy.profilePicture} 
        alt={pin.createdBy.username}
        className="w-full h-full object-cover"
      />
    ) : (
      pin.createdBy.username?.[0]?.toUpperCase() || 'U'
    )}
  </div>
  <span className="text-sm text-gray-600 hover:text-primary">
    {pin.createdBy.username}
  </span>
</div>
              <div className="flex items-center gap-1 text-sm">
                {isLiked ? (
                  <IoHeart className="text-red-500" size={14} />
                ) : (
                  <IoHeartOutline className="text-gray-400" size={14} />
                )}
                <span className={isLiked ? "text-red-500" : "text-gray-500"}>
                  {likeCount}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default PinCard;