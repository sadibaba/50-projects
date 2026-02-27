import React, { useState } from 'react';
import { createPost } from '../api/api';

const CreateBlogModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    excerpt: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    'Technology',
    'Lifestyle',
    'Travel',
    'Food',
    'Health',
    'Business',
    'Entertainment',
    'Education'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }

      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Title is required');
      return false;
    }
    if (!formData.content.trim()) {
      setError('Content is required');
      return false;
    }
    if (!formData.category) {
      setError('Please select a category');
      return false;
    }
    if (!formData.excerpt.trim()) {
      setError('Excerpt is required');
      return false;
    }
    return true;
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!validateForm()) {
    return;
  }

  setLoading(true);
  setError('');

  try {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to create a post');
      setTimeout(() => {
        window.location.href = '/auth';
      }, 2000);
      return;
    }

    // Create FormData for file upload
    const postFormData = new FormData();
    postFormData.append('title', formData.title);
    postFormData.append('content', formData.content);
    postFormData.append('category', formData.category);
    postFormData.append('excerpt', formData.excerpt);
    
    if (formData.image) {
      postFormData.append('image', formData.image);
    }

    console.log('Sending data to API...');
    const response = await createPost(postFormData, token);
    console.log('API Response:', response);
    
    // Check the response structure - your backend sends { post: {...} }
    // But your code expects response.success or response.data
    if (response && response.post) {
      alert('Post created successfully!');
      if (onSuccess) {
        await onSuccess();
      }
      onClose();
    } else if (response && response.data) {
      alert('Post created successfully!');
      if (onSuccess) {
        await onSuccess();
      }
      onClose();
    } else if (response && response.success) {
      alert('Post created successfully!');
      if (onSuccess) {
        await onSuccess();
      }
      onClose();
    } else {
      console.error('Unexpected response format:', response);
      setError('Failed to create post. Unexpected response format.');
    }
  } catch (err) {
    console.error('Full error object:', err);
    setError(err.message || 'Failed to create post. Please try again.');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-gray-900 rounded-2xl border border-gray-800 w-full max-w-4xl my-8">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gray-900 border-b border-gray-800 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Write Your Story</h2>
              <p className="text-gray-400">Share your thoughts with the world</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-6 p-4 bg-red-900/30 border border-red-800 rounded-lg">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Form */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-white font-medium mb-2">
                Story Title <span className="text-red-400">*</span>
              </label>
              <input
                name="title"
                type="text"
                required
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                placeholder="Catchy title that grabs attention..."
                value={formData.title}
                onChange={handleChange}
                maxLength="200"
              />
              <p className="text-right text-sm text-gray-500 mt-1">
                {formData.title.length}/200
              </p>
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-white font-medium mb-2">
                Short Description <span className="text-red-400">*</span>
              </label>
              <textarea
                name="excerpt"
                rows="2"
                required
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                placeholder="Brief summary of your story..."
                value={formData.excerpt}
                onChange={handleChange}
                maxLength="300"
              />
              <p className="text-right text-sm text-gray-500 mt-1">
                {formData.excerpt.length}/300
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category */}
              <div>
                <label className="block text-white font-medium mb-2">
                  Category <span className="text-red-400">*</span>
                </label>
                <select
                  name="category"
                  required
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Cover Image Upload */}
              <div>
                <label className="block text-white font-medium mb-2">
                  Cover Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                />
                <p className="text-sm text-gray-500 mt-1">Max size: 5MB (Optional)</p>
              </div>
            </div>

            {/* Image Preview */}
            {imagePreview && (
              <div className="border border-gray-800 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Cover Preview</h3>
                <div className="relative h-48 rounded-lg overflow-hidden">
                  <img 
                    src={imagePreview} 
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* Content */}
            <div>
              <label className="block text-white font-medium mb-2">
                Your Story <span className="text-red-400">*</span>
              </label>
              <textarea
                name="content"
                rows="12"
                required
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-600 focus:border-transparent font-mono"
                placeholder="Start writing your amazing story here..."
                value={formData.content}
                onChange={handleChange}
              />
              <p className="text-right mt-2 text-sm text-gray-500">
                {formData.content.length} characters
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-800">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-gray-400 hover:text-white font-medium"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
                    </svg>
                    <span>Publish Story</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateBlogModal;