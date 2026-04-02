'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { userService } from '@/services/user.service';
import { useAuth } from '@/context/AuthContext';
import PinGrid from '@/components/pins/PinGrid';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { pinService } from '@/services/pin.service';
import toast from 'react-hot-toast';
import { IoHeartOutline, IoPersonAddOutline, IoPersonRemoveOutline, IoCreateOutline } from 'react-icons/io5';
import EditProfileModal from '@/components/profile/EditProfileModal';

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { user: currentUser, isAuthenticated } = useAuth();
  const [profileUser, setProfileUser] = useState<any>(null);
  const [userPins, setUserPins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [totalLikes, setTotalLikes] = useState(0);
  const [isFollowingLoading, setIsFollowingLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && params.id) {
      fetchProfile();
      fetchUserPins();
    }
  }, [params.id, mounted]);

  const fetchProfile = async () => {
    try {
      const data = await userService.getUserProfile(params.id as string);
      setProfileUser(data.user);
      setFollowersCount(data.followersCount);
      setFollowingCount(data.followingCount);
      
      // Check if current user is following this profile
      if (currentUser && data.user) {
        const isFollowingUser = data.user.followers?.includes(currentUser._id);
        setFollowing(isFollowingUser);
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      toast.error('Failed to load profile');
    }
  };

  const fetchUserPins = async () => {
    try {
      const allPins = await pinService.getAllPins();
      const pins = allPins.filter(pin => pin.createdBy?._id === params.id);
      setUserPins(pins);
      
      // Calculate total likes
      const likes = pins.reduce((total, pin) => total + (pin.likes?.length || 0), 0);
      setTotalLikes(likes);
    } catch (err) {
      console.error('Failed to fetch user pins:', err);
      setUserPins([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to follow users');
      router.push('/login');
      return;
    }

    setIsFollowingLoading(true);
    try {
      await userService.followUser(params.id as string);
      setFollowing(true);
      setFollowersCount(prev => prev + 1);
      toast.success(`Following ${profileUser?.username}`);
    } catch (err) {
      console.error('Failed to follow:', err);
      toast.error('Failed to follow user');
    } finally {
      setIsFollowingLoading(false);
    }
  };

  const handleUnfollow = async () => {
    setIsFollowingLoading(true);
    try {
      await userService.unfollowUser(params.id as string);
      setFollowing(false);
      setFollowersCount(prev => prev - 1);
      toast.success(`Unfollowed ${profileUser?.username}`);
    } catch (err) {
      console.error('Failed to unfollow:', err);
      toast.error('Failed to unfollow user');
    } finally {
      setIsFollowingLoading(false);
    }
  };

  const handleProfileUpdate = (updatedUser: any) => {
    setProfileUser(updatedUser);
    // Refresh pins to update any changes
    fetchUserPins();
  };

  if (!mounted || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!profileUser) {
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

  return (
    <div className="max-w-[2000px] mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        {/* Edit Button for Own Profile */}
        {isOwnProfile && (
          <button
            onClick={() => setShowEditModal(true)}
            className="absolute top-0 right-0 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors z-10"
          >
            <IoCreateOutline size={20} className="text-gray-600" />
          </button>
        )}

        {/* Profile Header */}
        <div className="flex flex-col items-center text-center">
          <div className="w-32 h-32 bg-gradient-to-r from-primary to-red-500 rounded-full flex items-center justify-center text-white text-5xl font-bold overflow-hidden">
            {profileUser.profilePicture ? (
              <img 
                src={profileUser.profilePicture} 
                alt={profileUser.username} 
                className="w-full h-full object-cover"
              />
            ) : (
              profileUser.username?.[0]?.toUpperCase() || 'U'
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">{profileUser.username}</h1>
          {profileUser.bio && (
            <p className="text-gray-600 mt-2 max-w-md">{profileUser.bio}</p>
          )}
          <p className="text-gray-500 mt-1">{profileUser.email}</p>
          <p className="text-gray-400 text-sm mt-2">
            Joined {new Date(profileUser.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-8 mt-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{userPins.length}</p>
            <p className="text-sm text-gray-500">Pins</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{totalLikes}</p>
            <p className="text-sm text-gray-500">Total Likes</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{followersCount}</p>
            <p className="text-sm text-gray-500">Followers</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{followingCount}</p>
            <p className="text-sm text-gray-500">Following</p>
          </div>
        </div>

        {/* Follow Button */}
        {!isOwnProfile && isAuthenticated && (
          <div className="flex justify-center mt-6">
            {following ? (
              <Button
                variant="outline"
                onClick={handleUnfollow}
                loading={isFollowingLoading}
              >
                <IoPersonRemoveOutline className="mr-2" size={18} />
                Unfollow
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={handleFollow}
                loading={isFollowingLoading}
              >
                <IoPersonAddOutline className="mr-2" size={18} />
                Follow
              </Button>
            )}
          </div>
        )}

        {/* Pins Section */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {isOwnProfile ? 'Your Pins' : `${profileUser.username}'s Pins`}
            <span className="text-sm text-gray-500 ml-2">({userPins.length})</span>
          </h2>
          
          {userPins.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <div className="text-6xl mb-4">📌</div>
              <p className="text-gray-500">
                {isOwnProfile 
                  ? "You haven't created any pins yet." 
                  : `${profileUser.username} hasn't created any pins yet.`}
              </p>
              {isOwnProfile && (
                <Button onClick={() => router.push('/create-pin')} className="mt-4">
                  Create your first pin
                </Button>
              )}
            </div>
          ) : (
            <PinGrid pins={userPins} />
          )}
        </div>
      </motion.div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <EditProfileModal
          user={profileUser}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleProfileUpdate}
        />
      )}
    </div>
  );
}