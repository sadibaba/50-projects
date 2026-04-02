'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IoSearchOutline, IoCloseOutline } from 'react-icons/io5';
import LoadingSpinner from './LoadingSpinner';

interface UnsplashImagePickerProps {
  onSelect: (imageUrl: string) => void;
  onClose: () => void;
}

// Working images from Picsum (no API key needed)
const getWorkingImages = (count: number = 20, searchQuery: string = '') => {
  const images = [];
  const seed = searchQuery ? searchQuery.charCodeAt(0) : 1;
  
  for (let i = 0; i < count; i++) {
    const randomId = (i + seed) % 200 + 1;
    images.push({
      id: `img-${i}`,
      urls: {
        regular: `https://picsum.photos/id/${randomId}/500/500`,
        small: `https://picsum.photos/id/${randomId}/200/200`,
        thumb: `https://picsum.photos/id/${randomId}/100/100`,
      },
      user: {
        name: `Photographer ${randomId}`,
        username: `photographer_${randomId}`,
      },
      alt_description: `Beautiful image ${i + 1}`,
      description: `A stunning photograph`,
      likes: Math.floor(Math.random() * 1000),
    });
  }
  return images;
};

const UnsplashImagePicker: React.FC<UnsplashImagePickerProps> = ({ onSelect, onClose }) => {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Load images immediately
    const loadImages = () => {
      setLoading(true);
      const workingImages = getWorkingImages(24);
      setImages(workingImages);
      setLoading(false);
    };
    
    loadImages();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      // If empty search, show random images
      const randomImages = getWorkingImages(24);
      setImages(randomImages);
    } else {
      // Filter images based on search (simulated)
      const filteredImages = getWorkingImages(24, searchQuery);
      setImages(filteredImages);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Choose an image</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <IoCloseOutline size={24} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-gray-200">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for images..."
              className="w-full px-10 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <IoSearchOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </form>
        </div>

        {/* Image Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image) => (
                <motion.div
                  key={image.id}
                  whileHover={{ scale: 1.05 }}
                  className="cursor-pointer group relative"
                  onClick={() => onSelect(image.urls.regular)}
                >
                  <img
                    src={image.urls.small}
                    alt={image.alt_description}
                    className="w-full h-48 object-cover rounded-lg"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">Select</span>
                  </div>
                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="text-white text-xs truncate">📸 {image.user.name}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default UnsplashImagePicker;