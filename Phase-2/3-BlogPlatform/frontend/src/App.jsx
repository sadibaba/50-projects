import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState, Suspense, lazy } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import OnboardingTutorial from "./components/OnboardingTutorial";
import "./App.css";
import Cursor from "./components/Cursor";
import Navbar from "./components/Navbar";

/* ── Lazy loaded pages (fast processing) ─────────────────── */
const LoginSignup = lazy(() => import("./components/LoginSignup"));
const Home = lazy(() => import("./components/Home"));
const AllPosts = lazy(() => import("./components/AllPosts"));
const AccountPage = lazy(() => import("./components/AccountPage"));
const BlogDetail = lazy(() => import("./components/BlogDetail"));
const Dashboard = lazy(() => import("./components/Dashboard"));
const About = lazy(() => import("./components/About"));
const Contact = lazy(() => import("./components/Contact"));
const Details = lazy(() => import("./components/Details"));

/* ── Page loader (suspense fallback) ─────────────────────── */
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-primary">
    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-accent" />
  </div>
);

/* ── Routes ──────────────────────────────────────────────── */
const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<PageLoader />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Navigate to="/auth" />} />
          <Route path="/auth" element={<LoginSignup />} />
          <Route path="/home" element={<Home />} />
          <Route path="/posts" element={<AllPosts />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/details" element={<Details />} />
          <Route path="/contact" element={<Contact />} />
          {/* ❌ /profile, /profile/:username — REMOVED */}
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};

/* ── Main App ────────────────────────────────────────────── */
function App() {
  const [showTutorial, setShowTutorial] = useState(false);

  /* Show tutorial only if logged in AND hasn't seen it yet */
  useEffect(() => {
    const token = localStorage.getItem("token");
    const seen = localStorage.getItem("hasSeenTutorial");
    if (token && seen !== "true") {
      setShowTutorial(true);
    }
  }, []);

  /* Custom cursor logic */
  useEffect(() => {
    const cursorDot = document.querySelector(".cursor-dot");
    const cursorOutline = document.querySelector(".cursor-outline");
    if (!cursorDot || !cursorOutline) return;

    const moveCursor = (e) => {
      cursorDot.style.left = `${e.clientX}px`;
      cursorDot.style.top = `${e.clientY}px`;
      cursorOutline.animate(
        { left: `${e.clientX}px`, top: `${e.clientY}px` },
        { duration: 500, fill: "forwards" }
      );
    };

    const handleMouseOver = (e) => {
      if (e.target.closest('a, button, input, textarea, [role="button"]')) {
        cursorOutline.style.transform = "translate(-50%, -50%) scale(1.5)";
        cursorOutline.style.backgroundColor = "rgba(212, 161, 93, 0.2)";
        cursorOutline.style.borderColor = "var(--color-accent)";
      }
    };

    const handleMouseOut = (e) => {
      if (e.target.closest('a, button, input, textarea, [role="button"]')) {
        cursorOutline.style.transform = "translate(-50%, -50%) scale(1)";
        cursorOutline.style.backgroundColor = "transparent";
        cursorOutline.style.borderColor = "var(--color-text-secondary)";
      }
    };

    window.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
    };
  }, []);

  const handleTutorialComplete = () => {
    localStorage.setItem("hasSeenTutorial", "true");
    setShowTutorial(false);
  };

  return (
    <ThemeProvider>
      <Router>
        <Cursor />
        <div className="App bg-primary text-text-primary">
          <Navbar />
          <AnimatedRoutes />
          {showTutorial && (
            <OnboardingTutorial onComplete={handleTutorialComplete} />
          )}
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;