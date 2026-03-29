import React from 'react';
import { useNavigate } from 'react-router-dom';

const BlogCard = ({ blog, onReadMore, currentUserId }) => {
  const navigate = useNavigate();

  // Safe extraction of data
  const id = blog.id || blog._id;
  const title = blog.title || 'Untitled Post';
  const excerpt =
    blog.excerpt ||
    (blog.content ? blog.content.substring(0, 150) + '...' : 'No description available');
  const authorName = blog.authorName || blog.author?.name || 'Anonymous';
  const category = blog.category || 'Uncategorized';
  const date =
    blog.date ||
    (blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : 'Unknown date');
  const readTime =
    blog.readTime ||
    `${Math.ceil((blog.content?.split(' ').length || 0) / 200) || 3} min read`;
  const likes = blog.likesCount || blog.likes?.length || 0;
  const comments = blog.commentsCount || blog.comments?.length || 0;
  const isOwner = currentUserId === blog.authorId;

  // Handle image in multiple formats
  const image = (() => {
    if (!blog.image)
      return 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=1974';
    if (typeof blog.image === 'string') return blog.image;
    if (blog.image.url) return blog.image.url;
    if (blog.image.data) return blog.image.data;
    return 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=1974';
  })();

  const handleReadMore = () => {
    if (onReadMore) {
      onReadMore(id);
    } else {
      navigate(`/blog/${id}`);
    }
  };

  const handleAuthorClick = (e) => {
    e.stopPropagation();
    navigate(`/profile/${authorName}`);
  };

  return (
    <div className="group bg-gray-800/50 rounded-2xl overflow-hidden border border-gray-800 hover:border-purple-900/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-900/20">
      {/* Image */}
      <div className="relative h-48 overflow-hidden cursor-pointer" onClick={handleReadMore}>
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src =
              'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=1974';
          }}
        />
        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-purple-900/80 to-pink-900/80 text-purple-300 text-sm font-medium backdrop-blur-sm">
            {category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={handleAuthorClick}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <span className="text-white text-xs font-medium">
                {authorName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-white hover:text-purple-400 transition-colors">
                {authorName}
              </p>
              <p className="text-xs text-gray-500">{date}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-gray-500 text-sm">
            <span className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                ></path>
              </svg>
              <span>{likes}</span>
            </span>
            <span className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                ></path>
              </svg>
              <span>{comments}</span>
            </span>
          </div>
        </div>

        <h3
          className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 transition-all duration-300 line-clamp-2 cursor-pointer"
          onClick={handleReadMore}
        >
          {title}
        </h3>

        <p className="text-gray-300 mb-6 line-clamp-2">{excerpt}</p>

        <div className="flex items-center justify-between">
          <span className="text-gray-500 text-sm flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            {readTime}
          </span>

          <div className="flex gap-2">
            {isOwner && (
              <button
                onClick={() => navigate(`/edit-post/${id}`)}
                className="px-3 py-1.5 bg-gray-700/50 hover:bg-gray-700 text-white rounded-lg text-xs"
              >
                Edit
              </button>
            )}
            <button
              onClick={handleReadMore}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-900/30 to-pink-900/30 hover:from-purple-900/50 hover:to-pink-900/50 text-purple-300 hover:text-white rounded-lg font-medium transition-all duration-300 group/btn"
            >
              Read Full Story
              <svg
                className="w-4 h-4 ml-2 transform group-hover/btn:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
