import React, { useState } from 'react';
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, setAuth } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const role = await login(username, password);
      setAuth({ username, role });
      if (role === 'admin') {
        navigate('/AdminPage');
      } else if (role === 'user') {
        navigate('/UserPage/locations');
      }
    } catch (err) {
      setError(err.message);
    }
  };

    const pageStyle = {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: '0px', // Reduced padding top
    };

    const headerStyle = {
      width: '100%',
      padding: '10px 0', // Reduced vertical padding
      backgroundColor: '#ADD8E6',
      color: 'white',
      textAlign: 'center',
      fontSize: '2.5em',
      top: '0',
    };

    const formStyle = {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '20px',
      // Removed marginTop to bring form closer to the header
      backgroundColor: '#FFFFFF',
      padding: '20px', // Reduced padding
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    };


    const inputStyle = {
        width: '300px',
        padding: '15px',
        borderRadius: '5px',
        border: '1px solid #DDD',
        fontSize: '1.2em',
    };

    const buttonStyle = {
        width: '320px',
        padding: '15px',
        borderRadius: '5px',
        border: 'none',
        backgroundColor: '#ADD8E6',
        color: 'white',
        fontSize: '1.2em',
        fontWeight: 'bold',
        cursor: 'pointer',
    };

    const footerStyle = {
      width: '100%',
      padding: '5px 0', // Ensured padding is minimal
      backgroundColor: '#ADD8E6',
      color: 'white',
      textAlign: 'center',
      position: 'fixed',
      bottom: '0',
    };
  return (
    <div style={pageStyle}>
      <header style={headerStyle}>
        <h1>We are CSCI2720 Group17</h1>
        {/* <img src="/logo.png" alt="Logo" style={logoStyle} /> */}
        <h1>Welcome to Our Web Application!</h1>
      </header>
      <form onSubmit={handleSubmit} className="my-4" style={formStyle}>
        <h3 className="mb-3">Please log in to continue</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="mb-3">
          <label htmlFor="usernameInput" className="form-label" style={{ fontSize: '1.1em' }}>
            Username:
          </label>
          <input
            type="text"
            id="usernameInput"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="form-control"
            style={inputStyle}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="passwordInput" className="form-label" style={{ fontSize: '1.1em', marginLeft: '6px' }}>
            Password:
          </label>
          <input
            type="password"
            id="passwordInput"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control"
            style={inputStyle}
          />
        </div>
        <button type="submit" className="btn btn-primary" style={buttonStyle}>Log in</button>
      </form>
      
      <footer style={footerStyle}>© {new Date().getFullYear()} Our App</footer>
    </div>
  );
};

export default LoginPage;