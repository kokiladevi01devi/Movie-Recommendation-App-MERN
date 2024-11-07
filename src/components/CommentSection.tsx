import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { MessageCircle } from 'lucide-react';

interface Comment {
  id: string;
  movieId: number;
  userId: string;
  username: string;
  content: string;
  createdAt: string;
}

interface CommentSectionProps {
  movieId: number;
  movieTitle: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ movieId, movieTitle }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchComments();
  }, [movieId]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/comments/${movieId}`);
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    try {
      const response = await fetch('http://localhost:5000/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          movieId,
          content: newComment,
        }),
      });

      if (response.ok) {
        const comment = await response.json();
        setComments([...comments, comment]);
        setNewComment('');
      }
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 mt-6">
      <div className="flex items-center gap-2 mb-4">
        <MessageCircle className="text-red-500" />
        <h3 className="text-xl font-semibold">Comments for {movieTitle}</h3>
      </div>

      {user ? (
        <form onSubmit={handleSubmitComment} className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts..."
            className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-red-500 focus:outline-none"
            rows={3}
          />
          <button
            type="submit"
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Post Comment
          </button>
        </form>
      ) : (
        <p className="text-gray-400 mb-4">Please log in to comment.</p>
      )}

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-gray-700 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <span className="font-semibold text-red-400">{comment.username}</span>
              <span className="text-sm text-gray-400">
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-gray-200">{comment.content}</p>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-gray-400 text-center">No comments yet. Be the first to comment!</p>
        )}
      </div>
    </div>
  );
};

export default CommentSection;