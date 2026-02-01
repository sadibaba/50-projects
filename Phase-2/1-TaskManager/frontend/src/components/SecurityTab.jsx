import { useState } from 'react';
import { 
  Shield, 
  Smartphone, 
  Lock, 
  Check, 
  X,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import api from './api';

export default function SecurityTab({ user, setMessage }) {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(user?.twoFactorEnabled || false);
  const [loading, setLoading] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(false);
  const [activeSessions, setActiveSessions] = useState([
    { id: 1, device: 'Chrome on Windows', location: 'New York, USA', lastActive: '2 hours ago', current: true },
    { id: 2, device: 'Safari on iPhone', location: 'London, UK', lastActive: '1 day ago', current: false },
    { id: 3, device: 'Firefox on Mac', location: 'Tokyo, Japan', lastActive: '1 week ago', current: false },
  ]);

  const handleTwoFactorToggle = async () => {
    try {
      setLoading(true);
      if (twoFactorEnabled) {
        await api.post('/auth/disable-2fa');
        setTwoFactorEnabled(false);
        setMessage({
          text: 'Two-factor authentication disabled',
          type: 'success'
        });
      } else {
        await api.post('/auth/enable-2fa');
        setTwoFactorEnabled(true);
        setMessage({
          text: 'Two-factor authentication enabled',
          type: 'success'
        });
      }
    } catch (error) {
      console.error('Error toggling 2FA:', error);
      setMessage({
        text: 'Failed to update two-factor authentication',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutAllSessions = async () => {
    if (window.confirm('Are you sure you want to logout from all devices?')) {
      try {
        setSessionLoading(true);
        await api.post('/auth/logout-all');
        setMessage({
          text: 'Logged out from all devices',
          type: 'success'
        });
        // Refresh page to get new token
        window.location.reload();
      } catch (error) {
        console.error('Error logging out all sessions:', error);
        setMessage({
          text: 'Failed to logout all sessions',
          type: 'error'
        });
      } finally {
        setSessionLoading(false);
      }
    }
  };

  const handleRevokeSession = (sessionId) => {
    if (window.confirm('Are you sure you want to revoke this session?')) {
      setActiveSessions(prev => prev.filter(session => session.id !== sessionId));
      setMessage({
        text: 'Session revoked',
        type: 'success'
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Shield className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Security</h2>
            <p className="text-gray-600 mt-1">Manage your account security settings</p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Two-Factor Authentication */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Smartphone className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
              </div>
            </div>
            <button
              onClick={handleTwoFactorToggle}
              disabled={loading}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all ${
                twoFactorEnabled ? 'bg-green-600' : 'bg-gray-300'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {twoFactorEnabled ? (
            <div className="bg-green-50 p-4 rounded-xl border border-green-200">
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-green-700">2FA is enabled</p>
                  <p className="text-sm text-green-600 mt-1">
                    Your account is protected with two-factor authentication. You'll need to enter a code from your authenticator app when signing in.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-700">2FA is disabled</p>
                  <p className="text-sm text-yellow-600 mt-1">
                    Enable two-factor authentication for enhanced security. We recommend using Google Authenticator or Authy.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Active Sessions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Lock className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Active Sessions</h3>
                <p className="text-sm text-gray-500">Manage your active login sessions</p>
              </div>
            </div>
            <button
              onClick={handleLogoutAllSessions}
              disabled={sessionLoading}
              className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${sessionLoading ? 'animate-spin' : ''}`} />
              Logout All
            </button>
          </div>

          <div className="space-y-3">
            {activeSessions.map((session) => (
              <div
                key={session.id}
                className={`p-4 border rounded-xl ${
                  session.current ? 'border-blue-200 bg-blue-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      session.current ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{session.device}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                        <span>{session.location}</span>
                        <span>•</span>
                        <span>Last active: {session.lastActive}</span>
                        {session.current && (
                          <>
                            <span>•</span>
                            <span className="text-blue-600 font-medium">Current Session</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  {!session.current && (
                    <button
                      onClick={() => handleRevokeSession(session.id)}
                      className="text-gray-400 hover:text-red-600 p-2"
                      title="Revoke session"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security Recommendations */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-800">Security Recommendations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <h4 className="font-medium text-gray-800 mb-2">Strong Password</h4>
              <p className="text-sm text-gray-600">
                Use a unique password with letters, numbers, and symbols. Change it every 90 days.
              </p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <h4 className="font-medium text-gray-800 mb-2">Regular Updates</h4>
              <p className="text-sm text-gray-600">
                Keep your browser and operating system updated for the latest security patches.
              </p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <h4 className="font-medium text-gray-800 mb-2">Phishing Awareness</h4>
              <p className="text-sm text-gray-600">
                Never share your password or verification codes. Be cautious of suspicious emails.
              </p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <h4 className="font-medium text-gray-800 mb-2">Secure Connection</h4>
              <p className="text-sm text-gray-600">
                Always use HTTPS and avoid public Wi-Fi for sensitive operations.
              </p>
            </div>
          </div>
        </div>

        {/* Last Security Activity */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-800">Recent Security Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Password changed</span>
              </div>
              <span className="text-xs text-gray-500">2 days ago</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-700">New login from Chrome</span>
              </div>
              <span className="text-xs text-gray-500">1 week ago</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Profile information updated</span>
              </div>
              <span className="text-xs text-gray-500">2 weeks ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}