import React from 'react';
import ReactDOM from 'react-dom/client';
import { 
  createBrowserRouter, 
  RouterProvider, 
  createRoutesFromElements, 
  Route 
} from 'react-router-dom';
import App from './App.jsx';
import CreatePost from './pages/CreatePost';
import HomePage from './components/PostList';
import './index.css';

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
    <RouterProvider router={router} />
  </React.StrictMode>
);
