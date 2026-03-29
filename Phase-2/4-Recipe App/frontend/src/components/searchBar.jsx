import React, { useState, useEffect } from "react";
import { searchMeals, filterByCategory, getCategories } from "../api/meals";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";

const SearchBar = ({ onMealSelect, onAddFavorite, onRemoveFavorite, isFavorite }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        console.log("Loading categories...");
        const data = await getCategories();
        console.log("Full categories data:", data);
        
        // Handle different response formats
        let categoriesList = [];
        if (data && data.categories && Array.isArray(data.categories)) {
          categoriesList = data.categories;
        } else if (data && data.meals && Array.isArray(data.meals)) {
          categoriesList = data.meals;
        } else if (data && Array.isArray(data)) {
          categoriesList = data;
        } else if (data && data.data && Array.isArray(data.data)) {
          categoriesList = data.data;
        }
        
        console.log("Processed categories:", categoriesList);
        setCategories(categoriesList);
      } catch (error) {
        console.error("Error loading categories:", error);
        // Fallback categories
        setCategories(["Beef", "Chicken", "Dessert", "Lamb", "Pasta", "Pork", "Seafood", "Vegetarian"]);
      }
    };
    loadCategories();
  }, []);

  const handleSearch = async () => {
    if (!query.trim() && !selectedCategory) {
      setError("Please enter a search term or select a category");
      return;
    }
    
    setIsSearching(true);
    setError(null);
    
    try {
      let data;
      console.log("Searching with:", { query, selectedCategory });
      
      if (selectedCategory) {
        data = await filterByCategory(selectedCategory);
        console.log("Category filter response:", data);
      } else {
        data = await searchMeals(query);
        console.log("Search response:", data);
      }
      
      // Handle different response formats
      let mealsList = [];
      if (data && data.meals && Array.isArray(data.meals)) {
        mealsList = data.meals;
      } else if (data && Array.isArray(data)) {
        mealsList = data;
      } else if (data && data.data && Array.isArray(data.data)) {
        mealsList = data.data;
      } else if (data && data.recipes && Array.isArray(data.recipes)) {
        mealsList = data.recipes;
      }
      
      console.log("Final meals list:", mealsList);
      console.log("Number of meals found:", mealsList.length);
      
      setResults(mealsList);
      
      if (mealsList.length === 0) {
        setError(`No recipes found for "${selectedCategory || query}". Try something else!`);
      }
    } catch (error) {
      console.error("Search error:", error);
      setError("Failed to search recipes. Please try again.");
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleCategoryChange = (category) => {
    console.log("Category selected:", category);
    setSelectedCategory(category);
    setQuery("");
    setError(null);
    // Auto-search when category is selected
    setTimeout(() => {
      handleSearch();
    }, 100);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSelect = (meal) => {
    console.log("Selected meal for detail:", meal);
    console.log("Meal ID:", meal.idMeal || meal._id || meal.id);
    onMealSelect(meal);
    navigate("/recipe");
  };

  // Function to get display name from category object
  const getCategoryName = (cat) => {
    if (typeof cat === 'string') return cat;
    return cat.strCategory || cat.name || cat.title || "Unknown";
  };

  // Demo categories if API fails
  const demoCategories = ["Beef", "Chicken", "Dessert", "Lamb", "Pasta", "Pork", "Seafood", "Vegetarian"];
  const displayCategories = categories.length > 0 ? categories : demoCategories;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-red-900/30 to-orange-900/30 py-16">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-red-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-orange-500 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent animate-gradient">
            Discover Amazing Recipes
          </h1>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Search for delicious meals from around the world, explore new flavors, and save your favorites
          </p>
          
          {/* Search Input */}
          <div className="max-w-2xl mx-auto">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSelectedCategory("");
                    setError(null);
                  }}
                  onKeyPress={handleKeyPress}
                  className="w-full px-6 py-4 pl-12 bg-gray-800/80 backdrop-blur-sm border-2 border-red-500/30 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/50 transition-all duration-300"
                  placeholder="Search for chicken, pasta, cake, indian..."
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔍</span>
              </div>
              <button
                onClick={handleSearch}
                disabled={isSearching}
                className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-red-500/25 disabled:opacity-50"
              >
                {isSearching ? "Searching..." : "Search"}
              </button>
            </div>
          </div>
          
          {/* Category Pills */}
          <div className="mt-8 flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
            <button
              onClick={() => {
                setSelectedCategory("");
                setError(null);
              }}
              className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                !selectedCategory 
                  ? "bg-red-600 text-white shadow-lg" 
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              All
            </button>
            {displayCategories.map((cat, index) => (
              <button
                key={index}
                onClick={() => handleCategoryChange(getCategoryName(cat))}
                className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                  selectedCategory === getCategoryName(cat)
                    ? "bg-red-600 text-white shadow-lg scale-105"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:scale-105"
                }`}
              >
                {getCategoryName(cat)}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="container mx-auto px-4 mt-4">
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 text-red-300 text-center">
            {error}
          </div>
        </div>
      )}
      
      {/* Results Section */}
      <div className="container mx-auto px-4 py-12">
        {isSearching ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner />
          </div>
        ) : results.length > 0 ? (
          <>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="text-3xl">🍽️</span> 
              Found {results.length} delicious {results.length === 1 ? 'recipe' : 'recipes'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {results.map((meal, index) => (
                <div
                  key={meal.idMeal || meal._id || meal.id || index}
                  className="group relative bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-red-500/20 transition-all duration-500 transform hover:-translate-y-2 cursor-pointer"
                  onClick={() => handleSelect(meal)}
                >
                  <div className="relative overflow-hidden h-56">
                    <img
                      src={meal.strMealThumb || meal.image_url || "https://via.placeholder.com/400x300?text=No+Image"}
                      alt={meal.strMeal || meal.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const mealId = meal.idMeal || meal._id || meal.id;
                        if (isFavorite && isFavorite(mealId)) {
                          onRemoveFavorite(mealId);
                        } else {
                          onAddFavorite(meal);
                        }
                      }}
                      className="absolute top-3 right-3 z-10 p-2 rounded-full bg-gray-900/70 backdrop-blur-sm hover:bg-red-600 transition-all duration-300"
                    >
                      <span className="text-xl">
                        {isFavorite && isFavorite(meal.idMeal || meal._id || meal.id) ? "❤️" : "🤍"}
                      </span>
                    </button>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-white mb-1 line-clamp-1 group-hover:text-red-400 transition-colors">
                      {meal.strMeal || meal.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <span className="px-2 py-0.5 bg-red-500/20 rounded-full text-red-300">
                        {meal.strCategory || meal.category || "Various"}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <span>🌍</span> {meal.strArea || meal.area || "International"}
                      </span>
                    </div>
                    
                    <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center gap-1">⭐ 4.5</span>
                      <span className="flex items-center gap-1">⏱️ 30-45 min</span>
                    </div>
                  </div>
                  
                  <div className="absolute inset-0 border-2 border-red-500/0 rounded-2xl group-hover:border-red-500/50 transition-all duration-300 pointer-events-none"></div>
                </div>
              ))}
            </div>
          </>
        ) : (query || selectedCategory) ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">😢</div>
            <h3 className="text-xl text-gray-400">No recipes found</h3>
            <p className="text-gray-500 mt-2">Try searching for "chicken", "pasta", "indian", or select a different category</p>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4 animate-bounce">🍳</div>
            <h3 className="text-xl text-gray-400">Start your culinary journey</h3>
            <p className="text-gray-500 mt-2">Search for any meal or browse by category above</p>
            <div className="mt-8 flex justify-center gap-3 flex-wrap">
              <button 
                onClick={() => {
                  setQuery("Chicken");
                  handleSearch();
                }}
                className="px-4 py-2 bg-gray-800 rounded-full text-sm text-gray-300 hover:bg-gray-700"
              >
                🍗 Try "Chicken"
              </button>
              <button 
                onClick={() => {
                  setQuery("Pasta");
                  handleSearch();
                }}
                className="px-4 py-2 bg-gray-800 rounded-full text-sm text-gray-300 hover:bg-gray-700"
              >
                🍝 Try "Pasta"
              </button>
              <button 
                onClick={() => {
                  setQuery("Indian");
                  handleSearch();
                }}
                className="px-4 py-2 bg-gray-800 rounded-full text-sm text-gray-300 hover:bg-gray-700"
              >
                🇮🇳 Try "Indian"
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;