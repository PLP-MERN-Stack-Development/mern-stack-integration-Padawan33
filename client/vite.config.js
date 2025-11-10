import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  css: {
    postcss: {
      plugins: [
        // 💡 FIX: Pass the config file PATH as a string
        // This tells the plugin "Go find this file and read it yourself."
        tailwindcss({ config: './tailwind.config.js' }), 
        autoprefixer,
      ],
    },
  },
});