'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Movie, TVShow } from '@/lib/types';
import MovieCard from '@/components/MovieCard';

export default function TrendingPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [tvShows, setTVShows] = useState<TVShow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrending();
  }, []);

  const fetchTrending = async () => {
    try {
      const { data: moviesData } = await supabase
        .from('movies')
        .select('*')
        .order('rating', { ascending: false })
        .limit(10);

      const { data: showsData } = await supabase
        .from('tv_shows')
        .select('*')
        .order('rating', { ascending: false })
        .limit(10);

      setMovies(moviesData || []);
      setTVShows(showsData || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="text-2xl">Loading...</div></div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Trending Now</h1>

      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-6">Trending Movies</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {movies.map((movie) => <MovieCard key={movie.id} item={movie} type="movie" />)}
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-6">Trending TV Shows</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {tvShows.map((show) => <MovieCard key={show.id} item={show} type="tvshow" />)}
        </div>
      </section>
    </div>
  );
}
