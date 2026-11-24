import { useEffect, useRef, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import SearchBar from "./components/searchBar";
import RecipePage from "./pages/RecipePage";
import FavoritesBar from "./components/FavoritesBar";
import { getRandomMeal } from "./api/meals";
import {
  addFavorite as addFavoriteRequest,
  getFavorites,
  removeFavorite as removeFavoriteRequest,
} from "./api/favorites";

const FAVORITES_STORAGE_KEY = "favoriteRecipes";

const NavBar = ({ onRandomMeal }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="bg-gray-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-red-500/30">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 group"
        >
          <span className="text-2xl group-hover:rotate-12 transition-transform duration-300">
            &#127859;
          </span>
          <span className="text-2xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
            FlavorFusion
          </span>
        </button>

        <div className="flex gap-3">
          {location.pathname !== "/" && (
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-all duration-300"
            >
              Search
            </button>
          )}
          <button
            onClick={onRandomMeal}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white transition-all duration-300 shadow-lg hover:shadow-red-500/25"
          >
            Random recipe
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
  const [storageMode, setStorageMode] = useState("local");
  const skipNextSave = useRef(false);

  useEffect(() => {
    const saved = localStorage.getItem(FAVORITES_STORAGE_KEY);
    const localFavorites = saved ? JSON.parse(saved) : [];
    setFavorites(localFavorites);

    let active = true;
    const loadRemote = async () => {
      try {
        const remote = await getFavorites();
        if (!active) return;

        if (remote.length === 0 && localFavorites.length > 0) {
          await Promise.allSettled(
            localFavorites.map((meal) => addFavoriteRequest(meal))
          );
          return;
        }

        skipNextSave.current = true;
        setFavorites(remote);
        setStorageMode("server");
      } catch {
        if (active) setStorageMode("local");
      }
    };

    loadRemote();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (skipNextSave.current) {
      skipNextSave.current = false;
      return;
    }
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = (meal) => {
    if (favorites.some((favorite) => favorite.idMeal === meal.idMeal)) return;
    setFavorites((current) => [...current, meal]);
    addFavoriteRequest(meal).catch(() => setStorageMode("local"));
  };

  const removeFromFavorites = (mealId) => {
    setFavorites((current) =>
      current.filter((favorite) => favorite.idMeal !== mealId)
    );
    removeFavoriteRequest(mealId).catch(() => setStorageMode("local"));
  };

  const isFavorite = (mealId) =>
    favorites.some((favorite) => favorite.idMeal === mealId);

  const handleRandomMeal = async () => {
    setIsLoading(true);
    try {
      const data = await getRandomMeal();
      if (data.meals && data.meals[0]) setSelectedMeal(data.meals[0]);
    } catch (error) {
      console.error("Error fetching random meal:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Router>
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen">
        <NavBar onRandomMeal={handleRandomMeal} />

        <div className="container mx-auto px-4 pt-3">
          <p className="text-xs text-gray-500">
            Favorites storage:{" "}
            {storageMode === "server"
              ? "MongoDB through the API"
              : "this browser (API unavailable)"}
          </p>
        </div>

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
