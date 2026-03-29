import express from "express";
import axios from "axios";

const router = express.Router();
const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

// Search meal by name
router.get("/search", async (req, res) => {
  try {
    const { q } = req.query;
    const response = await axios.get(`${BASE_URL}/search.php?s=${q}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching meals" });
  }
});

// Search meal by first letter
router.get("/letter", async (req, res) => {
  try {
    const { f } = req.query;
    const response = await axios.get(`${BASE_URL}/search.php?f=${f}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching meals" });
  }
});

// Lookup meal by ID
router.get("/lookup/:id", async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/lookup.php?i=${req.params.id}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching meal" });
  }
});

// Random meal
router.get("/random", async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/random.php`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching random meal" });
  }
});

// List categories
router.get("/categories", async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/categories.php`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories" });
  }
});

// Filter by ingredient
router.get("/filter/ingredient", async (req, res) => {
  try {
    const { i } = req.query;
    const response = await axios.get(`${BASE_URL}/filter.php?i=${i}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error filtering meals" });
  }
});

// Filter by category
router.get("/filter/category", async (req, res) => {
  try {
    const { c } = req.query;
    const response = await axios.get(`${BASE_URL}/filter.php?c=${c}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error filtering meals" });
  }
});

// Filter by area
router.get("/filter/area", async (req, res) => {
  try {
    const { a } = req.query;
    const response = await axios.get(`${BASE_URL}/filter.php?a=${a}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error filtering meals" });
  }
});

export default router;
