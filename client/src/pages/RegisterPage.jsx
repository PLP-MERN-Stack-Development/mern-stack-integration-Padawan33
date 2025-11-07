import React, { useState, useContext } from 'react'; // 💡 Import useContext
import { Link, useNavigate } from 'react-router-dom';
import api from '../api.js';
import AuthContext from '../context/AuthContext.jsx'; // 💡 Import the AuthContext

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // 💡 Get the login function from the context
  const { login } = useContext(AuthContext);

  const handleRegister = async (e) => {
    e.preventDefault(); 
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await api.post('/auth/register', {
        username,
        email,
        password,
      });

      if (response.data.success) {
        // 💡 Use the context's login function to log the user in immediately
        login(response.data);
        
        // alert('Registration successful!'); // No alert needed
        navigate('/'); // Redirect to home page
      } else {
        setError(response.data.error || 'Registration failed.');
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
        Register New Account
      </h2>
      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        {error && (
          <div style={{ padding: '10px', color: 'red', background: '#ffebee', border: '1px solid red' }}>
            {error}
          </div>
        )}

        {/* Username Field */}
        <div>
          <label htmlFor="username" style={{ display: 'block', marginBottom: '5px' }}>
            Username
          </label>
          <input
            id="username"
            type="text"
            placeholder="Choose a username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd' }}
            required
          />
        </div>

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
            placeholder="Min. 6 characters"
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
          {isSubmitting ? 'Registering...' : 'Register'}
        </button>

        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <span style={{ color: '#555' }}>Already have an account? </span>
          <Link to="/login" style={{ color: '#337ab7', textDecoration: 'none' }}>
            Log In
          </Link>
        </div>
      </form>
    </div>
  );
}