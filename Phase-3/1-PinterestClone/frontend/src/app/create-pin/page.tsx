'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { IoCloudUploadOutline, IoLinkOutline, IoImagesOutline } from 'react-icons/io5';
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
  const [uploadMethod, setUploadMethod] = useState<'url' | 'drag'>('url');
  const [dragActive, setDragActive] = useState(false);
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

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        handleImageUrlChange(imageUrl);
      };
      reader.readAsDataURL(file);
      toast.success('Image loaded!');
    } else {
      toast.error('Please drop an image file');
    }
  }, []);

  const compressImage = (file: File, maxSizeMB = 1): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Max dimensions
        const maxWidth = 1200;
        const maxHeight = 1200;
        
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Compress to JPEG with 0.7 quality
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
        resolve(compressedDataUrl);
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file && file.type.startsWith('image/')) {
    if (file.size > 5 * 1024 * 1024) { // If larger than 5MB
      toast.loading('Compressing image...');
      try {
        const compressedUrl = await compressImage(file);
        handleImageUrlChange(compressedUrl);
        toast.dismiss();
        toast.success('Image compressed and loaded!');
      } catch (error) {
        toast.dismiss();
        toast.error('Failed to compress image');
      }
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        handleImageUrlChange(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  } else {
    toast.error('Please select an image file');
  }
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Please add a title');
      return;
    }
    if (!formData.imageUrl.trim()) {
      toast.error('Please add an image URL or upload an image');
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
              {/* Image Upload Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image *
                </label>
                
                {/* Upload Method Tabs */}
                <div className="flex gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => setUploadMethod('url')}
                    className={`flex-1 px-3 py-2 text-sm rounded-lg transition-colors ${
                      uploadMethod === 'url' 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <IoLinkOutline className="inline mr-1" size={16} />
                    URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadMethod('drag')}
                    className={`flex-1 px-3 py-2 text-sm rounded-lg transition-colors ${
                      uploadMethod === 'drag' 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <IoCloudUploadOutline className="inline mr-1" size={16} />
                    Drag & Drop
                  </button>
                </div>

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
                  <>
                    {uploadMethod === 'url' ? (
                      <div className="space-y-3">
                        <Input
                          type="url"
                          value={formData.imageUrl}
                          onChange={(e) => handleImageUrlChange(e.target.value)}
                          placeholder="https://example.com/image.jpg"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          fullWidth
                          onClick={() => setShowUnsplashPicker(true)}
                        >
                          <IoImagesOutline className="mr-2" />
                          Browse Free Images
                        </Button>
                      </div>
                    ) : (
                      <div
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                          dragActive ? 'border-primary bg-primary/5' : 'border-gray-300'
                        }`}
                      >
                        <IoCloudUploadOutline className="mx-auto text-gray-400 text-4xl mb-2" />
                        <p className="text-sm text-gray-600 mb-2">
                          Drag & drop an image here
                        </p>
                        <p className="text-xs text-gray-500 mb-3">or</p>
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                          <span className="text-primary hover:underline text-sm">
                            Browse files
                          </span>
                        </label>
                      </div>
                    )}
                  </>
                )}
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