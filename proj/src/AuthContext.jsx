// AuthContext.jsx
import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});

    const login = async (username, password) => {
    // Placeholder login logic
    // send a POST request to verify credentials
    const response = await fetch('http://localhost:3001/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    // read the response as plain text
    const text = await response.text();
      console.log(text);

        if (username === 'admin' && text !== 'User not found' && text !== 'Internal server error' ) {
      return 'admin';
        } else if (username !== 'admin' && text !== 'User not found' && text !== 'Internal server error') {
      return 'user';
    }
    throw new Error('Login failed: Incorrect username or password'); // Throw error when login fails
  };
  
  const logout = () => {
    return new Promise((resolve) => {
      setAuth({});
      resolve();
    });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);