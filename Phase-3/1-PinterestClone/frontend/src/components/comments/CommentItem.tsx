'use client';

import React from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { IoTrashOutline } from 'react-icons/io5';
import { Comment } from '@/types';
import { useAuth } from '@/context/AuthContext';

interface CommentItemProps {
  comment: Comment;
  onDelete: (id: string) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, onDelete }) => {
  const { user } = useAuth();
  
  // Safely check if comment and userId exist
  if (!comment || !comment.userId) {
    return null;
  }
  
  // Handle both populated user object and user ID string
  const commentUser = typeof comment.userId === 'object' ? comment.userId : null;
  const userId = commentUser?._id || comment.userId;
  const username = commentUser?.username || 'User';
  const isOwner = user?._id === userId;
  
  return (
    <div className="flex gap-3">
      <Link href={`/profile/${userId}`}>
        <div className="w-10 h-10 bg-gradient-to-r from-primary to-red-500 rounded-full flex items-center justify-center text-white font-semibold cursor-pointer">
          {username?.[0]?.toUpperCase() || 'U'}
        </div>
      </Link>
      <div className="flex-1">
        <div className="bg-gray-100 rounded-lg p-3">
          <Link href={`/profile/${userId}`}>
            <span className="font-semibold text-sm hover:text-primary cursor-pointer">
              {username}
            </span>
          </Link>
          <p className="text-gray-800 mt-1">{comment.text}</p>
        </div>
        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
          <span>{formatDistanceToNow(new Date(comment.createdAt))} ago</span>
          {isOwner && (
            <button
              onClick={() => onDelete(comment._id)}
              className="hover:text-red-500 transition-colors"
            >
              <IoTrashOutline size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentItem;