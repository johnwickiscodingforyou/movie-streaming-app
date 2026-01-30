// src/lib/types.ts
// This file defines all the TypeScript types/interfaces for our app
// Types help prevent bugs by ensuring we use the correct data structures

// Movie interface - defines what a movie object looks like
export interface Movie {
  id: number;                    // Unique identifier
  title: string;                 // Movie title
  description: string | null;    // Movie description (can be null)
  poster_url: string | null;     // URL to poster image
  backdrop_url: string | null;   // URL to backdrop image
  trailer_url: string | null;    // URL to trailer video
  rating: number;                // Rating (0-10)
  release_date: string | null;   // Release date
  duration: number | null;       // Duration in minutes
  genre: string[];               // Array of genre names
  created_at: string;            // When record was created
  updated_at: string;            // When record was updated
}

// TV Show interface - similar to Movie but for TV shows
export interface TVShow {
  id: number;
  title: string;
  description: string | null;
  poster_url: string | null;
  backdrop_url: string | null;
  trailer_url: string | null;
  rating: number;
  first_air_date: string | null;
  seasons: number;
  episodes: number;
  genre: string[];
  created_at: string;
  updated_at: string;
}

// Review interface - for movie/TV show reviews
export interface Review {
  id: number;
  movie_id: number | null;
  tvshow_id: number | null;
  user_id: string;
  rating: number;                // 1-5 stars
  comment: string | null;
  created_at: string;
  // Optional: include user info when fetching reviews
  user?: {
    email: string;
  };
}

// Watchlist interface - for user's saved items
export interface Watchlist {
  id: number;
  user_id: string;
  movie_id: number | null;
  tvshow_id: number | null;
  created_at: string;
}

// User interface - from Supabase Auth
export interface User {
  id: string;
  email: string;
  created_at: string;
}

// Genre options - predefined list
export const GENRES = [
  'Action',
  'Drama',
  'Thriller',
  'Romance',
  'Comedy',
  'Mystery',
  'Animation',
  'Crime',
  'Adventure',
  'Fantasy',
  'Family',
  'Horror',
  'Sci-Fi',
  'Documentary',
] as const;

// Type for genre (one of the GENRES values)
export type Genre = typeof GENRES[number];
