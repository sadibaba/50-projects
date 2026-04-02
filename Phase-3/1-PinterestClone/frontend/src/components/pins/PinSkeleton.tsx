'use client';

import React from 'react';

const PinSkeleton = () => {
  const randomHeight = Math.floor(Math.random() * (400 - 200 + 1) + 200);
  
  return (
    <div className="masonry-item">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <div 
          className="bg-gray-200 animate-pulse"
          style={{ height: `${randomHeight}px` }}
        />
        <div className="p-4 space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
          <div className="h-3 bg-gray-200 rounded w-full animate-pulse" />
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
              <div className="h-3 bg-gray-200 rounded w-20 animate-pulse" />
            </div>
            <div className="flex gap-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PinSkeleton;