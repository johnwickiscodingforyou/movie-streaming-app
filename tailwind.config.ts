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
