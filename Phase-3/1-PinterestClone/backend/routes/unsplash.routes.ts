import { Router } from "express";
import axios from "axios";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

// Debug: Check if key is loaded
console.log('Unsplash API Key loaded:', !!UNSPLASH_ACCESS_KEY);
console.log('Unsplash API Key value:', UNSPLASH_ACCESS_KEY ? `${UNSPLASH_ACCESS_KEY.substring(0, 10)}...` : 'NOT FOUND');

router.get("/images", authMiddleware, async (req, res) => {
  try {
    const { query = "nature", page = 1, perPage = 20 } = req.query;
    
    if (!UNSPLASH_ACCESS_KEY) {
      return res.status(500).json({ error: "Unsplash API key not configured" });
    }
    
    const response = await axios.get("https://api.unsplash.com/search/photos", {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
      params: {
        query,
        page: parseInt(page as string),
        per_page: parseInt(perPage as string),
      },
    });
    
    res.json(response.data);
  } catch (err: any) {
    console.error("Unsplash API error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch images", details: err.response?.data });
  }
});

router.get("/images/random", authMiddleware, async (req, res) => {
  try {
    const { count = 20 } = req.query;
    
    if (!UNSPLASH_ACCESS_KEY) {
      return res.status(500).json({ error: "Unsplash API key not configured" });
    }
    
    const response = await axios.get("https://api.unsplash.com/photos/random", {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
      params: {
        count: parseInt(count as string),
      },
    });
    
    res.json(response.data);
  } catch (err: any) {
    console.error("Unsplash API error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch random images", details: err.response?.data });
  }
});

export default router;