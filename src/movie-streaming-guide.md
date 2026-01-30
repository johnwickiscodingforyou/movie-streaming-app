# Complete Movie Streaming Website - Step-by-Step Guide

## Project Overview
Building a movie streaming platform similar to pyazz.com using:
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (Database + Authentication)

---

## Phase 1: Basic Setup ✅

### File Structure
```
movie-streaming-app/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Main layout (we'll modify)
│   │   ├── page.tsx             # Homepage
│   │   ├── movies/
│   │   │   ├── page.tsx         # Movies listing
│   │   │   └── [id]/
│   │   │       └── page.tsx     # Single movie details
│   │   ├── tvshows/
│   │   │   ├── page.tsx         # TV Shows listing
│   │   │   └── [id]/
│   │   │       └── page.tsx     # Single TV show details
│   │   ├── login/
│   │   │   └── page.tsx         # Login page
│   │   ├── signup/
│   │   │   └── page.tsx         # Signup page
│   │   └── profile/
│   │       └── page.tsx         # User profile
│   ├── components/
│   │   ├── Header.tsx           # Navigation header
│   │   ├── Footer.tsx           # Footer
│   │   ├── MovieCard.tsx        # Movie card component
│   │   ├── SearchBar.tsx        # Search functionality
│   │   ├── GenreFilter.tsx      # Genre filtering
│   │   └── Hero.tsx             # Hero section
│   ├── lib/
│   │   ├── supabase.ts          # Supabase client
│   │   └── types.ts             # TypeScript types
│   └── styles/
│       └── globals.css          # Global styles
├── .env.local                   # Environment variables
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

---

## Phase 2: Setting Up Supabase

### Step 1: Create Supabase Project
1. Go to https://supabase.com
2. Sign up / Login
3. Click "New Project"
4. Fill in:
   - Name: movie-streaming-db
   - Database Password: (create a strong password - SAVE THIS!)
   - Region: Choose closest to you
5. Wait 2-3 minutes for setup

### Step 2: Create Database Tables

Go to your Supabase project → SQL Editor → New Query

**Run this SQL code:**

```sql
-- Create movies table
CREATE TABLE movies (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  poster_url TEXT,
  backdrop_url TEXT,
  trailer_url TEXT,
  rating DECIMAL(3,1) DEFAULT 0,
  release_date DATE,
  duration INTEGER, -- in minutes
  genre TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create TV shows table
CREATE TABLE tv_shows (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  poster_url TEXT,
  backdrop_url TEXT,
  trailer_url TEXT,
  rating DECIMAL(3,1) DEFAULT 0,
  first_air_date DATE,
  seasons INTEGER DEFAULT 1,
  episodes INTEGER DEFAULT 1,
  genre TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reviews table
CREATE TABLE reviews (
  id BIGSERIAL PRIMARY KEY,
  movie_id BIGINT REFERENCES movies(id) ON DELETE CASCADE,
  tvshow_id BIGINT REFERENCES tv_shows(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create watchlist table
CREATE TABLE watchlist (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  movie_id BIGINT REFERENCES movies(id) ON DELETE CASCADE,
  tvshow_id BIGINT REFERENCES tv_shows(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, movie_id),
  UNIQUE(user_id, tvshow_id)
);

-- Insert sample movies
INSERT INTO movies (title, description, poster_url, rating, release_date, duration, genre) VALUES
('The Shawshank Redemption', 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.', 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg', 9.3, '1994-09-23', 142, ARRAY['Drama', 'Crime']),
('The Godfather', 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.', 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg', 9.2, '1972-03-14', 175, ARRAY['Drama', 'Crime']),
('The Dark Knight', 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.', 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg', 9.0, '2008-07-18', 152, ARRAY['Action', 'Crime', 'Drama']),
('Pulp Fiction', 'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.', 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg', 8.9, '1994-10-14', 154, ARRAY['Crime', 'Drama']),
('Inception', 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea.', 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg', 8.8, '2010-07-16', 148, ARRAY['Action', 'Thriller', 'Mystery']);

-- Insert sample TV shows
INSERT INTO tv_shows (title, description, poster_url, rating, first_air_date, seasons, episodes, genre) VALUES
('Breaking Bad', 'A high school chemistry teacher turned methamphetamine producer partners with a former student.', 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg', 9.5, '2008-01-20', 5, 62, ARRAY['Drama', 'Crime', 'Thriller']),
('Game of Thrones', 'Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns.', 'https://image.tmdb.org/t/p/w500/u3bZgnGQ9T01sWNhyveQz0wH0Hl.jpg', 9.3, '2011-04-17', 8, 73, ARRAY['Drama', 'Fantasy', 'Adventure']),
('Stranger Things', 'When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces.', 'https://image.tmdb.org/t/p/w500/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg', 8.7, '2016-07-15', 4, 34, ARRAY['Drama', 'Mystery', 'Thriller']);
```

### Step 3: Get Supabase Credentials

1. In Supabase Dashboard → Settings → API
2. Copy these values:
   - **Project URL**
   - **anon public key**

---

## Phase 3: Environment Setup

Create `.env.local` file in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

**⚠️ IMPORTANT:** Replace the values with your actual Supabase credentials!

---

## Phase 4: Core Configuration Files

These files are already in your project, but we need to update them.

### Update `tailwind.config.ts`
```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#e50914',
          dark: '#b20710',
        },
        dark: {
          DEFAULT: '#141414',
          light: '#2f2f2f',
        }
      },
    },
  },
  plugins: [],
};

export default config;
```

### Update `src/app/globals.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-dark text-white;
  }
}

@layer components {
  .btn-primary {
    @apply bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-6 rounded transition-colors duration-200;
  }
  
  .btn-secondary {
    @apply bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded transition-colors duration-200;
  }

  .card {
    @apply bg-dark-light rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300;
  }

  .input-field {
    @apply w-full px-4 py-2 bg-dark-light border border-gray-700 rounded focus:outline-none focus:border-primary text-white;
  }
}
```

---

## Next Steps

Now you're ready to start coding the actual components! 

The guide continues with:
- TypeScript types
- Supabase client setup
- Components (Header, Footer, MovieCard, etc.)
- Pages (Homepage, Movies, TV Shows, etc.)
- Authentication
- And more!

Would you like me to continue with the next section?
