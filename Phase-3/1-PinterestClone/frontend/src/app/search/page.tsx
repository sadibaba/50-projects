'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { pinService } from '@/services/pin.service';
import PinGrid from '@/components/pins/PinGrid';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import Button from '@/components/common/Button';

const unsplashService = {
  async searchImages(query: string, perPage: number = 20) {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:5000/api/unsplash/search?query=${encodeURIComponent(query)}&perPage=${perPage}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    return data;
  },
};

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [pins, setPins] = useState<any[]>([]);
  const [unsplashImages, setUnsplashImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [unsplashLoading, setUnsplashLoading] = useState(true);

  useEffect(() => {
    if (query) {
      searchDatabase();
      searchUnsplash();
    }
  }, [query]);

  const searchDatabase = async () => {
    setLoading(true);
    try {
      const data = await pinService.search(query);
      setPins(data.pins || []);
    } catch (err) {
      console.error('Database search failed:', err);
      setPins([]);
    } finally {
      setLoading(false);
    }
  };

  const searchUnsplash = async () => {
    setUnsplashLoading(true);
    try {
      const data = await unsplashService.searchImages(query);
      console.log('Unsplash API response:', data);
      setUnsplashImages(data.results || []);
    } catch (err) {
      console.error('Unsplash search failed:', err);
      setUnsplashImages([]);
    } finally {
      setUnsplashLoading(false);
    }
  };

  const createPinFromImage = (imageUrl: string) => {
    window.location.href = `/create-pin?image=${encodeURIComponent(imageUrl)}&title=${encodeURIComponent(query)}`;
  };

  return (
    <div className="max-w-[2000px] mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Search results for "{query}"
      </h1>

      {/* My Pins Section */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span>My Pins</span>
          <span className="text-sm text-gray-500">({pins.length})</span>
        </h2>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : pins.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-xl">
            <p className="text-gray-500">No matching pins in your collection.</p>
          </div>
        ) : (
          <PinGrid pins={pins} />
        )}
      </div>

      {/* Unsplash Images Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span>From API</span>
          <span className="text-sm text-gray-500">({unsplashImages.length})</span>
        </h2>
        
        {unsplashLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : unsplashImages.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-xl">
            <p className="text-gray-500">No images found on Unsplash for "{query}".</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {unsplashImages.map((image) => (
              <div
                key={image.id}
                className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer"
                onClick={() => createPinFromImage(image.urls.regular)}
              >
                <img
                  src={image.urls.small}
                  alt={image.alt_description || query}
                  className="w-full h-64 object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button size="sm" variant="primary">
                    Use this image
                  </Button>
                </div>
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-white text-xs truncate">
                    📸 {image.user?.name || 'Unsplash Photographer'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}