// 💡 We must use ESM 'import' and 'export default'
import tailwindcss from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';

export default {
  plugins: [
    // 💡 FIX: Pass an object with the config file path
    // This tells the plugin "Go find this file and read it yourself."
    tailwindcss({ config: './tailwind.config.js' }), 
    autoprefixer,
  ],
};