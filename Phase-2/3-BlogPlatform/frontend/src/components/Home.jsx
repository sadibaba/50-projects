import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import BlogCard from "./BlogCard";
import CreateBlogModal from "./CreateBlogModal";
import { getPosts, getImageUrl } from "../api/api";

const HeroSection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <section ref={ref} className="section relative h-screen">
      <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1790288025544-e06d7cc03070?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxMDJ8fHxlbnwwfHx8fHw%3D"
          alt="Background"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary via-primary/80 to-primary"></div>
      </motion.div>
      <div className="relative z-10 text-center px-4">
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="section-title text-gradient"
        >
          STORIES IN MOTION
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="section-subtitle"
        >
          A digital anthology for the curious mind. Discover narratives that transcend the ordinary.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.1 }}
          className="mt-12"
        >
          <Link to="#featured" className="inline-flex items-center text-accent hover:text-amber-300 transition-colors text-lg font-medium group">
            Explore the Collection
            <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
            </svg>
          </Link>
        </motion.div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>
    </section>
  );
};

const AboutSection = () => (
  <section id="about" className="section bg-secondary">
    <div className="max-w-4xl mx-auto">
      <h2 className="section-title text-text-primary">WHY ANTHOLOGY?</h2>
      <p className="section-subtitle text-text-secondary">
        In a world of fleeting content, Anthology is a sanctuary for stories that matter. We are a community of writers, thinkers, and artists dedicated to the craft of narrative. Here, every post is a chapter, and every reader is a traveler. We believe in the power of the written word to inspire, challenge, and connect us.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
        {[
          { title: "Curated Stories", desc: "Hand-picked narratives from a diverse community of voices." },
          { title: "Cinematic Design", desc: "An interface designed to let the stories take center stage." },
          { title: "A Global Community", desc: "Connect with readers and writers from around the world." },
        ].map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: i * 0.2 }}
            className="glass p-8 rounded-2xl text-center"
          >
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-accent/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h3 className="font-display text-2xl text-text-primary mb-2">{item.title}</h3>
            <p className="text-text-secondary text-sm">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const FeaturedSection = ({ blogs, loading }) => {
  const navigate = useNavigate();

  return (
    <section id="featured" className="section bg-primary">
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-16 gap-4">
          <h2 className="section-title text-text-primary">FEATURED STORIES</h2>
          <button
            onClick={() => navigate('/posts')}
            className="inline-flex items-center text-accent hover:text-amber-300 transition-colors text-sm font-medium group whitespace-nowrap"
          >
            View All Stories
            <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-secondary/50 rounded-xl p-6 animate-pulse">
                <div className="h-48 bg-secondary rounded-lg mb-4" />
                <div className="h-3 bg-secondary rounded w-1/4 mb-3" />
                <div className="h-5 bg-secondary rounded mb-2" />
                <div className="h-3 bg-secondary rounded mb-4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.slice(0, 6).map((blog, i) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                onClick={() => navigate(`/blog/${blog.id}`)}
                className="cursor-pointer"
              >
                <BlogCard blog={blog} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

const ContactSection = () => (
  <section id="contact" className="section bg-secondary">
    <div className="max-w-3xl mx-auto text-center">
      <h2 className="section-title text-text-primary">JOIN THE CONVERSATION</h2>
      <p className="section-subtitle text-text-secondary mb-12">
        Have a story to tell? A question to ask? We'd love to hear from you.
      </p>
      <Link to="/auth" className="inline-block px-10 py-4 bg-accent text-primary font-bold rounded-full hover:bg-amber-300 transition-all duration-300 text-lg tracking-wider">
        Start Writing
      </Link>
    </div>
  </section>
);

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

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

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await getPosts();
      const postsData = Array.isArray(response) ? response : response?.data || response || [];
      const processed = postsData.map(processBlog);
      setBlogs(processed);
    } catch (error) {
      console.error("Error fetching blogs:", error);
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

  const handleCreateBlog = () => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/auth"); return; }
    setShowCreateModal(true);
  };

  const handleCreateSuccess = async (newPost) => {
    if (newPost) {
      const processed = processBlog(newPost);
      setBlogs((prev) => [processed, ...prev]);
    } else {
      await fetchBlogs();
    }
  };

  return (
    <div className="min-h-screen bg-primary">
      {/* Floating Write Button */}
      {user && (
        <button
          onClick={handleCreateBlog}
          className="fixed bottom-8 right-8 z-40 w-14 h-14 bg-accent rounded-full shadow-lg flex items-center justify-center hover:bg-amber-300 transition-all duration-300 hover:scale-110"
          aria-label="Write blog"
        >
          <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      )}
      <HeroSection />
      <AboutSection />
      <FeaturedSection blogs={blogs} loading={loading} />
      <ContactSection />
      {showCreateModal && (
        <CreateBlogModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateSuccess}
        />
      )}
    </div>
  );
};

export default Home;