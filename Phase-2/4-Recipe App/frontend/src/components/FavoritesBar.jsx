import React from "react";
import { useNavigate } from "react-router-dom";

const FavoritesBar = ({ favorites, onSelectMeal, onRemoveFavorite }) => {
  const navigate = useNavigate();

  const handleSelect = (meal) => {
    onSelectMeal(meal);
    navigate("/recipe");
  };

  if (favorites.length === 0) return null;

  return (
    <div className="bg-gray-800/90 backdrop-blur-md border-b border-red-500/30 py-3">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 overflow-x-auto pb-2 custom-scrollbar">
          <div className="flex items-center gap-2 text-white font-semibold sticky left-0 bg-gray-800/90 px-2">
            <span>❤️</span> Favorites ({favorites.length})
          </div>
          {favorites.map((meal) => (
            <div
              key={meal.idMeal}
              className="flex items-center gap-2 bg-gray-700 rounded-full pl-1 pr-2 hover:bg-gray-600 transition-all cursor-pointer group flex-shrink-0"
              onClick={() => handleSelect(meal)}
            >
              <img
                src={meal.strMealThumb}
                alt={meal.strMeal}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="text-sm text-white group-hover:text-red-400 transition-colors">
                {meal.strMeal.length > 20 ? meal.strMeal.slice(0, 20) + "..." : meal.strMeal}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveFavorite(meal.idMeal);
                }}
                className="text-gray-400 hover:text-red-500 transition-colors ml-1"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FavoritesBar;