import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './UpdateEventForm.css'; // Import the CSS file for styling

const UpdateUser = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: '',
    password: ''
  });

  useEffect(() => {
    // Fetch the existing user data for the given userId
    fetch(`http://localhost:3001/user/${userId}`)
      .then(response => response.json())
      .then(data => {
          setUserData({
              name: data.name,
              password: data.password,
          });
      })
          .catch(error => console.error('Error fetching user data:', error));
  }, [userId]);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const updatedFields = { ...userData };
    if (updatedFields.password === '') {
      delete updatedFields.password;
    }

    fetch(`http://localhost:3001/user/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedFields)
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        window.alert("Username already been used!");
        throw new Error('Network response was not ok.');
      })
      .then(data => {
        console.log('User updated:', data);
        window.alert("User Successfully Updated!");
        navigate('/AdminPage/userDatabase'); // Redirect to user listing
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <form className="update-event-form" onSubmit={handleSubmit}>
      <h2>Update User</h2>

      <div className="form-group">
        <label htmlFor="name">Name:</label>
        <div className="form-field-container">
          <input
            type="text"
            id="name"
            name="name"
            value={userData.name}
            onChange={handleChange}
            placeholder="Enter new username"
            className="form-field" // Apply the form-field class
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="password">Password:</label>
        <div className="form-field-container">
          <input
            type="text"
            id="password"
            name="password"
            value={userData.password}
            onChange={handleChange}
            placeholder="Enter new password"
            className="form-field" // Apply the form-field class
          />
        </div>
      </div>

      <button type="submit">Update User</button>
    </form>
  );
};

export default UpdateUser;