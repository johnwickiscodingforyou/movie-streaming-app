// src/app/movies/[id]/page.tsx
// Single movie details page
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase, getCurrentUser } from '@/lib/supabase';
import { Movie, Review } from '@/lib/types';
import Image from 'next/image';

export default function MovieDetailPage() {
  const params = useParams();
  const router = useRouter();
  const movieId = params.id;

  const [movie, setMovie] = useState<Movie | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchMovieDetails();
    checkUserAuth();
  }, [movieId]);

  const checkUserAuth = async () => {
    const user = await getCurrentUser();
    setIsLoggedIn(!!user);
  };

  const fetchMovieDetails = async () => {
    try {
      // Fetch movie
      const { data: movieData, error: movieError } = await supabase
        .from('movies')
        .select('*')
        .eq('id', movieId)
        .single();

      if (movieError) throw movieError;
      setMovie(movieData);

      // Fetch reviews
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select('*')
        .eq('movie_id', movieId)
        .order('created_at', { ascending: false });

      if (reviewsError) throw reviewsError;
      setReviews(reviewsData || []);
    } catch (error) {
      console.error('Error fetching movie details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      alert('Please login to submit a review');
      router.push('/login');
      return;
    }

    if (userRating === 0) {
      alert('Please select a rating');
      return;
    }

    setSubmitting(true);

    try {
      const user = await getCurrentUser();
      
      const { error } = await supabase
        .from('reviews')
        .insert({
          movie_id: movieId,
          user_id: user?.id,
          rating: userRating,
          comment: userComment,
        });

      if (error) throw error;

      // Reset form
      setUserRating(0);
      setUserComment('');
      
      // Refresh reviews
      fetchMovieDetails();
      alert('Review submitted successfully!');
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Error submitting review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-3xl font-bold mb-4">Movie Not Found</h1>
        <button onClick={() => router.back()} className="btn-primary">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section with Backdrop */}
      <div className="relative h-[500px]">
        {movie.backdrop_url ? (
          <Image
            src={movie.backdrop_url}
            alt={movie.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-dark-light" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/70 to-transparent" />
      </div>

      {/* Movie Details */}
      <div className="container mx-auto px-4 -mt-64 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="flex-shrink-0">
            <div className="relative w-64 h-96 rounded-lg overflow-hidden shadow-2xl">
              {movie.poster_url ? (
                <Image
                  src={movie.poster_url}
                  alt={movie.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                  <p className="text-gray-500">No Image</p>
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-5xl font-bold mb-4">{movie.title}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <span className="text-yellow-400 text-2xl">⭐ {movie.rating.toFixed(1)}</span>
              {movie.release_date && (
                <span className="text-gray-400">
                  {new Date(movie.release_date).getFullYear()}
                </span>
              )}
              {movie.duration && (
                <span className="text-gray-400">{movie.duration} min</span>
              )}
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-6">
              {movie.genre.map((genre, index) => (
                <span
                  key={index}
                  className="bg-primary px-4 py-1 rounded-full text-sm"
                >
                  {genre}
                </span>
              ))}
            </div>

            {/* Description */}
            <p className="text-lg text-gray-300 mb-6 leading-relaxed">
              {movie.description || 'No description available.'}
            </p>

            {/* Trailer Button */}
            {movie.trailer_url && (
              <a
                href={movie.trailer_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-block"
              >
                Watch Trailer
              </a>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-8">Reviews</h2>

          {/* Submit Review Form */}
          {isLoggedIn ? (
            <form onSubmit={handleSubmitReview} className="bg-dark-light p-6 rounded-lg mb-8">
              <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
              
              {/* Rating */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Your Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setUserRating(star)}
                      className={`text-3xl ${
                        star <= userRating ? 'text-yellow-400' : 'text-gray-600'
                      }`}
                    >
                      ⭐
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Your Review</label>
                <textarea
                  value={userComment}
                  onChange={(e) => setUserComment(e.target.value)}
                  placeholder="Write your review here..."
                  rows={4}
                  className="input-field resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          ) : (
            <div className="bg-dark-light p-6 rounded-lg mb-8 text-center">
              <p className="mb-4">Please login to write a review</p>
              <button onClick={() => router.push('/login')} className="btn-primary">
                Login
              </button>
            </div>
          )}

          {/* Display Reviews */}
          <div className="space-y-4">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id} className="bg-dark-light p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-400">
                        {'⭐'.repeat(review.rating)}
                      </span>
                      <span className="text-gray-400 text-sm">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  {review.comment && (
                    <p className="text-gray-300">{review.comment}</p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-400">No reviews yet. Be the first to review!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
