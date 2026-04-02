import { Router } from "express";
import axios from "axios";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.get("/search", authMiddleware, async (req, res) => {
  try {
    const { query, perPage = 20 } = req.query;
    const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
    
    
    if (!UNSPLASH_ACCESS_KEY) {
      return res.status(500).json({ error: "Unsplash API key not configured" });
    }
    
    const response = await axios.get("https://api.unsplash.com/search/photos", {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
      params: {
        query: query || "nature",
        per_page: parseInt(perPage as string),
      },
    });
    
    const images = response.data.results.map((photo: any) => ({
      id: photo.id,
      urls: {
        regular: photo.urls.regular,
        small: photo.urls.small,
        thumb: photo.urls.thumb,
      },
      user: {
        name: photo.user.name,
        username: photo.user.username,
      },
      alt_description: photo.alt_description || query,
      description: photo.description || `Beautiful ${query} photo`,
      likes: photo.likes,
    }));
    
    res.json({ results: images, total: response.data.total });
    
  } catch (err: any) {
    res.status(500).json({ error: err.response?.data?.errors?.[0] || "Failed to fetch images" });
  }
});

export default router;