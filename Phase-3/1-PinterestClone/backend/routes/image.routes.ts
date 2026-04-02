import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// Working images from Picsum (no API key needed, always works)
const getImages = (query: string = "", count: number = 20) => {
  const images = [];
  const seeds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
  
  for (let i = 0; i < count; i++) {
    const seed = seeds[i % seeds.length];
    images.push({
      id: `img-${i}-${Date.now()}`,
      urls: {
        regular: `https://picsum.photos/id/${seed * 10}/500/500`,
        small: `https://picsum.photos/id/${seed * 10}/200/200`,
        thumb: `https://picsum.photos/id/${seed * 10}/100/100`,
      },
      user: {
        name: `Photographer ${seed}`,
        username: `photographer_${seed}`,
      },
      alt_description: query || "Beautiful image",
      description: `A stunning ${query || "beautiful"} photograph`,
      likes: Math.floor(Math.random() * 1000),
    });
  }
  return images;
};

router.get("/images", authMiddleware, async (req, res) => {
  try {
    const { query = "nature", page = 1, perPage = 20 } = req.query;
    const images = getImages(query as string, parseInt(perPage as string));
    
    res.json({ 
      results: images, 
      total: 100,
      total_pages: 5
    });
  } catch (err: any) {
    console.error("Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

router.get("/images/random", authMiddleware, async (req, res) => {
  try {
    const { count = 20 } = req.query;
    const images = getImages("", parseInt(count as string));
    res.json(images);
  } catch (err: any) {
    console.error("Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;