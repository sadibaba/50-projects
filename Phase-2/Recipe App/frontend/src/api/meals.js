import axios from "axios";

const API_BASE = "http://localhost:5000/api/meals";

// Search meal by name
export const searchMeals = async (query) => {
  try {
    const response = await axios.get(`${API_BASE}/search`, {
      params: { q: query }
    });
    console.log("Search API Response:", response.data);
    
    // Handle different response formats
    if (response.data && response.data.meals) {
      return response.data;
    } else if (response.data && Array.isArray(response.data)) {
      return { meals: response.data };
    } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
      return { meals: response.data.data };
    } else {
      return { meals: [] };
    }
  } catch (error) {
    console.error("Search meals error:", error);
    return { meals: [] };
  }
};

// Search meal by first letter
export const searchByLetter = async (letter) => {
  try {
    const response = await axios.get(`${API_BASE}/letter`, {
      params: { f: letter }
    });
    return response.data;
  } catch (error) {
    console.error("Search by letter error:", error);
    return { meals: [] };
  }
};

// Lookup meal by ID
export const lookupMeal = async (id) => {
  try {
    const response = await axios.get(`${API_BASE}/lookup/${id}`);
    console.log("Lookup API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Lookup meal error:", error);
    return { meals: null };
  }
};

// Random meal
export const getRandomMeal = async () => {
  try {
    const response = await axios.get(`${API_BASE}/random`);
    return response.data;
  } catch (error) {
    console.error("Random meal error:", error);
    return { meals: null };
  }
};

// Categories
export const getCategories = async () => {
  try {
    const response = await axios.get(`${API_BASE}/categories`);
    console.log("Categories API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Categories error:", error);
    return { categories: [] };
  }
};

// Filter by ingredient
export const filterByIngredient = async (ingredient) => {
  try {
    const response = await axios.get(`${API_BASE}/filter/ingredient`, {
      params: { i: ingredient }
    });
    return response.data;
  } catch (error) {
    console.error("Filter by ingredient error:", error);
    return { meals: [] };
  }
};

// Filter by category
export const filterByCategory = async (category) => {
  try {
    const response = await axios.get(`${API_BASE}/filter/category`, {
      params: { c: category }
    });
    console.log(`Category filter for ${category}:`, response.data);
    return response.data;
  } catch (error) {
    console.error("Filter by category error:", error);
    return { meals: [] };
  }
};

// Filter by area
export const filterByArea = async (area) => {
  try {
    const response = await axios.get(`${API_BASE}/filter/area`, {
      params: { a: area }
    });
    return response.data;
  } catch (error) {
    console.error("Filter by area error:", error);
    return { meals: [] };
  }
};