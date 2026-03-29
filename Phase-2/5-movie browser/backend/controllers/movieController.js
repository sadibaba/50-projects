import axios from "axios";

export async function getMovies(req, res) {
  try {
    const { keyword } = req.query;
    const response = await axios.get("http://www.omdbapi.com/", {
      params: { apikey: process.env.OMDB_API_KEY, s: keyword || "Batman" }
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch movies" });
  }
}
