import React, { useState, useEffect, useContext } from 'react'; // 💡 Import useContext
import { Routes, Route, Link, useNavigate } from 'react-router-dom'; // 💡 Import useNavigate
import api from './api.js'; 
import CreatePost from './pages/CreatePost.jsx'; 
import RegisterPage from './pages/RegisterPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import AuthContext from './context/AuthContext.jsx'; // 💡 Import AuthContext

// --- UTILITY COMPONENTS ---
// ... (LoadingSpinner, ErrorMessage, PostCard remain the same) ...
const LoadingSpinner = () => (
  <div style={{ textAlign: 'center', margin: '50px', fontSize: '18px' }}>
    Loading posts...
  </div>
);

const ErrorMessage = ({ message }) => (
  <div style={{ color: 'red', border: '1px solid red', padding: '10px', margin: '20px' }}>
    <strong style={{ fontWeight: 'bold' }}>Error:</strong>
    <span style={{ marginLeft: '10px' }}>{message}</span>
  </div>
);

const PostCard = ({ post }) => {
    const defaultExcerpt = post.content ? (post.content.substring(0, 150) + (post.content.length > 150 ? '...' : '')) : 'No content preview available.';
    const imageUrl = `http://localhost:5000${post.featuredImage}`;

    return (
        <div style={{ border: '1px solid #ddd', borderRadius: '8px', margin: '10px', padding: '15px', background: '#fff' }}>
            <div style={{ height: '200px', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {post.featuredImage && post.featuredImage !== 'default-post.jpg' ? (
                  <img src={imageUrl} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ color: '#888' }}>[No Image]</span>
                )}
            </div>
            <div style={{ padding: '15px 0 0' }}>
                <span style={{ fontSize: '12px', color: '#555', background: '#f0f0f0', padding: '3px 8px', borderRadius: '12px' }}>
                    {post.category?.name || 'Uncategorized'}
                </span>
                <Link to={`/post/${post._id}`}>
                    <h3 style={{ fontSize: '20px', fontWeight: 'bold', margin: '10px 0', color: '#111' }}>
                        {post.title}
                    </h3>
                </Link>
                <p style={{ fontSize: '14px', color: '#444', lineHeight: '1.5' }}>
                    {post.excerpt || defaultExcerpt}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
                    <p style={{ fontSize: '12px', color: '#777' }}>
                        {post.author?.username ? `By ${post.author.username}` : 'By Unknown Author'}
                    </p>
                    <Link to={`/post/${post._id}`} style={{ fontSize: '14px', fontWeight: 'bold', color: '#337ab7' }}>
                        Read More &rarr;
                    </Link>
                </div>
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
        if (response.data.success) {
          setPosts(response.data.data);
        } else {
          setError('API returned success: false');
        }
      } catch (err) {
        console.error('[HomePage] Error in fetchPosts catch block:', err);
        setError("Failed to fetch posts. Check the console.");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []); // Empty dependency array, runs once

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '20px' }}>
        Latest Blog Posts
      </h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {posts.length > 0 ? (
          posts.map(post => (
            <PostCard key={post._id} post={post} />
          ))
        ) : (
          <p style={{ fontSize: '18px', color: '#555', gridColumn: '1 / -1', textAlign: 'center' }}>
              No posts found.
          </p>
        )}
      </div>
    </div>
  );
};

const PostDetailPage = () => {
    return (
        <div style={{ maxWidth: '800px', margin: '40px auto' }}>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '10px' }}>Post Detail Page Placeholder</h1>
            <p style={{ color: '#555' }}>Details will be implemented later.</p>
        </div>
    );
};

// --- LAYOUT COMPONENTS ---
const Header = () => {
  // 💡 NEW: Get auth state and logout function from context
  const { userInfo, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/'); // Redirect to home after logout
  };

  return (
    <header style={{ background: '#fff', borderBottom: '1px solid #eee', position: 'sticky', top: 0, zIndex: 10 }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px' }}>
        <Link to="/" style={{ fontSize: '24px', fontWeight: 'bold', color: '#337ab7', textDecoration: 'none' }}>
          MERN Blog
        </Link>
        <nav style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Link to="/" style={{ color: '#555', textDecoration: 'none' }}>Home</Link>
          
          {/* 💡 NEW: Conditional Links */}
          {userInfo ? (
            <>
              {/* Show "New Post" and "Logout" if logged in */}
              <Link to="/create" style={{ padding: '5px 15px', border: '1px solid #337ab7', color: '#337ab7', borderRadius: '20px', textDecoration: 'none' }}>
                New Post
              </Link>
              <span style={{ color: '#333', fontWeight: '500' }}>
                Hello, {userInfo.username}
              </span>
              <button 
                onClick={handleLogout} 
                style={{ 
                  color: '#555', 
                  textDecoration: 'none', 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer', 
                  fontSize: '1em' 
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {/* Show "Login" and "Register" if logged out */}
              <Link to="/login" style={{ color: '#555', textDecoration: 'none' }}>Log In</Link>
              <Link to="/register" style={{ color: '#555', textDecoration: 'none' }}>Register</Link>
            </>
          )}
          
        </nav>
      </div>
    </header>
  );
};

const Footer = () => {
  return (
    <footer style={{ background: '#333', color: '#aaa', marginTop: '50px', padding: '30px 0', textAlign: 'center' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <p>© {new Date().getFullYear()} MERN Stack Blog. All rights reserved.</p>
      </div>
    </footer>
  );
};

// --- MAIN APP COMPONENT ---

const App = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f9f9f9' }}>
        <Header />
        <main style={{ flexGrow: 1, width: '100%', maxWidth: '1200px', margin: '20px auto', padding: '0 20px' }}>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/post/:id" element={<PostDetailPage />} />
                <Route path="/create" element={<CreatePost />} /> 
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="*" element={<div style={{ textAlign: 'center', marginTop: '50px', fontSize: '24px' }}>404 - Page Not Found</div>} />
            </Routes>
        </main>
        <Footer />
    </div>
  );
};

export default App;