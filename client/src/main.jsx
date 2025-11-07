import React from 'react';
import ReactDOM from 'react-dom/client';
import { 
  createBrowserRouter, 
  RouterProvider, 
  createRoutesFromElements, 
  Route 
} from 'react-router-dom';

import App from './App.jsx';
import CreatePost from './pages/CreatePost.jsx'; // Added .jsx
import HomePage from './components/PostList.jsx'; // Added .jsx
import './index.css';

// 💡 NEW: Import your AuthProvider
import { AuthProvider } from './context/AuthContext.jsx';

const routes = createRoutesFromElements(
  <Route path="/" element={<App />}>
    <Route index element={<HomePage />} />
    <Route path="create" element={<CreatePost />} />
    <Route path="post/:id" element={<div>Post Detail Page</div>} />
    <Route 
      path="*" 
      element={
        <div className="text-center mt-20 text-base font-semibold text-gray-400">
          404 - Page Not Found
        </div>
      } 
    />
  </Route>
);

const router = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 💡 Wrap your RouterProvider with the AuthProvider */}
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);