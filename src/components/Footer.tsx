// src/components/Footer.tsx
// Simple footer component
'use client';

import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-light mt-20 py-8 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold text-primary mb-4">MovieStream</h3>
            <p className="text-gray-400 text-sm">
              Your ultimate destination for movies and TV shows. Stream, review, and discover your next favorite content.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link href="/movies" className="hover:text-primary transition-colors">
                  Movies
                </Link>
              </li>
              <li>
                <Link href="/tvshows" className="hover:text-primary transition-colors">
                  TV Shows
                </Link>
              </li>
              <li>
                <Link href="/trending" className="hover:text-primary transition-colors">
                  Trending
                </Link>
              </li>
            </ul>
          </div>

          {/* Genres */}
          <div>
            <h4 className="font-semibold mb-4">Popular Genres</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
            <li><Link href="/movies?genre=Action" className="hover:text-primary transition-colors">Action</Link></li>
            <li><Link href="/movies?genre=Drama" className="hover:text-primary transition-colors">Drama</Link></li>
            <li><Link href="/movies?genre=Comedy" className="hover:text-primary transition-colors">Comedy</Link></li>
            <li><Link href="/movies?genre=Thriller" className="hover:text-primary transition-colors">Thriller</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link href="/privacy" className="hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          <p>&copy; {currentYear} MovieStream. All rights reserved.</p>
          <p className="mt-2">Built with Next.js, TypeScript, and Supabase</p>
        </div>
      </div>
    </footer>
  );
}
