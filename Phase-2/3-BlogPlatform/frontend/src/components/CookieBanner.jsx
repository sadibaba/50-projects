import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const CookieBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) setVisible(true);
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookieConsent", "declined");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-4 left-4 right-4 z-[100] mx-auto max-w-3xl"
        >
          <div className="glass rounded-2xl p-5 border border-secondary/50 shadow-2xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-1">
                <p className="text-text-primary text-sm font-medium mb-1">
                  🍪 We use cookies
                </p>
                <p className="text-text-secondary text-xs font-serif">
                  We use cookies to improve your experience, remember your theme, and analyze traffic.
                  Read our <Link to="/cookies" className="text-accent underline">Cookie Policy</Link>.
                </p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={handleDecline}
                  className="px-4 py-2 text-text-secondary hover:text-text-primary text-xs font-medium transition-colors border border-secondary/50 rounded-full"
                >
                  Decline
                </button>
                <button
                  onClick={handleAccept}
                  className="px-5 py-2 bg-accent text-primary rounded-full text-xs font-bold hover:bg-amber-300 transition-colors"
                >
                  Accept
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieBanner;