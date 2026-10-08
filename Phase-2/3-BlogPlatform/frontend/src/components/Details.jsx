import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

/* ── Reusable SVG icon component ────────────────────────── */
const Icon = ({ name, className = "w-6 h-6" }) => {
  const paths = {
    book: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    ),
    heart: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    ),
    comment: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    ),
    theme: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    ),
    bolt: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
        d="M13 10V3L4 14h7v7l9-11h-7z" />
    ),
    shield: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    ),
    user: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    ),
    search: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    ),
    sparkle: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    ),
  };
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      {paths[name]}
    </svg>
  );
};

const FEATURES = [
  { iconName: "book",    title: "Curated Stories",  desc: "Hand-picked biographies of remarkable people from every field." },
  { iconName: "heart",   title: "Likes & Reactions", desc: "Show appreciation for stories that resonate with you." },
  { iconName: "comment", title: "Comments",          desc: "Join the conversation. Share your thoughts with the community." },
  { iconName: "theme",   title: "Light & Dark Mode", desc: "Read comfortably — day or night — with a single toggle." },
  { iconName: "bolt",    title: "Fast & Smooth",     desc: "Optimized for speed with lazy loading and cached content." },
  { iconName: "shield",  title: "Secure Account",    desc: "Your data is protected with JWT, rate limiting, and sanitization." },
];

const FUNCTIONAL_REQS = [
  "Guests can browse stories freely",
  "Readers can register, login, like, and comment",
  "Only admin can publish, edit, or delete stories",
  "Readers can personalize their account (avatar, bio, password)",
  "Full-text search and category filtering",
  "Persistent session with JWT tokens",
];

const NON_FUNCTIONAL_REQS = [
  "Page load under 2 seconds",
  "Responsive on all devices",
  "Secure with rate limiting & sanitization",
  "Accessible (keyboard navigable)",
  "Consistent design system across pages",
  "Light and dark theme support",
];

const Details = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-primary relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-primary via-secondary/20 to-primary"></div>
        <div className="absolute top-[-15%] left-[-10%] w-[600px] h-[600px] rounded-full bg-accent/[0.06] blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-accent/[0.04] blur-[100px] animate-pulse-slow" style={{ animationDelay: "2s" }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 pt-32 pb-20">
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

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <p className="text-accent text-xs uppercase tracking-[0.3em] mb-4 font-medium">
            About the Platform
          </p>
          <h1 className="font-display text-6xl sm:text-7xl md:text-8xl text-text-primary mb-6 leading-none">
            CHRONICA
          </h1>
          <p className="text-text-secondary text-lg max-w-3xl mx-auto font-serif leading-relaxed">
            Chronica is a digital sanctuary dedicated to the stories of remarkable people —
            visionaries, leaders, artists, and thinkers who shaped our world. We believe every
            life is a story worth preserving, and every reader deserves a place to discover them.
          </p>
        </motion.div>

        {/* Purpose */}
        <div className="max-w-4xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-8 sm:p-12"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-accent/10 border border-accent/30 text-accent">
                <Icon name="sparkle" className="w-5 h-5" />
              </span>
              <h2 className="font-display text-3xl text-text-primary">
                Why Chronica Exists
              </h2>
            </div>
            <p className="text-text-secondary font-serif leading-relaxed mb-4">
              In a world of fleeting headlines and shallow content, we wanted to build something
              that honors depth. Chronica is not a news feed — it's a library. Each story is
              carefully written, edited, and presented with the reverence it deserves.
            </p>
            <p className="text-text-secondary font-serif leading-relaxed">
              Whether you're a student, a curious mind, or someone who simply loves biographies,
              Chronica is your quiet corner for stories that stay with you long after you close the tab.
            </p>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="mb-20">
          <h2 className="font-display text-4xl text-text-primary text-center mb-12">
            Features
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass rounded-2xl p-6 hover:border-accent/40 transition-colors group"
              >
                {/* Icon bubble */}
                <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/25 flex items-center justify-center text-accent mb-4 group-hover:bg-accent/20 group-hover:scale-110 transition-all duration-300">
                  <Icon name={f.iconName} className="w-6 h-6" />
                </div>
                <h3 className="font-display text-xl text-text-primary mb-2">{f.title}</h3>
                <p className="text-text-secondary text-sm font-serif">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Requirements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto mb-20">
          {/* Functional */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-accent/10 border border-accent/30 text-accent">
                <Icon name="user" className="w-5 h-5" />
              </span>
              <h3 className="font-display text-2xl text-text-primary">
                Functional Requirements
              </h3>
            </div>
            <ul className="space-y-3">
              {FUNCTIONAL_REQS.map((r, i) => (
                <li key={i} className="flex items-start gap-3 text-text-secondary text-sm font-serif">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0"></span>
                  {r}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Non-Functional */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-accent/10 border border-accent/30 text-accent">
                <Icon name="bolt" className="w-5 h-5" />
              </span>
              <h3 className="font-display text-2xl text-text-primary">
                Non-Functional Requirements
              </h3>
            </div>
            <ul className="space-y-3">
              {NON_FUNCTIONAL_REQS.map((r, i) => (
                <li key={i} className="flex items-start gap-3 text-text-secondary text-sm font-serif">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0"></span>
                  {r}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <button
            onClick={() => navigate("/home")}
            className="inline-flex items-center gap-2 px-8 py-3 bg-accent text-primary rounded-full font-bold text-sm hover:bg-amber-300 transition-all hover:scale-105"
          >
            Start Exploring
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Details;