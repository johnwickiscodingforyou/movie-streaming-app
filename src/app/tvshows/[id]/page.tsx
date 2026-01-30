

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase, getCurrentUser } from '@/lib/supabase';
import { TVShow, Review } from '@/lib/types';
import Image from 'next/image';

export default function TVShowDetailPage() {
  const params = useParams();
  const router = useRouter();
  const showId = params.id;
  const [show, setShow] = useState<TVShow | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchDetails();
    checkAuth();
  }, [showId]);

  const checkAuth = async () => {
    const user = await getCurrentUser();
    setIsLoggedIn(!!user);
  };

  const fetchDetails = async () => {
    try {
      const { data: showData, error: showError } = await supabase
        .from('tv_shows')
        .select('*')
        .eq('id', showId)
        .single();

      if (showError) throw showError;
      setShow(showData);

      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select('*')
        .eq('tvshow_id', showId)
        .order('created_at', { ascending: false });

      if (reviewsError) throw reviewsError;
      setReviews(reviewsData || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      alert('Please login');
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
      const { error } = await supabase.from('reviews').insert({
        tvshow_id: showId,
        user_id: user?.id,
        rating: userRating,
        comment: userComment,
      });
      if (error) throw error;
      setUserRating(0);
      setUserComment('');
      fetchDetails();
      alert('Review submitted!');
    } catch (error) {
      console.error('Error:', error);
      alert('Error submitting review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="text-2xl">Loading...</div></div>;
  if (!show) return <div className="flex flex-col items-center justify-center min-h-screen"><h1 className="text-3xl font-bold mb-4">TV Show Not Found</h1><button onClick={() => router.back()} className="btn-primary">Go Back</button></div>;

  return (
    <div>
      <div className="relative h-[500px]">
        {show.backdrop_url ? <Image src={show.backdrop_url} alt={show.title} fill className="object-cover" priority /> : <div className="w-full h-full bg-dark-light" />}
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/70 to-transparent" />
      </div>

      <div className="container mx-auto px-4 -mt-64 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-shrink-0">
            <div className="relative w-64 h-96 rounded-lg overflow-hidden shadow-2xl">
              {show.poster_url ? <Image src={show.poster_url} alt={show.title} fill className="object-cover" /> : <div className="w-full h-full bg-gray-800 flex items-center justify-center"><p className="text-gray-500">No Image</p></div>}
            </div>
          </div>

          <div className="flex-1">
            <h1 className="text-5xl font-bold mb-4">{show.title}</h1>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-yellow-400 text-2xl">⭐ {show.rating.toFixed(1)}</span>
              {show.first_air_date && <span className="text-gray-400">{new Date(show.first_air_date).getFullYear()}</span>}
              <span className="text-gray-400">{show.seasons} Season{show.seasons !== 1 ? 's' : ''}</span>
              <span className="text-gray-400">{show.episodes} Episodes</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {show.genre.map((genre, idx) => <span key={idx} className="bg-primary px-4 py-1 rounded-full text-sm">{genre}</span>)}
            </div>
            <p className="text-lg text-gray-300 mb-6 leading-relaxed">{show.description || 'No description available.'}</p>
            {show.trailer_url && <a href={show.trailer_url} target="_blank" rel="noopener noreferrer" className="btn-primary inline-block">Watch Trailer</a>}
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-8">Reviews</h2>
          {isLoggedIn ? (
            <form onSubmit={handleSubmit} className="bg-dark-light p-6 rounded-lg mb-8">
              <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Your Rating</label>
                <div className="flex gap-2">
                  {[1,2,3,4,5].map((star) => <button key={star} type="button" onClick={() => setUserRating(star)} className={`text-3xl ${star <= userRating ? 'text-yellow-400' : 'text-gray-600'}`}>⭐</button>)}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Your Review</label>
                <textarea value={userComment} onChange={(e) => setUserComment(e.target.value)} placeholder="Write your review..." rows={4} className="input-field resize-none" />
              </div>
              <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-50">{submitting ? 'Submitting...' : 'Submit Review'}</button>
            </form>
          ) : (
            <div className="bg-dark-light p-6 rounded-lg mb-8 text-center"><p className="mb-4">Please login to write a review</p><button onClick={() => router.push('/login')} className="btn-primary">Login</button></div>
          )}
          <div className="space-y-4">
            {reviews.length > 0 ? reviews.map((review) => (
              <div key={review.id} className="bg-dark-light p-6 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-400">{'⭐'.repeat(review.rating)}</span>
                    <span className="text-gray-400 text-sm">{new Date(review.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                {review.comment && <p className="text-gray-300">{review.comment}</p>}
              </div>
            )) : <p className="text-gray-400">No reviews yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
