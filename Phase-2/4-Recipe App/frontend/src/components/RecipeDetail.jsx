import React, { useState } from "react";

const RecipeDetail = ({ meal, onAddFavorite, onRemoveFavorite, isFavorite }) => {
  const [showFullInstructions, setShowFullInstructions] = useState(false);
  
  // Add null check at the beginning
  if (!meal) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😢</div>
          <h2 className="text-2xl text-white mb-2">No recipe selected</h2>
          <p className="text-gray-400">Go back and search for a recipe!</p>
        </div>
      </div>
    );
  }

  console.log("Rendering recipe detail:", meal);

  // Extract ingredients and measures
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim() && ingredient.trim() !== "") {
      ingredients.push({ ingredient: ingredient.trim(), measure: (measure || "").trim() });
    }
  }

  const getDifficulty = () => {
    const instrLength = meal.strInstructions?.length || 0;
    const ingredientCount = ingredients.length;
    if (instrLength > 2000 || ingredientCount > 15) return { level: "Hard", color: "red", icon: "🔥" };
    if (instrLength > 1000 || ingredientCount > 8) return { level: "Medium", color: "yellow", icon: "⚡" };
    return { level: "Easy", color: "green", icon: "✨" };
  };

  const difficulty = getDifficulty();
  const mealId = meal.idMeal || meal._id || meal.id;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="mb-4 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          ← Back to Search
        </button>
        
        {/* Hero Image Section */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl mb-8">
          <img
            src={meal.strMealThumb || "https://via.placeholder.com/800x400?text=No+Image"}
            alt={meal.strMeal || "Recipe"}
            className="w-full h-96 object-cover"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/800x400?text=No+Image";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
          
          {/* Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">
                  {meal.strMeal || "Recipe"}
                </h1>
                <div className="flex flex-wrap gap-3">
                  <span className="px-3 py-1 bg-red-500/80 backdrop-blur-sm rounded-full text-sm text-white">
                    🍽️ {meal.strCategory || "Various"}
                  </span>
                  <span className="px-3 py-1 bg-orange-500/80 backdrop-blur-sm rounded-full text-sm text-white">
                    🌍 {meal.strArea || "International"}
                  </span>
                  <span className={`px-3 py-1 bg-${difficulty.color}-500/80 backdrop-blur-sm rounded-full text-sm text-white`}>
                    {difficulty.icon} {difficulty.level}
                  </span>
                </div>
              </div>
              
              <button
                onClick={() => {
                  if (isFavorite && isFavorite(mealId)) {
                    onRemoveFavorite(mealId);
                  } else {
                    onAddFavorite(meal);
                  }
                }}
                className="px-6 py-3 bg-gray-800/80 backdrop-blur-sm rounded-2xl hover:bg-red-600 transition-all duration-300 flex items-center gap-2 text-white"
              >
                <span className="text-2xl">{isFavorite && isFavorite(mealId) ? "❤️" : "🤍"}</span>
                <span>{isFavorite && isFavorite(mealId) ? "Saved" : "Save Recipe"}</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Ingredients Column */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span>🛒</span> Ingredients
                <span className="text-sm font-normal text-gray-400">({ingredients.length})</span>
              </h2>
              {ingredients.length === 0 ? (
                <p className="text-gray-400">No ingredients listed</p>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                  {ingredients.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700/50 transition-colors group"
                    >
                      <span className="w-6 h-6 flex items-center justify-center bg-red-500/20 rounded-full text-red-400 text-xs font-bold group-hover:scale-110 transition-transform">
                        {idx + 1}
                      </span>
                      <span className="text-gray-200 flex-1">{item.ingredient}</span>
                      {item.measure && (
                        <span className="text-red-400 text-sm bg-red-500/10 px-2 py-0.5 rounded-full">
                          {item.measure}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              {/* Extra Info */}
              <div className="mt-6 pt-4 border-t border-gray-700">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Source: {meal.strSource ? "External" : "Community"}</span>
                  <span>ID: #{mealId}</span>
                </div>
                {meal.strYoutube && (
                  <a
                    href={meal.strYoutube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 flex items-center justify-center gap-2 w-full py-2 bg-red-600/20 hover:bg-red-600/40 rounded-xl text-red-400 transition-colors"
                  >
                    ▶️ Watch Video Tutorial
                  </a>
                )}
              </div>
            </div>
          </div>
          
          {/* Instructions Column */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span>📖</span> Instructions
              </h2>
              <div className="prose prose-invert max-w-none">
                {meal.strInstructions ? (
                  <p className={`text-gray-300 leading-relaxed whitespace-pre-line ${!showFullInstructions && "line-clamp-8"}`}>
                    {meal.strInstructions}
                  </p>
                ) : (
                  <p className="text-gray-400">No instructions available</p>
                )}
                {meal.strInstructions && meal.strInstructions.split(' ').length > 100 && (
                  <button
                    onClick={() => setShowFullInstructions(!showFullInstructions)}
                    className="mt-3 text-red-400 hover:text-red-300 transition-colors"
                  >
                    {showFullInstructions ? "Show less ↑" : "Read more ↓"}
                  </button>
                )}
              </div>
            </div>
            
            {/* Tips Section */}
            <div className="mt-6 bg-gradient-to-r from-red-900/20 to-orange-900/20 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <span>💡</span> Chef's Tips
              </h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-red-400">•</span>
                  Prep all ingredients before starting to cook (mise en place)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400">•</span>
                  Taste and adjust seasoning throughout the cooking process
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400">•</span>
                  Let the dish rest for a few minutes before serving for best flavor
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;