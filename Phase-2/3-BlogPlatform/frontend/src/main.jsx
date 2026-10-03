import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

function startApp() {
  const rootElement = document.getElementById('root');
  const loader = document.querySelector('.loader-container');
  if (loader) {
    loader.style.opacity = '0';
    loader.style.transition = 'opacity 1s ease-out';
    setTimeout(() => {
      loader.remove();
    }, 1000);
  }
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

// Loader animation
document.addEventListener('DOMContentLoaded', () => {
  const clockElement = document.getElementById('loader-clock');
  const textElement = document.getElementById('loader-text');
  const phrases = [
    "Preparing your experience...",
    "Curating stories...",
    "Connecting worlds...",
    "Ready."
  ];
  let phraseIndex = 0;

  const interval = setInterval(() => {
    if (textElement) {
      textElement.textContent = phrases[phraseIndex % phrases.length];
      phraseIndex++;
    }
  }, 1500);

  const updateClock = () => {
    if (clockElement) {
      const now = new Date();
      clockElement.textContent = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
    }
  };

  updateClock();
  const clockInterval = setInterval(updateClock, 1000);

  // Simulate loading completion
  setTimeout(() => {
    clearInterval(interval);
    clearInterval(clockInterval);
    startApp();
  }, 4000); // Adjust time as needed
});