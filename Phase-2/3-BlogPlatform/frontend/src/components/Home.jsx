import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getPosts, createPost, getCategories } from '../api/api';
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
    const userRole = localStorage.getItem('userRole');
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');
    if (userRole || userName) {
      setUser({ 
        role: userRole || 'reader', 
        name: userName,
        email: userEmail 
      });
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
      results = results.filter(blog =>
        blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.authorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredBlogs(results);
  }, [selectedCategory, blogs, searchTerm]);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      const categoriesData = Array.isArray(data) ? data : [];
      
      // Add "All" category and count posts per category
      const categoryCounts = {};
      blogs.forEach(blog => {
        const cat = blog.category;
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
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
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const data = await getPosts();
      
      // Process the data to ensure proper structure
      const processedBlogs = data.map(blog => ({
        ...blog,
        id: blog._id,
        author: blog.authorName || 'Anonymous',
        date: new Date(blog.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }),
        readTime: `${Math.ceil((blog.content?.split(' ').length || 0) / 200) || 5} min read`,
        likes: blog.likes?.length || 0,
        comments: blog.comments || 0,
        excerpt: blog.content?.substring(0, 150) + '...' || 'No description available',
        image: blog.image?.url || 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=1974'
      }));
      
      setBlogs(processedBlogs);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBlog = async (blogData) => {
    try {
      const token = localStorage.getItem('token');
      
      // Create FormData for image upload
      const formData = new FormData();
      formData.append('title', blogData.title);
      formData.append('content', blogData.content);
      formData.append('category', blogData.category);
      formData.append('excerpt', blogData.excerpt);
      
      if (blogData.image) {
        formData.append('image', blogData.image); // This should be a File object
      }

      const response = await createPost(formData, token);
      
      if (response) {
        // Refresh blogs list
        await fetchBlogs();
        setShowCreateModal(false);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error creating blog:', error);
      return false;
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/auth');
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
                        {user.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <span className="text-white text-sm">{user.name}</span>
                  </button>
                  
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200">
                    <div className="py-2">
                      <Link to="/profile" className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white">
                        My Profile
                      </Link>
                      {user.role === 'author' && (
                        <button 
                          onClick={() => setShowCreateModal(true)}
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
                <Link to="/auth" className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg">
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
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
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-400 mb-4">No stories found</p>
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