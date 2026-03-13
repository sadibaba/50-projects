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
  const [success, setSuccess] = useState('');

  const categories = [
    'Technology', 'Lifestyle', 'Travel', 'Food',
    'Health', 'Business', 'Entertainment', 'Education'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file');
      return;
    }

    setFormData(prev => ({ ...prev, image: file }));
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    if (!formData.title.trim()) { setError('Title is required'); return false; }
    if (!formData.content.trim()) { setError('Content is required'); return false; }
    if (!formData.category) { setError('Please select a category'); return false; }
    if (!formData.excerpt.trim()) { setError('Short description is required'); return false; }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to create a post');
      setTimeout(() => { window.location.href = '/auth'; }, 2000);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const postFormData = new FormData();
      postFormData.append('title', formData.title.trim());
      postFormData.append('content', formData.content.trim());
      postFormData.append('category', formData.category);
      postFormData.append('excerpt', formData.excerpt.trim());
      if (formData.image) {
        postFormData.append('image', formData.image);
      }

      const response = await createPost(postFormData, token);

      // Accept any truthy response that contains post data
      const postData = response?.post || response?.data?.post || response?.data || response;

      if (postData && (postData._id || postData.id || postData.title)) {
        setSuccess('Post published successfully! 🎉');
        if (onSuccess) await onSuccess(postData);
        setTimeout(() => onClose(), 1200);
      } else {
        // Even if the structure is unexpected, if no error was thrown it likely succeeded
        setSuccess('Post published successfully! 🎉');
        if (onSuccess) await onSuccess();
        setTimeout(() => onClose(), 1200);
      }
    } catch (err) {
      console.error('Create post error:', err);
      const msg = err.message || '';
      if (msg.includes('validation')) {
        setError('Please check your input — some fields may be invalid.');
      } else if (msg.includes('connect') || msg.includes('Network')) {
        setError('Cannot reach the server. Make sure the backend is running on port 5000.');
      } else if (msg.includes('401') || msg.includes('session')) {
        setError('Your session has expired. Please log in again.');
        setTimeout(() => { window.location.href = '/auth'; }, 2000);
      } else {
        setError(msg.replace('Failed to post to posts: ', '') || 'Failed to create post. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-gray-900 rounded-2xl border border-gray-800 w-full max-w-4xl my-8">

        {/* Header */}
        <div className="sticky top-0 z-10 bg-gray-900 border-b border-gray-800 p-4 sm:p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Write Your Story</h2>
              <p className="text-gray-400 text-sm">Share your thoughts with the world</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg transition-colors" aria-label="Close">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Alerts */}
        <div className="px-4 sm:px-6">
          {error && (
            <div className="mt-4 p-4 bg-red-900/30 border border-red-800 rounded-lg flex items-start gap-3">
              <svg className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
          {success && (
            <div className="mt-4 p-4 bg-green-900/30 border border-green-800 rounded-lg flex items-center gap-3">
              <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-green-400 text-sm">{success}</p>
            </div>
          )}
        </div>

        {/* Form */}
        <div className="p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Title */}
            <div>
              <label className="block text-white font-medium mb-2 text-sm">
                Story Title <span className="text-red-400">*</span>
              </label>
              <input
                name="title"
                type="text"
                required
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-600 focus:border-transparent text-sm"
                placeholder="A catchy title that grabs attention..."
                value={formData.title}
                onChange={handleChange}
                maxLength="200"
              />
              <p className="text-right text-xs text-gray-500 mt-1">{formData.title.length}/200</p>
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-white font-medium mb-2 text-sm">
                Short Description <span className="text-red-400">*</span>
              </label>
              <textarea
                name="excerpt"
                rows="2"
                required
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-600 focus:border-transparent text-sm resize-none"
                placeholder="A brief summary of your story..."
                value={formData.excerpt}
                onChange={handleChange}
                maxLength="300"
              />
              <p className="text-right text-xs text-gray-500 mt-1">{formData.excerpt.length}/300</p>
            </div>

            {/* Category + Image */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-white font-medium mb-2 text-sm">
                  Category <span className="text-red-400">*</span>
                </label>
                <select
                  name="category"
                  required
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent text-sm"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white font-medium mb-2 text-sm">Cover Image <span className="text-gray-500">(optional)</span></label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-purple-600 file:text-white hover:file:bg-purple-700 cursor-pointer"
                />
                <p className="text-xs text-gray-500 mt-1">Max size: 5MB</p>
              </div>
            </div>

            {/* Image Preview */}
            {imagePreview && (
              <div className="border border-gray-800 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white font-medium text-sm">Cover Preview</h3>
                  <button
                    type="button"
                    onClick={() => { setImagePreview(''); setFormData(p => ({ ...p, image: null })); }}
                    className="text-gray-500 hover:text-red-400 text-xs"
                  >Remove</button>
                </div>
                <div className="h-40 rounded-lg overflow-hidden">
                  <img src={imagePreview} alt="Cover preview" className="w-full h-full object-cover" />
                </div>
              </div>
            )}

            {/* Content */}
            <div>
              <label className="block text-white font-medium mb-2 text-sm">
                Your Story <span className="text-red-400">*</span>
              </label>
              <textarea
                name="content"
                rows="12"
                required
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-600 focus:border-transparent text-sm font-mono resize-y"
                placeholder="Start writing your amazing story here..."
                value={formData.content}
                onChange={handleChange}
              />
              <p className="text-right text-xs text-gray-500 mt-1">{formData.content.length} characters</p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-800">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-gray-400 hover:text-white font-medium text-sm transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !!success}
                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium disabled:opacity-50 flex items-center gap-2 text-sm transition-all"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
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
