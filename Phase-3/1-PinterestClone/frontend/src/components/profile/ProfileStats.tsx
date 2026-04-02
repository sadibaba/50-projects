import React from 'react';

interface ProfileStatsProps {
  followersCount: number;
  followingCount: number;
  pinsCount: number;
}

const ProfileStats: React.FC<ProfileStatsProps> = ({
  followersCount,
  followingCount,
  pinsCount,
}) => {
  return (
    <div className="flex gap-8">
      <div className="text-center">
        <p className="text-2xl font-bold text-gray-900">{pinsCount}</p>
        <p className="text-sm text-gray-500">Pins</p>
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
  );
};

export default ProfileStats;