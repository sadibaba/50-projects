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
  const isOwner = user?._id === comment.userId._id;

  return (
    <div className="flex gap-3">
      <Link href={`/profile/${comment.userId._id}`}>
        <div className="w-10 h-10 bg-gradient-to-r from-primary to-red-500 rounded-full flex items-center justify-center text-white font-semibold cursor-pointer">
          {comment.userId.username[0].toUpperCase()}
        </div>
      </Link>
      <div className="flex-1">
        <div className="bg-gray-100 rounded-lg p-3">
          <Link href={`/profile/${comment.userId._id}`}>
            <span className="font-semibold text-sm hover:text-primary">
              {comment.userId.username}
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