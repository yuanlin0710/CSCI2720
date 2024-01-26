// UpdateEventForm.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './UpdateEventForm.css'; // Import the CSS file for styling

const UpdateEventForm = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [eventData, setEventData] = useState({
    id: '',
    title: '',
    date: '',
    time: '',
    venueId: '',
    description: '',
    presenter: '',
    price: ''
  });

  useEffect(() => {
    // Fetch the current event data for the given eventId
    fetch(`http://localhost:3001/event/${eventId}`)
      .then(response => response.json())
      .then(data => {
        setEventData({
          id: data.eventId,
          title: data.title,
          date: data.date,
          time: data.time,
          venueId: data.venueId,
          description: data.description,
          presenter: data.presenter,
          price: data.price
        });
      })
      .catch(error => console.error('Error fetching event data:', error));
  }, [eventId]);

  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const updatedFields = Object.keys(eventData)
      .filter(key => eventData[key] !== '')
      .reduce((acc, key) => {
        acc[key] = eventData[key];
        return acc;
      }, {});

    fetch(`http://localhost:3001/event/${eventId}`, {
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
        throw new Error('Network response was not ok.');
      })
      .then(data => {
        console.log('Event updated:', data);
        window.alert("User Successfully Updated!");
        navigate('/AdminPage/eventDatabase'); // Redirect to event listing
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <form className="update-event-form" onSubmit={handleSubmit}>
      <h2>Update Event</h2>

      <div className="form-group">
        <label htmlFor="title">EventID:</label>
        <input
          type="text"
          id="title"
          name="title"
          value={eventData.id}
          onChange={handleChange}
          placeholder={eventData.id}
          readOnly
        />
      </div>

      <div className="form-group">
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          name="title"
          value={eventData.title}
          onChange={handleChange}
          placeholder={eventData.title}
        />
      </div>

      <div className="form-group">
        <label htmlFor="date">Date:</label>
        <input
          type="text"
          id="date"
          name="date"
          value={eventData.date}
          onChange={handleChange}
          placeholder={eventData.date}
        />
      </div>

      <div className="form-group">
        <label htmlFor="time">Time:</label>
        <input
          type="text"
          id="time"
          name="time"
          value={eventData.time}
          onChange={handleChange}
          placeholder={eventData.time}
        />
      </div>

      <div className="form-group">
        <label htmlFor="venueId">Venue ID:</label>
        <input
          type="text"
          id="venueId"
          name="venueId"
          value={eventData.venueId}
          onChange={handleChange}
          placeholder={eventData.venueId}
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          name="description"
          value={eventData.description}
          onChange={handleChange}
          placeholder={eventData.description}
        />
      </div>

      <div className="form-group">
        <label htmlFor="presenter">Presenter:</label>
        <input
          type="text"
          id="presenter"
          name="presenter"
          value={eventData.presenter}
          onChange={handleChange}
          placeholder={eventData.presenter}
        />
      </div>

      <div className="form-group">
        <label htmlFor="price">Price:</label>
        <input
          type="text"
          id="price"
          name="price"
          value={eventData.price}
          onChange={handleChange}
        />
      </div>

      <button type="submit">Update Event</button>
    </form>
  );
};

export default UpdateEventForm;