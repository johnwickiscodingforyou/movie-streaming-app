'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { TVShow } from '@/lib/types';
import MovieCard from '@/components/MovieCard';
import { GENRES } from '@/lib/types';

export default function TVShowsPage() {
  const [tvShows, setTVShows] = useState<TVShow[]>([]);
  const [filteredShows, setFilteredShows] = useState<TVShow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'rating' | 'title' | 'first_air_date'>('rating');

  useEffect(() => {
    fetchTVShows();
  }, []);

  useEffect(() => {
    filterAndSort();
  }, [tvShows, searchTerm, selectedGenre, sortBy]);

  const fetchTVShows = async () => {
    try {
      const { data, error } = await supabase
        .from('tv_shows')
        .select('*')
        .order('rating', { ascending: false });

      if (error) throw error;
      setTVShows(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSort = () => {
    let result = [...tvShows];

    if (searchTerm) {
      result = result.filter(show =>
        show.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedGenre !== 'All') {
      result = result.filter(show => show.genre.includes(selectedGenre));
    }

    result.sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'first_air_date') 
        return new Date(b.first_air_date || 0).getTime() - new Date(a.first_air_date || 0).getTime();
      return 0;
    });

    setFilteredShows(result);
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen"><div className="text-2xl">Loading...</div></div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">All TV Shows</h1>

      <div className="bg-dark-light p-6 rounded-lg mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Search</label>
            <input
              type="text"
              placeholder="Search TV shows..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Genre</label>
            <select value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)} className="input-field">
              <option value="All">All Genres</option>
              {GENRES.map((genre) => <option key={genre} value={genre}>{genre}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Sort By</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="input-field">
              <option value="rating">Rating</option>
              <option value="title">Title</option>
              <option value="first_air_date">Air Date</option>
            </select>
          </div>
        </div>
      </div>

      <p className="text-gray-400 mb-4">Showing {filteredShows.length} of {tvShows.length} TV shows</p>

      {filteredShows.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {filteredShows.map((show) => <MovieCard key={show.id} item={show} type="tvshow" />)}
        </div>
      ) : (
        <div className="text-center py-20"><p className="text-2xl text-gray-400">No TV shows found</p></div>
      )}
    </div>
  );
}
