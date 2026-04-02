'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { pinService } from '@/services/pin.service';
import PinGrid from '@/components/pins/PinGrid';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

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
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-[2000px] mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Search results for "{query}"
      </h1>
      <p className="text-gray-600 mb-8">
        Found {results?.pins?.length || 0} pins
      </p>

      <PinGrid pins={results?.pins || []} />
    </div>
  );
}