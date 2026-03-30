import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { NoteProvider } from './context/NoteContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './pages/Dashboard';
import NotesPage from './pages/NotesPage';
import UserProfile from './components/User/UserProfile';
import AnimatedRoutes from './components/Layout/AnimatedRoutes';

function App() {
  return (
    <Router>
      <AuthProvider>
        <NoteProvider>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#4ade80',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
          <AnimatedRoutes />
        </NoteProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;