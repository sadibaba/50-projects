import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

  // Fetch blogs on component mount
  useEffect(() => {
    fetchBlogs();
    // Get user info from localStorage
    const userRole = localStorage.getItem('userRole');
    const userName = localStorage.getItem('userName') || 'Author';
    if (userRole) {
      setUser({ role: userRole, name: userName });
    }
  }, []);

  // Filter blogs when category changes
  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredBlogs(blogs);
    } else {
      setFilteredBlogs(blogs.filter(blog => 
        blog.category?.toLowerCase() === selectedCategory.toLowerCase()
      ));
    }
  }, [selectedCategory, blogs]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const data = await getPosts();
      // Add mock categories if not present in API response
      const blogsWithCategories = data.map(blog => ({
        ...blog,
        category: blog.category || ['Technology', 'Lifestyle', 'Travel', 'Food', 'Health'][Math.floor(Math.random() * 5)],
        readTime: blog.readTime || `${Math.floor(Math.random() * 10) + 3} min read`,
        likes: blog.likes || Math.floor(Math.random() * 500),
        comments: blog.comments || Math.floor(Math.random() * 50)
      }));
      setBlogs(blogsWithCategories);
      setFilteredBlogs(blogsWithCategories);
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
          comments: 42
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
          comments: 31
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
          comments: 67
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
          comments: 58
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
          comments: 49
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
          comments: 72
        }
      ];
      setBlogs(mockBlogs);
      setFilteredBlogs(mockBlogs);
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
          id: blogs.length + 1,
          author: user?.name || 'You',
          date: new Date().toISOString().split('T')[0],
          likes: 0,
          comments: 0,
          readTime: `${Math.ceil(blogData.content.split(' ').length / 200)} min read`
        };
        
        setBlogs(prev => [newBlog, ...prev]);
        setShowCreateModal(false);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error creating blog:', error);
      return false;
    }
  };

  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredBlogs(blogs);
      return;
    }
    
    const searchResults = blogs.filter(blog =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.author.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredBlogs(searchResults);
  };

  const categories = [
    { name: 'All', value: 'all', count: blogs.length },
    { name: 'Technology', value: 'technology', count: blogs.filter(b => b.category === 'Technology').length },
    { name: 'Lifestyle', value: 'lifestyle', count: blogs.filter(b => b.category === 'Lifestyle').length },
    { name: 'Travel', value: 'travel', count: blogs.filter(b => b.category === 'Travel').length },
    { name: 'Food', value: 'food', count: blogs.filter(b => b.category === 'Food').length },
    { name: 'Health', value: 'health', count: blogs.filter(b => b.category === 'Health').length }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-900/90 backdrop-blur-lg border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
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
              
              {/* Search Bar */}
              <div className="hidden md:block relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
                <input
                  type="search"
                  className="pl-10 pr-4 py-2 w-64 lg:w-80 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="Search blogs..."
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* User Profile */}
              {user && (
                <div className="hidden md:flex items-center space-x-3 bg-gray-800/50 px-4 py-2 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {user.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{user.name}</p>
                    <p className="text-gray-400 text-xs capitalize">{user.role}</p>
                  </div>
                </div>
              )}

              {/* Create Blog Button */}
              {user?.role === 'author' && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition duration-300"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                  <span className="hidden md:inline">Write Blog</span>
                </button>
              )}

              {/* Mobile Menu */}
              <button className="md:hidden text-gray-400 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>
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
                className="pl-10 pr-4 py-2 w-full bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                placeholder="Search blogs..."
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-12 relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-800">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
          </div>
          
          <div className="relative z-10 p-8 md:p-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Discover Amazing <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Stories</span>
            </h1>
            <p className="text-gray-300 text-lg md:text-xl mb-8 max-w-2xl">
              Explore thought-provoking articles, inspiring stories, and expert insights from our community of writers.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition duration-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org2000/svg">
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
                onClick={() => setSelectedCategory('all')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-lg font-medium"
              >
                View All Stories
              </button>
            </div>
          )}
        </div>

        {/* Trending Section */}
        {blogs.length > 0 && (
          <div className="mb-12">
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

      {/* Create Blog Modal */}
      {showCreateModal && (
        <CreateBlogModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateBlog}
          user={user}
        />
      )}
    </div>
  );
};

export default Home;