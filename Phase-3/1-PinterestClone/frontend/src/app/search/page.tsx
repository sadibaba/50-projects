'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { pinService } from '@/services/pin.service';
import PinGrid from '@/components/pins/PinGrid';
import LoadingSpinner from '@/components/common/LoadingSpinner';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      performSearch();
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const pins = results?.pins || [];

  return (
    <div className="max-w-[2000px] mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Search results for "{query}"
      </h1>
      <p className="text-gray-600 mb-8">
        Found {pins.length} {pins.length === 1 ? 'pin' : 'pins'}
      </p>

      {pins.length === 0 ? (
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