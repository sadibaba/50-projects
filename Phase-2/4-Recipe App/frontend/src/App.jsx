import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import SearchBar from "./components/searchBar";
import RecipePage from "./pages/RecipePage";
import FavoritesBar from "./components/FavoritesBar";
import { getRandomMeal } from "./api/meals";

// Navigation component for better UX
const NavBar = ({ onRandomMeal, hasFavorites }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  return (
    <nav className="bg-gray-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-red-500/30">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="text-3xl group-hover:rotate-12 transition-transform duration-300">🍳</div>
          <span className="text-2xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
            FlavorFusion
          </span>
        </div>
        
        <div className="flex gap-3">
          {location.pathname !== '/' && (
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-all duration-300 flex items-center gap-2"
            >
              🔍 Search
            </button>
          )}
          <button
            onClick={onRandomMeal}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-red-500/25"
          >
            🎲 Random Recipe
          </button>
        </div>
      </div>
    </nav>
  );
};

const App = () => {
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favoriteRecipes');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('favoriteRecipes', JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = (meal) => {
    if (!favorites.find(fav => fav.idMeal === meal.idMeal)) {
      setFavorites([...favorites, meal]);
    }
  };

  const removeFromFavorites = (mealId) => {
    setFavorites(favorites.filter(meal => meal.idMeal !== mealId));
  };

  const isFavorite = (mealId) => {
    return favorites.some(meal => meal.idMeal === mealId);
  };

  const handleRandomMeal = async () => {
    setIsLoading(true);
    try {
      const data = await getRandomMeal();
      if (data.meals && data.meals[0]) {
        setSelectedMeal(data.meals[0]);
      }
    } catch (error) {
      console.error("Error fetching random meal:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Router>
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen">
        <NavBar onRandomMeal={handleRandomMeal} hasFavorites={favorites.length > 0} />
        
        {favorites.length > 0 && (
          <FavoritesBar 
            favorites={favorites} 
            onSelectMeal={setSelectedMeal}
            onRemoveFavorite={removeFromFavorites}
          />
        )}
        
        <Routes>
          <Route
            path="/"
            element={
              <SearchBar 
                onMealSelect={setSelectedMeal} 
                isLoading={isLoading}
                favorites={favorites}
                onAddFavorite={addToFavorites}
                onRemoveFavorite={removeFromFavorites}
                isFavorite={isFavorite}
              />
            }
          />
          <Route
            path="/recipe"
            element={
              <RecipePage 
                meal={selectedMeal} 
                onAddFavorite={addToFavorites}
                onRemoveFavorite={removeFromFavorites}
                isFavorite={isFavorite}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;