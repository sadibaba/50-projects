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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');
    const userRole = localStorage.getItem('userRole');
    if (token && userName) {
      setUser({ role: userRole || 'reader', name: userName, email: userEmail, token });
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    buildCategories(blogs);
  }, [blogs]);

  useEffect(() => {
    let results = blogs;
    if (selectedCategory !== 'all') {
      results = results.filter(b => b.category?.toLowerCase() === selectedCategory.toLowerCase());
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      results = results.filter(b =>
        b.title?.toLowerCase().includes(q) ||
        b.content?.toLowerCase().includes(q) ||
        b.authorName?.toLowerCase().includes(q) ||
        b.category?.toLowerCase().includes(q)
      );
    }
    setFilteredBlogs(results);
  }, [selectedCategory, blogs, searchTerm]);

  const buildCategories = (posts) => {
    const counts = {};
    posts.forEach(b => { if (b.category) counts[b.category] = (counts[b.category] || 0) + 1; });
    const unique = Object.keys(counts);
    setCategories([
      { name: 'All', value: 'all', count: posts.length },
      ...unique.map(c => ({ name: c, value: c.toLowerCase(), count: counts[c] }))
    ]);
  };

 // Update the processBlog function in Home.jsx
const processBlog = (blog) => ({
  id: blog._id || blog.id,
  _id: blog._id || blog.id,
  title: blog.title || 'Untitled Post',
  content: blog.content || '',
  excerpt: blog.excerpt || (blog.content ? blog.content.substring(0, 150) + '...' : 'No description available'),
  authorName: blog.authorName || blog.author?.name || blog.author || 'Anonymous',
  authorId: blog.authorId || blog.author?._id,
  author: blog.author,
  date: blog.createdAt
    ? new Date(blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    : 'Unknown date',
  category: blog.category || 'Uncategorized',
  image: (() => {
    // Handle image in multiple possible formats
    if (blog.image) {
      if (typeof blog.image === 'string') return blog.image;
      if (blog.image.url) return blog.image.url;
      if (blog.image.data) return blog.image.data;
    }
    return null;
  })(),
  readTime: blog.readTime || `${Math.ceil((blog.content?.split(' ').length || 0) / 200) || 3} min read`,
  likes: blog.likes?.length || 0,
  likesArray: blog.likes || [],
  comments: blog.comments?.length || 0,
  views: blog.views || 0,
  createdAt: blog.createdAt,
});

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await getPosts();
      const postsData = Array.isArray(response) ? response : (response?.data || response || []);
      const processed = postsData.map(processBlog);
      setBlogs(processed);
      setFilteredBlogs(processed);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBlog = () => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/auth'); return; }
    setShowCreateModal(true);
  };

 const handleCreateSuccess = async (newPost) => {
  // Optimistically add the new post to the top of the list
  if (newPost) {
    console.log('New post created:', newPost); // Add this to debug
    console.log('Image data:', newPost.image); // Add this to debug
    const processed = processBlog(newPost);
    console.log('Processed blog:', processed); // Add this to debug
    setBlogs(prev => [processed, ...prev]);
  } else {
    await fetchBlogs();
  }
};

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-lg border-b border-gray-800">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            {/* Logo */}
            <Link to="/home" className="flex items-center space-x-2 flex-shrink-0">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-white hidden sm:inline">BlogSphere</span>
            </Link>

            {/* Desktop Search */}
            <div className="hidden md:flex flex-1 max-w-sm mx-4">
              <input
                type="search"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-4 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-600 focus:outline-none text-sm"
                placeholder="Search stories..."
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {user ? (
                <>
                  <button
                    onClick={handleCreateBlog}
                    className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium text-sm transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Write
                  </button>

                  {/* User dropdown */}
                  <div className="relative group">
                    <button className="flex items-center gap-2 bg-gray-800/60 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-bold">{user.name?.charAt(0).toUpperCase() || 'U'}</span>
                      </div>
                      <span className="text-white text-sm hidden md:inline max-w-[100px] truncate">{user.name}</span>
                      <svg className="w-4 h-4 text-gray-400 hidden md:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-xl shadow-xl border border-gray-700 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 z-50 py-1">
                      <Link to="/profile" className="flex items-center gap-2 px-4 py-2.5 text-gray-300 hover:bg-gray-700 hover:text-white text-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        My Profile
                      </Link>
                      <button onClick={handleCreateBlog} className="w-full flex items-center gap-2 px-4 py-2.5 text-gray-300 hover:bg-gray-700 hover:text-white text-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Write Blog
                      </button>
                      <div className="border-t border-gray-700 my-1" />
                      <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2.5 text-red-400 hover:bg-red-900/20 text-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/auth" className="px-4 py-2 text-gray-300 hover:text-white text-sm font-medium">Login</Link>
                  <Link to="/auth" className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-pink-700 transition-all">Sign Up</Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Search */}
          <div className="mt-3 md:hidden">
            <input
              type="search"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-600 focus:outline-none text-sm"
              placeholder="Search stories..."
            />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-8">
        {/* Welcome Banner */}
        {!user && (
          <div className="mb-8 p-5 sm:p-6 bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-2xl border border-purple-800/50">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">Welcome to BlogSphere!</h2>
                <p className="text-gray-300 text-sm">Join our community to start writing and engaging with amazing content.</p>
              </div>
              <div className="flex gap-3 flex-shrink-0">
                <Link to="/auth" className="px-5 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg text-sm font-medium">Login</Link>
                <Link to="/auth" className="px-5 py-2 bg-gray-800 text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-700">Sign Up</Link>
              </div>
            </div>
          </div>
        )}

        {/* Categories */}
        {categories.length > 0 && (
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        )}

        {/* Blog Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              {selectedCategory === 'all' ? 'Latest Stories' : selectedCategory}
              <span className="text-gray-400 text-base font-normal ml-2">
                ({filteredBlogs.length} {filteredBlogs.length === 1 ? 'story' : 'stories'})
              </span>
            </h2>
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="text-sm text-purple-400 hover:text-purple-300">
                Clear search
              </button>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-gray-800/50 rounded-xl p-6 animate-pulse">
                  <div className="h-48 bg-gray-700 rounded-lg mb-4" />
                  <div className="h-3 bg-gray-700 rounded w-1/4 mb-3" />
                  <div className="h-5 bg-gray-700 rounded mb-2" />
                  <div className="h-3 bg-gray-700 rounded mb-4" />
                  <div className="h-3 bg-gray-700 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : filteredBlogs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBlogs.map(blog => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 text-gray-700">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No stories found</h3>
              <p className="text-gray-400 mb-6 text-sm">Try adjusting your search or category filter</p>
              <button
                onClick={() => { setSelectedCategory('all'); setSearchTerm(''); }}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:from-purple-700 hover:to-pink-700"
              >
                View All Stories
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Mobile FAB */}
      {user && (
        <button
          onClick={handleCreateBlog}
          className="fixed bottom-6 right-6 sm:hidden z-40 w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-lg flex items-center justify-center hover:from-purple-700 hover:to-pink-700 transition-all"
          aria-label="Write blog"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      )}

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
