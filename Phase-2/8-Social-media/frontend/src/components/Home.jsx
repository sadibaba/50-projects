import { useState, useEffect } from "react";
import Chat from "./Chat";
import { connectSocket, disconnectSocket, getSocket } from "../services/socket";
import { getCurrentUser , getAllUsers , getChatUsers } from "../services/api";

function Home() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatUsers, setChatUsers] = useState([]);
  const [onlineUsersList, setOnlineUsersList] = useState([]);

  const fetchCurrentUser  = async () => {
    try {
      const data = await getCurrentUser()
      setCurrentUser(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers()
      setUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChatUsers  = async () => {
    try {
      const data = await getChatUsers()
      setChatUsers (data);
    } catch (error) {
      console.error(error);
    }
  };

  // Socket connection
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      connectSocket(token);
      const socket = getSocket();
      
      if (socket) {
        socket.on("online-users", (users) => {
          setOnlineUsersList(users);
        });
        
        socket.on("new-message", () => {
          fetchChatUsers();
        });
      }
    }
    
    return () => {
      disconnectSocket();
    };
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchUsers();
    fetchCurrentUser();
    fetchChatUsers();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Navbar */}
      <nav className="bg-white/10 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <span className="text-white font-bold text-xl">ChatHub</span>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                  {currentUser?.username?.[0]?.toUpperCase() || "U"}
                </div>
                <span className="text-white hidden sm:inline">
                  {currentUser?.username || "Username"}
                </span>
              </div>
              <button 
                onClick={() => {
                  localStorage.clear();
                  window.location.href = "/login";
                }}
                className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition duration-200 flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl p-6 mb-8 border border-white/10">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {currentUser?.username || "Guest"}!
          </h1>
          <p className="text-gray-300">
            Ready to connect with friends? Start a conversation now.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-6 border-b border-white/10">
          <button onClick={() => setActiveTab('dashboard')} className={`px-6 py-3 font-medium transition duration-200 ${activeTab === 'dashboard' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400 hover:text-gray-300'}`}>
            Dashboard
          </button>
          <button onClick={() => setActiveTab('users')} className={`px-6 py-3 font-medium transition duration-200 ${activeTab === 'users' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400 hover:text-gray-300'}`}>
            Users
          </button>
          <button onClick={() => setActiveTab('profile')} className={`px-6 py-3 font-medium transition duration-200 ${activeTab === 'profile' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400 hover:text-gray-300'}`}>
            Profile
          </button>
        </div>
        
        {/* Dashboard Tab Content */}
        {activeTab === "dashboard" && (
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-4">Quick Stats</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white/10 rounded-xl p-4">
                <div className="text-gray-400 text-sm">Total Users</div>
                <div className="text-2xl font-bold text-white">
                  {Array.isArray(users) ? users.length : 0}
                </div>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <div className="text-gray-400 text-sm">Online Now</div>
                <div className="text-2xl font-bold text-green-400">
                  {onlineUsersList.length}
                </div>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <div className="text-gray-400 text-sm">Active Chats</div>
                <div className="text-2xl font-bold text-purple-400">
                  {chatUsers.length}
                </div>
              </div>
            </div>
            <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/20">
              <p className="text-gray-300 text-center">
                 Click on Users tab to start chatting with friends!
              </p>
            </div>
          </div>
        )}

        {/* Users Tab Content */}
        {activeTab === "users" && (
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-4">All Users</h2>
            <div className="space-y-3">
              {users.map((user) => (
                <div key={user._id} className="flex items-center justify-between p-4 bg-white/10 rounded-xl hover:bg-white/20 transition">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {user.username?.[0]?.toUpperCase() || "?"}
                      </div>
                      <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${
                        onlineUsersList.includes(user._id) ? "bg-green-500" : "bg-gray-500"
                      }`}></div>
                    </div>
                    <div>
                      <div className="text-white font-medium">{user.username}</div>
                      <div className="text-gray-400 text-sm">{user.email}</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedUser(user)}
                    className="px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 rounded-lg transition"
                  >
                    Chat
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Profile Tab Content */}
        {activeTab === "profile" && (
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-4">Profile Information</h2>
            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4">
                {currentUser?.username?.[0]?.toUpperCase() || "U"}
              </div>
              <h3 className="text-xl text-white font-semibold">{currentUser?.username || "User"}</h3>
              <p className="text-gray-400">{currentUser?.email || "user@example.com"}</p>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-white/10">
                <span className="text-gray-400">Member Since</span>
                <span className="text-white">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/10">
                <span className="text-gray-400">Status</span>
                <span className="text-green-400">Active</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chat Modal */}
      {selectedUser && (
        <Chat
          selectedUser={selectedUser}
          currentUser={currentUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
}

export default Home;