'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { pinService } from '@/services/pin.service';
import { imageService } from '@/services/image.service';
import PinGrid from '@/components/pins/PinGrid';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import Button from '@/components/common/Button';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<any>(null);
  const [apiImages, setApiImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiLoading, setApiLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'pins' | 'api'>('pins');

  useEffect(() => {
    if (query) {
      performSearch();
      searchApiImages();
    }
  }, [query]);

  const performSearch = async () => {
    setLoading(true);
    try {
      const data = await pinService.search(query);
      setResults(data);
    } catch (err) {
      console.error('Search failed:', err);
      setResults({ pins: [], boards: [] });
    } finally {
      setLoading(false);
    }
  };

  const searchApiImages = async () => {
    setApiLoading(true);
    try {
      // Try to get images from API
      const data = await imageService.searchImages(query);
      setApiImages(data.results || []);
    } catch (err) {
      console.error('API search failed:', err);
      setApiImages([]);
    } finally {
      setApiLoading(false);
    }
  };

  const pins = results?.pins || [];

  return (
    <div className="max-w-[2000px] mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Search results for "{query}"
      </h1>

      {/* Tabs */}
      <div className="border-b border-gray-200 mt-4 mb-6">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('pins')}
            className={`pb-3 text-sm font-semibold transition-colors ${
              activeTab === 'pins'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Your Pins ({pins.length})
          </button>
          <button
            onClick={() => setActiveTab('api')}
            className={`pb-3 text-sm font-semibold transition-colors ${
              activeTab === 'api'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            From Gallery ({apiImages.length})
          </button>
        </div>
      </div>

      {/* Your Pins Tab */}
      {activeTab === 'pins' && (
        <>
          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : pins.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No pins found</h3>
              <p className="text-gray-500">
                Try searching for something else or create a new pin!
              </p>
            </div>
          ) : (
            <PinGrid pins={pins} />
          )}
        </>
      )}

      {/* API Images Tab */}
      {activeTab === 'api' && (
        <>
          {apiLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : apiImages.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🖼️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No images found</h3>
              <p className="text-gray-500">
                Couldn't fetch images from gallery. Try again later.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {apiImages.map((image) => (
                <div
                  key={image.id}
                  className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer"
                  onClick={() => {
                    // Create pin from this image
                    window.location.href = `/create-pin?image=${encodeURIComponent(image.urls.regular)}&title=${encodeURIComponent(query)}`;
                  }}
                >
                  <img
                    src={image.urls.small}
                    alt={image.alt_description || query}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button size="sm" variant="primary">
                      Use this image
                    </Button>
                  </div>
                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="text-white text-xs truncate">📸 {image.user?.name || 'Photographer'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
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