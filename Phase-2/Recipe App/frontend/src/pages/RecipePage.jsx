import React from "react";
import RecipeDetail from "../components/RecipeDetail";

const RecipePage = ({ meal }) => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <RecipeDetail meal={meal} />
    </div>
  );
};

export default RecipePage;
