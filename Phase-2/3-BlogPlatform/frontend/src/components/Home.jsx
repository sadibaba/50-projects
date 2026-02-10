import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getPosts, createPost } from '../api/api.js';
import BlogCard from './BlogCard';
import CategoryFilter from './CategoryFilter';
import CreateBlogModal from './CreateBlogModal';

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Fetch blogs on component mount
  useEffect(() => {
    fetchBlogs();
    // Get user info from localStorage
    const userRole = localStorage.getItem('userRole');
    const userName = localStorage.getItem('userName') || 'Author';
    const userEmail = localStorage.getItem('userEmail');
    if (userRole || userName) {
      setUser({ 
        role: userRole || 'reader', 
        name: userName,
        email: userEmail 
      });
    }
  }, []);

  // Filter blogs when category or search changes
  useEffect(() => {
    let results = blogs;
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      results = results.filter(blog => 
        blog.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    
    // Apply search filter
    if (searchTerm.trim()) {
      results = results.filter(blog =>
        blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredBlogs(results);
  }, [selectedCategory, blogs, searchTerm]);

  // Helper function to get author name from object or string
  const getAuthorName = (author) => {
    if (!author) return 'Anonymous';
    if (typeof author === 'string') return author;
    if (author.name) return author.name;
    if (author.username) return author.username;
    if (author.email) return author.email.split('@')[0];
    return 'Author';
  };

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const data = await getPosts();
      
      // Process the data to ensure proper structure
      const blogsWithCategories = data.map(blog => {
        // Extract author name safely
        const authorName = getAuthorName(blog.author);
        
        return {
          ...blog,
          id: blog.id || blog._id || Date.now(),
          author: authorName,
          category: blog.category || ['Technology', 'Lifestyle', 'Travel', 'Food', 'Health'][Math.floor(Math.random() * 5)],
          readTime: blog.readTime || `${Math.floor(Math.random() * 10) + 3} min read`,
          likes: blog.likes || Math.floor(Math.random() * 500),
          comments: blog.comments || Math.floor(Math.random() * 50),
          image: blog.image || 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=1974',
          excerpt: blog.excerpt || 'No description available',
          title: blog.title || 'Untitled Post',
          date: blog.date || new Date().toISOString().split('T')[0],
          content: blog.content || 'Start writing your amazing story here...'
        };
      });
      
      setBlogs(blogsWithCategories);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      // Mock data for demonstration
      const mockBlogs = [
        {
          id: 1,
          title: "The Future of Artificial Intelligence",
          excerpt: "Exploring how AI is transforming industries and what the future holds for this revolutionary technology.",
          author: "Alex Johnson",
          date: "2024-03-15",
          category: "Technology",
          image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070",
          readTime: "8 min read",
          likes: 342,
          comments: 42,
          content: "Full content about AI future..."
        },
        {
          id: 2,
          title: "Sustainable Living in Urban Areas",
          excerpt: "Practical tips for reducing your carbon footprint while living in the city.",
          author: "Maria Garcia",
          date: "2024-03-14",
          category: "Lifestyle",
          image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2074",
          readTime: "6 min read",
          likes: 289,
          comments: 31,
          content: "Full content about sustainable living..."
        },
        {
          id: 3,
          title: "Hidden Gems of Southeast Asia",
          excerpt: "Discovering the less traveled paths and authentic experiences in Thailand, Vietnam, and Cambodia.",
          author: "David Chen",
          date: "2024-03-12",
          category: "Travel",
          image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=2070",
          readTime: "10 min read",
          likes: 512,
          comments: 67,
          content: "Full content about Southeast Asia travel..."
        },
        {
          id: 4,
          title: "The Art of Sourdough Bread Making",
          excerpt: "A beginner's guide to creating the perfect sourdough loaf at home.",
          author: "Sophie Williams",
          date: "2024-03-10",
          category: "Food",
          image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=2072",
          readTime: "12 min read",
          likes: 421,
          comments: 58,
          content: "Full content about sourdough bread..."
        },
        {
          id: 5,
          title: "Mindfulness Meditation for Beginners",
          excerpt: "Simple techniques to incorporate mindfulness into your daily routine for better mental health.",
          author: "Dr. James Wilson",
          date: "2024-03-08",
          category: "Health",
          image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1999",
          readTime: "7 min read",
          likes: 398,
          comments: 49,
          content: "Full content about mindfulness..."
        },
        {
          id: 6,
          title: "Web Development Trends in 2024",
          excerpt: "An overview of the latest technologies and frameworks shaping the future of web development.",
          author: "Tech Pro",
          date: "2024-03-05",
          category: "Technology",
          image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070",
          readTime: "9 min read",
          likes: 567,
          comments: 72,
          content: "Full content about web development trends..."
        }
      ];
      setBlogs(mockBlogs);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBlog = async (blogData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await createPost(blogData, token);
      
      if (response.success) {
        // Add the new blog to the list
        const newBlog = {
          ...blogData,
          id: Date.now(),
          author: user?.name || 'You',
          date: new Date().toISOString().split('T')[0],
          likes: 0,
          comments: 0,
          readTime: `${Math.ceil((blogData.content || '').split(' ').length / 200) || 5} min read`,
          excerpt: blogData.excerpt || blogData.content?.substring(0, 150) + '...'
        };
        
        setBlogs(prev => [newBlog, ...prev]);
        setShowCreateModal(false);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error creating blog:', error);
      // Even if error, add locally for demo
      const newBlog = {
        ...blogData,
        id: Date.now(),
        author: user?.name || 'You',
        date: new Date().toISOString().split('T')[0],
        likes: 0,
        comments: 0,
        readTime: `${Math.ceil((blogData.content || '').split(' ').length / 200) || 5} min read`,
        excerpt: blogData.excerpt || blogData.content?.substring(0, 150) + '...'
      };
      
      setBlogs(prev => [newBlog, ...prev]);
      setShowCreateModal(false);
      return true;
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const categories = [
    { name: 'All', value: 'all', count: blogs.length },
    { name: 'Technology', value: 'technology', count: blogs.filter(b => b.category === 'Technology').length },
    { name: 'Lifestyle', value: 'lifestyle', count: blogs.filter(b => b.category === 'Lifestyle').length },
    { name: 'Travel', value: 'travel', count: blogs.filter(b => b.category === 'Travel').length },
    { name: 'Food', value: 'food', count: blogs.filter(b => b.category === 'Food').length },
    { name: 'Health', value: 'health', count: blogs.filter(b => b.category === 'Health').length }
  ];

  // Handle clicking outside modal
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && showCreateModal) {
        setShowCreateModal(false);
      }
    };
    
    const handleClickOutside = (e) => {
      if (showCreateModal && e.target.classList.contains('fixed')) {
        setShowCreateModal(false);
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    window.addEventListener('click', handleClickOutside);
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
      window.removeEventListener('click', handleClickOutside);
    };
  }, [showCreateModal]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header with Shortcuts */}
      <header className="sticky top-0 z-50 bg-gray-900/90 backdrop-blur-lg border-b border-gray-800">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                </div>
                <span className="text-2xl font-bold text-white">BlogSphere</span>
              </Link>
              
              {/* Navigation Shortcuts */}
              <div className="hidden md:flex items-center space-x-6 ml-6">
                <Link to="/home" className="text-gray-300 hover:text-white font-medium">
                  Home
                </Link>
                <Link to="/profile" className="text-gray-300 hover:text-white font-medium">
                  Profile
                </Link>
                <button 
                  onClick={() => setShowCreateModal(true)}
                  className="text-gray-300 hover:text-white font-medium"
                >
                  Create Post
                </button>
                <Link to="/home#trending" className="text-gray-300 hover:text-white font-medium">
                  Trending
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <div className="hidden md:block relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
                <input
                  type="search"
                  value={searchTerm}
                  onChange={handleSearch}
                  className="pl-10 pr-4 py-2 w-64 lg:w-80 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="Search blogs, authors, categories..."
                />
              </div>

              {/* User Profile & Shortcuts */}
              <div className="flex items-center space-x-3">
                {/* Quick Create Button (Mobile) */}
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="md:hidden p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg"
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                </button>

                {/* User Profile Dropdown */}
                {user ? (
                  <div className="relative group">
                    <button className="flex items-center space-x-3 bg-gray-800/50 px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {user.name?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <div className="hidden md:block text-left">
                        <p className="text-white text-sm font-medium">{user.name}</p>
                        <p className="text-gray-400 text-xs capitalize">{user.role}</p>
                      </div>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </button>
                    
                    {/* Dropdown Menu */}
                    <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 z-50">
                      <div className="py-2">
                        <Link 
                          to="/profile" 
                          className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white"
                        >
                          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                          </svg>
                          My Profile
                        </Link>
                        <button 
                          onClick={() => setShowCreateModal(true)}
                          className="flex items-center w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white"
                        >
                          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                          </svg>
                          Write Blog
                        </button>
                        <Link 
                          to="/home#saved" 
                          className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white"
                        >
                          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                          </svg>
                          Saved Posts
                        </Link>
                        <div className="border-t border-gray-700 my-1"></div>
                        <button 
                          onClick={() => {
                            localStorage.clear();
                            navigate('/auth');
                          }}
                          className="flex items-center w-full text-left px-4 py-2 text-red-400 hover:bg-red-900/20"
                        >
                          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                          </svg>
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link 
                    to="/auth" 
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium"
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="mt-4 md:hidden">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <input
                type="search"
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10 pr-4 py-2 w-full bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                placeholder="Search blogs, authors, categories..."
              />
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex justify-center space-x-6 mt-4 pb-2">
            <Link to="/home" className="text-gray-300 hover:text-white text-sm">
              Home
            </Link>
            <Link to="/profile" className="text-gray-300 hover:text-white text-sm">
              Profile
            </Link>
            <Link to="/home#trending" className="text-gray-300 hover:text-white text-sm">
              Trending
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section with Quick Actions */}
        <div className="mb-12 relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-800">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
          </div>
          
          <div className="relative z-10 p-8 md:p-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex-1">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  Discover Amazing <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Stories</span>
                </h1>
                <p className="text-gray-300 text-lg md:text-xl mb-8 max-w-2xl">
                  Explore thought-provoking articles, inspiring stories, and expert insights from our community of writers.
                </p>
              </div>
              
              {/* Quick Action Buttons */}
              <div className="flex flex-col gap-3">
                <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition duration-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                  </svg>
                  <span>Start Reading</span>
                </button>
                
                {user?.role === 'author' && (
                  <button 
                    onClick={() => setShowCreateModal(true)}
                    className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition duration-300 border border-gray-700"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                    <span>Write a Story</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800/50 rounded-xl p-4 text-center border border-gray-800">
            <div className="text-2xl font-bold text-white">{blogs.length}</div>
            <div className="text-gray-400 text-sm">Total Posts</div>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-4 text-center border border-gray-800">
            <div className="text-2xl font-bold text-white">{categories.length - 1}</div>
            <div className="text-gray-400 text-sm">Categories</div>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-4 text-center border border-gray-800">
            <div className="text-2xl font-bold text-white">
              {Array.from(new Set(blogs.map(b => b.author))).length}
            </div>
            <div className="text-gray-400 text-sm">Writers</div>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-4 text-center border border-gray-800">
            <div className="text-2xl font-bold text-white">
              {blogs.reduce((sum, blog) => sum + (blog.likes || 0), 0)}
            </div>
            <div className="text-gray-400 text-sm">Total Likes</div>
          </div>
        </div>

        {/* Categories Filter */}
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Blog Posts */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">
              {selectedCategory === 'all' ? 'Latest Stories' : selectedCategory}
              <span className="text-gray-400 text-lg font-normal ml-2">
                ({filteredBlogs.length} {filteredBlogs.length === 1 ? 'story' : 'stories'})
              </span>
            </h2>
            
            <div className="flex items-center space-x-4">
              <button className="text-gray-400 hover:text-white flex items-center space-x-1">
                <span>Sort by:</span>
                <span className="text-white font-medium">Latest</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-gray-800/50 rounded-xl p-6 animate-pulse">
                  <div className="h-48 bg-gray-700 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/4 mb-4"></div>
                  <div className="h-6 bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded mb-4"></div>
                  <div className="flex justify-between">
                    <div className="h-4 bg-gray-700 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredBlogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBlogs.map(blog => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 text-gray-700">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No stories found</h3>
              <p className="text-gray-400 mb-6">Try changing your search or filter criteria</p>
              <button 
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchTerm('');
                }}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-lg font-medium"
              >
                View All Stories
              </button>
            </div>
          )}
        </div>

        {/* Trending Section */}
        {blogs.length > 0 && (
          <div className="mb-12" id="trending">
            <h2 className="text-2xl font-bold text-white mb-8">Trending Now 🔥</h2>
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl border border-gray-800 p-6 md:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {blogs
                  .sort((a, b) => b.likes - a.likes)
                  .slice(0, 2)
                  .map(blog => (
                    <div key={blog.id} className="flex flex-col md:flex-row gap-6 items-center">
                      <div className="w-full md:w-48 h-48 flex-shrink-0">
                        <img 
                          src={blog.image} 
                          alt={blog.title}
                          className="w-full h-full object-cover rounded-xl"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=1974';
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-purple-900/50 to-pink-900/50 text-purple-300 text-sm font-medium mb-3">
                          {blog.category}
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">{blog.title}</h3>
                        <p className="text-gray-300 mb-4">{blog.excerpt}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-gray-400 text-sm">
                            <span>{blog.author}</span>
                            <span>•</span>
                            <span>{blog.date}</span>
                            <span>•</span>
                            <span>{blog.readTime}</span>
                          </div>
                          <Link 
                            to={`/blog/${blog.id}`}
                            className="text-purple-400 hover:text-purple-300 font-medium flex items-center space-x-1"
                          >
                            <span>Read Full Story</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                            </svg>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Newsletter Subscription */}
        <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-900/50 rounded-2xl p-8 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-4">Never Miss a Story</h2>
            <p className="text-gray-300 mb-6">Subscribe to our newsletter and get the latest posts delivered directly to your inbox.</p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                placeholder="Enter your email"
              />
              <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-medium transition duration-300">
                Subscribe
              </button>
            </div>
            
            <p className="text-gray-500 text-sm mt-4">By subscribing, you agree with our Terms & Privacy policy.</p>
          </div>
        </div>
      </main>

      {/* Create Blog Modal - Fixed to close on click outside and ESC */}
      {showCreateModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target.classList.contains('fixed')) {
              setShowCreateModal(false);
            }
          }}
        >
          <CreateBlogModal
            onClose={() => setShowCreateModal(false)}
            onSubmit={handleCreateBlog}
            user={user}
          />
        </div>
      )}

      {/* Floating Action Button for Mobile */}
      {user?.role === 'author' && (
        <button
          onClick={() => setShowCreateModal(true)}
          className="fixed bottom-6 right-6 md:hidden z-40 w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-lg flex items-center justify-center hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
          </svg>
        </button>
      )}

      {/* Quick Access Footer */}
      <footer className="mt-12 border-t border-gray-800 pt-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="text-xl font-bold text-white mb-2">BlogSphere</h3>
              <p className="text-gray-400">Your platform for amazing stories</p>
            </div>
            
            <div className="flex flex-wrap gap-6">
              <Link to="/home" className="text-gray-400 hover:text-white">
                Home
              </Link>
              <Link to="/profile" className="text-gray-400 hover:text-white">
                Profile
              </Link>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="text-gray-400 hover:text-white"
              >
                Write
              </button>
              <Link to="/auth" className="text-gray-400 hover:text-white">
                Login
              </Link>
            </div>
          </div>
          
          <div className="text-center text-gray-500 text-sm mt-8 pt-4 border-t border-gray-800">
            © 2024 BlogSphere. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;