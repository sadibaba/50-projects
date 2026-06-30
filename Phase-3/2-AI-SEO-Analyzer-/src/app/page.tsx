"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { toast, Toaster } from "sonner";
import {
  XCircle,
  Keyboard,
  Search,
  BarChart3,
  CheckCircle,
  Globe,
  Share2,
  FileSearch,
  Gauge,
  FileText,
  Github,
  Instagram,
  Linkedin,
  TrendingUp,
  Users,
  Award,
  Sparkles,
  Zap,
  Rocket,
  Target,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UrlInput } from "@/components/UrlInput";
import { ScoreCard } from "@/components/ScoreCard";
import { ChecksTab } from "@/components/ChecksTab";
import { ContentStructureTab } from "@/components/ContentStructureTab";
import { RecommendationList } from "@/components/RecommendationList";
import { CompetitorComparison } from "@/components/CompetitorComparison";
import { motion } from "framer-motion";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import type {
  CheckResult,
  SeoData,
  DiscoveryData,
  ContentData,
} from "@/types/analyzer";
import type { Recommendation } from "@/types/recommendation";

// Social Links - Update with your details
const SOCIAL_LINKS = {
  github: "https://github.com/sadibaba",
  instagram: "https://www.instagram.com/sadi_sheikh.94/",
  linkedin: "https://www.linkedin.com/in/aizaz-saad/",
  portfolio: "https://nova-desk-flax.vercel.app/",
  author: "Sheikh Muhammad Aizaz",
};

interface AnalyzeResponse {
  input: {
    raw: string;
    normalized: string;
    timestamp: string;
  };
  fetch: {
    status: number;
    finalUrl: string;
    contentType: string;
    size: number;
    timingMs: number;
  };
  seo: SeoData;
  content: ContentData;
  discovery: DiscoveryData;
  checks: CheckResult[];
  score: {
    score: number;
    max: number;
    total: number;
  };
  recommendations: Recommendation[];
  competitorComparison?: any;
  status: string;
}

export default function HomePage() {
  // ===== FIX: mounted state for hydration =====
  const [mounted, setMounted] = useState(false);
  
  const [url, setUrl] = useState("");
  const [competitors, setCompetitors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // ===== FIX: Set mounted to true after hydration =====
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem("seo-analyzer-tutorial-seen");

    if (!hasSeenTutorial && !loading && !results && !error) {
      const timer = setTimeout(() => {
        startTutorial();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [loading, results, error]);

  const startTutorial = () => {
    setResults(null);
    setError(null);
    setLoading(false);
    setUrl("");

    setTimeout(() => {
      const driverObj = driver({
        showProgress: true,
        showButtons: ["next", "previous", "close"],
        steps: [
          {
            element: "#url-input-container",
            popover: {
              title: "Enter Your Website URL",
              description:
                "Start by typing your website address here. You can enter with or without https://",
              side: "bottom",
              align: "center",
            },
          },
          {
            element: "#competitor-input",
            popover: {
              title: "Add Competitors",
              description:
                "Add competitor URLs to compare and see where you stand against them!",
              side: "bottom",
              align: "center",
            },
          },
          {
            element: "#analyze-button",
            popover: {
              title: "Click Analyze",
              description:
                "Hit this button to start the AI-powered SEO analysis. It only takes a few seconds!",
              side: "bottom",
              align: "center",
            },
          },
          {
            element: "#demo-button",
            popover: {
              title: "Try a Demo",
              description:
                "Want to see it in action first? Click here to analyze a demo website.",
              side: "top",
              align: "center",
            },
          },
          {
            element: "#features-section",
            popover: {
              title: "What We Check",
              description:
                "We analyze On-Page SEO, Content Structure, Social Media tags, Discovery settings, and give you an overall performance score with actionable recommendations.",
              side: "top",
              align: "center",
            },
          },
        ],
        onDestroyed: () => {
          localStorage.setItem("seo-analyzer-tutorial-seen", "true");
        },
      });

      driverObj.drive();
    }, 100);
  };

  const handleAnalyze = async (
    urlToAnalyze?: string | unknown,
    currentAttempt = 1
  ) => {
    const targetUrl = typeof urlToAnalyze === "string" ? urlToAnalyze : url;

    if (!targetUrl.trim()) {
      toast.error("Please enter a URL");
      return;
    }

    if (currentAttempt === 1) {
      setLoading(true);
      setResults(null);
      setError(null);
    }

    try {
      const loadingToast = toast.loading(
        currentAttempt === 1
          ? " Analyzing website with AI..."
          : ` Retrying... (attempt ${currentAttempt}/2)`
      );

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: targetUrl.trim(),
          competitors: competitors.filter(c => c.trim()),
          useAI: true,
        }),
      });

      if (res.status === 429) {
        toast.dismiss(loadingToast);
        setLoading(false);
        const errorMsg =
          " Rate limit reached. Please wait a minute before trying again.";
        setError(errorMsg);
        toast.error(errorMsg);
        return;
      }

      const data = await res.json();
      toast.dismiss(loadingToast);

      if (!res.ok) {
        throw new Error(data.error || "Failed to analyze");
      }

      // ===== FIX: Handle nested data structure =====
      // API returns { success: true, data: { report, summary, raw, metadata } }
      // So we need to extract the actual report data
      if (data && data.data) {
        // New structure with data wrapper
        setResults(data.data);
      } else {
        // Fallback
        setResults(data);
      }
      
      setLoading(false);
      toast.success(" Analysis complete!");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Analysis failed";

      if (currentAttempt === 1) {
        toast.info("First attempt failed, retrying...");
        await new Promise((resolve) => setTimeout(resolve, 500));
        return handleAnalyze(targetUrl, 2);
      }

      setError(message);
      setLoading(false);
      toast.error(` Analysis failed after ${currentAttempt} attempts`);
    }
  };

  const handleDemoClick = () => {
    const demoUrl = "example.com";
    const demoCompetitors = ["google.com", "wikipedia.org"];
    setUrl(demoUrl);
    setCompetitors(demoCompetitors);
    handleAnalyze(demoUrl);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as const },
    },
  };

  // ===== FIX: Don't render until mounted =====
  if (!mounted) {
    return null;
  }

  // ===== FIX: Safe access to score from nested structure =====
  const getScore = () => {
    if (results?.report?.score !== undefined) return results.report.score;
    if (results?.score?.score !== undefined) return results.score.score;
    if (results?.score !== undefined) return results.score;
    return 0;
  };

  const getChecks = () => {
    if (results?.report?.checks) return results.report.checks;
    if (results?.checks) return results.checks;
    return [];
  };

  const getRecommendations = () => {
    if (results?.report?.recommendations) return results.report.recommendations;
    if (results?.recommendations) return results.recommendations;
    return [];
  };

  const getContent = () => {
    if (results?.report?.content) return results.report.content;
    if (results?.content) return results.content;
    return null;
  };

  const getCompetitorComparison = () => {
    if (results?.report?.competitorComparison) return results.report.competitorComparison;
    if (results?.competitorComparison) return results.competitorComparison;
    return null;
  };

  const getAIKeywords = () => {
    if (results?.report?.aiKeywords) return results.report.aiKeywords;
    return null;
  };

  const getAIFAQ = () => {
    if (results?.report?.aiFAQs) return results.report.aiFAQs;
    return null;
  };

  const getSchema = () => {
    if (results?.report?.schema) return results.report.schema;
    return null;
  };

  const score = getScore();
  const checks = getChecks();
  const recommendations = getRecommendations();
  const content = getContent();
  const competitorComparison = getCompetitorComparison();
  const aiKeywords = getAIKeywords();
  const aiFAQs = getAIFAQ();
  const schema = getSchema();

  return (
    <>
      <Toaster position="top-center" />
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 flex flex-col">
        {/* Header */}
        <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between max-w-7xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
                <Rocket className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  AI-SEO Analyzer
                </h1>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-indigo-500" />
                  Powered by AI
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={SOCIAL_LINKS.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-indigo-600 transition p-2 rounded-lg hover:bg-indigo-50"
                title="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-pink-600 transition p-2 rounded-lg hover:bg-pink-50"
                title="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href={SOCIAL_LINKS.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-700 transition p-2 rounded-lg hover:bg-blue-50"
                title="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href={SOCIAL_LINKS.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-indigo-600 transition p-2 rounded-lg hover:bg-indigo-50"
                title="Portfolio"
              >
                <Globe className="w-5 h-5" />
              </a>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <div className="border-b bg-gradient-to-r from-indigo-50/50 via-white to-purple-50/50">
          <div className="container mx-auto px-4 pt-10 pb-8 sm:pt-14 sm:pb-12 lg:pt-18 lg:pb-14 max-w-5xl">
            <motion.div
              className="text-center space-y-3 sm:space-y-4 mb-6 sm:mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" as const }}
            >
              <div className="flex items-center justify-center gap-3 mb-2">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur-2xl opacity-20 animate-pulse"></div>
                  <Image
                    src="/icon.png"
                    alt="SEO Analyzer Icon"
                    width={56}
                    height={56}
                    className="rounded-2xl shadow-xl relative"
                    priority
                    suppressHydrationWarning
                  />
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  AI-SEO Analyzer
                </h1>
              </div>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
                Analyze your website&apos;s SEO performance with AI-powered insights
                <span className="inline-block ml-2">
                  <Sparkles className="w-4 h-4 inline text-indigo-500" />
                </span>
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.5,
                delay: 0.3,
                ease: "easeOut" as const,
              }}
              className="space-y-4"
            >
              <div id="url-input-container">
                <UrlInput
                  value={url}
                  onChange={setUrl}
                  onAnalyze={handleAnalyze}
                  loading={loading}
                />
              </div>

              {/* Competitor Input */}
              <div id="competitor-input" className="max-w-2xl mx-auto">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Users className="w-4 h-4 inline mr-1" />
                  Competitor URLs (optional)
                  <span className="text-xs text-gray-400 ml-2">
                    one per line
                  </span>
                </label>
                <textarea
                  value={competitors.join('\n')}
                  onChange={(e) => setCompetitors(e.target.value.split('\n').filter(Boolean))}
                  placeholder="https://competitor1.com&#10;https://competitor2.com"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition bg-white/50 backdrop-blur-sm resize-none text-sm"
                  rows={2}
                  disabled={loading}
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* ===== FIX: Results Section with nested data support ===== */}
        {results && (
          <div className="container mx-auto px-4 py-8 sm:py-12 max-w-7xl flex-1">
            <div className="space-y-6 sm:space-y-8">
              <ScoreCard score={score} />
              
              {competitorComparison && (
                <CompetitorComparison data={competitorComparison} />
              )}
              
              {checks && checks.length > 0 && (
                <ChecksTab checks={checks} />
              )}
              
              {content && (
                <ContentStructureTab content={content} />
              )}
              
              {recommendations && recommendations.length > 0 && (
                <RecommendationList 
                  recommendations={recommendations}
                  aiKeywords={aiKeywords}
                  aiFAQs={aiFAQs}
                  schemaData={schema}
                />
              )}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!results && !loading && !error && (
          <div className="container mx-auto px-4 py-8 sm:py-12 lg:py-16 max-w-6xl flex-1">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-12 sm:space-y-16"
            >
              {/* Stats Banner */}
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
              >
                {[
                  { icon: <Target className="w-5 h-5" />, label: "SEO Checks", value: "18+" },
                  { icon: <Award className="w-5 h-5" />, label: "AI Score", value: "0-100" },
                  { icon: <Users className="w-5 h-5" />, label: "Competitor Compare", value: "Up to 5" },
                  { icon: <Zap className="w-5 h-5" />, label: "Response Time", value: "< 5s" },
                ].map((stat, i) => (
                  <Card key={i} className="p-4 text-center border-0 shadow-md bg-white/70 backdrop-blur-sm">
                    <div className="text-indigo-600 flex justify-center mb-1">{stat.icon}</div>
                    <div className="text-xl font-bold">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </Card>
                ))}
              </motion.div>

              {/* How It Works */}
              <motion.div
                variants={itemVariants}
                className="text-center space-y-6 sm:space-y-8"
              >
                <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  How It Works
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto">
                  <motion.div
                    variants={itemVariants}
                    className="flex flex-col items-center text-center space-y-3 p-6 rounded-2xl bg-white/50 backdrop-blur-sm border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center shadow-md">
                      <Keyboard className="w-8 h-8 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Enter URL</h3>
                      <p className="text-sm text-muted-foreground">
                        Type your website address
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    className="flex flex-col items-center text-center space-y-3 p-6 rounded-2xl bg-white/50 backdrop-blur-sm border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center shadow-md">
                      <Search className="w-8 h-8 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">AI Analysis</h3>
                      <p className="text-sm text-muted-foreground">
                        AI scans your website instantly
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    className="flex flex-col items-center text-center space-y-3 p-6 rounded-2xl bg-white/50 backdrop-blur-sm border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center shadow-md">
                      <BarChart3 className="w-8 h-8 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Get Insights</h3>
                      <p className="text-sm text-muted-foreground">
                        AI-powered recommendations
                      </p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Quick Demo */}
              <motion.div
                variants={itemVariants}
                className="text-center"
                id="demo-button"
              >
                <p className="text-sm text-muted-foreground mb-3">
                  Want to see it in action?
                </p>
                <Button 
                  onClick={handleDemoClick} 
                  variant="outline" 
                  size="lg"
                  className="border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50 transition-all"
                >
                  <Rocket className="w-4 h-4 mr-2" />
                  Try Demo
                </Button>
              </motion.div>

              {/* Features */}
              <motion.div
                variants={itemVariants}
                className="space-y-6"
                id="features-section"
              >
                <h2 className="text-2xl sm:text-3xl font-bold text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  What We Check
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
                  {[
                    { icon: FileSearch, label: "On-Page SEO", color: "indigo", desc: "Title, meta, canonical" },
                    { icon: FileText, label: "Content", color: "purple", desc: "Headings, images, links" },
                    { icon: Share2, label: "Social Media", color: "pink", desc: "OG & Twitter cards" },
                    { icon: CheckCircle, label: "Discovery", color: "green", desc: "Robots, sitemap" },
                    { icon: Gauge, label: "AI Score", color: "orange", desc: "Overall health" },
                  ].map((item, i) => (
                    <Card key={i} className="p-4 text-center space-y-2 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-md">
                      <div className={`w-12 h-12 rounded-xl bg-${item.color}-100 flex items-center justify-center mx-auto`}>
                        <item.icon className={`w-6 h-6 text-${item.color}-600`} />
                      </div>
                      <h3 className="font-semibold text-sm">{item.label}</h3>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </Card>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="container mx-auto px-4 py-12 sm:py-16 max-w-4xl flex-1">
            <Card className="p-6 sm:p-8 border-red-200 bg-red-50/50 backdrop-blur-sm shadow-lg">
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="p-2 rounded-full bg-red-100 shrink-0">
                  <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-semibold mb-2 text-red-700">
                    Analysis Failed
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {error}
                  </p>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p className="font-medium text-red-600">Common issues:</p>
                    <ul className="list-disc list-inside space-y-0.5 ml-2">
                      <li>URL might not exist or is temporarily unavailable</li>
                      <li>Website is blocking our service</li>
                      <li>Analysis rate limit has been reached</li>
                      <li>Invalid URL format</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Footer */}
        <footer className="border-t mt-auto bg-white/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-12 sm:py-16 max-w-7xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                    <Rocket className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="font-bold text-lg bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    AI-SEO Analyzer
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  AI-powered SEO analysis tool to help optimize your website&apos;s
                  search engine performance with competitor insights.
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                  Quick Links
                </h4>
                <ul className="space-y-3 text-sm">
                  <li>
                    <button
                      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                      className="text-foreground/80 hover:text-indigo-600 transition-colors"
                    >
                      Analyze Website
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={startTutorial}
                      className="text-foreground/80 hover:text-indigo-600 transition-colors"
                    >
                      Take Tutorial
                    </button>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                  Resources
                </h4>
                <ul className="space-y-3 text-sm">
                  <li>
                    <a
                      href="https://developers.google.com/search/docs"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground/80 hover:text-indigo-600 transition-colors inline-flex items-center gap-1"
                    >
                      Google SEO Guide
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://moz.com/beginners-guide-to-seo"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground/80 hover:text-indigo-600 transition-colors inline-flex items-center gap-1"
                    >
                      SEO Basics
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                  Connect
                </h4>
                <ul className="space-y-3 text-sm">
                  <li>
                    <a
                      href={SOCIAL_LINKS.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground/80 hover:text-indigo-600 transition-colors inline-flex items-center gap-2"
                    >
                      <Github className="w-4 h-4" />
                      GitHub
                    </a>
                  </li>
                  <li>
                    <a
                      href={SOCIAL_LINKS.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground/80 hover:text-pink-600 transition-colors inline-flex items-center gap-2"
                    >
                      <Instagram className="w-4 h-4" />
                      Instagram
                    </a>
                  </li>
                  <li>
                    <a
                      href={SOCIAL_LINKS.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground/80 hover:text-blue-700 transition-colors inline-flex items-center gap-2"
                    >
                      <Linkedin className="w-4 h-4" />
                      LinkedIn
                    </a>
                  </li>
                  <li>
                    <a
                      href={SOCIAL_LINKS.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground/80 hover:text-indigo-600 transition-colors inline-flex items-center gap-2"
                    >
                      <Globe className="w-4 h-4" />
                      Portfolio
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
                <p>
                  © {new Date().getFullYear()} AI-SEO Analyzer. Built with ❤️ by{" "}
                  <a
                    href={SOCIAL_LINKS.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-indigo-600 hover:underline"
                  >
                    {SOCIAL_LINKS.author}
                  </a>
                </p>
                <p className="text-xs flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-indigo-500" />
                  Powered by AI
                </p>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}