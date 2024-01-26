import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateEventForm.css'; // Import the CSS file for styling

class CreateEventForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eventId: '',
      title: '',
      date: '',
      time: '',
      venueId: '',
      description: '',
      presenter: '',
      price: ''
    };
  }
  
  
  
  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmit = (event) => {
    // const navigate = useNavigate();
    event.preventDefault();
    fetch('http://localhost:3001/event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state)
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        // Log the response to see what is being returned
        console.error('Error Response:', response);
        // Handle different response statuses explicitly
        if(response.status === 409) { // Replace with the actual status code if different
          window.alert("Username already been used!");
        } else {
          window.alert("An error occurred. Please try again later.");
        }
        // Throw an error to break the promise chain
        throw new Error('Error in response');
      }
    })
    .then(data => {
      console.log('Event created:', data);
      window.alert("Event Successfully Created!");
      // navigate('/AdminPage/userDatabase'); // Redirect to user listing
      this.setState({
        eventId: '',
        title: '',
        date: '',
        time: '',
        venueId: '',
        description: '',
        presenter: '',
        price: ''
      });
    })
    .catch((error) => {
      // Log any error caught during the fetch or promise handling
      console.error('Catch Error:', error);
    });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit} className="form-container">
        <h2>Creat a New Event</h2>

        <label className="form-label">
          Event ID:
          <input
            type="text"
            name="eventId"
            value={this.state.eventId}
            onChange={this.handleChange}
            required
            className="form-input"
          />
        </label>
        <label className="form-label">
          Title:
          <input
            type="text"
            name="title"
            value={this.state.title}
            onChange={this.handleChange}
            required
            className="form-input"
          />
        </label>
        <label className="form-label">
          Date:
          <input
            type="text"
            name="date"
            value={this.state.date}
            onChange={this.handleChange}
            required
            className="form-input"
          />
        </label>
        <label className="form-label">
          Time:
          <input
            type="text"
            name="time"
            value={this.state.time}
            onChange={this.handleChange}
            required
            className="form-input"
          />
        </label>
        <label className="form-label">
          Venue ID:
          <input
            type="text"
            name="venueId"
            value={this.state.venueId}
            onChange={this.handleChange}
            required
            className="form-input"
          />
        </label>
        <label className="form-label">
          Description:
          <textarea
            name="description"
            value={this.state.description}
            onChange={this.handleChange}
            required
            className="form-input"
          />
        </label>
        <label className="form-label">
          Presenter:
          <input
            type="text"
            name="presenter"
            value={this.state.presenter}
            onChange={this.handleChange}
            required
            className="form-input"
          />
        </label>
        <label className="form-label">
          Price:
          <input
            type="text"
            name="price"
            value={this.state.price}
            onChange={this.handleChange}
            required
            className="form-input"
          />
        </label>
        <button type="submit" className="form-button">Create Event</button>
      </form>
    );
  }
}

export default CreateEventForm;