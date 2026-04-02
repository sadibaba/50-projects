'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { IoHeartOutline, IoHeart, IoBookmarkOutline, IoBookmark, IoArrowBackOutline, IoShareOutline } from 'react-icons/io5';
import { useAuth } from '@/context/AuthContext';
import { pinService } from '@/services/pin.service';
import CommentSection from '@/components/comments/CommentSection';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import toast from 'react-hot-toast';

export default function PinDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [pin, setPin] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchPinDetails();
    }
  }, [params.id]);

  useEffect(() => {
    if (pin && user) {
      const liked = pin.likes?.includes(user._id);
      setIsLiked(liked);
      setLikeCount(pin.likes?.length || 0);
      
      const saved = pin.saves?.includes(user._id);
      setIsSaved(saved);
    }
  }, [pin, user]);

  const fetchPinDetails = async () => {
    try {
      const data = await pinService.getPinById(params.id as string);
      setPin(data);
    } catch (error) {
      console.error('Failed to fetch pin:', error);
      toast.error('Failed to load pin');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to like');
      router.push('/login');
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

  const handleSave = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to save');
      router.push('/login');
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

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/pin/${pin._id}`);
      toast.success('Link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const handleCreatorClick = (e: React.MouseEvent, userId: string) => {
    e.preventDefault();
    router.push(`/profile/${userId}`);
  };

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
            {/* Creator Info */}
            <div className="flex items-center justify-between mb-4">
              <div 
                onClick={(e) => handleCreatorClick(e, pin.createdBy?._id)}
                className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg overflow-hidden bg-gradient-to-r from-primary to-red-500">
                  {pin.createdBy?.profilePicture ? (
                    <img 
                      src={pin.createdBy.profilePicture} 
                      alt={pin.createdBy.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    pin.createdBy?.username?.[0]?.toUpperCase() || 'U'
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{pin.createdBy?.username || 'User'}</p>
                  <p className="text-sm text-gray-500">Creator</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={handleLike}
                  disabled={isProcessing}
                  className="p-3 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
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
                  className="p-3 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  {isSaved ? (
                    <IoBookmark className="text-primary" size={24} />
                  ) : (
                    <IoBookmarkOutline size={24} />
                  )}
                </button>
                <button
                  onClick={handleShare}
                  className="p-3 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <IoShareOutline size={24} />
                </button>
              </div>
            </div>
            
            {/* Like Count */}
            <div className="flex items-center gap-2 mb-4">
              <IoHeart className={isLiked ? "text-red-500" : "text-gray-400"} size={20} />
              <span className="text-gray-700">{likeCount} {likeCount === 1 ? 'like' : 'likes'}</span>
            </div>
            
            {/* Title & Description */}
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{pin.title}</h1>
            {pin.description && (
              <p className="text-gray-600 mb-6 leading-relaxed">{pin.description}</p>
            )}
            
            {/* Comments Section */}
            <div className="border-t border-gray-200 pt-6">
              <CommentSection pinId={pin._id} />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}