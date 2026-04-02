import React from 'react';
import { User } from '@/types';

interface ProfileHeaderProps {
  user: User;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-32 h-32 bg-gradient-to-r from-primary to-red-500 rounded-full flex items-center justify-center text-white text-5xl font-bold">
        {user.username[0].toUpperCase()}
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mt-4">{user.username}</h1>
      <p className="text-gray-500 mt-1">{user.email}</p>
      <p className="text-gray-600 mt-2">Joined {new Date(user.createdAt).toLocaleDateString()}</p>
    </div>
  );
};

export default ProfileHeader;