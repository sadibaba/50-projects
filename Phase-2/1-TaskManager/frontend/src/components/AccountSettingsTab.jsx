import { useState } from 'react';
import { 
  Bell, 
  Globe, 
  Moon, 
  Mail, 
  Eye, 
  Trash2,
  Save
} from 'lucide-react';
import api from './api';

export default function AccountSettingsTab({ user, setMessage }) {
  const [settings, setSettings] = useState({
    emailNotifications: user?.settings?.emailNotifications ?? true,
    pushNotifications: user?.settings?.pushNotifications ?? true,
    language: user?.settings?.language || 'en',
    theme: user?.settings?.theme || 'light',
    privacy: user?.settings?.privacy || 'public',
  });
  const [loading, setLoading] = useState(false);

  const handleToggle = (field) => {
    setSettings(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSelectChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveSettings = async () => {
    try {
      setLoading(true);
      await api.put('/auth/settings', { settings });
      setMessage({
        text: 'Settings updated successfully!',
        type: 'success'
      });
    } catch (error) {
      console.error('Error updating settings:', error);
      setMessage({
        text: 'Failed to update settings',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        setLoading(true);
        await api.delete('/auth/account');
        localStorage.removeItem('token');
        window.location.href = '/login';
      } catch (error) {
        console.error('Error deleting account:', error);
        setMessage({
          text: 'Failed to delete account',
          type: 'error'
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Settings className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Account Settings</h2>
            <p className="text-gray-600 mt-1">Customize your account preferences</p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Notifications */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="font-medium text-gray-700">Email Notifications</p>
                <p className="text-sm text-gray-500">Receive email updates about your account</p>
              </div>
              <button
                onClick={() => handleToggle('emailNotifications')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                  settings.emailNotifications ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="font-medium text-gray-700">Push Notifications</p>
                <p className="text-sm text-gray-500">Receive push notifications in browser</p>
              </div>
              <button
                onClick={() => handleToggle('pushNotifications')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                  settings.pushNotifications ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    settings.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Language & Region */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Language & Region
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Language
              </label>
              <select
                value={settings.language}
                onChange={(e) => handleSelectChange('language', e.target.value)}
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="hi">Hindi</option>
                <option value="ur">Urdu</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Time Zone
              </label>
              <select
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="UTC">UTC</option>
                <option value="EST">Eastern Time (EST)</option>
                <option value="PST">Pacific Time (PST)</option>
                <option value="GMT">GMT</option>
                <option value="IST">India Standard Time (IST)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Moon className="w-5 h-5" />
            Appearance
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['light', 'dark', 'auto'].map((theme) => (
              <button
                key={theme}
                onClick={() => handleSelectChange('theme', theme)}
                className={`p-4 border rounded-xl text-center transition-all ${
                  settings.theme === theme
                    ? 'border-blue-500 bg-blue-50 text-blue-600'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-sm font-medium capitalize">{theme} Theme</div>
              </button>
            ))}
          </div>
        </div>

        {/* Privacy */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Privacy
          </h3>
          <div className="space-y-3">
            {['public', 'private', 'contacts'].map((privacy) => (
              <div key={privacy} className="flex items-center gap-3">
                <input
                  type="radio"
                  id={privacy}
                  name="privacy"
                  checked={settings.privacy === privacy}
                  onChange={() => handleSelectChange('privacy', privacy)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor={privacy} className="text-gray-700 capitalize">
                  {privacy} profile
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-4 justify-between pt-8 border-t">
          <div>
            <button
              onClick={handleSaveSettings}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Settings
            </button>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => setMessage({ text: 'Export feature coming soon!', type: 'info' })}
              className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
            >
              Export Data
            </button>
            
            <button
              onClick={handleDeleteAccount}
              disabled={loading}
              className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-medium flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}