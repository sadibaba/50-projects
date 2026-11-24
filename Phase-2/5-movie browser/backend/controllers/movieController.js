import axios from "axios";
import { ApiError, asyncHandler } from "../utils/http.js";

const OMDB_URL = "https://www.omdbapi.com/";

const omdb = async (params) => {
  if (!process.env.OMDB_API_KEY) {
    throw new ApiError(503, "OMDB_API_KEY is not configured on the server");
  }

  try {
    const response = await axios.get(OMDB_URL, {
      params: { apikey: process.env.OMDB_API_KEY, ...params },
      timeout: 10000,
    });
    return response.data;
  } catch {
    throw new ApiError(502, "The movie database is not reachable right now");
  }
};

export const getMovies = asyncHandler(async (req, res) => {
  const keyword = String(req.query.keyword || "").trim();

  if (!keyword) {
    throw new ApiError(400, "A search keyword is required");
  }

  const data = await omdb({ s: keyword, page: Number(req.query.page) || 1 });

  if (data.Response === "False") {
    return res.status(404).json({ error: data.Error || "No movies found" });
  }

  res.json(data);
});

export const getMovieById = asyncHandler(async (req, res) => {
  const data = await omdb({ i: req.params.id, plot: "full" });

  if (data.Response === "False") {
    throw new ApiError(404, data.Error || "Movie not found");
  }

  res.json(data);
});
