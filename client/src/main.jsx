import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// Basic global styles (assuming Tailwind CSS is imported here or in index.css)
// NOTE: We assume you have a CSS file (like index.css) that imports Tailwind
// directives. We will skip creating a separate CSS file as per the single-file
// mandate, but this setup assumes Tailwind utilities are available.

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
