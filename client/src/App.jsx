import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

// Utility: API base URL. Using the standard local URL for sandbox environments.
// Removed import.meta.env to resolve compilation warning/error.
const API_BASE_URL = 'http://localhost:5000/api';
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- PAGES (Components for Routes) ---

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get('/posts');
        setPosts(response.data.data);
      } catch (err) {
        // Updated error message to be more specific after API integration is confirmed
        setError("Failed to fetch posts. Ensure the backend server is running on port 5000.");
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
        Latest Blog Posts
      </h1>
      <div className="grid gap-8 lg:grid-cols-3 md:grid-cols-2">
        {posts.length > 0 ? (
          posts.map(post => (
            <PostCard key={post._id} post={post} />
          ))
        ) : (
          <p className="text-lg text-gray-500 col-span-full">No posts found. Time to create one!</p>
        )}
      </div>
    </div>
  );
};

const PostDetailPage = () => {
    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Post Title Goes Here</h1>
            <p className="text-gray-500 mb-6">Published on January 1, 2024</p>
            <div className="prose lg:prose-lg">
                <p>This is where the detailed content of the blog post will be rendered. We will fetch the post data by ID and display the full title, content, and any metadata here in Task 4.</p>
                <p>For now, this serves as a placeholder for the detailed view.</p>
            </div>
        </div>
    );
};

const CreatePostPage = () => {
    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-2xl">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Create New Post</h1>
            <p className="text-gray-500">Form to create a new post will go here in Task 4.</p>
        </div>
    );
};

// --- COMPONENTS ---

const Header = () => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-indigo-600 hover:text-indigo-800 transition duration-150">
            MERN Blog
          </Link>
          <nav className="flex space-x-6">
            <Link to="/" className="text-gray-500 hover:text-gray-900 transition duration-150 font-medium">Home</Link>
            <Link to="/create" className="px-4 py-1 border border-indigo-600 text-indigo-600 rounded-full text-sm font-semibold hover:bg-indigo-50 transition duration-150">
              New Post
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

const Footer = () => {
  return (
    <footer className="bg-gray-800 mt-12">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-gray-400 text-sm">© {new Date().getFullYear()} MERN Stack Blog. All rights reserved.</p>
      </div>
    </footer>
  );
};

const PostCard = ({ post }) => {
    const defaultExcerpt = post.content.substring(0, 150) + (post.content.length > 150 ? '...' : '');

    return (
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100">
            {/* Placeholder for featured image */}
            <div className="h-48 bg-gray-200 flex items-center justify-center text-gray-500 font-semibold">
                
            </div>
            <div className="p-6">
                <span className="inline-block px-3 py-1 text-xs font-semibold text-indigo-600 bg-indigo-100 rounded-full mb-2">
                    {post.category?.name || 'Uncategorized'}
                </span>
                <Link to={`/post/${post._id}`} className="block">
                    <h3 className="text-xl font-bold text-gray-900 hover:text-indigo-600 transition duration-150 truncate">
                        {post.title}
                    </h3>
                </Link>
                <p className="mt-3 text-gray-500 text-sm line-clamp-3">
                    {post.excerpt || defaultExcerpt}
                </p>
                <div className="mt-4 flex items-center justify-between">
                    <p className="text-xs text-gray-400">
                        {post.author?.username ? `By ${post.author.username}` : 'By Unknown Author'}
                    </p>
                    <Link to={`/post/${post._id}`} className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition duration-150">
                        Read More &rarr;
                    </Link>
                </div>
            </div>
        </div>
    );
};

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
    <p className="ml-4 text-indigo-600">Loading posts...</p>
  </div>
);

const ErrorMessage = ({ message }) => (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
    <strong className="font-bold">Error:</strong>
    <span className="block sm:inline ml-2">{message}</span>
  </div>
);


// --- MAIN APP COMPONENT ---

const App = () => {
  return (
    // Note: Tailwind CSS is assumed to be configured in your build process (Vite).
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
        <BrowserRouter>
            <Header />
            <main className="flex-grow max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/post/:id" element={<PostDetailPage />} />
                    <Route path="/create" element={<CreatePostPage />} />
                    {/* Placeholder for 404 */}
                    <Route path="*" element={<div className="text-center mt-20 text-xl font-bold">404 - Page Not Found</div>} />
                </Routes>
            </main>
            <Footer />
        </BrowserRouter>
    </div>
  );
};

export default App;
