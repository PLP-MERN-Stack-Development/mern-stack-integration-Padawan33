import React, { useState, useContext } from 'react'; // 💡 Import useContext
import { Link, useNavigate } from 'react-router-dom';
import api from '../api.js';
import AuthContext from '../context/AuthContext.jsx'; // 💡 Import the AuthContext

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // 💡 Get the login function from the context
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      if (response.data.success) {
        // 💡 Use the context's login function
        login(response.data);
        
        // No alert needed, the header will update automatically
        navigate('/'); // Redirect to home page
      } else {
        setError(response.data.error || 'Login failed.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '450px', margin: '40px auto', padding: '20px', border: '1px solid #ccc', background: '#fff' }}>
      <h2 style={{ fontSize: '24px', textAlign: 'center', marginBottom: '20px' }}>
        Log In
      </h2>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        {error && (
          <div style={{ padding: '10px', color: 'red', background: '#ffebee', border: '1px solid red' }}>
            {error}
          </div>
        )}

        {/* Email Field */}
        <div>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd' }}
            required
          />
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd' }}
            required
          />
        </div>

        {/* Submit Button */}
        <button 
          type="submit"
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
          {isSubmitting ? 'Logging In...' : 'Log In'}
        </button>

        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <span style={{ color: '#555' }}>Don't have an account? </span>
          <Link to="/register" style={{ color: '#337ab7', textDecoration: 'none' }}>
            Register
          </Link>
        </div>
      </form>
    </div>
  );
}