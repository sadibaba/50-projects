'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { userService } from '@/services/user.service';
import { useAuth } from '@/context/AuthContext';
import PinGrid from '@/components/pins/PinGrid';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { usePins } from '@/hooks/usePins';

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { user: currentUser, isAuthenticated } = useAuth();
  const { pins: allPins, loading: pinsLoading } = usePins(false);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pins' | 'boards'>('pins');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && params.id) {
      fetchProfile();
    }
  }, [params.id, mounted]);

  const fetchProfile = async () => {
    try {
      const data = await userService.getUserProfile(params.id as string);
      setProfile(data);
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!currentUser) return;
    try {
      await userService.followUser(params.id as string);
      fetchProfile();
    } catch (err) {
      console.error('Failed to follow user:', err);
    }
  };

  const handleUnfollow = async () => {
    if (!currentUser) return;
    try {
      await userService.unfollowUser(params.id as string);
      fetchProfile();
    } catch (err) {
      console.error('Failed to unfollow user:', err);
    }
  };

  if (!mounted || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold text-gray-900">User not found</h2>
        <Button onClick={() => router.push('/')} className="mt-4">
          Go Home
        </Button>
      </div>
    );
  }

  const isOwnProfile = currentUser?._id === params.id;
  const isFollowing = currentUser?.following?.includes(params.id as string);

  const userPins = allPins.filter(pin => pin.createdBy?._id === params.id);

  return (
    <div className="max-w-[2000px] mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Profile Header */}
        <div className="flex flex-col items-center text-center">
          <div className="w-32 h-32 bg-gradient-to-r from-primary to-red-500 rounded-full flex items-center justify-center text-white text-5xl font-bold">
            {profile.user.username[0].toUpperCase()}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">{profile.user.username}</h1>
          <p className="text-gray-500 mt-1">{profile.user.email}</p>
          <p className="text-gray-600 mt-2">Joined {new Date(profile.user.createdAt).toLocaleDateString()}</p>
        </div>

        {/* Stats and Actions */}
        <div className="flex items-center justify-between mt-6">
          <div className="flex gap-8">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{userPins.length}</p>
              <p className="text-sm text-gray-500">Pins</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{profile.followersCount}</p>
              <p className="text-sm text-gray-500">Followers</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{profile.followingCount}</p>
              <p className="text-sm text-gray-500">Following</p>
            </div>
          </div>
          
          {!isOwnProfile && isAuthenticated && (
            <Button
              variant={isFollowing ? 'outline' : 'primary'}
              onClick={isFollowing ? handleUnfollow : handleFollow}
            >
              {isFollowing ? 'Unfollow' : 'Follow'}
            </Button>
          )}
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mt-8">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('pins')}
              className={`pb-3 text-sm font-semibold transition-colors ${
                activeTab === 'pins'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Pins ({userPins.length})
            </button>
            <button
              onClick={() => setActiveTab('boards')}
              className={`pb-3 text-sm font-semibold transition-colors ${
                activeTab === 'boards'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Boards ({profile.boards?.length || 0})
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="mt-8">
          {activeTab === 'pins' && (
            <PinGrid pins={userPins} loading={pinsLoading} />
          )}
          {activeTab === 'boards' && (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {profile.boards?.map((board: any) => (
                <div key={board._id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4">
                  <h3 className="font-semibold text-gray-900">{board.name}</h3>
                  {board.description && (
                    <p className="text-sm text-gray-500 mt-1">{board.description}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">{board.pins?.length || 0} pins</p>
                </div>
              ))}
              {(!profile.boards || profile.boards.length === 0) && (
                <div className="col-span-full text-center py-12 text-gray-500">
                  No boards yet
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}