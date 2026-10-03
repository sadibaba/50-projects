import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPosts, getImageUrl } from '../api/api';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import BlogCard from './BlogCard';
import CreateBlogModal from './CreateBlogModal';

gsap.registerPlugin(ScrollTrigger);

const AllPosts = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const containerRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');
    const userRole = localStorage.getItem('userRole');
    const userAvatar = localStorage.getItem('userAvatar');
    if (token && userName) {
      setUser({ role: userRole || 'reader', name: userName, email: userEmail, token, avatar: userAvatar });
    }
    fetchBlogs();
  }, []);

  useEffect(() => {
    filterBlogs();
  }, [blogs, searchTerm, selectedCategory]);

  // GSAP scroll animations
  useLayoutEffect(() => {
    if (loading || filteredBlogs.length === 0) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.post-card-item');

      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          {
            y: 80,
            opacity: 0,
            rotateX: -15,
            scale: 0.95,
            filter: 'blur(10px)',
          },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            scale: 1,
            filter: 'blur(0px)',
            duration: 1.2,
            ease: 'power3.out',
            delay: (i % 3) * 0.12,
            scrollTrigger: {
              trigger: card,
              start: 'top 90%',
              end: 'top 40%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, gridRef);

    return () => ctx.revert();
  }, [loading, filteredBlogs]);

  // Animate header on scroll
  useLayoutEffect(() => {
    if (loading) return;
    const ctx = gsap.context(() => {
      gsap.to('.posts-hero', {
        scrollTrigger: {
          trigger: '.posts-hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
        y: -80,
        opacity: 0.3,
        scale: 0.95,
      });
    }, containerRef);
    return () => ctx.revert();
  }, [loading]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await getPosts(true);
      const postsData = Array.isArray(response) ? response : response?.data || response || [];
      const processed = postsData.map(processBlog);
      setBlogs(processed);
      buildCategories(processed);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const processBlog = (blog) => ({
    id: blog._id || blog.id,
    _id: blog._id || blog.id,
    title: blog.title || 'Untitled Post',
    content: blog.content || '',
    excerpt: blog.excerpt || (blog.content ? blog.content.substring(0, 150) + '...' : 'No description available'),
    authorName: blog.authorName || blog.author?.name || blog.author || 'Anonymous',
    authorId: blog.authorId || blog.author?._id,
    authorAvatar: blog.authorAvatar || blog.author?.avatar,
    author: blog.author,
    date: blog.createdAt ? new Date(blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Unknown date',
    category: blog.category || 'Uncategorized',
    // image: (() => {
    //   if (blog.image) {
    //     if (typeof blog.image === 'string') return blog.image;
    //     if (blog.image.url) return blog.image.url;
    //     if (blog.image.data) return blog.image.data;
    //   }
    //   return null;
    // })(),
    image: getImageUrl(blog.image),
    readTime: blog.readTime || `${Math.ceil((blog.content?.split(' ').length || 0) / 200) || 3} min read`,
    likes: blog.likes?.length || 0,
    likesArray: blog.likes || [],
    comments: blog.comments?.length || 0,
    views: blog.views || 0,
    createdAt: blog.createdAt,
  });

  const buildCategories = (posts) => {
    const counts = {};
    posts.forEach((b) => {
      if (b.category) counts[b.category] = (counts[b.category] || 0) + 1;
    });
    const unique = Object.keys(counts);
    setCategories([
      { name: 'All', value: 'all', count: posts.length },
      ...unique.map((c) => ({ name: c, value: c.toLowerCase(), count: counts[c] })),
    ]);
  };

  const filterBlogs = () => {
    let results = blogs;
    if (selectedCategory !== 'all') {
      results = results.filter((b) => b.category?.toLowerCase() === selectedCategory.toLowerCase());
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      results = results.filter(
        (b) =>
          b.title?.toLowerCase().includes(q) ||
          b.content?.toLowerCase().includes(q) ||
          b.authorName?.toLowerCase().includes(q) ||
          b.category?.toLowerCase().includes(q)
      );
    }
    setFilteredBlogs(results);
  };

  const handleCreateBlog = () => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/auth'); return; }
    setShowCreateModal(true);
  };

  const handleCreateSuccess = async (newPost) => {
    if (newPost) {
      const processed = processBlog(newPost);
      setBlogs((prev) => [processed, ...prev]);
      buildCategories([processed, ...blogs]);
    } else {
      await fetchBlogs();
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-primary pt-32 pb-20 relative overflow-hidden">
      {/* ============ CINEMATIC BACKGROUND ============ */}
      {/* Layer 1: Base gradient */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-primary via-[#0d1412] to-primary"></div>

        {/* Layer 2: Glowing orbs */}
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-accent/[0.06] blur-[120px] animate-pulse-slow"></div>
        <div className="absolute top-[30%] right-[-15%] w-[700px] h-[700px] rounded-full bg-[#1C2B27]/60 blur-[140px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] rounded-full bg-accent/[0.04] blur-[100px] animate-pulse-slow" style={{ animationDelay: '4s' }}></div>

        {/* Layer 3: Grain texture */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        ></div>

        {/* Layer 4: Subtle vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]"></div>

        {/* Layer 5: Animated grid lines */}
        <div className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(212,161,93,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(212,161,93,0.3) 1px, transparent 1px)`,
            backgroundSize: '80px 80px',
          }}
        ></div>
      </div>

      {/* ============ CONTENT ============ */}
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="posts-hero text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-accent text-xs uppercase tracking-[0.3em] mb-4 font-medium">
              The Collection
            </p>
            <h1 className="font-display text-6xl sm:text-7xl md:text-8xl text-text-primary mb-6 leading-none">
              ALL STORIES
            </h1>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto font-serif mb-8">
              Browse through our entire collection of narratives, ideas, and perspectives.
            </p>
            {user && (
              <button
                onClick={handleCreateBlog}
                className="group inline-flex items-center gap-2 px-6 py-3 bg-accent text-primary rounded-full font-bold text-sm hover:bg-amber-300 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-accent/30"
              >
                <svg className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Write a Story
              </button>
            )}
          </motion.div>
        </div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-2xl mx-auto mb-8"
        >
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-transparent rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity blur-md"></div>
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search stories by title, author, or content..."
              className="relative w-full pl-12 pr-4 py-4 bg-secondary/40 backdrop-blur-sm border border-secondary/50 rounded-full text-text-primary placeholder-text-secondary focus:ring-2 focus:ring-accent focus:border-transparent text-sm transition-all"
            />
          </div>
        </motion.div>

        {/* Category Filter */}
        {categories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 backdrop-blur-sm ${
                  selectedCategory === cat.value
                    ? 'bg-accent text-primary shadow-lg shadow-accent/20 scale-105'
                    : 'bg-secondary/40 text-text-secondary hover:bg-secondary/60 hover:text-text-primary border border-secondary/50'
                }`}
              >
                <span>{cat.name}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs ${
                    selectedCategory === cat.value ? 'bg-primary/20' : 'bg-primary/40'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            ))}
          </motion.div>
        )}

        {/* Results Count */}
        <div className="flex items-center justify-between mb-8">
          <p className="text-text-secondary text-sm">
            Showing <span className="text-text-primary font-medium">{filteredBlogs.length}</span>{' '}
            {filteredBlogs.length === 1 ? 'story' : 'stories'}
          </p>
          {(searchTerm || selectedCategory !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="text-accent hover:text-amber-300 text-sm font-medium flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear filters
            </button>
          )}
        </div>

        {/* Blog Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-secondary/40 backdrop-blur-sm rounded-2xl p-6 animate-pulse border border-secondary/30">
                <div className="h-48 bg-secondary rounded-xl mb-4" />
                <div className="h-3 bg-secondary rounded w-1/4 mb-3" />
                <div className="h-5 bg-secondary rounded mb-2" />
                <div className="h-3 bg-secondary rounded mb-4" />
              </div>
            ))}
          </div>
        ) : filteredBlogs.length > 0 ? (
          <div
            ref={gridRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 [perspective:1500px]"
          >
            {filteredBlogs.map((blog) => (
              <div
                key={blog.id}
                className="post-card-item will-change-transform"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <BlogCard blog={blog} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 text-text-secondary">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-text-primary mb-2">No stories found</h3>
            <p className="text-text-secondary mb-6 text-sm">
              Try adjusting your search or category filter.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="px-6 py-2.5 bg-accent text-primary rounded-full font-bold text-sm hover:bg-amber-300 transition-colors"
            >
              View All Stories
            </button>
          </div>
        )}

        {/* Bottom spacing for depth */}
        <div className="h-32"></div>
      </div>

      {/* Floating Write Button */}
      {user && (
        <button
          onClick={handleCreateBlog}
          className="fixed bottom-8 right-8 z-40 w-14 h-14 bg-accent rounded-full shadow-lg shadow-accent/30 flex items-center justify-center hover:bg-amber-300 transition-all duration-300 hover:scale-110"
          aria-label="Write blog"
        >
          <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      )}

      {/* Create Blog Modal */}
      {showCreateModal && (
        <CreateBlogModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateSuccess}
        />
      )}
    </div>
  );
};

export default AllPosts;