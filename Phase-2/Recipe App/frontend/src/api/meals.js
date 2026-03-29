import axios from "axios";

const API_BASE = "http://localhost:5000/api/meals";

// Search meal by name
export const searchMeals = async (query) => {
  const response = await axios.get(`${API_BASE}/search?q=${query}`);
  return response.data;
};

// Search meal by first letter
export const searchByLetter = async (letter) => {
  const response = await axios.get(`${API_BASE}/letter?f=${letter}`);
  return response.data;
};

// Lookup meal by ID
export const lookupMeal = async (id) => {
  const response = await axios.get(`${API_BASE}/lookup/${id}`);
  return response.data;
};

// Random meal
export const getRandomMeal = async () => {
  const response = await axios.get(`${API_BASE}/random`);
  return response.data;
};

// Categories
export const getCategories = async () => {
  const response = await axios.get(`${API_BASE}/categories`);
  return response.data;
};

// Filter by ingredient
export const filterByIngredient = async (ingredient) => {
  const response = await axios.get(`${API_BASE}/filter/ingredient?i=${ingredient}`);
  return response.data;
};

// Filter by category
export const filterByCategory = async (category) => {
  const response = await axios.get(`${API_BASE}/filter/category?c=${category}`);
  return response.data;
};

// Filter by area
export const filterByArea = async (area) => {
  const response = await axios.get(`${API_BASE}/filter/area?a=${area}`);
  return response.data;
};
