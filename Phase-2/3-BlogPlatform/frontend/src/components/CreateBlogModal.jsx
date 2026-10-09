import React, { useState } from 'react';
import { createPost } from '../api/api';
import { motion } from 'framer-motion';

const CreateBlogModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({ title: '', content: '', category: '', excerpt: '', image: null });
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const categories = ['Technology', 'Lifestyle', 'Travel', 'Science','Leaders','Scientists','Inventors' ,'Inspiration', 'Food', 'Health', 'Business', 'Entertainment', 'Education'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError('Image size should be less than 5MB'); return; }
    if (!file.type.startsWith('image/')) { setError('Please upload a valid image file'); return; }
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
    if (!token) { setError('You must be logged in to create a post'); setTimeout(() => { window.location.href = '/auth'; }, 2000); return; }
    setLoading(true);
    setError('');
    try {
      const postFormData = new FormData();
      postFormData.append('title', formData.title.trim());
      postFormData.append('content', formData.content.trim());
      postFormData.append('category', formData.category);
      postFormData.append('excerpt', formData.excerpt.trim());
      if (formData.image) { postFormData.append('image', formData.image); }
      const response = await createPost(postFormData, token);
      const postData = response?.post || response?.data?.post || response?.data || response;
      setSuccess('Post published successfully!');
      if (onSuccess) await onSuccess(postData);
      setTimeout(() => onClose(), 1200);
    } catch (err) {
      console.error('Create post error:', err);
      setError(err.message || 'Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
    >
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="glass rounded-2xl w-full max-w-4xl my-8"
      >
        <div className="sticky top-0 z-10 glass border-b border-secondary/50 p-4 sm:p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl text-text-primary">Write Your Story</h2>
              <p className="text-text-secondary text-sm">Share your thoughts with the world</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-secondary/50 rounded-lg transition-colors" aria-label="Close">
              <svg className="w-6 h-6 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
        <div className="px-4 sm:px-6">
          {error && (<div className="mt-4 p-4 bg-red-900/30 border border-red-800 rounded-lg flex items-start gap-3"><svg className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg><p className="text-red-400 text-sm">{error}</p></div>)}
          {success && (<div className="mt-4 p-4 bg-green-900/30 border border-green-800 rounded-lg flex items-center gap-3"><svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg><p className="text-green-400 text-sm">{success}</p></div>)}
        </div>
        <div className="p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-text-secondary text-xs mb-2 uppercase tracking-wider">Story Title <span className="text-red-400">*</span></label>
              <input name="title" type="text" required className="w-full px-4 py-3 bg-primary/50 border border-secondary/50 rounded-lg text-text-primary placeholder-text-secondary focus:ring-2 focus:ring-accent focus:border-transparent text-sm" placeholder="A catchy title..." value={formData.title} onChange={handleChange} maxLength="200" />
            </div>
            <div>
              <label className="block text-text-secondary text-xs mb-2 uppercase tracking-wider">Short Description <span className="text-red-400">*</span></label>
              <textarea name="excerpt" rows="2" required className="w-full px-4 py-3 bg-primary/50 border border-secondary/50 rounded-lg text-text-primary placeholder-text-secondary focus:ring-2 focus:ring-accent focus:border-transparent text-sm resize-none" placeholder="A brief summary..." value={formData.excerpt} onChange={handleChange} maxLength="300" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-text-secondary text-xs mb-2 uppercase tracking-wider">Category <span className="text-red-400">*</span></label>
                <select name="category" required className="w-full px-4 py-3 bg-primary/50 border border-secondary/50 rounded-lg text-text-primary focus:ring-2 focus:ring-accent focus:border-transparent text-sm" value={formData.category} onChange={handleChange}>
                  <option value="">Select a category</option>
                  {categories.map(cat => (<option key={cat} value={cat}>{cat}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-text-secondary text-xs mb-2 uppercase tracking-wider">Cover Image <span className="text-text-secondary/60">(optional)</span></label>
                <input type="file" accept="image/*" onChange={handleImageChange} className="w-full px-3 py-2.5 bg-primary/50 border border-secondary/50 rounded-lg text-text-primary text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-accent file:text-primary hover:file:bg-amber-300 cursor-pointer" />
              </div>
            </div>
            {imagePreview && (
              <div className="border border-secondary/50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-text-primary font-medium text-sm">Cover Preview</h3>
                  <button type="button" onClick={() => { setImagePreview(''); setFormData(p => ({ ...p, image: null })); }} className="text-text-secondary hover:text-red-400 text-xs">Remove</button>
                </div>
                <div className="h-40 rounded-lg overflow-hidden"><img src={imagePreview} alt="Cover preview" className="w-full h-full object-cover" /></div>
              </div>
            )}
            <div>
              <label className="block text-text-secondary text-xs mb-2 uppercase tracking-wider">Your Story <span className="text-red-400">*</span></label>
              <textarea name="content" rows="12" required className="w-full px-4 py-3 bg-primary/50 border border-secondary/50 rounded-lg text-text-primary placeholder-text-secondary focus:ring-2 focus:ring-accent focus:border-transparent text-sm font-serif resize-y" placeholder="Start writing your amazing story here..." value={formData.content} onChange={handleChange} />
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-secondary/50">
              <button type="button" onClick={onClose} className="px-5 py-2.5 text-text-secondary hover:text-text-primary font-medium text-sm transition-colors" disabled={loading}>Cancel</button>
              <button type="submit" disabled={loading || !!success} className="px-6 py-2.5 bg-accent text-primary rounded-full font-bold disabled:opacity-50 flex items-center gap-2 text-sm transition-all hover:bg-amber-300">
                {loading ? (<><svg className="animate-spin h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg><span>Publishing...</span></>) : (<><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg><span>Publish Story</span></>)}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CreateBlogModal;