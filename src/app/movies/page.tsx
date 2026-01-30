// src/app/movies/page.tsx
// Movies listing page with search and filter
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Movie } from '@/lib/types';
import MovieCard from '@/components/MovieCard';
import { GENRES } from '@/lib/types';

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'rating' | 'title' | 'release_date'>('rating');

  useEffect(() => {
    fetchMovies();
  }, []);

  useEffect(() => {
    filterAndSortMovies();
  }, [movies, searchTerm, selectedGenre, sortBy]);

  const fetchMovies = async () => {
    try {
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .order('rating', { ascending: false });

      if (error) throw error;
      setMovies(data || []);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortMovies = () => {
    let result = [...movies];

    // Filter by search term
    if (searchTerm) {
      result = result.filter(movie =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by genre
    if (selectedGenre !== 'All') {
      result = result.filter(movie =>
        movie.genre.includes(selectedGenre)
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      } else if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      } else if (sortBy === 'release_date') {
        return new Date(b.release_date || 0).getTime() - new Date(a.release_date || 0).getTime();
      }
      return 0;
    });

    setFilteredMovies(result);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl">Loading movies...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">All Movies</h1>

      {/* Filters Section */}
      <div className="bg-dark-light p-6 rounded-lg mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium mb-2">Search</label>
            <input
              type="text"
              placeholder="Search movies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
            />
          </div>

          {/* Genre Filter */}
          <div>
            <label className="block text-sm font-medium mb-2">Genre</label>
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="input-field"
            >
              <option value="All">All Genres</option>
              {GENRES.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'rating' | 'title' | 'release_date')}
              className="input-field"
            >
              <option value="rating">Rating</option>
              <option value="title">Title</option>
              <option value="release_date">Release Date</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <p className="text-gray-400 mb-4">
        Showing {filteredMovies.length} of {movies.length} movies
      </p>

      {/* Movies Grid */}
      {filteredMovies.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {filteredMovies.map((movie) => (
            <MovieCard key={movie.id} item={movie} type="movie" />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-2xl text-gray-400">No movies found</p>
          <p className="text-gray-500 mt-2">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
}
