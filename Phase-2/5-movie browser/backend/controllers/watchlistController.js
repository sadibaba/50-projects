import Watchlist from "../models/watchlist.js";

export async function addToWatchlist(req, res) {
  try {
    const { movieId } = req.body;
    const item = new Watchlist({ movieId });
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: "Failed to add to watchlist" });
  }
}

export async function getWatchlist(req, res) {
  try {
    const list = await Watchlist.find();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch watchlist" });
  }
}
