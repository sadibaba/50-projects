import React, { useState } from "react";
import { searchMeals } from "../api/meals";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    const data = await searchMeals(query);
    setResults(data.meals || []);
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-lg w-3/4">
      <div className="flex">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border border-red-500 p-2 rounded w-full bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          placeholder="Search meals..."
        />
        <button
          onClick={handleSearch}
          className="ml-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-6">
        {results.map((meal) => (
          <div key={meal.idMeal} className="bg-gray-700 p-4 rounded-lg shadow-md">
            <img
              src={meal.strMealThumb}
              alt={meal.strMeal}
              className="w-full rounded-lg"
            />
            <h3 className="text-lg font-bold mt-2 text-red-400">{meal.strMeal}</h3>
            <p className="text-sm text-gray-300">
              {meal.strCategory} - {meal.strArea}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;
