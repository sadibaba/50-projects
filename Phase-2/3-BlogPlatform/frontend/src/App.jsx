import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import LoginSignup from './components/LoginSignup';
import Home from './components/Home';
import AllPosts from './components/AllPosts';
import UserProfile from './components/UserProfile';
import BlogDetail from './components/BlogDetail';
import Dashboard from './components/Dashboard';
import './App.css';
import Cursor from './components/Cursor';
import Navbar from './components/Navbar';

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Navigate to="/auth" />} />
        <Route path="/auth" element={<LoginSignup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/posts" element={<AllPosts />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/profile/:username" element={<UserProfile />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  useEffect(() => {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    if (!cursorDot || !cursorOutline) return;

    const moveCursor = (e) => {
      const posX = e.clientX;
      const posY = e.clientY;

      cursorDot.style.left = `${posX}px`;
      cursorDot.style.top = `${posY}px`;

      cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
      }, { duration: 500, fill: 'forwards' });
    };

    const handleMouseOver = (e) => {
      if (e.target.closest('a, button, input, textarea, [role="button"]')) {
        document.body.classList.add('cursor-hover');
        cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
        cursorOutline.style.backgroundColor = 'rgba(212, 161, 93, 0.2)';
        cursorOutline.style.borderColor = 'var(--color-accent)';
      }
    };

    const handleMouseOut = (e) => {
      if (e.target.closest('a, button, input, textarea, [role="button"]')) {
        document.body.classList.remove('cursor-hover');
        cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorOutline.style.backgroundColor = 'transparent';
        cursorOutline.style.borderColor = 'var(--color-text-secondary)';
      }
    };

    window.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  return (
    <Router>
      <Cursor />
      <div className="App bg-primary text-text-primary">
        <Navbar />
        <AnimatedRoutes />
      </div>
    </Router>
  );
}

export default App;