import React from 'react';
import './CreateEventForm.css'; // Import the CSS file for styling

class CreateUserForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        name: '',
        password: ''
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    fetch('http://localhost:3001/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state)
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        window.alert("Username already been used!");
        throw new Error('Network response was not ok.');
      })
      .then(data => {
        console.log('User created:', data);
        // Reset the form or handle the UI changes accordingly
        this.setState({
            name: '',
            password: '',
            successMessage: 'User successfully created!'
        });
        // Possibly redirect the admin to the user list or give a success message
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit} className="form-container">
        <h2>Create a New User
        </h2>
        <label className="form-label">
          Name:
          <input
            type="text"
            name="name"
            value={this.state.name}
            onChange={this.handleChange}
            required
            className="form-input"
          />
        </label>
        <label className="form-label">
          Password:
          <input
            type="text"
            name="password"
            value={this.state.password}
            onChange={this.handleChange}
            required
            className="form-input"
          />
        </label>
        <button type="submit" className="form-button">Create User!</button>
        {this.state.successMessage && <p>{this.state.successMessage}</p>}
      </form>
    );
  }
}

export default CreateUserForm;