import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { markTutorialSeen } from '../api/api';

/* ── Inline SVG icons (design system style) ─────────────── */
const Icon = ({ name, className = "w-16 h-16" }) => {
  const paths = {
    welcome: (
      // Sparkle / Star
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    ),
    browse: (
      // Open book
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    ),
    engage: (
      // Chat bubble with heart
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    ),
    profile: (
      // User with pencil
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    ),
    theme: (
      // Sun / Moon combo
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    ),
  };

  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      {paths[name]}
    </svg>
  );
};

const STEPS = [
  {
    title: 'Welcome to Chronica',
    description: 'Your gateway to the lives of remarkable people — their stories, struggles, and legacy.',
    iconName: 'welcome',
  },
  {
    title: 'Browse Stories',
    description: 'Explore curated biographies and stories from politicians, artists, scientists, and more.',
    iconName: 'browse',
  },
  {
    title: 'Like & Comment',
    description: 'Engage with stories you love. Like them, share your thoughts in the comments.',
    iconName: 'engage',
  },
  {
    title: 'Personalize Your Profile',
    description: 'Add a bio, upload an avatar, and make Chronica yours.',
    iconName: 'profile',
  },
  {
    title: 'Switch Themes',
    description: 'Enjoy light or dark mode — whichever feels right. Toggle anytime from the navbar.',
    iconName: 'theme',
  },
];

const OnboardingTutorial = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const isLast = step === STEPS.length - 1;

  const handleNext = async () => {
    if (isLast) {
      try { await markTutorialSeen(); } catch (_) {}
      onComplete();
    } else {
      setStep(s => s + 1);
    }
  };

  const handleSkip = async () => {
    try { await markTutorialSeen(); } catch (_) {}
    onComplete();
  };

  const current = STEPS[step];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="glass rounded-3xl max-w-md w-full p-8 relative overflow-hidden"
      >
        {/* Progress bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-secondary/40">
          <motion.div
            className="h-full bg-accent"
            initial={{ width: 0 }}
            animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.35 }}
            className="text-center py-6"
          >
            {/* Icon bubble */}
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center text-accent">
              <Icon name={current.iconName} className="w-12 h-12" />
            </div>

            <h2 className="font-display text-3xl text-text-primary mb-3">
              {current.title}
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed font-serif">
              {current.description}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Dots */}
        <div className="flex justify-center gap-2 mb-6">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step ? 'w-6 bg-accent' : 'w-1.5 bg-secondary/60'
              }`}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleSkip}
            className="text-text-secondary hover:text-text-primary text-sm transition-colors"
          >
            Skip
          </button>
          <button
            onClick={handleNext}
            className="px-6 py-2.5 bg-accent text-primary rounded-full font-bold text-sm hover:bg-amber-300 transition-all hover:scale-105 inline-flex items-center gap-2"
          >
            {isLast ? 'Get Started' : 'Next'}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default OnboardingTutorial;