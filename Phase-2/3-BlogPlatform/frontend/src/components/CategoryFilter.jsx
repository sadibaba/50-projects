import React from 'react';

const CategoryFilter = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Browse by Category</h2>
        <button className="text-purple-400 hover:text-purple-300 font-medium text-sm flex items-center">
          View All
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
      </div>
      
      <div className="flex flex-wrap gap-4">
        {categories.map(category => (
          <button
            key={category.value}
            onClick={() => onSelectCategory(category.value)}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 ${
              selectedCategory === category.value
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-900/30'
                : 'bg-gray-800/50 text-gray-300 hover:bg-gray-800 hover:text-white border border-gray-800'
            }`}
          >
            <span>{category.name}</span>
            <span className={`px-2 py-1 rounded-full text-xs ${
              selectedCategory === category.value
                ? 'bg-white/20'
                : 'bg-gray-700/50'
            }`}>
              {category.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;