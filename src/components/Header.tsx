// src/components/Header.tsx
// Navigation header component that appears on every page
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase, getCurrentUser, signOut } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();

  // Check if user is logged in when component mounts
  useEffect(() => {
    checkUser();
    
    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setIsLoggedIn(true);
        setUserEmail(session.user.email || '');
      } else {
        setIsLoggedIn(false);
        setUserEmail('');
      }
    });

    // Cleanup subscription
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const checkUser = async () => {
    const user = await getCurrentUser();
    if (user) {
      setIsLoggedIn(true);
      setUserEmail(user.email || '');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setShowUserMenu(false);
    router.push('/');
  };

  return (
    <header className="bg-dark-light shadow-lg sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-primary hover:text-primary-dark transition-colors">
            MovieStream
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/movies" className="hover:text-primary transition-colors">
              Movies
            </Link>
            <Link href="/tvshows" className="hover:text-primary transition-colors">
              TV Shows
            </Link>
            <Link href="/trending" className="hover:text-primary transition-colors">
              Trending
            </Link>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 hover:text-primary transition-colors"
                >
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    {userEmail.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:inline">{userEmail}</span>
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-dark-light rounded-lg shadow-xl py-2">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 hover:bg-dark transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      My Profile
                    </Link>
                    <Link
                      href="/watchlist"
                      className="block px-4 py-2 hover:bg-dark transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Watchlist
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 hover:bg-dark transition-colors text-red-500"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login" className="hover:text-primary transition-colors">
                  Login
                </Link>
                <Link href="/signup" className="btn-primary">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden mt-4 flex items-center justify-center space-x-6">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <Link href="/movies" className="hover:text-primary transition-colors">
            Movies
          </Link>
          <Link href="/tvshows" className="hover:text-primary transition-colors">
            TV Shows
          </Link>
        </div>
      </nav>
    </header>
  );
}
