import React, { useState, useEffect } from 'react';
import api from '../api.js';

export default function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  // 1. Fetch all existing categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get('/categories');
      if (response.data.success) {
        setCategories(response.data.data);
      } else {
        setError('Failed to fetch categories.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Error fetching categories.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Run the fetch on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // 3. Handle the form submission for a new category
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    if (!newCategoryName) {
      setSubmitError('Category name cannot be empty.');
      return;
    }

    try {
      const response = await api.post('/categories', { name: newCategoryName });
      if (response.status === 201) {
        alert('Category created!');
        setNewCategoryName(''); // Clear the input
        fetchCategories(); // Refresh the list
      } else {
        setSubmitError(response.data.error || 'Failed to create category.');
      }
    } catch (err) {
      setSubmitError(err.response?.data?.error || 'An error occurred.');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '30px', border: '1px solid #3b9eff', background: 'rgba(10, 25, 47, 0.9)', borderRadius: '8px', boxShadow: '0 0 15px rgba(59, 158, 255, 0.5)' }}>
      <h2 style={{ fontSize: '24px', textAlign: 'center', marginBottom: '20px', color: '#f7c800' }}>
        Manage Categories
      </h2>

      {/* Form to add a new category */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="New category name"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          style={{ flexGrow: 1, padding: '10px', border: '1px solid #3b9eff', background: '#1e3a5f', color: '#e6f1ff', borderRadius: '5px' }}
        />
        <button type="submit" style={{ padding: '10px 15px', backgroundColor: '#3b9eff', color: '#0a192f', border: 'none', cursor: 'pointer', borderRadius: '5px', fontWeight: 'bold' }}>
          Add
        </button>
      </form>
      {submitError && <p style={{ color: '#d63333', fontSize: '14px', background: 'rgba(214, 51, 51, 0.2)', padding: '8px', borderRadius: '4px' }}>{submitError}</p>}

      <hr style={{ margin: '30px 0', border: 'none', borderTop: '1px solid #1e3a5f' }} />

      {/* List of existing categories */}
      <h3 style={{ fontSize: '18px', marginBottom: '15px', color: '#e6f1ff' }}>Existing Categories</h3>
      {loading ? (
        <p style={{ color: '#e6f1ff' }}>Loading...</p>
      ) : error ? (
        <p style={{ color: '#d63333' }}>{error}</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {categories.map((cat) => (
            <li key={cat._id} style={{ padding: '10px', borderBottom: '1px solid #1e3a5f', color: '#e6f1ff' }}>
              {cat.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}