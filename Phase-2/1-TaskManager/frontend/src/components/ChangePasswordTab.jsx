import { useState } from 'react';
import { Lock, Eye, EyeOff, Key, Shield, Check } from 'lucide-react';
import api from './api';

export default function ChangePasswordTab({ setMessage }) {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({
        text: 'New passwords do not match',
        type: 'error'
      });
      return;
    }

    if (formData.newPassword.length < 6) {
      setMessage({
        text: 'Password must be at least 6 characters',
        type: 'error'
      });
      return;
    }

    try {
      setLoading(true);
      await api.put('/auth/change-password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      
      setMessage({
        text: 'Password changed successfully!',
        type: 'success'
      });
      
      // Reset form
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error changing password:', error);
      setMessage({
        text: error.response?.data?.message || 'Failed to change password',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const passwordRequirements = [
    { text: 'At least 6 characters', met: formData.newPassword.length >= 6 },
    { text: 'Contains uppercase letter', met: /[A-Z]/.test(formData.newPassword) },
    { text: 'Contains lowercase letter', met: /[a-z]/.test(formData.newPassword) },
    { text: 'Contains number', met: /\d/.test(formData.newPassword) },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Lock className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Change Password</h2>
            <p className="text-gray-600 mt-1">Update your password to keep your account secure</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Current Password */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Current Password
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Key className="w-5 h-5" />
            </div>
            <input
              type={showCurrentPassword ? "text" : "password"}
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              placeholder="Enter current password"
              required
              className="w-full pl-12 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            New Password
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Lock className="w-5 h-5" />
            </div>
            <input
              type={showNewPassword ? "text" : "password"}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Enter new password"
              required
              className="w-full pl-12 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Confirm New Password
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Shield className="w-5 h-5" />
            </div>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm new password"
              required
              className="w-full pl-12 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Password Requirements */}
        <div className="bg-gray-50 p-4 rounded-xl">
          <h4 className="font-medium text-gray-700 mb-3">Password Requirements</h4>
          <ul className="space-y-2">
            {passwordRequirements.map((req, index) => (
              <li key={index} className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  req.met ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  <Check className="w-3 h-3" />
                </div>
                <span className={`text-sm ${req.met ? 'text-green-600' : 'text-gray-500'}`}>
                  {req.text}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:opacity-90 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Updating...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                Change Password
              </>
            )}
          </button>
        </div>
      </form>

      {/* Security Tips */}
      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
        <h4 className="font-medium text-yellow-800 mb-2 flex items-center gap-2">
          <Shield className="w-4 h-4" />
          Security Tips
        </h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Use a unique password that you don't use elsewhere</li>
          <li>• Change your password regularly</li>
          <li>• Never share your password with anyone</li>
          <li>• Enable two-factor authentication for extra security</li>
        </ul>
      </div>
    </div>
  );
}