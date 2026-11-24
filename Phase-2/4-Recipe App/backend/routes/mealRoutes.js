import express from "express";
import axios from "axios";
import { ApiError, asyncHandler } from "../utils/http.js";

const router = express.Router();
const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

const fetchMealDb = async (path, params = {}) => {
  try {
    const response = await axios.get(`${BASE_URL}/${path}`, {
      params,
      timeout: 10000,
    });
    return response.data;
  } catch (error) {
    throw new ApiError(
      502,
      "TheMealDB is not reachable right now. Try again in a moment."
    );
  }
};

const requireParam = (value, name) => {
  if (!value || !String(value).trim()) {
    throw new ApiError(400, `${name} is required`);
  }
  return String(value).trim();
};

router.get(
  "/search",
  asyncHandler(async (req, res) => {
    const q = requireParam(req.query.q, "Search query");
    res.json(await fetchMealDb("search.php", { s: q }));
  })
);

router.get(
  "/letter",
  asyncHandler(async (req, res) => {
    const f = requireParam(req.query.f, "Letter");
    if (!/^[a-zA-Z]$/.test(f)) {
      throw new ApiError(400, "Letter must be a single character");
    }
    res.json(await fetchMealDb("search.php", { f }));
  })
);

router.get(
  "/lookup/:id",
  asyncHandler(async (req, res) => {
    res.json(await fetchMealDb("lookup.php", { i: req.params.id }));
  })
);

router.get(
  "/random",
  asyncHandler(async (req, res) => {
    res.json(await fetchMealDb("random.php"));
  })
);

router.get(
  "/categories",
  asyncHandler(async (req, res) => {
    res.json(await fetchMealDb("categories.php"));
  })
);

router.get(
  "/filter/ingredient",
  asyncHandler(async (req, res) => {
    const i = requireParam(req.query.i, "Ingredient");
    res.json(await fetchMealDb("filter.php", { i }));
  })
);

router.get(
  "/filter/category",
  asyncHandler(async (req, res) => {
    const c = requireParam(req.query.c, "Category");
    res.json(await fetchMealDb("filter.php", { c }));
  })
);

router.get(
  "/filter/area",
  asyncHandler(async (req, res) => {
    const a = requireParam(req.query.a, "Area");
    res.json(await fetchMealDb("filter.php", { a }));
  })
);

export default router;
