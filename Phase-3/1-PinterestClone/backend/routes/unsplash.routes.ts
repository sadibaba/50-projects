import { Router } from "express";
import axios from "axios";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

router.get("/images", authMiddleware, async (req, res) => {
  try {
    const { query = "nature", page = 1, perPage = 20 } = req.query;
    
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
    console.error("Unsplash API error:", err.message);
    res.status(500).json({ error: "Failed to fetch images" });
  }
});

router.get("/images/random", authMiddleware, async (req, res) => {
  try {
    const { count = 20 } = req.query;
    
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
    console.error("Unsplash API error:", err.message);
    res.status(500).json({ error: "Failed to fetch random images" });
  }
});

export default router;