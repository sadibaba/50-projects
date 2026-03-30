// src/components/Chat.jsx (note the .jsx extension)
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
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

  // Decode token to get current user
  useEffect(() => {
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      setCurrentUser({ id: decoded.id });
    } catch (error) {
      console.error('Error decoding token:', error);
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
      socketRef.current.emit('joinRoom', {
        senderId: currentUser.id,
        receiverId: selectedUser._id
      });
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
      const url = searchQuery 
        ? `http://localhost:5000/api/users/search?q=${searchQuery}`
        : 'http://localhost:5000/api/users';
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const filtered = res.data.filter(user => user._id !== currentUser?.id);
      setUsers(filtered);
    } catch (err) {
      console.error('Failed to fetch users', err);
    }
  };

  const fetchMessages = async (userId) => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/messages?sender=${currentUser.id}&receiver=${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(res.data);
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
    setMessages(prev => [...prev, { ...messageData, _id: tempId }]);
    setNewMessage('');

    try {
      const res = await axios.post('http://localhost:5000/api/messages', messageData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Update with real message data
      setMessages(prev => prev.map(msg => 
        msg._id === tempId ? res.data : msg
      ));
      
      // Emit via socket
      if (socketRef.current) {
        socketRef.current.emit('sendMessage', res.data);
      }
    } catch (err) {
      console.error('Failed to send message', err);
      setMessages(prev => prev.filter(msg => msg._id !== tempId));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
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
    return React.createElement('div', { className: 'loading-container' }, 'Loading...');
  }

  return React.createElement('div', { className: 'chat-container' },
    React.createElement('div', { className: 'sidebar' },
      React.createElement('div', { className: 'sidebar-header' },
        React.createElement('div', { className: 'logo-small' },
          React.createElement('span', { className: 'logo-icon' }, '💬'),
          React.createElement('span', null, 'GoldChat')
        ),
        React.createElement('button', { onClick: handleLogout, className: 'logout-btn' }, '🚪')
      ),
      React.createElement('div', { className: 'search-box' },
        React.createElement('input', {
          type: 'text',
          placeholder: '🔍 Search users...',
          value: searchQuery,
          onChange: (e) => setSearchQuery(e.target.value)
        })
      ),
      React.createElement('div', { className: 'users-list' },
        users.map(user => 
          React.createElement('div', {
            key: user._id,
            className: `user-item ${selectedUser?._id === user._id ? 'active' : ''}`,
            onClick: () => handleSelectUser(user)
          },
            React.createElement('div', { className: 'user-avatar' }, user.username.charAt(0).toUpperCase()),
            React.createElement('div', { className: 'user-info' },
              React.createElement('div', { className: 'user-name' }, user.username),
              React.createElement('div', { className: 'user-email' }, user.email)
            )
          )
        ),
        users.length === 0 && React.createElement('div', { className: 'no-users' }, 'No users found')
      )
    ),
    React.createElement('div', { className: 'chat-area' },
      selectedUser ? 
        React.createElement(React.Fragment, null,
          React.createElement('div', { className: 'chat-header' },
            React.createElement('div', { className: 'chat-user-info' },
              React.createElement('div', { className: 'user-avatar large' }, selectedUser.username.charAt(0).toUpperCase()),
              React.createElement('div', null,
                React.createElement('h3', null, selectedUser.username),
                React.createElement('p', null, selectedUser.email)
              )
            )
          ),
          React.createElement('div', { className: 'messages-container' },
            loading ?
              React.createElement('div', { className: 'loading-messages' },
                React.createElement('div', { className: 'spinner-gold' })
              ) :
              React.createElement(React.Fragment, null,
                messages.map((msg, idx) =>
                  React.createElement('div', {
                    key: msg._id || idx,
                    className: `message ${msg.sender === currentUser?.id ? 'sent' : 'received'}`
                  },
                    React.createElement('div', { className: 'message-bubble' },
                      React.createElement('p', null, msg.text),
                      React.createElement('span', { className: 'message-time' }, formatTime(msg.createdAt))
                    )
                  )
                ),
                React.createElement('div', { ref: messagesEndRef })
              )
          ),
          React.createElement('form', { onSubmit: handleSendMessage, className: 'message-input-form' },
            React.createElement('input', {
              type: 'text',
              value: newMessage,
              onChange: (e) => setNewMessage(e.target.value),
              placeholder: 'Type a message...',
              className: 'message-input'
            }),
            React.createElement('button', { type: 'submit', className: 'send-btn' }, 'Send')
          )
        ) :
        React.createElement('div', { className: 'no-chat-selected' },
          React.createElement('div', { className: 'no-chat-content' },
            React.createElement('span', { className: 'no-chat-icon' }, '💬'),
            React.createElement('h3', null, 'Select a user to start chatting'),
            React.createElement('p', null, 'Choose someone from the left sidebar to begin your conversation')
          )
        )
    )
  );
}

export default Chat;