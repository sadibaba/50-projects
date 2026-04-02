'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IoTrashOutline } from 'react-icons/io5';
import { commentService } from '@/services/comment.service';
import { Comment } from '@/types';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/common/Button';
import toast from 'react-hot-toast';

interface CommentSectionProps {
  pinId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ pinId }) => {
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [pinId]);

  const fetchComments = async () => {
    try {
      const data = await commentService.getComments(pinId);
      setComments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load comments:', err);
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to comment');
      return;
    }
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      const comment = await commentService.addComment(pinId, newComment);
      setComments([comment, ...comments]);
      setNewComment('');
      toast.success('Comment added!');
    } catch (err) {
      console.error('Failed to add comment:', err);
      toast.error('Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await commentService.deleteComment(commentId);
      setComments(comments.filter(c => c._id !== commentId));
      toast.success('Comment deleted');
    } catch (err) {
      console.error('Failed to delete comment:', err);
      toast.error('Failed to delete comment');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-10 bg-gray-100 rounded-lg animate-pulse" />
        {[...Array(2)].map((_, i) => (
          <div key={i} className="flex gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-full animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-100 rounded w-1/4 animate-pulse" />
              <div className="h-3 bg-gray-100 rounded w-3/4 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Comments ({comments.length})</h3>

      {isAuthenticated && (
        <form onSubmit={handleAddComment} className="flex gap-3">
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>
          <Button
            type="submit"
            disabled={submitting || !newComment.trim()}
            size="sm"
          >
            Post
          </Button>
        </form>
      )}

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => {
            // Import dynamically to avoid circular dependency
            const CommentItem = require('./CommentItem').default;
            return (
              <CommentItem
                key={comment._id}
                comment={comment}
                onDelete={handleDeleteComment}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default CommentSection;