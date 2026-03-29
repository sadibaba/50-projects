import axios from "axios";

export async function getMovies(req, res) {
  try {
    const { keyword } = req.query;
    const response = await axios.get("http://www.omdbapi.com/", {
      params: { 
        apikey: process.env.OMDB_API_KEY, 
        s: keyword || "Batman" 
      }
    });
    res.json(response.data);
  } catch (err) {
    console.error('Error fetching movies:', err);
    res.status(500).json({ error: "Failed to fetch movies" });
  }
}

export async function getMovieById(req, res) {
  try {
    const { id } = req.params;
    const response = await axios.get("http://www.omdbapi.com/", {
      params: { 
        apikey: process.env.OMDB_API_KEY, 
        i: id,
        plot: "full"
      }
    });
    
    if (response.data.Response === "False") {
      return res.status(404).json({ error: response.data.Error });
    }
    
    res.json(response.data);
  } catch (err) {
    console.error('Error fetching movie details:', err);
    res.status(500).json({ error: "Failed to fetch movie details" });
  }
}