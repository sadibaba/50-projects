import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getPosts, getCategories } from '../api/api';
import BlogCard from './BlogCard';
import CategoryFilter from './CategoryFilter';
import CreateBlogModal from './CreateBlogModal';

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Fetch user from localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');
    
    if (token && (userRole || userName)) {
      setUser({ 
        role: userRole || 'reader', 
        name: userName,
        email: userEmail,
        token: token
      });
    } else {
      // If no user data, redirect to login after a short delay
      // But don't redirect immediately to allow viewing posts as guest
      console.log('User not logged in - guest mode');
    }
  }, []);

  // Fetch blogs and categories
  useEffect(() => {
    fetchBlogs();
    fetchCategories();
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
      const searchLower = searchTerm.toLowerCase();
      results = results.filter(blog =>
        blog.title?.toLowerCase().includes(searchLower) ||
        blog.content?.toLowerCase().includes(searchLower) ||
        blog.authorName?.toLowerCase().includes(searchLower) ||
        blog.category?.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredBlogs(results);
  }, [selectedCategory, blogs, searchTerm]);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      // Handle different response structures
      const categoriesData = data.data || data || [];
      
      if (Array.isArray(categoriesData)) {
        // Count posts per category
        const categoryCounts = {};
        blogs.forEach(blog => {
          const cat = blog.category;
          if (cat) {
            categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
          }
        });

        const categoryList = [
          { name: 'All', value: 'all', count: blogs.length },
          ...categoriesData.map(cat => ({
            name: cat.name,
            value: cat.name.toLowerCase(),
            count: categoryCounts[cat.name] || 0
          }))
        ];
        
        setCategories(categoryList);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Fallback categories
      setCategories([
        { name: 'All', value: 'all', count: blogs.length },
        { name: 'Technology', value: 'technology', count: blogs.filter(b => b.category === 'Technology').length },
        { name: 'Lifestyle', value: 'lifestyle', count: blogs.filter(b => b.category === 'Lifestyle').length },
        { name: 'Travel', value: 'travel', count: blogs.filter(b => b.category === 'Travel').length },
      ]);
    }
  };

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await getPosts();
      
      // Handle different response structures
      const postsData = response.data || response || [];
      
      // Process the data to ensure proper structure
      const processedBlogs = postsData.map(blog => {
        // Handle author name safely
        let authorName = 'Anonymous';
        if (blog.authorName) {
          authorName = blog.authorName;
        } else if (blog.author) {
          if (typeof blog.author === 'object') {
            authorName = blog.author.name || blog.author.username || 'Author';
          } else {
            authorName = blog.author;
          }
        }

        return {
          id: blog._id || blog.id,
          _id: blog._id || blog.id,
          title: blog.title || 'Untitled Post',
          content: blog.content || '',
          excerpt: blog.excerpt || (blog.content ? blog.content.substring(0, 150) + '...' : 'No description available'),
          authorName: authorName,
          author: blog.author,
          date: blog.createdAt ? new Date(blog.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }) : 'Unknown date',
          category: blog.category || 'Uncategorized',
          image: blog.image?.url || 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=1974',
          readTime: blog.readTime || `${Math.ceil((blog.content?.split(' ').length || 0) / 200) || 3} min read`,
          likes: blog.likes?.length || 0,
          comments: blog.comments?.length || 0,
          views: blog.views || 0,
          createdAt: blog.createdAt
        };
      });
      
      setBlogs(processedBlogs);
      setFilteredBlogs(processedBlogs);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBlog = async () => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      // Redirect to login if not logged in
      navigate('/auth');
      return;
    }
    
    // Check if user has author role
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'author' && userRole !== 'admin') {
      alert('Only authors can create posts. Please register as an author.');
      return;
    }
    
    // Open create modal
    setShowCreateModal(true);
  };

  const handleCreateSuccess = async () => {
    // Refresh blogs after successful creation
    await fetchBlogs();
    await fetchCategories();
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate('/auth');
  };

  const handleReadMore = (blogId) => {
    navigate(`/blog/${blogId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-900/90 backdrop-blur-lg border-b border-gray-800">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
              </div>
              <span className="text-2xl font-bold text-white">BlogSphere</span>
            </Link>

            <div className="flex items-center space-x-4">
              {/* Create Post Button - Always visible but checks auth on click */}
              <button
                onClick={handleCreateBlog}
                className="hidden md:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                </svg>
                <span>Write</span>
              </button>

              {/* Search Bar */}
              <div className="hidden md:block relative">
                <input
                  type="search"
                  value={searchTerm}
                  onChange={handleSearch}
                  className="pl-4 pr-4 py-2 w-64 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-600"
                  placeholder="Search blogs..."
                />
              </div>

              {/* User Menu */}
              {user ? (
                <div className="relative group">
                  <button className="flex items-center space-x-3 bg-gray-800/50 px-4 py-2 rounded-lg hover:bg-gray-800">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <span className="text-white text-sm hidden md:inline">{user.name}</span>
                  </button>
                  
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 z-50">
                    <div className="py-2">
                      <Link to="/profile" className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white">
                        My Profile
                      </Link>
                      {(user.role === 'author' || user.role === 'admin') && (
                        <button 
                          onClick={handleCreateBlog}
                          className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white"
                        >
                          Write Blog
                        </button>
                      )}
                      <button 
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-red-400 hover:bg-red-900/20"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link 
                    to="/auth" 
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/auth" 
                    className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 hidden md:block"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Search */}
          <div className="mt-4 md:hidden">
            <input
              type="search"
              value={searchTerm}
              onChange={handleSearch}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500"
              placeholder="Search blogs..."
            />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Banner for Guests */}
        {!user && (
          <div className="mb-8 p-6 bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-2xl border border-purple-800/50">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Welcome to BlogSphere!</h2>
                <p className="text-gray-300">Join our community to start writing and engaging with amazing content.</p>
              </div>
              <div className="flex space-x-4 mt-4 md:mt-0">
                <Link to="/auth" className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg">
                  Login
                </Link>
                <Link to="/auth" className="px-6 py-2 bg-gray-800 text-gray-300 rounded-lg">
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Categories Filter */}
        {categories.length > 0 && (
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        )}

        {/* Blog Posts */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-8">
            {selectedCategory === 'all' ? 'Latest Stories' : selectedCategory}
            <span className="text-gray-400 text-lg font-normal ml-2">
              ({filteredBlogs.length} {filteredBlogs.length === 1 ? 'story' : 'stories'})
            </span>
          </h2>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-gray-800/50 rounded-xl p-6 animate-pulse">
                  <div className="h-48 bg-gray-700 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/4 mb-4"></div>
                  <div className="h-6 bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded mb-4"></div>
                </div>
              ))}
            </div>
          ) : filteredBlogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBlogs.map(blog => (
                <BlogCard 
                  key={blog.id} 
                  blog={blog} 
                  onReadMore={() => handleReadMore(blog.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 text-gray-700">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg"
              >
                View All Stories
              </button>
            </div>
          )}
        </div>

        {/* Floating Action Button for Mobile */}
        <button
          onClick={handleCreateBlog}
          className="fixed bottom-6 right-6 md:hidden z-40 w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-lg flex items-center justify-center hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
          </svg>
        </button>
      </main>

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

export default Home;