import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Star, Clock, Calendar } from 'lucide-react';
import CommentSection from '../components/CommentSection';
import VideoModal from '../components/VideoModal';

interface MovieDetails {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  release_date: string;
  runtime: number;
}

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [selectedVideoKey, setSelectedVideoKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovieDetails();
  }, [id]);

  const fetchMovieDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/movies/${id}`);
      setMovie(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching movie details:', error);
      setLoading(false);
    }
  };

  const handlePlayTrailer = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/movies/videos/${id}`);
      const videos = response.data.results;
      const trailer = videos.find((video: any) =>
        video.type === "Trailer" && video.site === "YouTube"
      ) || videos[0];

      if (trailer) {
        setSelectedVideoKey(trailer.key);
      }
    } catch (error) {
      console.error('Error fetching trailer:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (!movie) return null;

  return (
    <div>
      <div
        className="relative h-[70vh] bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.9)), 
                           url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
        }}
      >
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4 flex gap-8">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-64 rounded-lg shadow-xl"
            />
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
              <div className="flex items-center gap-6 mb-4">
                <div className="flex items-center">
                  <Star className="text-yellow-400 w-5 h-5 mr-1" />
                  <span>{movie.vote_average.toFixed(1)}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="text-gray-400 w-5 h-5 mr-1" />
                  <span>{movie.runtime} min</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="text-gray-400 w-5 h-5 mr-1" />
                  <span>{new Date(movie.release_date).getFullYear()}</span>
                </div>
              </div>
              <p className="text-gray-300 mb-6">{movie.overview}</p>
              <button
                onClick={handlePlayTrailer}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Watch Trailer
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <CommentSection movieId={parseInt(id!)} movieTitle={movie.title} />
      </div>

      <VideoModal
        videoKey={selectedVideoKey}
        onClose={() => setSelectedVideoKey(null)}
      />
    </div>
  );
};

export default MovieDetail;