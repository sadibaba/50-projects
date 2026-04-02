'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { IoCloudUploadOutline, IoImagesOutline } from 'react-icons/io5';
import { usePins } from '@/hooks/usePins';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import UnsplashImagePicker from '@/components/common/UnsplashImagePicker';
import toast from 'react-hot-toast';

export default function CreatePinPage() {
  const router = useRouter();
  const { createPin } = usePins();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
  });
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [showUnsplashPicker, setShowUnsplashPicker] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleImageUrlChange = (url: string) => {
    setFormData({ ...formData, imageUrl: url });
    setImagePreview(url);
  };

  const handleUnsplashSelect = (imageUrl: string) => {
    handleImageUrlChange(imageUrl);
    setShowUnsplashPicker(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.imageUrl.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await createPin(formData);
      toast.success('Pin created successfully!');
      router.push('/');
    } catch (err) {
      console.error('Failed to create pin:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Create new pin</h1>
            <p className="text-gray-600 mt-1">Share your ideas with the world</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image *
                </label>
                <div className="relative">
                  {imagePreview ? (
  <div className="relative rounded-lg overflow-hidden">
    <img
      src={imagePreview}
      alt="Preview"
      className="w-full h-auto object-cover"
    />
    <button
      type="button"
      onClick={() => handleImageUrlChange('')}
      className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-lg hover:bg-gray-100"
    >
      ✕
    </button>
  </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                      <IoCloudUploadOutline className="mx-auto text-gray-400 text-4xl mb-2" />
                      <p className="text-sm text-gray-600">Choose an image from Unsplash</p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-4"
                        onClick={() => setShowUnsplashPicker(true)}
                      >
                        <IoImagesOutline className="mr-2" />
                        Browse Unsplash
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Pin Details */}
              <div className="space-y-4">
                <Input
                  label="Title *"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Add a title"
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder="Tell everyone what your pin is about"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    loading={loading}
                  >
                    Publish
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </motion.div>
      </div>

      {showUnsplashPicker && (
        <UnsplashImagePicker
          onSelect={handleUnsplashSelect}
          onClose={() => setShowUnsplashPicker(false)}
        />
      )}
    </>
  );
}