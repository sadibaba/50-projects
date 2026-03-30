import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { userService } from '../services/userService';
import { messageService } from '../services/messageService';
import { authService } from '../services/authService';
import './Chat.css';

function Chat({ token, setToken }) {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  // Get current user from token
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    } else if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        setCurrentUser({ id: decoded.id });
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, [token]);

  // Connect to socket
  useEffect(() => {
    if (currentUser) {
      socketRef.current = io('http://localhost:5000', {
        transports: ['websocket', 'polling']
      });

      socketRef.current.on('connect', () => {
        console.log('Socket connected');
      });

      socketRef.current.on('receiveMessage', (messageData) => {
        if (selectedUser && 
            ((messageData.sender === selectedUser._id && messageData.receiver === currentUser.id) ||
             (messageData.sender === currentUser.id && messageData.receiver === selectedUser._id))) {
          setMessages(prev => [...prev, messageData]);
        }
      });

      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
        }
      };
    }
  }, [currentUser, selectedUser]);

  // Join room when user is selected
  useEffect(() => {
    if (selectedUser && currentUser && socketRef.current) {
      const roomId = [currentUser.id, selectedUser._id].sort().join('_');
      socketRef.current.emit('joinRoom', {
        senderId: currentUser.id,
        receiverId: selectedUser._id
      });
      console.log(`Joined room: ${roomId}`);
    }
  }, [selectedUser, currentUser]);

  // Fetch users
  useEffect(() => {
    if (currentUser) {
      fetchUsers();
    }
  }, [searchQuery, currentUser]);

  const fetchUsers = async () => {
    try {
      let fetchedUsers;
      if (searchQuery) {
        fetchedUsers = await userService.searchUsers(searchQuery);
      } else {
        fetchedUsers = await userService.getAllUsers();
      }
      const filtered = fetchedUsers.filter(user => user._id !== currentUser?.id);
      setUsers(filtered);
    } catch (err) {
      console.error('Failed to fetch users', err);
    }
  };

  const fetchMessages = async (userId) => {
    setLoading(true);
    try {
      const fetchedMessages = await messageService.getMessages(currentUser.id, userId);
      setMessages(fetchedMessages);
    } catch (err) {
      console.error('Failed to fetch messages', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    fetchMessages(user._id);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    const messageData = {
      sender: currentUser.id,
      receiver: selectedUser._id,
      text: newMessage,
      createdAt: new Date()
    };

    // Optimistic update
    const tempId = Date.now();
    const tempMessage = { ...messageData, _id: tempId };
    setMessages(prev => [...prev, tempMessage]);
    setNewMessage('');

    try {
      const savedMessage = await messageService.sendMessage(messageData);
      // Update with real message data
      setMessages(prev => prev.map(msg => 
        msg._id === tempId ? savedMessage : msg
      ));
      
      // Emit via socket
      if (socketRef.current) {
        socketRef.current.emit('sendMessage', savedMessage);
      }
    } catch (err) {
      console.error('Failed to send message', err);
      setMessages(prev => prev.filter(msg => msg._id !== tempId));
    }
  };

  const handleLogout = () => {
    authService.logout();
    setToken(null);
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!currentUser) {
    return <div className="loading-container">Loading...</div>;
  }

  return (
    <div className="chat-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="logo-small">
            <span className="logo-icon">💬</span>
            <span>GoldChat</span>
          </div>
          <button onClick={handleLogout} className="logout-btn">🚪</button>
        </div>
        
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="users-list">
          {users.map(user => (
            <div
              key={user._id}
              className={`user-item ${selectedUser?._id === user._id ? 'active' : ''}`}
              onClick={() => handleSelectUser(user)}
            >
              <div className="user-avatar">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div className="user-info">
                <div className="user-name">{user.username}</div>
                <div className="user-email">{user.email}</div>
              </div>
            </div>
          ))}
          {users.length === 0 && (
            <div className="no-users">No users found</div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="chat-area">
        {selectedUser ? (
          <>
            <div className="chat-header">
              <div className="chat-user-info">
                <div className="user-avatar large">
                  {selectedUser.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3>{selectedUser.username}</h3>
                  <p>{selectedUser.email}</p>
                </div>
              </div>
            </div>

            <div className="messages-container">
              {loading ? (
                <div className="loading-messages">
                  <div className="spinner-gold"></div>
                </div>
              ) : (
                <>
                  {messages.map((msg, idx) => (
                    <div
                      key={msg._id || idx}
                      className={`message ${msg.sender === currentUser?.id ? 'sent' : 'received'}`}
                    >
                      <div className="message-bubble">
                        <p>{msg.text}</p>
                        <span className="message-time">{formatTime(msg.createdAt)}</span>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            <form onSubmit={handleSendMessage} className="message-input-form">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="message-input"
              />
              <button type="submit" className="send-btn">Send</button>
            </form>
          </>
        ) : (
          <div className="no-chat-selected">
            <div className="no-chat-content">
              <span className="no-chat-icon">💬</span>
              <h3>Select a user to start chatting</h3>
              <p>Choose someone from the left sidebar to begin your conversation</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;