import { 
  User, 
  Lock, 
  Settings, 
  Shield,
  LogOut,
  Mail,
  Calendar,
  UserCheck
} from 'lucide-react';

export default function ProfileSidebar({ user, activeTab, setActiveTab }) {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const menuItems = [
    { id: 'profile', label: 'Profile Information', icon: User },
    { id: 'password', label: 'Change Password', icon: Lock },
    { id: 'settings', label: 'Account Settings', icon: Settings },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <div className="lg:w-80 bg-white rounded-2xl shadow-lg p-6 h-fit">
      {/* User Info Card */}
      <div className="text-center mb-8 pb-8 border-b">
        <div className="relative inline-block mb-4">
          <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold mx-auto">
            {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <button className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 shadow-md">
            <User className="w-4 h-4" />
          </button>
        </div>
        
        <h2 className="text-xl font-bold text-gray-800">{user?.name || 'User'}</h2>
        <div className="flex items-center justify-center gap-2 mt-2 text-gray-600">
          <Mail className="w-4 h-4" />
          <p className="text-sm">{user?.email}</p>
        </div>
        
        {user?.createdAt && (
          <div className="flex items-center justify-center gap-2 mt-2 text-gray-500 text-xs">
            <Calendar className="w-3 h-3" />
            <span>Member since {new Date(user.createdAt).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id
                  ? 'bg-blue-50 text-blue-600 border border-blue-200'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 mt-8 px-4 py-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl font-medium transition-colors"
      >
        <LogOut className="w-5 h-5" />
        Logout
      </button>

      {/* Account Status */}
      <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
        <div className="flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-green-600" />
          <div>
            <p className="text-sm font-medium text-green-700">Account Active</p>
            <p className="text-xs text-green-600 mt-1">Your account is verified and active</p>
          </div>
        </div>
      </div>
    </div>
  );
}