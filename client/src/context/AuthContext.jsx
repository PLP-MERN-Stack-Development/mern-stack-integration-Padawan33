import React, { createContext, useState, useEffect } from 'react';

// 1. Create the Context
const AuthContext = createContext();

// 2. Create the Provider (a component that will wrap your app)
export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);

  // 3. Check localStorage when the app first loads
  useEffect(() => {
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      setUserInfo(JSON.parse(storedUser));
    }
  }, []);

  // 4. Login function
  const login = (userData) => {
    localStorage.setItem('userInfo', JSON.stringify(userData));
    setUserInfo(userData);
  };

  // 5. Logout function
  const logout = () => {
    localStorage.removeItem('userInfo');
    setUserInfo(null);
  };

  return (
    <AuthContext.Provider value={{ userInfo, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 6. Export the context to be used by other components
export default AuthContext;