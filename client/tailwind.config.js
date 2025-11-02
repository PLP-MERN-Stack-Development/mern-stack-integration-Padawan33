import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Ensuring a font is specified to confirm styles apply
        sans: ['Inter', 'sans-serif'], 
      },
    },
  },
  plugins: [
    typography,
  ],
};