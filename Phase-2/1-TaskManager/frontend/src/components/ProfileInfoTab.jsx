import { useState } from 'react';
import { User, Mail, Phone, MapPin, Globe, Save } from 'lucide-react';
import api from './api';

export default function ProfileInfoTab({ user, setUser, setMessage }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    website: user?.website || '',
    bio: user?.bio || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put('/auth/profile', formData);
      setUser(response.data);
      setMessage({
        text: 'Profile updated successfully!',
        type: 'success'
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({
        text: 'Failed to update profile',
        type: 'error'
      });
    }
  };

  const fields = [
    { 
      label: 'Full Name', 
      name: 'name', 
      icon: User, 
      type: 'text',
      placeholder: 'Enter your full name'
    },
    { 
      label: 'Email Address', 
      name: 'email', 
      icon: Mail, 
      type: 'email',
      placeholder: 'Enter your email',
      readOnly: true // Email shouldn't be changed
    },
    { 
      label: 'Phone Number', 
      name: 'phone', 
      icon: Phone, 
      type: 'tel',
      placeholder: 'Enter your phone number'
    },
    { 
      label: 'Location', 
      name: 'location', 
      icon: MapPin, 
      type: 'text',
      placeholder: 'Enter your city/country'
    },
    { 
      label: 'Website', 
      name: 'website', 
      icon: Globe, 
      type: 'url',
      placeholder: 'https://example.com'
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Profile Information</h2>
          <p className="text-gray-600 mt-1">Update your personal details and information</p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map((field) => {
            const Icon = field.icon;
            return (
              <div key={field.name} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {field.label}
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    readOnly={!isEditing || field.name === 'email'}
                    className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                      !isEditing || field.name === 'email'
                        ? 'bg-gray-50 text-gray-500'
                        : 'bg-white text-gray-700'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bio Section */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Bio
          </label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Tell us about yourself..."
            rows="4"
            readOnly={!isEditing}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
              !isEditing ? 'bg-gray-50 text-gray-500' : 'bg-white text-gray-700'
            }`}
          />
        </div>
      </form>

      {/* Stats */}
      <div className="mt-8 pt-8 border-t">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Stats</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-xl">
            <p className="text-2xl font-bold text-blue-600">12</p>
            <p className="text-sm text-gray-600">Projects</p>
          </div>
          <div className="bg-green-50 p-4 rounded-xl">
            <p className="text-2xl font-bold text-green-600">48</p>
            <p className="text-sm text-gray-600">Tasks Completed</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-xl">
            <p className="text-2xl font-bold text-purple-600">85%</p>
            <p className="text-sm text-gray-600">Productivity</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-xl">
            <p className="text-2xl font-bold text-yellow-600">30</p>
            <p className="text-sm text-gray-600">Days Active</p>
          </div>
        </div>
      </div>
    </div>
  );
}