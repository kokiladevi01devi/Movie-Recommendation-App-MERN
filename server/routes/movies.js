import express from 'express';
import axios from 'axios';

const router = express.Router();
const API_KEY = "db95773a7fb212ba790d71f6adac0e7e";
const BASE_URL = "https://api.themoviedb.org/3";

router.get('/trending', async (req, res) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/trending/movie/week?api_key=${API_KEY}`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    const response = await axios.get(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/videos/:movieId', async (req, res) => {
  try {
    const { movieId } = req.params;
    const response = await axios.get(
      `${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}&language=en-US`
    );
    
    // Filter for only YouTube videos and sort by type
    const videos = response.data.results.filter(video => video.site === "YouTube");
    response.data.results = videos;
    
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export { router as movieRoutes };