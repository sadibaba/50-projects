import React, { useState } from 'react';
import { updateUserProfile, uploadAvatar } from '../api/api';
import { motion } from 'framer-motion';

const EditProfileModal = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    bio: user.bio || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user.avatar || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError('Image size should be less than 5MB'); return; }
    if (!file.type.startsWith('image/')) { setError('Please upload a valid image file'); return; }
    setAvatar(file);
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }

    try {
      let avatarUrl = user.avatar;
      if (avatar) {
        const avatarFormData = new FormData();
        avatarFormData.append('avatar', avatar);
        const avatarResponse = await uploadAvatar(avatarFormData);
        avatarUrl = avatarResponse.avatar || avatarResponse.data?.avatar;
        if (avatarUrl) localStorage.setItem('userAvatar', avatarUrl);
      }

      const updateData = { name: formData.name, email: formData.email, bio: formData.bio };
      if (formData.newPassword && formData.currentPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      await updateUserProfile(updateData);
      localStorage.setItem('userName', formData.name);
      localStorage.setItem('userEmail', formData.email);
      localStorage.setItem('userBio', formData.bio);

      setSuccess('Profile updated successfully!');
      onSave({ ...updateData, avatar: avatarUrl });
      setTimeout(() => { onClose(); }, 1200);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="glass rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 z-10 glass border-b border-secondary/50 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl text-text-primary">Edit Profile</h2>
            <button onClick={onClose} className="p-2 hover:bg-secondary/50 rounded-lg transition-colors" disabled={loading}>
              <svg className="w-6 h-6 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (<div className="bg-red-900/30 border border-red-800 text-red-400 px-4 py-3 rounded-lg text-sm">{error}</div>)}
          {success && (<div className="bg-green-900/30 border border-green-800 text-green-400 px-4 py-3 rounded-lg text-sm">{success}</div>)}

          {/* Avatar */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text-primary">Profile Picture</h3>
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-r from-accent to-amber-300">
                  <img src={avatarPreview} alt="Profile" className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=B8873E&color=fff&size=200`; }} />
                </div>
                <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 p-1.5 bg-primary rounded-full border border-secondary cursor-pointer hover:bg-secondary transition-colors">
                  <svg className="w-4 h-4 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </label>
                <input id="avatar-upload" type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
              </div>
              <p className="text-text-secondary text-sm">Click the camera icon to change</p>
            </div>
          </div>

          {/* Info */}
          <div className="space-y-4 pt-4 border-t border-secondary/50">
            <h3 className="text-lg font-semibold text-text-primary">Profile Information</h3>
            <div>
              <label className="block text-text-secondary text-xs mb-2 uppercase tracking-wider">Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required disabled={loading}
                className="w-full px-4 py-3 bg-primary/50 border border-secondary/50 rounded-lg text-text-primary focus:ring-2 focus:ring-accent focus:border-transparent disabled:opacity-50" />
            </div>
            <div>
              <label className="block text-text-secondary text-xs mb-2 uppercase tracking-wider">Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required disabled={loading}
                className="w-full px-4 py-3 bg-primary/50 border border-secondary/50 rounded-lg text-text-primary focus:ring-2 focus:ring-accent focus:border-transparent disabled:opacity-50" />
            </div>
            <div>
              <label className="block text-text-secondary text-xs mb-2 uppercase tracking-wider">Bio</label>
              <textarea name="bio" rows="4" value={formData.bio} onChange={handleChange} disabled={loading}
                className="w-full px-4 py-3 bg-primary/50 border border-secondary/50 rounded-lg text-text-primary focus:ring-2 focus:ring-accent focus:border-transparent disabled:opacity-50 font-serif"
                placeholder="Tell us about yourself..." maxLength="200" />
              <p className="text-text-secondary text-xs mt-2">{formData.bio.length}/200</p>
            </div>
          </div>

          {/* Password */}
          <div className="space-y-4 pt-4 border-t border-secondary/50">
            <h3 className="text-lg font-semibold text-text-primary">Change Password</h3>
            <p className="text-text-secondary text-sm">Leave blank to keep current password</p>
            <div>
              <label className="block text-text-secondary text-xs mb-2 uppercase tracking-wider">Current Password</label>
              <input type="password" name="currentPassword" value={formData.currentPassword} onChange={handleChange} disabled={loading}
                className="w-full px-4 py-3 bg-primary/50 border border-secondary/50 rounded-lg text-text-primary focus:ring-2 focus:ring-accent focus:border-transparent disabled:opacity-50" placeholder="••••••••" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-text-secondary text-xs mb-2 uppercase tracking-wider">New Password</label>
                <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} disabled={loading}
                  className="w-full px-4 py-3 bg-primary/50 border border-secondary/50 rounded-lg text-text-primary focus:ring-2 focus:ring-accent focus:border-transparent disabled:opacity-50" placeholder="••••••••" />
              </div>
              <div>
                <label className="block text-text-secondary text-xs mb-2 uppercase tracking-wider">Confirm Password</label>
                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} disabled={loading}
                  className="w-full px-4 py-3 bg-primary/50 border border-secondary/50 rounded-lg text-text-primary focus:ring-2 focus:ring-accent focus:border-transparent disabled:opacity-50" placeholder="••••••••" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-secondary/50">
            <button type="button" onClick={onClose} disabled={loading} className="px-6 py-3 text-text-secondary hover:text-text-primary font-medium disabled:opacity-50">Cancel</button>
            <button type="submit" disabled={loading}
              className="px-8 py-3 bg-accent text-primary rounded-full font-bold disabled:opacity-50 hover:bg-amber-300 transition-all">
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default EditProfileModal;