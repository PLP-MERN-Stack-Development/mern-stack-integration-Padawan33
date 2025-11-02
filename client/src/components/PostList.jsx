import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Use a placeholder category name since we haven't implemented category population yet
const CATEGORY_PLACEHOLDER = 'Uncategorized'; 

// Component for a single post card
const PostCard = ({ post }) => (
  <div className="bg-white shadow-lg rounded-xl overflow-hidden transform transition duration-300 hover:shadow-xl hover:scale-[1.02]">
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        {/* Placeholder for category/tag */}
        <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
          {post.category || CATEGORY_PLACEHOLDER} 
        </span>
        <span className="text-sm text-gray-500">
          {new Date(post.createdAt || Date.now()).toLocaleDateString()}
        </span>
      </div>
      
      {/* Post Title */}
      <h2 className="text-2xl font-bold text-gray-900 mb-3 leading-snug">
        {post.title}
      </h2>
      
      {/* Post Content Snippet */}
      <p className="text-gray-700 mb-4 line-clamp-3">
        {post.content}
      </p>
      
      {/* Author/Footer Info */}
      <div className="flex items-center justify-between border-t pt-4">
        <div className="text-sm text-gray-600 font-medium">
          Author: {post.author || 'Anonymous'} 
        </div>
        <button 
          onClick={() => console.log(`Reading post: ${post.title}`)} // Placeholder action
          className="text-indigo-600 hover:text-indigo-800 transition duration-150 text-sm font-semibold"
        >
          Read More &rarr;
        </button>
      </div>
    </div>
  </div>
);

// Main component to fetch and display the list of posts
const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // The base URL for the Express API
  const API_URL = 'http://localhost:5000/api/posts';

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      // Use axios to fetch data from the back-end API
      const response = await axios.get(API_URL);
      
      // The back-end responds with { success: true, count: X, data: [...] }
      if (response.data.success && Array.isArray(response.data.data)) {
        setPosts(response.data.data);
      } else {
        // Handle unexpected API response structure
        throw new Error('Unexpected data format from API.');
      }
    } catch (err) {
      // Axios error handling
      console.error("Error fetching posts:", err.message);
      // Display a helpful message to the user
      setError('Failed to fetch posts. Ensure the Node.js server is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  // Run the fetch function only once on component mount
  useEffect(() => {
    fetchPosts();
  }, []); // Empty dependency array means this runs once

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <p className="ml-3 text-lg text-gray-600">Loading posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-red-50 border border-red-200 rounded-lg max-w-xl mx-auto">
        <p className="text-red-700 font-medium mb-4">{error}</p>
        <button 
          onClick={fetchPosts} 
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center mx-auto transition duration-200"
        >
          Try Refreshing
        </button>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center p-8 bg-yellow-50 border border-yellow-200 rounded-lg max-w-xl mx-auto">
        <p className="text-xl font-semibold text-yellow-800 mb-2">No Posts Found</p>
        <p className="text-yellow-700">The database is connected, but there are no blog posts yet.</p>
        <p className="text-sm text-yellow-600 mt-2">Check the browser console for network activity!</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen font-inter">
      <header className="max-w-4xl mx-auto mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">MERN Stack Blog</h1>
        <p className="text-xl text-gray-600">Discover the latest articles fetched live from your Express API.</p>
      </header>

      <div className="max-w-6xl mx-auto grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map(post => (
          // Use the MongoDB _id as the key
          <PostCard key={post._id} post={post} /> 
        ))}
      </div>
    </div>
  );
};

export default PostList;
