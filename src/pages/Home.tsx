import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Search } from 'lucide-react';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  overview: string;
}

const Home = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrendingMovies();
  }, []);

  const fetchTrendingMovies = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/movies/trending');
      setMovies(response.data.results);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/movies/search?query=${searchQuery}`);
      setMovies(response.data.results);
      setLoading(false);
    } catch (error) {
      console.error('Error searching movies:', error);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative max-w-xl mx-auto">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for movies..."
            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-red-500"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
          >
            <Search className="h-5 w-5 text-gray-400" />
          </button>
        </div>
      </form>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform duration-200"
            >
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="w-full h-[400px] object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2 truncate">{movie.title}</h3>
                <div className="flex items-center mb-2">
                  <span className="text-yellow-400">★</span>
                  <span className="ml-1">{movie.vote_average.toFixed(1)}</span>
                </div>
                <p className="text-gray-400 text-sm line-clamp-3">{movie.overview}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;