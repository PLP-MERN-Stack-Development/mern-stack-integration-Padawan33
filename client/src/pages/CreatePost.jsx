import React, { useState, useEffect, useContext } from 'react'; // 💡 Import useContext
import { useNavigate } from 'react-router-dom';
import api from '../api.js';
import AuthContext from '../context/AuthContext.jsx'; // 💡 Import the AuthContext

export default function CreatePost() {
  // ... (State variables remain the same) ...
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const navigate = useNavigate();

  // 💡 NEW: Get user info (which includes the token) from context
  const { userInfo } = useContext(AuthContext);

  // ... (useEffect for fetching categories remains the same) ...
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        if (response.data.success && response.data.data.length > 0) {
          setCategories(response.data.data);
          setSelectedCategory(response.data.data[0]._id);
        } else { console.error('No categories found'); }
      } catch (err) { console.error('Failed to fetch categories:', err); } 
      finally { setLoadingCategories(false); }
    };
    fetchCategories();
  }, []); 

  useEffect(() => {
    if (redirect) {
      navigate('/'); 
    }
  }, [redirect, navigate]); 

  async function createNewPost() {
    if (loadingCategories || !selectedCategory) {
      alert('Please select a category.');
      return;
    }

    // 💡 NEW: Check if user is logged in
    if (!userInfo || !userInfo.token) {
        alert('You must be logged in to create a post.');
        navigate('/login');
        return;
    }
    
    setIsSubmitting(true);

    if (!file) {
        alert('CLIENT ERROR: No file was found in the state. Please select an image file before submitting.');
        setIsSubmitting(false);
        return;
    }

    let featuredImagePath = 'default-post.jpg';

    // Create the authorization header
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${userInfo.token}` // 💡 NEW: Add the token
      }
    };

    try {
      // === STEP 1: UPLOAD IMAGE ===
      const fileData = new FormData();
      fileData.set('file', file); 
      
      // 💡 NEW: Send the auth header with the upload request
      const uploadResponse = await api.post('/upload', fileData, config);
      
      if (uploadResponse.data.success) {
        featuredImagePath = uploadResponse.data.imagePath;
      } else {
        throw new Error('File upload failed.');
      }

      // === STEP 2: SUBMIT POST AS JSON ===
      const postData = {
        title,
        content,
        category: selectedCategory,
        // 💡 REMOVED: Author is now set by the server from the token
        // author: '66a0142b4700d97034c56b02', 
        featuredImage: featuredImagePath,
      };

      // 💡 NEW: Create a new config for the JSON request
      const jsonConfig = {
         headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userInfo.token}` // 💡 NEW: Add the token
        }
      };

      // Send as plain JSON with auth header
      const postResponse = await api.post('/posts', postData, jsonConfig); 

      if (postResponse.status === 201) {
        setRedirect(true);
      } else {
        alert('Failed to create post after image upload.');
      }
    } catch (error) {
      console.error('Error creating post:', error.response?.data || error.message);
      // Check for auth error
      if (error.response?.status === 401) {
          alert('Authorization failed. Please log in again.');
          navigate('/login');
      } else {
          alert('An error occurred. Check the console.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  // ... (The return/JSX remains the same) ...
  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', border: '1px solid #ccc', background: '#fff' }}>
      <h2 style={{ fontSize: '24px', textAlign: 'center', marginBottom: '20px' }}>
        Create a New Blog Post (Auth Enabled)
      </h2>
      <form style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        {/* Title Field */}
        <div>
          <label htmlFor="title" style={{ display: 'block', marginBottom: '5px' }}>
            Post Title
          </label>
          <input id="title" type="text" placeholder="A compelling title" value={title} onChange={e => setTitle(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #ddd' }} required />
        </div>

        {/* Category Select Dropdown */}
        <div>
          <label htmlFor="category" style={{ display: 'block', marginBottom: '5px' }}>
            Category
          </label>
          <select id="category" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #ddd' }} required >
            <option value="" disabled>Select a category</option>
            {loadingCategories ? ( <option disabled>Loading...</option> ) : (
              categories.map(cat => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))
            )}
          </select>
        </div>

        {/* File/Image Upload Field */}
        <div>
          <label htmlFor="cover-image" style={{ display: 'block', marginBottom: '5px' }}>
            Cover Image
          </label>
          <input id="cover-image" type="file" onChange={e => setFile(e.target.files[0])} style={{ width: '100%', padding: '10px', border: '1px solid #ddd' }} />
          {file && <p style={{ fontSize: '12px', marginTop: '5px' }}>Selected file: {file.name}</p>}
        </div>

        {/* Content Field */}
        <div>
          <label htmlFor="content" style={{ display: 'block', marginBottom: '5px' }}>
            Post Content
          </label>
          <textarea id="content" placeholder="Write your main article..." value={content} onChange={e => setContent(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', minHeight: '200px' }} required />
        </div>

        {/* Submit Button */}
        <button 
          type="button"
          onClick={createNewPost}
          disabled={isSubmitting}
          style={{ 
            padding: '10px', 
            backgroundColor: isSubmitting ? '#999' : '#333', 
            color: 'white', 
            border: 'none', 
            cursor: isSubmitting ? 'not-allowed' : 'pointer', 
            fontSize: '16px' 
          }}
        >
          {isSubmitting ? 'Submitting...' : 'Create Post'}
        </button>
      </form>
    </div>
  );
}