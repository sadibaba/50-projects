import React, { useState } from 'react';
import { updateUserProfile, uploadAvatar } from '../api/api';

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

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file');
      return;
    }

    setAvatar(file);
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);
  };

  // In EditProfileModal.jsx, update the handleSubmit function:

// Update the handleSubmit function in EditProfileModal.jsx

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');
  setSuccess('');

  console.log('Starting profile update...');

  // Validation
  if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
    setError('New passwords do not match');
    setLoading(false);
    return;
  }

  try {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in');
      setLoading(false);
      return;
    }

    // First, upload avatar if changed (BEFORE profile update)
    let avatarUrl = user.avatar;
    if (avatar) {
      console.log('Uploading avatar...');
      try {
        const avatarFormData = new FormData();
        avatarFormData.append('avatar', avatar);
        
        // Log FormData contents for debugging
        console.log('FormData contents:');
        for (let pair of avatarFormData.entries()) {
          console.log(pair[0], pair[1]);
        }
        
        const avatarResponse = await uploadAvatar(avatarFormData);
        console.log('Avatar upload response:', avatarResponse);
        
        avatarUrl = avatarResponse.avatar || avatarResponse.data?.avatar;
        
        if (avatarUrl) {
          localStorage.setItem('userAvatar', avatarUrl);
          console.log('Avatar saved:', avatarUrl);
        }
      } catch (avatarErr) {
        console.error('Avatar upload error details:', avatarErr);
        setError('Avatar upload failed: ' + avatarErr.message);
        setLoading(false);
        return;
      }
    }

    // Then update profile info
    const updateData = {
      name: formData.name,
      email: formData.email,
      bio: formData.bio,
    };

    console.log('Update data being sent:', updateData);

    // Only add password if provided
    if (formData.newPassword && formData.currentPassword) {
      updateData.currentPassword = formData.currentPassword;
      updateData.newPassword = formData.newPassword;
      console.log('Password update included');
    }

    console.log('Updating profile info...');
    const response = await updateUserProfile(updateData);
    console.log('Profile update response:', response);
    
    // Update localStorage with profile info
    localStorage.setItem('userName', formData.name);
    localStorage.setItem('userEmail', formData.email);
    localStorage.setItem('userBio', formData.bio);
    
    setSuccess('Profile updated successfully!');
    console.log('Profile update complete');
    
    // Call the parent's onSave function
    onSave({
      ...updateData,
      avatar: avatarUrl
    });
    
    setTimeout(() => {
      onClose();
    }, 1500);
    
  } catch (err) {
    console.error('Update profile error details:', err);
    console.error('Error stack:', err.stack);
    
    // Handle rate limiting error specifically
    if (err.message.includes('Too many requests') || err.message.includes('429')) {
      setError('Too many update attempts. Please wait 15-30 minutes before trying again.');
    } else if (err.message.includes('network') || err.message.includes('fetch')) {
      setError('Network error. Please check your connection and try again.');
    } else {
      setError(err.message || 'Failed to update profile');
    }
  } finally {
    setLoading(false);
  }

  
  // In the handleSubmit function, update the avatar URL handling:

if (avatar) {
  console.log('Uploading avatar...');
  try {
    const avatarFormData = new FormData();
    avatarFormData.append('avatar', avatar);
    
    console.log('FormData contents:');
    for (let pair of avatarFormData.entries()) {
      console.log(pair[0], pair[1]);
    }
    
    const avatarResponse = await uploadAvatar(avatarFormData);
    console.log('Avatar upload response:', avatarResponse);
    
    // Fix: Convert relative path to full URL
    let avatarUrl = avatarResponse.avatar || avatarResponse.data?.avatar;
    if (avatarUrl && !avatarUrl.startsWith('http')) {
      avatarUrl = `http://localhost:5000${avatarUrl}`;
    }
    
    console.log('Avatar saved (full URL):', avatarUrl);
    
    if (avatarUrl) {
      localStorage.setItem('userAvatar', avatarUrl);
    }
  } catch (avatarErr) {
    console.error('Avatar upload error details:', avatarErr);
    setError('Avatar upload failed: ' + avatarErr.message);
    setLoading(false);
    return;
  }
}
};
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-2xl border border-gray-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 z-10 bg-gray-900 border-b border-gray-800 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              disabled={loading}
            >
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error/Success Messages */}
          {error && (
            <div className="bg-red-900/30 border border-red-800 text-red-400 px-4 py-3 rounded-lg">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}
          {success && (
            <div className="bg-green-900/30 border border-green-800 text-green-400 px-4 py-3 rounded-lg">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>{success}</span>
              </div>
            </div>
          )}

          {/* Avatar Upload */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Profile Picture</h3>
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600">
                  <img
                    src={avatarPreview}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=8b5cf6&color=fff&size=200`;
                    }}
                  />
                </div>
                <label
                  htmlFor="avatar-upload"
                  className={`absolute bottom-0 right-0 p-1.5 bg-gray-900 rounded-full border border-gray-700 cursor-pointer hover:bg-gray-800 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                  disabled={loading}
                />
              </div>
              <p className="text-gray-500 text-sm">Click the camera icon to change your profile picture</p>
            </div>
          </div>

          {/* Profile Info */}
          <div className="space-y-6 pt-6 border-t border-gray-800">
            <h3 className="text-lg font-semibold text-white">Profile Information</h3>
            
            <div>
              <label className="block text-gray-400 text-sm mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">Bio</label>
              <textarea
                name="bio"
                rows="4"
                value={formData.bio}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:opacity-50"
                placeholder="Tell us about yourself..."
                maxLength="200"
              />
              <p className="text-gray-500 text-sm mt-2">
                {formData.bio.length}/200 characters
              </p>
            </div>
          </div>

          {/* Change Password */}
          <div className="space-y-6 pt-6 border-t border-gray-800">
            <h3 className="text-lg font-semibold text-white">Change Password</h3>
            <p className="text-gray-500 text-sm">Leave blank if you don't want to change your password</p>
            
            <div>
              <label className="block text-gray-400 text-sm mb-2">Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:opacity-50"
                placeholder="••••••••"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:opacity-50"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:opacity-50"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-800">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-3 text-gray-400 hover:text-white font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Saving...</span>
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;