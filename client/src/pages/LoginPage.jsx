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
    <div style={{ maxWidth: '450px', margin: '40px auto', padding: '30px', border: '1px solid #3b9eff', background: 'rgba(10, 25, 47, 0.9)', borderRadius: '8px', boxShadow: '0 0 15px rgba(59, 158, 255, 0.5)' }}>
      <h2 style={{ fontSize: '24px', textAlign: 'center', marginBottom: '20px', color: '#f7c800' }}>
        Log In
      </h2>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        {error && (
          <div style={{ padding: '10px', color: '#e6f1ff', background: 'rgba(214, 51, 51, 0.5)', border: '1px solid #d63333' }}>
            {error}
          </div>
        )}

        {/* Email Field */}
        <div>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '5px', color: '#e6f1ff' }}>
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ width: '100%', padding: '10px', border: '1px solid #3b9eff', background: '#1e3a5f', color: '#e6f1ff', borderRadius: '5px' }}
            required
          />
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '5px', color: '#e6f1ff' }}>
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ width: '100%', padding: '10px', border: '1px solid #3b9eff', background: '#1e3a5f', color: '#e6f1ff', borderRadius: '5px' }}
            required
          />
        </div>

        {/* Submit Button */}
        <button 
          type="submit"
          disabled={isSubmitting}
          style={{ 
            padding: '10px', 
            backgroundColor: isSubmitting ? '#1e3a5f' : '#3b9eff', 
            color: isSubmitting ? '#e6f1ff' : '#0a192f', 
            border: 'none', 
            cursor: isSubmitting ? 'not-allowed' : 'pointer', 
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          {isSubmitting ? 'Logging In...' : 'Log In'}
        </button>

        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <span style={{ color: '#e6f1ff' }}>Don't have an account? </span>
          <Link to="/register" style={{ color: '#f7c800', textDecoration: 'none' }}>
            Register
          </Link>
        </div>
      </form>
    </div>
  );
}