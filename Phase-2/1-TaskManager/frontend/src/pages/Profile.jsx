import { useState } from 'react';
import { 
  User, Mail, Phone, MapPin, Globe, Calendar, 
  Lock, Settings, Shield, LogOut, Check, Edit2, Save, X
} from 'lucide-react';

export default function ProfilePage() {
  // Get user data from localStorage or use default
  const [user, setUser] = useState({
    name: localStorage.getItem('userName') || "Guest User",
    email: localStorage.getItem('userEmail') || "guest@example.com",
    phone: "",
    location: "",
    website: "",
    bio: "Welcome to your profile!",
    createdAt: new Date().toLocaleDateString()
  });

  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...user });
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = () => {
    // Save to localStorage
    localStorage.setItem('userName', formData.name);
    localStorage.setItem('userEmail', formData.email);
    
    // Update state
    setUser(formData);
    setIsEditing(false);
    setMessage('Profile updated successfully!');
    
    // Clear message after 3 seconds
    setTimeout(() => setMessage(''), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
          <p className="text-gray-600 mt-2">Manage your personal information</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
                <div className="flex items-center gap-2 text-gray-600 mt-1">
                  <Mail className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
              </div>
            </div>
            
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({ ...user });
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
              </div>
            )}
          </div>

          {/* Success Message */}
          {message && (
            <div className="mb-6 p-3 bg-green-50 text-green-700 rounded-lg">
              ✅ {message}
            </div>
          )}

          {/* Profile Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full pl-12 pr-4 py-3 rounded-lg border ${
                      isEditing 
                        ? 'bg-white border-gray-300 text-gray-800' 
                        : 'bg-gray-50 border-gray-200 text-gray-500'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full pl-12 pr-4 py-3 rounded-lg border ${
                      isEditing 
                        ? 'bg-white border-gray-300 text-gray-800' 
                        : 'bg-gray-50 border-gray-200 text-gray-500'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Add phone number"
                    disabled={!isEditing}
                    className={`w-full pl-12 pr-4 py-3 rounded-lg border ${
                      isEditing 
                        ? 'bg-white border-gray-300 text-gray-800' 
                        : 'bg-gray-50 border-gray-200 text-gray-500'
                    }`}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Add your location"
                    disabled={!isEditing}
                    className={`w-full pl-12 pr-4 py-3 rounded-lg border ${
                      isEditing 
                        ? 'bg-white border-gray-300 text-gray-800' 
                        : 'bg-gray-50 border-gray-200 text-gray-500'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="https://example.com"
                    disabled={!isEditing}
                    className={`w-full pl-12 pr-4 py-3 rounded-lg border ${
                      isEditing 
                        ? 'bg-white border-gray-300 text-gray-800' 
                        : 'bg-gray-50 border-gray-200 text-gray-500'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Member Since
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={user.createdAt}
                    disabled
                    className="w-full pl-12 pr-4 py-3 rounded-lg border bg-gray-50 border-gray-200 text-gray-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bio Section */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Tell us about yourself..."
              rows="3"
              disabled={!isEditing}
              className={`w-full px-4 py-3 rounded-lg border ${
                isEditing 
                  ? 'bg-white border-gray-300 text-gray-800' 
                  : 'bg-gray-50 border-gray-200 text-gray-500'
              }`}
            />
          </div>

          {/* Stats */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Stats</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-xl">
                <p className="text-2xl font-bold text-blue-600">12</p>
                <p className="text-sm text-gray-600">Projects</p>
              </div>
              <div className="bg-green-50 p-4 rounded-xl">
                <p className="text-2xl font-bold text-green-600">48</p>
                <p className="text-sm text-gray-600">Tasks Done</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-xl">
                <p className="text-2xl font-bold text-purple-600">85%</p>
                <p className="text-sm text-gray-600">Progress</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-xl">
                <p className="text-2xl font-bold text-yellow-600">7</p>
                <p className="text-sm text-gray-600">Active Days</p>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>

        {/* Info Note */}
        <div className="mt-6 p-4 bg-blue-50 rounded-xl text-center">
          <p className="text-sm text-blue-700">
            ℹ️ This is a local-only profile. Data is saved in your browser's localStorage.
          </p>
        </div>
      </div>
    </div>
  );
}