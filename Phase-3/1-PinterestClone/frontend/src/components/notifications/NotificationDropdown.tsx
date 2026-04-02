'use client';

import React from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { IoHeart, IoChatbubble, IoBookmark, IoPersonAdd } from 'react-icons/io5';
import { useNotifications } from '@/hooks/useNotifications';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface NotificationDropdownProps {
  onClose: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ onClose }) => {
  const { notifications, loading, markAsRead } = useNotifications();

  const getIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <IoHeart className="text-red-500" size={20} />;
      case 'comment':
        return <IoChatbubble className="text-blue-500" size={20} />;
      case 'save':
        return <IoBookmark className="text-green-500" size={20} />;
      case 'follow':
        return <IoPersonAdd className="text-purple-500" size={20} />;
      default:
        return null;
    }
  };

  const getMessage = (notification: any) => {
    const username = notification.fromUser?.username || 'Someone';
    switch (notification.type) {
      case 'like':
        return `${username} liked your pin`;
      case 'comment':
        return `${username} commented on your pin`;
      case 'save':
        return `${username} saved your pin`;
      case 'follow':
        return `${username} started following you`;
      default:
        return '';
    }
  };

  const handleNotificationClick = async (notification: any) => {
    if (!notification.isRead) {
      await markAsRead(notification._id);
    }
    onClose();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner size="sm" />
      </div>
    );
  }

  return (
    <div className="max-h-96 overflow-y-auto">
      {notifications.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No notifications yet</p>
        </div>
      ) : (
        notifications.map((notification) => (
          <Link
            key={notification._id}
            href={
              notification.pinId
                ? `/pin/${notification.pinId._id}`
                : `/profile/${notification.fromUser._id}`
            }
            onClick={() => handleNotificationClick(notification)}
          >
            <div
              className={`flex items-start gap-3 p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                !notification.isRead ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-r from-primary to-red-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {notification.fromUser?.username?.[0]?.toUpperCase() || '?'}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2">
                  <div className="mt-1">{getIcon(notification.type)}</div>
                  <div>
                    <p className="text-sm text-gray-900">
                      {getMessage(notification)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDistanceToNow(new Date(notification.createdAt))} ago
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))
      )}
    </div>
  );
};

export default NotificationDropdown;