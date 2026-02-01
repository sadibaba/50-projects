import { useState, useEffect } from 'react';
import api from '../api/axios'; 

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get('/auth/profile');
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setMessage({
        text: 'Failed to load profile',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500">Failed to load user profile</p>
          <button 
            onClick={fetchUserProfile}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Profile Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account information and preferences</p>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar */}
          <ProfileSidebar 
            user={user} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
          />

          {/* Right Content Area */}
          <div className="flex-1">
            {message.text && (
              <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {message.text}
              </div>
            )}

            {activeTab === 'profile' && (
              <ProfileInfoTab 
                user={user} 
                setUser={setUser}
                setMessage={setMessage}
              />
            )}
            
            {activeTab === 'password' && (
              <ChangePasswordTab 
                setMessage={setMessage}
              />
            )}
            
            {activeTab === 'settings' && (
              <AccountSettingsTab 
                user={user}
                setMessage={setMessage}
              />
            )}
            
            {activeTab === 'security' && (
              <SecurityTab 
                user={user}
                setMessage={setMessage}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}