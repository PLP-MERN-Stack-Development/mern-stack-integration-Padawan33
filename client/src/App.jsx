import React, { useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import api from './api'; 

// --- IMPORT NEW COMPONENTS ---
// 💡 Updated path to pages directory 💡
import CreatePost from './pages/CreatePost'; 

// --- UTILITY COMPONENTS ---

const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center h-64">
    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-gray-300"></div>
    <p className="mt-4 text-gray-500 text-sm">Loading posts...</p>
  </div>
);

const ErrorMessage = ({ message }) => (
  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-md text-sm" role="alert">
    <span className="font-semibold">Error:</span>
    <span className="ml-2">{message}</span>
  </div>
);

const PostCard = ({ post }) => {
  const defaultExcerpt = post.content ? (post.content.substring(0, 120) + (post.content.length > 120 ? '...' : '')) : 'No content preview available.';
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 flex flex-col gap-2 hover:shadow-sm transition-shadow duration-200">
      <span className="text-xs font-medium text-gray-500 mb-1">
        {post.category?.name || 'Uncategorized'}
      </span>
      <Link to={`/post/${post._id}`} className="block">
        <h3 className="text-lg font-semibold text-gray-900 hover:text-purple-600 transition-colors truncate">
          {post.title}
        </h3>
      </Link>
      <p className="text-gray-500 text-sm">
        {post.excerpt || defaultExcerpt}
      </p>
      <div className="flex items-center justify-between mt-2">
        <p className="text-xs text-gray-400">
          {post.author?.username ? `By ${post.author.username}` : 'By Unknown Author'}
        </p>
        <Link to={`/post/${post._id}`} className="text-xs font-medium text-purple-500 hover:text-purple-700 transition-colors">
          Read More →
        </Link>
      </div>
    </div>
  );
};


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
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Latest Blog Posts</h1>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {posts.length > 0 ? (
          posts.map(post => (
            <PostCard key={post._id} post={post} />
          ))
        ) : (
          <p className="text-base text-gray-400 col-span-full text-center py-8">No posts found. Time to create one!</p>
        )}
      </div>
    </div>
  );
};

const PostDetailPage = () => {
    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Post Detail Page Placeholder</h1>
            <p className="text-gray-500 mb-6">Details will be implemented later.</p>
        </div>
    );
};

// --- LAYOUT COMPONENTS ---

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 flex justify-between items-center h-14">
        <Link to="/" className="text-lg font-bold text-purple-600 hover:text-purple-800 transition-colors">MERN Blog</Link>
        <nav className="flex gap-4">
          <Link to="/" className="text-gray-500 hover:text-gray-900 text-sm font-medium">Home</Link>
          <Link to="/create" className="px-3 py-1 border border-purple-500 text-purple-500 rounded-full text-xs font-semibold hover:bg-purple-50 transition-colors">New Post</Link>
        </nav>
      </div>
    </header>
  );
};

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="max-w-4xl mx-auto py-6 px-4 text-center">
        <p className="text-gray-400 text-xs">© {new Date().getFullYear()} MERN Stack Blog.</p>
      </div>
    </footer>
  );
};

// --- MAIN APP COMPONENT ---

const App = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      <Header />
      <main className="grow max-w-4xl mx-auto w-full p-4">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default App;