import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-navy': '#0a192f',
        'brand-gold': '#f7c30a',
        'brand-blue': '#3b9eff',
        'brand-red': '#d62f2f',
        'brand-light': '#e6f1ff', 
        'brand-dark-accent': '#1e3a5f',
      },
      fontFamily: {
        sans: ['Roboto Condensed', 'sans-serif'],
      },
    },
  },
  plugins: [
    typography,
  ],
};  