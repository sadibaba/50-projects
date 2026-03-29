import Watchlist from "../models/watchlist.js";

export async function addToWatchlist(req, res) {
  try {
    const { movieId } = req.body;
    
    if (!movieId) {
      return res.status(400).json({ error: "Movie ID is required" });
    }
    
    // Check if already exists
    const existing = await Watchlist.findOne({ movieId });
    if (existing) {
      return res.status(400).json({ error: "Movie already in watchlist" });
    }
    
    const item = new Watchlist({ 
      movieId,
      userId: null  
    });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    console.error('Error adding to watchlist:', err);
    res.status(500).json({ error: "Failed to add to watchlist: " + err.message });
  }
}

export async function getWatchlist(req, res) {
  try {
    const list = await Watchlist.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    console.error('Error fetching watchlist:', err);
    res.status(500).json({ error: "Failed to fetch watchlist" });
  }
}

export async function removeFromWatchlist(req, res) {
  try {
    const { movieId } = req.params;
    const result = await Watchlist.findOneAndDelete({ movieId });
    
    if (!result) {
      return res.status(404).json({ error: "Movie not found in watchlist" });
    }
    
    res.json({ message: "Removed from watchlist" });
  } catch (err) {
    console.error('Error removing from watchlist:', err);
    res.status(500).json({ error: "Failed to remove from watchlist" });
  }
}