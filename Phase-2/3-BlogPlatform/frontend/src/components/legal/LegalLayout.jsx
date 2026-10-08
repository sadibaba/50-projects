import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

const LegalLayout = ({ title, subtitle, lastUpdated, children }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-primary relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-primary via-primary/95 to-primary"></div>
        <div className="absolute top-[-15%] left-[-10%] w-[600px] h-[600px] rounded-full bg-accent/[0.06] blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-accent/[0.04] blur-[100px] animate-pulse-slow" style={{ animationDelay: "2s" }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 pt-32 pb-20 max-w-4xl">
        {/* Back */}
        <button
          onClick={() => navigate("/home")}
          className="inline-flex items-center text-accent hover:text-amber-300 text-sm group mb-8"
        >
          <svg className="w-4 h-4 mr-1.5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-12"
        >
          <p className="text-accent text-xs uppercase tracking-[0.3em] mb-3 font-medium">
            Legal
          </p>
          <h1 className="font-display text-5xl sm:text-6xl text-text-primary mb-4 leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-text-secondary text-lg font-serif italic mb-4">
              {subtitle}
            </p>
          )}
          {lastUpdated && (
            <p className="text-text-secondary text-xs uppercase tracking-wider">
              Last Updated: {lastUpdated}
            </p>
          )}
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="glass rounded-3xl p-8 sm:p-12 legal-content"
        >
          {children}
        </motion.div>

        {/* Footer Links */}
        <div className="mt-12 pt-8 border-t border-secondary/30">
          <p className="text-text-secondary text-xs text-center mb-4 uppercase tracking-wider">
            Related Legal Pages
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { to: "/terms", label: "Terms" },
              { to: "/privacy", label: "Privacy" },
              { to: "/cookies", label: "Cookies" },
              { to: "/disclaimer", label: "Disclaimer" },
              { to: "/acceptable-use", label: "Acceptable Use" },
              { to: "/dmca", label: "DMCA" },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-xs text-text-secondary hover:text-accent transition-colors border border-secondary/40 rounded-full px-3 py-1.5"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalLayout;