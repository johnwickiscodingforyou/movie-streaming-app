// src/app/page.tsx
// Homepage component
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Movie, TVShow } from '@/lib/types';
import MovieCard from '@/components/MovieCard';
import Link from 'next/link';

export default function HomePage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [tvShows, setTVShows] = useState<TVShow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch top 6 movies
      const { data: moviesData, error: moviesError } = await supabase
        .from('movies')
        .select('*')
        .order('rating', { ascending: false })
        .limit(6);

      if (moviesError) throw moviesError;

      // Fetch top 6 TV shows
      const { data: tvShowsData, error: tvShowsError } = await supabase
        .from('tv_shows')
        .select('*')
        .order('rating', { ascending: false })
        .limit(6);

      if (tvShowsError) throw tvShowsError;

      setMovies(moviesData || []);
      setTVShows(tvShowsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center bg-gradient-to-r from-dark via-dark-light to-dark">
        <div className="text-center z-10 px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Welcome to <span className="text-primary">MovieStream</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Discover and stream thousands of movies and TV shows. Your next favorite is waiting.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/movies" className="btn-primary text-lg">
              Browse Movies
            </Link>
            <Link href="/tvshows" className="btn-secondary text-lg">
              Browse TV Shows
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Movies Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Top Rated Movies</h2>
          <Link href="/movies" className="text-primary hover:underline">
            View All →
          </Link>
        </div>

        {movies.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {movies.map((movie) => (
              <MovieCard key={movie.id} item={movie} type="movie" />
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No movies found.</p>
        )}
      </section>

      {/* Featured TV Shows Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Top Rated TV Shows</h2>
          <Link href="/tvshows" className="text-primary hover:underline">
            View All →
          </Link>
        </div>

        {tvShows.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {tvShows.map((show) => (
              <MovieCard key={show.id} item={show} type="tvshow" />
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No TV shows found.</p>
        )}
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8">Browse by Genre</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {['Action', 'Drama', 'Comedy', 'Thriller', 'Romance', 'Mystery', 'Fantasy'].map((genre) => (
            <Link
              key={genre}
              href={`/movies?genre=${genre}`}
              className="bg-dark-light p-6 rounded-lg text-center hover:bg-primary hover:scale-105 transition-all duration-300"
            >
              <span className="text-lg font-semibold">{genre}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
