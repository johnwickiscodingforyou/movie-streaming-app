# 🚀 Movie Streaming Website - Complete Setup Guide

## IMPORTANT: Follow these steps IN ORDER!

---

## Part 1: Install Required Software (30 minutes)

### 1. Install Node.js
- Go to: https://nodejs.org
- Download the LTS version (recommended)
- Run the installer
- Click "Next" through all steps
- Restart your computer

**Verify Installation:**
Open Command Prompt (Windows) or Terminal (Mac) and type:
```bash
node --version
npm --version
```
You should see version numbers like v20.x.x and 10.x.x

### 2. Install Visual Studio Code
- Go to: https://code.visualstudio.com
- Download and install
- Open VS Code

**Recommended Extensions (Install these in VS Code):**
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- TypeScript Importer
- Prettier - Code formatter

### 3. Install Git
- Go to: https://git-scm.com
- Download and install
- Use default settings during installation

**Verify Installation:**
```bash
git --version
```

---

## Part 2: Create Accounts (10 minutes)

### 1. GitHub Account
- Go to: https://github.com
- Click "Sign up"
- Use your email
- Complete verification

### 2. Supabase Account
- Go to: https://supabase.com
- Click "Start your project"
- Sign up with GitHub (easiest)
- Verify your email

---

## Part 3: Create Your Project (15 minutes)

### Step 1: Open Terminal/Command Prompt

**Windows:**
- Press `Win + R`
- Type `cmd` and press Enter

**Mac:**
- Press `Cmd + Space`
- Type `terminal` and press Enter

### Step 2: Navigate to Desktop
```bash
cd Desktop
```

### Step 3: Create Next.js Project
```bash
npx create-next-app@latest movie-streaming-app
```

**When asked, choose these options:**
```
✔ Would you like to use TypeScript? … Yes
✔ Would you like to use ESLint? … Yes
✔ Would you like to use Tailwind CSS? … Yes
✔ Would you like your code inside a `src/` directory? … Yes
✔ Would you like to use App Router? … Yes
✔ Would you like to use Turbopack? … No
✔ Would you like to customize the import alias? … No
```

This will take 2-3 minutes to install.

### Step 4: Navigate into Project
```bash
cd movie-streaming-app
```

### Step 5: Install Supabase
```bash
npm install @supabase/supabase-js
```

### Step 6: Open in VS Code
```bash
code .
```

---

## Part 4: Setup Supabase Database (20 minutes)

### Step 1: Create Supabase Project

1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Fill in:
   - Name: `movie-streaming-db`
   - Database Password: Create a strong password
     **⚠️ WRITE THIS DOWN! YOU'LL NEED IT LATER**
   - Region: Choose closest to your location
4. Click "Create new project"
5. Wait 2-3 minutes for setup

### Step 2: Create Database Tables

1. In your Supabase project, click "SQL Editor" (left sidebar)
2. Click "New Query"
3. Copy and paste this ENTIRE SQL code:

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

4. Click "Run" (bottom right)
5. You should see "Success. No rows returned"

### Step 3: Get Supabase Credentials

1. In Supabase Dashboard, click "Settings" (gear icon, bottom left)
2. Click "API" in the settings menu
3. You'll see:
   - **Project URL** (starts with https://)
   - **anon public** key (long string)
4. **COPY BOTH OF THESE!** You'll need them next.

---

## Part 5: Configure Your Project (10 minutes)

### Step 1: Create Environment File

In VS Code:
1. In the file explorer (left sidebar), you should see your project files
2. Right-click in the empty space
3. Select "New File"
4. Name it: `.env.local`
5. Press Enter

### Step 2: Add Supabase Credentials

Paste this into `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

Replace `your_project_url_here` and `your_anon_key_here` with the actual values you copied from Supabase.

**Example:**
```
NEXT_PUBLIC_SUPABASE_URL=https://abcdefgh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Save the file (`Ctrl+S` or `Cmd+S`).

---

## Part 6: Add the Code Files (30 minutes)

Now you need to add all the code files I created for you. Here's how:

### Where to Find the Files

I've created these files for you:
1. `src-lib-types.ts`
2. `src-lib-supabase.ts`
3. `src-components-Header.tsx`
4. `src-components-Footer.tsx`
5. `src-components-MovieCard.tsx`
6. `src-app-layout.tsx`
7. `src-app-page.tsx`
8. `src-app-movies-page.tsx`
9. `src-app-movies-id-page.tsx`
10. `src-app-login-page.tsx`
11. `src-app-signup-page.tsx`

### How to Add Each File:

For EACH file above, follow these steps:

**Example: Adding types.ts**

1. In VS Code file explorer, navigate to create the folder structure
2. Right-click on `src` folder → New Folder → name it `lib`
3. Right-click on `lib` folder → New File → name it `types.ts`
4. Open the file I created (`src-lib-types.ts`)
5. Copy ALL the code
6. Paste it into your new `src/lib/types.ts` file
7. Save (`Ctrl+S` or `Cmd+S`)

**Repeat for all files following this pattern:**

- `src-lib-supabase.ts` → Create `src/lib/supabase.ts`
- `src-components-Header.tsx` → Create `src/components/Header.tsx`
- `src-components-Footer.tsx` → Create `src/components/Footer.tsx`
- `src-components-MovieCard.tsx` → Create `src/components/MovieCard.tsx`
- `src-app-layout.tsx` → **REPLACE** existing `src/app/layout.tsx`
- `src-app-page.tsx` → **REPLACE** existing `src/app/page.tsx`
- `src-app-movies-page.tsx` → Create folder `src/app/movies/`, then create `page.tsx` inside it
- `src-app-movies-id-page.tsx` → Create folders `src/app/movies/[id]/`, then create `page.tsx` inside
- `src-app-login-page.tsx` → Create folder `src/app/login/`, then create `page.tsx` inside
- `src-app-signup-page.tsx` → Create folder `src/app/signup/`, then create `page.tsx` inside

### Final Folder Structure Should Look Like:

```
movie-streaming-app/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   ├── movies/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── signup/
│   │       └── page.tsx
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── MovieCard.tsx
│   └── lib/
│       ├── types.ts
│       └── supabase.ts
├── .env.local
└── package.json
```

---

## Part 7: Update globals.css

Open `src/app/globals.css` and REPLACE everything with:

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

## Part 8: Update tailwind.config.ts

Open `tailwind.config.ts` and REPLACE everything with:

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

---

## Part 9: Run Your Website! 🎉

### Step 1: Start Development Server

In your terminal (still in the project folder):
```bash
npm run dev
```

You should see:
```
▲ Next.js 14.x.x
- Local: http://localhost:3000
```

### Step 2: Open in Browser

Open your web browser and go to:
```
http://localhost:3000
```

**You should see your movie streaming website! 🎉**

---

## Common Issues & Solutions

### Issue 1: "Module not found" errors
**Solution:**
```bash
npm install
```

### Issue 2: Port 3000 already in use
**Solution:**
```bash
# Kill the process and try again
# Or run on different port:
npm run dev -- -p 3001
```

### Issue 3: Supabase connection errors
**Solution:**
- Check `.env.local` file
- Make sure you copied the correct URL and key
- Restart the dev server (`Ctrl+C` then `npm run dev` again)

### Issue 4: Images not loading
**Solution:**
- This is normal for sample data
- Images are from TMDB CDN and should load
- Check your internet connection

---

## Next Steps

Now that your website is running:

1. **Test the features:**
   - Browse movies
   - Create an account
   - Login
   - Submit a review

2. **Learn the code:**
   - Open each file
   - Read the comments
   - Understand how it works

3. **Customize:**
   - Change colors in `tailwind.config.ts`
   - Add more movies in Supabase
   - Modify components

4. **Practice your homework:**
   - Study HTML in components
   - Learn CSS from Tailwind classes
   - Understand JavaScript/TypeScript logic

---

## Need Help?

If you get stuck:
1. Read error messages carefully
2. Google the error
3. Check Supabase dashboard for data
4. Ask me specific questions!

Good luck! You're building a real, professional website! 🚀
