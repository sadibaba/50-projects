import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Chat from './components/Chat';
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/login" element={!token ? <Login setToken={setToken} /> : <Navigate to="/chat" />} />
          <Route path="/register" element={!token ? <Register setToken={setToken} /> : <Navigate to="/chat" />} />
          <Route path="/chat" element={token ? <Chat token={token} setToken={setToken} /> : <Navigate to="/login" />} />
          <Route path="/" element={<Navigate to={token ? "/chat" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;