import React, { useState, useEffect, useContext } from 'react';
import { Routes, Route, Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'; 
import api from './api.js'; 
import CreatePost from './pages/CreatePost.jsx'; 
import RegisterPage from './pages/RegisterPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import CategoryManager from './pages/CategoryManager.jsx'; 
import AuthContext from './context/AuthContext.jsx'; 
import enterpriseSvg from './enterprise.svg'; // Example subtle ship graphic
// --- UTILITY COMPONENTS ---
const LoadingSpinner = () => (
  <div style={{ textAlign: 'center', margin: '50px', fontSize: '18px' }}>
    Loading...
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
        <div style={{ border: '1px solid #3b9eff', borderRadius: '8px', margin: '10px', padding: '15px', background: 'rgba(30, 58, 95, 0.6)', backdropFilter: 'blur(5px)' }}>
            <div style={{ height: '200px', background: '#0a192f', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #3b9eff' }}>
                {post.featuredImage && post.featuredImage !== 'default-post.jpg' ? (
                  <img src={imageUrl} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ color: '#888' }}>[No Image]</span>
                )}
            </div>
            <div style={{ padding: '15px 0 0' }}>
                <span style={{ fontSize: '12px', color: '#f7c800', background: 'rgba(59, 158, 255, 0.2)', padding: '3px 8px', borderRadius: '12px', border: '1px solid #f7c800' }}>
                    {post.category?.name || 'Uncategorized'}
                </span>
                <Link to={`/post/${post._id}`}>
                    <h3 style={{ fontSize: '20px', fontWeight: 'bold', margin: '10px 0', color: '#e6f1ff' }}>
                        {post.title}
                    </h3>
                </Link>
                <p style={{ fontSize: '14px', color: '#e6f1ff', lineHeight: '1.5' }}>
                    {post.excerpt || defaultExcerpt}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
                    <p style={{ fontSize: '12px', color: '#e6f1ff' }}>
                        By {post.author?.username || 'Unknown Author'}
                    </p>
                    <Link to={`/post/${post._id}`} style={{ fontSize: '14px', fontWeight: 'bold', color: '#f7c800' }}>
                        Read More &rarr;
                    </Link>
                </div>
            </div>
        </div>
    );
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const buttonStyle = (disabled) => ({
    padding: '8px 16px',
    border: '1px solid #ddd',
    background: disabled ? '#1e3a5f' : '#0a192f',
    color: disabled ? '#e6f1ff' : '#f7c800',
    cursor: disabled ? 'not-allowed' : 'pointer', // LCARS-style button
    borderRadius: '5px',
    fontSize: '14px',
    fontWeight: 'bold',
  });

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '30px', paddingBottom: '20px' }}>
      <button 
        onClick={handlePrev} 
        disabled={currentPage === 1}
        style={buttonStyle(currentPage === 1)}
      >
        &larr; Previous
      </button>
      <span style={{ fontSize: '14px', color: '#e6f1ff' }}>
        Page {currentPage} of {totalPages}
      </span>
      <button 
        onClick={handleNext} 
        disabled={currentPage === totalPages}
        style={buttonStyle(currentPage === totalPages)}
      >
        Next &rarr;
      </button>
    </div>
  );
};

const SearchBox = ({ onSearch }) => {
  const [keyword, setKeyword] = useState('');

  const submitHandler = (e) => {
    e.preventDefault();
    onSearch(keyword); 
  };

  return (
    <form onSubmit={submitHandler} style={{ display: 'flex', gap: '10px', flexGrow: 1 }}>
      <input
        type="text"
        name="q"
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Search transmissions..."
        style={{ flexGrow: 1, padding: '10px', border: '1px solid #3b9eff', borderRadius: '5px', background: '#1e3a5f', color: '#e6f1ff' }}
      />
      <button type="submit" style={{ padding: '10px 15px', backgroundColor: '#3b9eff', color: '#0a192f', border: 'none', cursor: 'pointer', borderRadius: '5px', fontWeight: 'bold' }}>
        Search
      </button>
    </form>
  );
};

const CategoryFilter = ({ onFilter }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/categories');
        if (data.success) {
          setCategories(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    onFilter(e.target.value); 
  };

  return (
    <select 
      onChange={handleChange} 
      style={{ padding: '10px', border: '1px solid #3b9eff', borderRadius: '5px', minWidth: '200px', background: '#1e3a5f', color: '#e6f1ff' }}
      aria-label="Filter by category"
    >
      <option value="">All Categories</option>
      {categories.map((category) => (
        <option key={category._id} value={category._id}>
          {category.name}
        </option>
      ))}
    </select>
  );
};

// 💡 --- NEW: COMMENT SECTION COMPONENT --- 💡
const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { userInfo } = useContext(AuthContext); // Get user info
  const navigate = useNavigate();

  // 1. Fetch comments for this post
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/posts/${postId}/comments`);
        if (data.success) {
          setComments(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch comments:", err);
        setError('Could not load comments.');
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [postId]); // Rerun if post ID changes

  // 2. Handle comment submission
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return; // Don't submit empty comments

    // Check if user is logged in
    if (!userInfo) {
      alert('You must be logged in to comment.');
      navigate('/login');
      return;
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userInfo.token}`
        }
      };
      
      const { data } = await api.post(
        `/posts/${postId}/comments`, 
        { content: newComment }, 
        config
      );

      if (data.success) {
        // Add new comment to the top of the list and clear the input
        setComments([data.data, ...comments]);
        setNewComment('');
      }
    } catch (err) {
      console.error("Failed to post comment:", err);
      alert('Error posting comment.');
    }
  };

  return (
    <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #3b9eff' }}>
      <h3 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '20px', color: '#f7c800' }}>Subspace Comms</h3>
      
      {/* Comment Form */}
      {userInfo ? (
        <form onSubmit={handleSubmitComment} style={{ marginBottom: '20px' }}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Log your comment..."
            style={{ width: '100%', minHeight: '80px', padding: '10px', border: '1px solid #3b9eff', borderRadius: '5px', background: '#1e3a5f', color: '#e6f1ff' }}
            required
          />
          <button type="submit" style={{ padding: '8px 15px', backgroundColor: '#f7c800', color: '#0a192f', border: 'none', cursor: 'pointer', borderRadius: '5px', marginTop: '10px', fontWeight: 'bold' }}>
            Transmit
          </button>
        </form>
      ) : (
        <p style={{ fontSize: '14px', color: '#e6f1ff', marginBottom: '20px' }}>
          Please <Link to="/login" style={{ color: '#f7c800', fontWeight: 'bold' }}>log in</Link> to transmit a comment.
        </p>
      )}

      {/* Comment List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {loading ? (
          <p>Loading comments...</p>
        ) : error ? (
          <p style={{ color: '#d63333' }}>{error}</p>
        ) : comments.length === 0 ? (
          <p style={{ color: '#e6f1ff', fontSize: '14px' }}>Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} style={{ padding: '15px', background: 'rgba(10, 25, 47, 0.8)', border: '1px solid #1e3a5f', borderRadius: '5px' }}>
              <p style={{ fontSize: '16px', color: '#e6f1ff' }}>{comment.content}</p>
              <p style={{ fontSize: '12px', color: '#e6f1ff', marginTop: '10px' }}>
                By <strong style={{ color: '#000' }}>{comment.author?.username || 'User'}</strong> on {new Date(comment.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};


// --- PAGES (Components for Routes) ---

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [searchParams, setSearchParams] = useSearchParams();
  
  const pageNumber = Number(searchParams.get('page')) || 1;
  const keyword = searchParams.get('keyword') || '';
  const category = searchParams.get('category') || '';

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        params.append('page', pageNumber.toString());
        if (keyword) params.append('keyword', keyword);
        if (category) params.append('category', category);

        const response = await api.get(`/posts?${params.toString()}`);
        
        if (response.data.success) {
          setPosts(response.data.data);
          setTotalPages(response.data.totalPages);
          setPage(response.data.page);
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
  }, [searchParams, pageNumber, keyword, category]); 

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    setSearchParams(params);
  };

  const handleSearch = (newKeyword) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1'); 
    if (newKeyword) {
      params.set('keyword', newKeyword);
    } else {
      params.delete('keyword');
    }
    setSearchParams(params);
  };
  
  const handleCategoryFilter = (newCategory) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    if (newCategory) {
      params.set('category', newCategory);
    } else {
      params.delete('category'); 
    }
    setSearchParams(params);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '20px', color: '#f7c800' }}>
        Latest Transmissions
      </h1>

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <SearchBox onSearch={handleSearch} />
        <CategoryFilter onFilter={handleCategoryFilter} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {posts.length > 0 ? (
          posts.map(post => (
            <PostCard key={post._id} post={post} />
          ))
        ) : (
          <p style={{ fontSize: '18px', color: '#e6f1ff', gridColumn: '1 / -1', textAlign: 'center' }}>
              No posts found for these criteria.
          </p>
        )}
      </div>

      {posts.length > 0 && totalPages > 1 && (
        <Pagination 
          currentPage={page} 
          totalPages={totalPages} 
          onPageChange={handlePageChange} 
        />
      )}
    </div>
  );
};

// 💡 --- UPDATED POST DETAIL PAGE --- 💡
const PostDetailPage = () => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await api.get(`/posts/${id}`);
        if (response.data.success) {
          setPost(response.data.data);
        } else {
          setError('API returned success: false');
        }
      } catch (err) {
        console.error(`[PostDetailPage] Error fetching post ${id}:`, err);
        setError("Failed to fetch post. Check the console.");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]); 

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!post) return <ErrorMessage message="Post not found." />;

  const publicationDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const imageUrl = `http://localhost:5000${post.featuredImage}`;

  return (
    <article style={{ maxWidth: '800px', margin: '40px auto', background: 'rgba(10, 25, 47, 0.9)', border: '1px solid #3b9eff', padding: '30px', borderRadius: '8px', boxShadow: '0 0 15px rgba(59, 158, 255, 0.5)' }}>
      <h1 style={{ fontSize: '40px', fontWeight: 'bold', marginBottom: '15px', color: '#f7c800' }}>
        {post.title}
      </h1>
      
      <div style={{ marginBottom: '20px', fontSize: '14px', color: '#e6f1ff' }}>
        Written by <strong style={{ color: '#f7c800' }}>{post.author?.username || 'Unknown'}</strong>
        <span style={{ margin: '0 10px' }}>|</span>
        Published on {publicationDate}
      </div>

      {post.featuredImage && post.featuredImage !== 'default-post.jpg' && (
        <img 
          src={imageUrl} 
          alt={post.title} 
          style={{ width: '100%', height: 'auto', maxHeight: '400px', objectFit: 'cover', borderRadius: '8px', marginBottom: '30px' }} 
        />
      )}
      
      <div style={{ fontSize: '18px', lineHeight: '1.7', color: '#e6f1ff' }}>
        {post.content.split('\n').map((paragraph, index) => (
          <p key={index} style={{ marginBottom: '20px' }}>
            {paragraph}
          </p>
        ))}
      </div>
      
      {/* 💡 NEW: Add the CommentSection component */}
      <CommentSection postId={post._id} />

    </article>
  );
};


// --- LAYOUT COMPONENTS ---
const Header = () => {
  const { userInfo, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/'); 
  };

  return (
    <header style={{ background: 'rgba(10, 25, 47, 0.8)', borderBottom: '1px solid #3b9eff', position: 'sticky', top: 0, zIndex: 10, backdropFilter: 'blur(10px)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px' }}>
        <Link to="/" style={{ fontSize: '24px', fontWeight: 'bold', color: '#f7c800', textDecoration: 'none', textShadow: '1px 1px 3px #000' }}>
          The Starfleet Daily
        </Link>
        <nav style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Link to="/" style={{ color: '#e6f1ff', textDecoration: 'none' }}>Home</Link>
          
          {userInfo ? (
            <>
              <Link to="/create" style={{ padding: '5px 15px', border: '1px solid #f7c800', color: '#f7c800', borderRadius: '20px', textDecoration: 'none' }}>
                New Post
              </Link>
              <Link to="/manage-categories" style={{ color: '#e6f1ff', textDecoration: 'none' }}>
                Categories
              </Link>
              <span style={{ color: '#e6f1ff', fontWeight: '500' }}>
                Hello, {userInfo.username}
              </span>
              <button 
                onClick={handleLogout} 
                style={{ 
                  color: '#e6f1ff', 
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
              <Link to="/login" style={{ color: '#e6f1ff', textDecoration: 'none' }}>Log In</Link>
              <Link to="/register" style={{ padding: '5px 15px', background: '#3b9eff', color: '#0a192f', borderRadius: '20px', textDecoration: 'none', fontWeight: 'bold' }}>Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

const Footer = () => {
  return (
    <footer style={{ background: 'rgba(10, 25, 47, 0.8)', color: '#e6f1ff', marginTop: '50px', padding: '30px 0', textAlign: 'center', borderTop: '1px solid #3b9eff' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <p>© {new Date().getFullYear()} The Starfleet Daily. All rights reserved.</p>
      </div>
    </footer>
  );
};

// --- MAIN APP COMPONENT ---
const App = () => {
  return (
    <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        backgroundImage: `url(${enterpriseSvg})`, 
        backgroundRepeat: 'no-repeat', backgroundPosition: '95% 10%', backgroundSize: '300px', backgroundAttachment: 'fixed'
      }}>
        <Header />
        <main style={{ flexGrow: 1, width: '100%', maxWidth: '1200px', margin: '20px auto', padding: '0 20px' }}>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/post/:id" element={<PostDetailPage />} />
                <Route path="/create" element={<CreatePost />} /> 
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/manage-categories" element={<CategoryManager />} />
                <Route path="*" element={<div style={{ textAlign: 'center', marginTop: '50px', fontSize: '24px' }}>404 - Page Not Found</div>} />
            </Routes>
        </main>
        <Footer />
    </div>
  );
};

export default App;