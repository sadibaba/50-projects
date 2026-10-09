import React, { useLayoutEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import creatorImage from "../images/creator.jpg";

gsap.registerPlugin(ScrollTrigger);

const PROJECTS = [
  {
    title: "Anthology — Blog Platform",
    role: "Full-Stack Developer",
    year: "2026",
    description:
      "A cinematic blogging platform with real-time likes, comments, follow system, and an orbital 3D post wheel. Built from scratch as a final-year project.",
    stack: ["React", "Node.js", "MongoDB", "GSAP", "Tailwind"],
    screenshot: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?q=80&w=1400",
  },
  {
    title: "Realtime Chat App",
    role: "Full-Stack Developer",
    year: "2025",
    description:
      "A WebSocket-powered chat application with rooms, typing indicators, read receipts, and end-to-end encrypted messages.",
    stack: ["React", "Socket.IO", "Express", "Redis"],
    screenshot: "https://images.unsplash.com/photo-1611606063065-ee7946f0787a?q=80&w=1400",
  },
  {
    title: "E-Commerce Storefront",
    role: "Frontend Engineer",
    year: "2025",
    description:
      "A high-performance storefront with cart persistence, Stripe checkout, product filters, and admin dashboard.",
    stack: ["Next.js", "Stripe", "PostgreSQL", "Prisma"],
    screenshot: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1400",
  },
  {
    title: "Task Manager API",
    role: "Backend Developer",
    year: "2024",
    description:
      "A RESTful API with JWT auth, role-based access, background jobs, and full test coverage using Jest and Supertest.",
    stack: ["Node.js", "Express", "MongoDB", "Jest"],
    screenshot: "https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?q=80&w=1400",
  },
  {
    title: "Portfolio Website",
    role: "Designer & Developer",
    year: "2024",
    description:
      "A minimal, animation-heavy portfolio with custom cursor, seamless scroll, and 3D transitions. Won college design award.",
    stack: ["React", "Framer Motion", "GSAP", "Tailwind"],
    screenshot: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?q=80&w=1400",
  },
];

const About = () => {
  const navigate = useNavigate();
  const pageRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".project-card").forEach((card) => {
        gsap.fromTo(
          card,
          { y: 80, opacity: 0, rotateX: -10, filter: "blur(8px)" },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            filter: "blur(0px)",
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      gsap.to(".about-cover-inner", {
        scrollTrigger: {
          trigger: ".about-cover",
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
        y: 60,
        scale: 1.08,
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className="min-h-screen bg-primary relative overflow-hidden">
      {/* ─── Cinematic Background (theme-aware) ─── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Base gradient — uses theme primary variable */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary via-primary/95 to-primary"></div>

        {/* Glowing orbs — theme accent & secondary */}
        <div className="absolute top-[-15%] left-[-10%] w-[600px] h-[600px] rounded-full bg-accent/[0.06] blur-[120px] animate-pulse-slow"></div>
        <div className="absolute top-[40%] right-[-15%] w-[700px] h-[700px] rounded-full bg-secondary/60 blur-[140px] animate-pulse-slow" style={{ animationDelay: "2s" }}></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] rounded-full bg-accent/[0.04] blur-[100px] animate-pulse-slow" style={{ animationDelay: "4s" }}></div>

        {/* Grain texture */}
        <div
          className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        ></div>

        {/* Vignette — light/dark aware */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.15)_100%)] dark:bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)]"></div>

        {/* Grid lines — theme accent */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(var(--color-accent) 1px, transparent 1px), linear-gradient(90deg, var(--color-accent) 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
          }}
        ></div>
      </div>

      {/* ─── Content ─── */}
      <div className="relative z-10">
        {/* Back */}
        <div className="container mx-auto px-4 pt-32 pb-4">
          <button
            onClick={() => navigate("/home")}
            className="inline-flex items-center text-accent hover:text-amber-300 text-sm group"
          >
            <svg className="w-4 h-4 mr-1.5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </button>
        </div>

        {/* Cover — theme-aware gradients */}
        <div className="about-cover relative h-56 sm:h-72 overflow-hidden">
          <div className="about-cover-inner absolute inset-0">
            {/* Replaced hardcoded #0A0F0D with theme variables */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-primary"></div>
            <div className="absolute top-0 left-[20%] w-[400px] h-[400px] rounded-full bg-accent/[0.08] blur-[100px]"></div>
            <div className="absolute bottom-0 right-[15%] w-[400px] h-[400px] rounded-full bg-accent/[0.06] blur-[100px]"></div>
            <div
              className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              }}
            ></div>
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-b from-transparent via-primary/70 to-primary"></div>
          </div>
        </div>

        {/* Profile Header */}
        <div className="container mx-auto px-4 relative -mt-32 sm:-mt-40">
          {/* Glass card — theme-aware background */}
          <div className="absolute inset-x-4 top-20 bottom-0 rounded-3xl bg-primary/80 dark:bg-primary/70 backdrop-blur-md -z-10 pointer-events-none border border-secondary/30 shadow-lg shadow-black/5 dark:shadow-none"></div>

          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5 mb-10">
            {/* Avatar */}
            <motion.div
              initial={{ scale: 0.6, opacity: 0, rotate: -8 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 180, damping: 14 }}
              className="relative flex-shrink-0"
            >
              <div
                className="absolute -inset-1.5 rounded-full"
                style={{
                  background:
                    "conic-gradient(from 0deg, #D4A15D, #f9a8d4, #86efac, #93c5fd, #D4A15D)",
                }}
              ></div>
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-primary overflow-hidden bg-secondary">
                <img
                  src={creatorImage}
                  alt="Saad — Full-Stack Developer"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "https://ui-avatars.com/api/?name=Saad&background=1C2B27&color=D4A15D&size=200";
                  }}
                />
              </div>
            </motion.div>

            {/* Info — theme-aware text colors */}
            <div className="text-text-primary pb-1">
              <p className="text-accent text-xs uppercase tracking-[0.3em] mb-2 font-medium">
                About the Creator
              </p>
              <h1 className="font-display text-3xl sm:text-5xl tracking-wide mb-3">
                Saad — Full-Stack Developer
              </h1>
              <p className="text-text-secondary text-sm max-w-2xl font-serif italic mb-4">
                I build cinematic web experiences. Obsessed with clean architecture, seamless animation,
                and interfaces that feel alive. Currently finishing my CS degree while shipping
                production-grade apps.
              </p>
              <div className="flex flex-wrap gap-2 text-text-secondary text-xs">
                <span className="rounded-full border border-secondary/50 bg-secondary/40 px-3 py-1">
                  Based in Pakistan
                </span>
                <span className="rounded-full border border-secondary/50 bg-secondary/40 px-3 py-1">
                  3+ years coding
                </span>
                <span className="rounded-full border border-secondary/50 bg-secondary/40 px-3 py-1">
                  Available for freelance
                </span>
              </div>
            </div>
          </div>

          {/* Bio Section — theme-aware cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-2 rounded-3xl border border-secondary/50 bg-secondary/40 backdrop-blur-sm p-8 shadow-sm dark:shadow-none"
            >
              <h2 className="font-display text-2xl text-text-primary mb-4">
                The Story
              </h2>
              <div className="space-y-4 text-text-secondary text-sm leading-relaxed font-serif">
                <p>
                  I started writing code on a borrowed laptop in 2022 — building small HTML pages
                  that no one saw. Fast forward to today, I've shipped full-stack platforms,
                  real-time apps, and design systems used by real people.
                </p>
                <p>
                  My approach:{" "}
                  <span className="text-accent font-semibold">
                    treat every project like a film
                  </span>
                  . The pacing matters. The transitions matter. The silence between interactions
                  matters. I don't just build — I compose.
                </p>
                <p>
                  When I'm not coding, I'm studying typography, watching film breakdowns, or
                  drinking too much chai while debugging something that worked five minutes ago.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="rounded-3xl border border-secondary/50 bg-secondary/40 backdrop-blur-sm p-8 shadow-sm dark:shadow-none"
            >
              <h2 className="font-display text-2xl text-text-primary mb-4">
                Focus
              </h2>
              <ul className="space-y-3 text-sm">
                {[
                  "React & Next.js architecture",
                  "Node.js + Express APIs",
                  "MongoDB data modeling",
                  "GSAP + Framer Motion animation",
                  "Tailwind design systems",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-text-secondary">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Projects */}
          <div className="mb-20">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-accent text-xs uppercase tracking-[0.3em] mb-2 font-medium">
                  Selected Work
                </p>
                <h2 className="font-display text-4xl sm:text-5xl text-text-primary">
                  Projects
                </h2>
              </div>
              <span className="text-text-secondary text-sm">
                {PROJECTS.length} projects
              </span>
            </div>

            <div className="space-y-8">
              {PROJECTS.map((project, i) => (
                <motion.div key={i} className="project-card group" initial={false}>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center rounded-3xl border border-secondary/50 bg-secondary/30 backdrop-blur-sm p-6 hover:border-accent/40 transition-all duration-500 shadow-sm dark:shadow-none">
                    {/* Screenshot */}
                    <div
                      className={`relative h-64 lg:h-80 rounded-2xl overflow-hidden border border-secondary/40 ${
                        i % 2 === 1 ? "lg:order-2" : ""
                      }`}
                    >
                      <img
                        src={project.screenshot}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        onError={(e) => {
                          e.target.src =
                            "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?q=80&w=1400";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent"></div>
                      <span className="absolute top-4 left-4 px-3 py-1 bg-primary/70 backdrop-blur-sm text-accent text-xs font-medium rounded-full">
                        {project.year}
                      </span>
                    </div>

                    {/* Info */}
                    <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                      <p className="text-accent text-xs uppercase tracking-wider mb-2">
                        {project.role}
                      </p>
                      <h3 className="font-display text-2xl sm:text-3xl text-text-primary mb-3 group-hover:text-accent transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-text-secondary text-sm mb-5 font-serif leading-relaxed">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {project.stack.map((tech, j) => (
                          <span
                            key={j}
                            className="px-3 py-1 bg-primary/40 border border-secondary/50 rounded-full text-xs text-text-secondary"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* CTA — theme-aware */}
          <div className="mb-20 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="inline-block rounded-3xl border border-secondary/50 bg-secondary/40 backdrop-blur-sm px-10 py-10 shadow-sm dark:shadow-none"
            >
              <p className="text-accent text-xs uppercase tracking-[0.3em] mb-3 font-medium">
                Let's work together
              </p>
              <h3 className="font-display text-3xl sm:text-4xl text-text-primary mb-4">
                Got an idea? Let's build it.
              </h3>
              <button
                onClick={() => navigate("/contact")}
                className="inline-flex items-center gap-2 px-8 py-3 bg-accent text-primary rounded-full font-bold text-sm hover:bg-amber-300 transition-all hover:scale-105"
              >
                Get in Touch
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;