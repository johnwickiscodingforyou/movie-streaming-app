# ?? MovieStream - Movie & TV Show Streaming Platform

A full-stack web application for browsing movies and TV shows, built with Next.js, TypeScript, Tailwind CSS, and Supabase.

![MovieStream Screenshot](screenshot.png)

## ?? Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Project](#running-the-project)
- [Project Structure](#project-structure)
- [Key Features Explained](#key-features-explained)
- [Database Schema](#database-schema)
- [Troubleshooting](#troubleshooting)
- [Future Enhancements](#future-enhancements)
- [Credits](#credits)

---

## ? Features

### Core Functionality
- ?? **Browse Movies & TV Shows** - View extensive catalogs with posters and ratings
- ?? **Search & Filter** - Find content by title, genre, rating, or release date
- ? **User Reviews** - Rate and review movies/TV shows (1-5 stars)
- ?? **User Authentication** - Secure signup and login system
- ?? **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- ?? **Dark Theme** - Modern Netflix-style dark interface

### Pages Included
- **Homepage** - Featured movies, TV shows, and genre browsing
- **Movies Page** - Full movie catalog with advanced filtering
- **TV Shows Page** - Complete TV show collection
- **Trending Page** - Most popular content
- **Movie/Show Details** - Full information, trailers, and reviews
- **Login/Signup** - User authentication pages
- **User Profile** - View account information

---

## ??? Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework

### Backend & Database
- **Supabase** - Backend as a Service (BaaS)
  - PostgreSQL database
  - Authentication
  - Real-time subscriptions
  - Storage (for future file uploads)

### Development Tools
- **Node.js** - JavaScript runtime
- **npm** - Package manager
- **VS Code** - Code editor (recommended)
- **Git** - Version control

---

## ?? Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js** (v20 or higher)
   - Download from: https://nodejs.org/
   - Verify: 
ode --version

2. **npm** (comes with Node.js)
   - Verify: 
pm --version

3. **Git** (optional but recommended)
   - Download from: https://git-scm.com/
   - Verify: git --version

4. **Supabase Account** (free)
   - Sign up at: https://supabase.com

5. **Code Editor** (VS Code recommended)
   - Download from: https://code.visualstudio.com/

---

## ?? Installation

### Step 1: Clone or Download the Project

**Option A: Using Git (recommended)**
\\\ash
git clone https://github.com/yourusername/movie-streaming-app.git
cd movie-streaming-app
\\\

**Option B: Download ZIP**
1. Download the project ZIP file
2. Extract to your desired location
3. Open terminal/command prompt in the project folder

### Step 2: Install Dependencies

\\\ash
npm install
\\\

This will install all required packages (~200MB). Wait 2-3 minutes for completion.

---

## ?? Configuration

### Step 1: Create Supabase Project

1. Go to https://supabase.com and sign in
2. Click **"New Project"**
3. Fill in details:
   - **Name**: movie-streaming-db
   - **Database Password**: Create a strong password (SAVE THIS!)
   - **Region**: Choose closest to your location
4. Click **"Create new project"**
5. Wait 2-3 minutes for setup

### Step 2: Create Database Tables

1. In Supabase Dashboard, go to **SQL Editor**
2. Click **"New Query"**
3. Copy and paste this SQL code:

\\\sql
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
  duration INTEGER,
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

-- Insert sample movies
INSERT INTO movies (title, description, poster_url, rating, release_date, duration, genre) VALUES
('The Shawshank Redemption', 'Two imprisoned men bond over a number of years.', 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg', 9.3, '1994-09-23', 142, ARRAY['Drama', 'Crime']),
('The Godfather', 'The aging patriarch of an organized crime dynasty.', 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg', 9.2, '1972-03-14', 175, ARRAY['Drama', 'Crime']),
('The Dark Knight', 'Batman must accept one of the greatest psychological tests.', 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg', 9.0, '2008-07-18', 152, ARRAY['Action', 'Crime', 'Drama']),
('Pulp Fiction', 'The lives of two mob hitmen intertwine in four tales.', 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg', 8.9, '1994-10-14', 154, ARRAY['Crime', 'Drama']),
('Inception', 'A thief who steals corporate secrets through dream-sharing.', 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg', 8.8, '2010-07-16', 148, ARRAY['Action', 'Thriller', 'Mystery']);

-- Insert sample TV shows
INSERT INTO tv_shows (title, description, poster_url, rating, first_air_date, seasons, episodes, genre) VALUES
('Breaking Bad', 'A high school chemistry teacher turned meth producer.', 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg', 9.5, '2008-01-20', 5, 62, ARRAY['Drama', 'Crime', 'Thriller']),
('Game of Thrones', 'Nine noble families fight for control over Westeros.', 'https://image.tmdb.org/t/p/w500/u3bZgnGQ9T01sWNhyveQz0wH0Hl.jpg', 9.3, '2011-04-17', 8, 73, ARRAY['Drama', 'Fantasy', 'Adventure']),
('Stranger Things', 'A young boy disappears in a small town.', 'https://image.tmdb.org/t/p/w500/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg', 8.7, '2016-07-15', 4, 34, ARRAY['Drama', 'Mystery', 'Thriller']);
\\\

4. Click **"Run"**
5. You should see ? **"Success"**

### Step 3: Get API Credentials

1. In Supabase Dashboard, go to **Settings** ? **API**
2. Copy two values:
   - **Project URL** (e.g., https://xxxxx.supabase.co)
   - **anon public key** (long string starting with eyJ...)

### Step 4: Configure Environment Variables

1. In the project root, find the file .env.local
2. Open it and replace with your actual credentials:

\\\env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
\\\

3. Save the file

?? **IMPORTANT**: Never share or commit your .env.local file to Git!

---

## ?? Running the Project

### Development Mode

\\\ash
npm run dev
\\\

This starts the development server at:
- **Local**: http://localhost:3000
- **Network**: http://your-ip:3000

Open your browser and go to http://localhost:3000

### Production Build

\\\ash
npm run build
npm start
\\\

---

## ?? Project Structure

\\\
movie-streaming-app/
+-- src/
¦   +-- app/                    # Next.js App Router pages
¦   ¦   +-- layout.tsx          # Root layout with Header/Footer
¦   ¦   +-- page.tsx            # Homepage
¦   ¦   +-- globals.css         # Global styles
¦   ¦   +-- movies/
¦   ¦   ¦   +-- page.tsx        # Movies listing
¦   ¦   ¦   +-- [id]/
¦   ¦   ¦       +-- page.tsx    # Single movie details
¦   ¦   +-- tvshows/
¦   ¦   ¦   +-- page.tsx        # TV shows listing
¦   ¦   ¦   +-- [id]/
¦   ¦   ¦       +-- page.tsx    # Single show details
¦   ¦   +-- trending/
¦   ¦   ¦   +-- page.tsx        # Trending content
¦   ¦   +-- login/
¦   ¦   ¦   +-- page.tsx        # Login page
¦   ¦   +-- signup/
¦   ¦       +-- page.tsx        # Signup page
¦   +-- components/             # Reusable UI components
¦   ¦   +-- Header.tsx          # Navigation header
¦   ¦   +-- Footer.tsx          # Footer
¦   ¦   +-- MovieCard.tsx       # Movie/show card
¦   +-- lib/                    # Utilities and configurations
¦       +-- supabase.ts         # Supabase client
¦       +-- types.ts            # TypeScript interfaces
+-- .env.local                  # Environment variables (NOT in Git)
+-- package.json                # Dependencies
+-- tsconfig.json               # TypeScript config
+-- tailwind.config.ts          # Tailwind CSS config
+-- next.config.ts              # Next.js config
+-- README.md                   # This file
\\\

---

## ?? Key Features Explained

### 1. Authentication System
- Uses Supabase Auth for secure user management
- Email/password authentication
- Session management with JWT tokens
- Protected routes for logged-in users only

### 2. Database Operations
All database queries use Supabase client:
\\\	ypescript
// Example: Fetch movies
const { data, error } = await supabase
  .from('movies')
  .select('*')
  .order('rating', { ascending: false });
\\\

### 3. Dynamic Routing
- /movies/[id] - Dynamic route for individual movies
- Next.js automatically generates routes based on folder structure

### 4. Search & Filter
- Client-side filtering for instant results
- Search by title
- Filter by genre
- Sort by rating, title, or date

### 5. Responsive Design
- Mobile-first approach
- Tailwind CSS breakpoints:
  - sm: - 640px
  - md: - 768px
  - lg: - 1024px
  - xl: - 1280px

---

## ??? Database Schema

### Movies Table
| Column | Type | Description |
|--------|------|-------------|
| id | BIGSERIAL | Primary key |
| title | TEXT | Movie title |
| description | TEXT | Movie description |
| poster_url | TEXT | Poster image URL |
| backdrop_url | TEXT | Background image URL |
| trailer_url | TEXT | YouTube trailer link |
| rating | DECIMAL | Rating (0-10) |
| release_date | DATE | Release date |
| duration | INTEGER | Duration in minutes |
| genre | TEXT[] | Array of genres |

### TV Shows Table
Similar to movies, with additional fields:
- irst_air_date instead of elease_date
- seasons - Number of seasons
- episodes - Total episode count

### Reviews Table
| Column | Type | Description |
|--------|------|-------------|
| id | BIGSERIAL | Primary key |
| movie_id | BIGINT | References movies(id) |
| tvshow_id | BIGINT | References tv_shows(id) |
| user_id | UUID | References auth.users(id) |
| rating | INTEGER | User rating (1-5) |
| comment | TEXT | Review text |
| created_at | TIMESTAMP | Review timestamp |

---

## ?? Troubleshooting

### Issue: Port 3000 already in use
**Solution:**
\\\ash
# Windows
netstat -ano | findstr :3000
taskkill /PID <pid> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
\\\

### Issue: Module not found errors
**Solution:**
\\\ash
rm -rf node_modules package-lock.json
npm install
\\\

### Issue: Supabase connection error
**Solution:**
1. Check .env.local file has correct credentials
2. Verify Supabase project is active
3. Restart dev server

### Issue: Images not loading
**Solution:**
- Check 
ext.config.ts has image.tmdb.org in emotePatterns
- Verify internet connection

### Issue: TypeScript errors
**Solution:**
\\\ash
npx tsc --noEmit
\\\
This checks for type errors without building.

---

## ?? Future Enhancements

Possible additions for expanding the project:

- [ ] **Watchlist Feature** - Save favorite movies/shows
- [ ] **User Profiles** - Custom avatars and bios
- [ ] **Social Features** - Follow users, like reviews
- [ ] **Admin Panel** - Add/edit/delete content
- [ ] **Video Player** - Stream content directly
- [ ] **Recommendation Engine** - AI-powered suggestions
- [ ] **Multiple Languages** - i18n support
- [ ] **Dark/Light Mode Toggle**
- [ ] **Email Notifications** - New releases alerts
- [ ] **Payment Integration** - Subscription system

---

## ?? Learning Resources

### Next.js
- Official Docs: https://nextjs.org/docs
- Learn Next.js: https://nextjs.org/learn

### TypeScript
- Handbook: https://www.typescriptlang.org/docs/handbook/intro.html
- TypeScript in React: https://react-typescript-cheatsheet.netlify.app/

### Tailwind CSS
- Documentation: https://tailwindcss.com/docs
- Components: https://tailwindui.com/

### Supabase
- Getting Started: https://supabase.com/docs/guides/getting-started
- Auth Guide: https://supabase.com/docs/guides/auth

---

## ?? Credits

**Developed by:** [Your Name]  
**Course:** Computer Science Diploma  
**Institution:** [Your School/College Name]  
**Year:** 2026

**Technologies Used:**
- Next.js - https://nextjs.org
- Supabase - https://supabase.com
- Tailwind CSS - https://tailwindcss.com
- TMDB API (for images) - https://www.themoviedb.org

---

## ?? License

This project is created for educational purposes as part of a diploma project.

---

## ?? Contact

For questions or feedback:
- **Email:** your.email@example.com
- **GitHub:** https://github.com/yourusername
- **LinkedIn:** https://linkedin.com/in/yourprofile

---

## ?? Project Demo

To demonstrate this project:

1. **Start the application:**
   \\\ash
   npm run dev
   \\\

2. **Show key features:**
   - Browse movies and TV shows
   - Use search and filters
   - Create an account
   - Submit a review
   - Navigate between pages

3. **Explain the tech stack:**
   - Frontend: Next.js + React + TypeScript
   - Styling: Tailwind CSS
   - Backend: Supabase (PostgreSQL)
   - Authentication: Supabase Auth

4. **Show the code structure:**
   - Open VS Code
   - Explain component architecture
   - Show database queries
   - Demonstrate TypeScript types

---

**Thank you for reviewing this project! ??**
