// src/components/MovieCard.tsx
// Reusable card component for displaying movies and TV shows
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Movie, TVShow } from '@/lib/types';

interface MovieCardProps {
  item: Movie | TVShow;
  type: 'movie' | 'tvshow';
}

export default function MovieCard({ item, type }: MovieCardProps) {
  // Determine the link URL based on type
  const href = type === 'movie' ? `/movies/${item.id}` : `/tvshows/${item.id}`;
  
  // Get the appropriate date field
  const date = type === 'movie' 
    ? (item as Movie).release_date 
    : (item as TVShow).first_air_date;
  
  // Format the year from date
  const year = date ? new Date(date).getFullYear() : 'N/A';

  return (
    <Link href={href} className="group">
      <div className="card cursor-pointer transform transition-transform duration-300 group-hover:scale-105">
        {/* Poster Image */}
        <div className="relative aspect-[2/3] overflow-hidden">
          {item.poster_url ? (
            <Image
              src={item.poster_url}
              alt={item.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
          ) : (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
              <p className="text-gray-500">No Image</p>
            </div>
          )}
          
          {/* Rating Badge */}
          <div className="absolute top-2 right-2 bg-black bg-opacity-80 px-2 py-1 rounded">
            <span className="text-yellow-400 font-bold">⭐ {item.rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">
            {item.title}
          </h3>
          
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>{year}</span>
            {type === 'tvshow' && (
              <span>{(item as TVShow).seasons} Season{(item as TVShow).seasons !== 1 ? 's' : ''}</span>
            )}
            {type === 'movie' && (item as Movie).duration && (
              <span>{(item as Movie).duration} min</span>
            )}
          </div>

          {/* Genres */}
          <div className="flex flex-wrap gap-1 mt-2">
            {item.genre.slice(0, 2).map((genre, index) => (
              <span
                key={index}
                className="text-xs bg-gray-700 px-2 py-1 rounded"
              >
                {genre}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
