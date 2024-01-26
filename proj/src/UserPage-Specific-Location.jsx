import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Link,useParams } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import SpeechContent from './accessibility.jsx';
import { useAuth } from "./AuthContext";

const icon = L.icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});



class LocationDetailsWrapper extends React.Component {
  constructor(props) {
    super(props);
    const { id, userName } = props;
    this.state = {
      id:  id, // This should be dynamic, for example, from props or router
      locations: null,
      events: null,
      comments: null,
      loading: true,
      error: null,
      priceFilter: '',
      newComment: '',
      userName: userName
    };
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentDidMount() {
    // const { id } = useParams();
    this.fetchVenueAndEvents();
  }


  handlePriceFilterChange = (event) => {
    this.setState({ priceFilter: event.target.value });
  };

  fetchVenueAndEvents() {
    Promise.all([
      fetch('http://localhost:3001/venue'),
      fetch('http://localhost:3001/event'),
      fetch('http://localhost:3001/comment'),
    ])
    .then(responses => {
      if (!responses.every(response => response.ok)) {
        throw new Error('HTTP error when fetching data');
      }
      return Promise.all(responses.map(response => response.json()));
    })
    .then(([venues, events, comments]) => {
      // Process and set the state for locations, events, and comments here
      const venuesMap= venues.map((item, index) => ({
        venueId: item.venueId || index, // Use item.id if available, otherwise use index
        name: item.venue_name || `Location ${index}`,
        lat: item.latitude ,
        lng: item.longitude 
      }));

      // Combine the venues with their eventsCount
      const eventsMap= events.map((item, index) => ({
        eventId: item.eventId || `EVT${index}`, // Use a default eventId prefix if not available
        title: item.title,
        date: item.date,
        time: item.time,
        venueId: item.venueId,
        description: item.description,
        presenter: item.presenter,
        price: item.price || "N/A", // Default to "N/A" if no price is provided
      }));

      const commentsMap = comments.map((item, index) => ({
        venueId: item.venueId,
        username: item.username,
        comment: item.comment
      }));

      this.setState({
        locations: venuesMap,
        events: eventsMap,
        comments: commentsMap,
        loading: false,
      });
    })
    .catch(error => {
      this.setState({
        error: error.message,
        loading: false,
      });
    });
  }


  handleInputChange(event) {
    
    this.setState({ newComment: event.target.value });
  }



  handleSubmit = async (event) => {
    event.preventDefault();

    const newcommentdata = {
      venueId: this.state.id,
      username: this.state.userName,
      comment: this.state.newComment
    };
    console.log(newcommentdata);

    try {
      const response = await fetch('http://localhost:3001/comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newcommentdata),
      });      
      if (response.ok) {
        const data = await response.json();
        // Update the comments in state with the new comment
        this.setState(prevState => ({
          comments: [...prevState.comments, data]
        }));
        console.log(data);
      } else {
        // Handle HTTP errors
        throw new Error('Failed to post comment');
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      // Update the state with the error
      this.setState({ error: error.message });
    }
  };

  renderComment = (comment, index) => (
    <div key={index} className="mb-3">
      <div className="d-flex align-items-center" style={{ backgroundColor: '#f5f5f5', borderRadius: '8px', padding: '10px' }}>
        <img src={'https://cdn2.thecatapi.com/images/341.gif'}
        alt={comment.username} className="rounded-circle me-2" style={{ width: '50px', height: '50px' }} />
        <div style={{ marginLeft: '10px' }}>
          <h5 className="mb-1">{comment.username}</h5>
          <p className="mb-0">{comment.comment}</p>
        </div>
      </div>
    </div>
  );
  /*
  renderComment(comment) {
    return (
    <div key={comment.venueId} className="mb-3">
        <h5>{comment.username}</h5>
        <p>{comment.comment}</p>
      </div>
    );
  } 
  */

  render() {
    const { locations, events, comments, id, loading, error, priceFilter } = this.state;
    if (loading) {return <div>Loading...</div>;}
    if (error) {return <div>Error: {error}</div>;}
  
      // Assuming the rest of the JSX is similar to your functional component
      const location = locations && locations.find((loc) => loc.venueId === id);
      const event = events.filter((ev) => ev.venueId === id);
      const comment = comments && comments.filter((co) => co.venueId === id);

      const filteredEvents = priceFilter
      ? event.filter(event => event.price && parseFloat(event.price) <= parseFloat(priceFilter))
      : event;

  
      return (
        <div className="container mt-5">
          <h2 className="text-center mb-4">Location Details</h2>
          <div className="card mb-4 shadow">
            <div className="card-body">
              <h5 className="card-title">{location.name}</h5>
              <br></br>
              <p className="card-text">ID: {location.venueId}</p>
            </div>
          </div>
          <SpeechContent locs={location} coms={comment} eves={filteredEvents}/>
          <MapContainer
            center={[location.lat, location.lng]}
            zoom={13}
            style={{ height: "400px", width: "100%" }}
            className="mb-4 shadow rounded"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker
              key={id}
              position={[location.lat, location.lng]}
              icon={icon}
            >
              <Popup>
                <h3>{location.name}</h3> {id}
                <p>ID: {id}</p>
                <p>Events Count: {location.eventsCount}</p>
              </Popup>
            </Marker>
              </MapContainer>
              <h3>Events of this Location</h3>
              <div className="container">
              <input
                  type="number" // Using type="number" to ensure only numbers are entered
                  className="form-control"
                  placeholder="Filter by max price"
                  value={this.state.priceFilter}
                  onChange={this.handlePriceFilterChange} // Use the class method to handle the change
                  />
                  <table className="table table-hover mt-3">
                      <thead className="thead-light">
                          <tr>
                              {/* <th style={{ textAlign: "center", verticalAlign: "middle" }}>#</th> */}
                              <th style={{ textAlign: "center", verticalAlign: "middle" }}>Event Title</th>
                              <th style={{ textAlign: "center", verticalAlign: "middle" }}>Date</th>
                              <th style={{ textAlign: "center", verticalAlign: "middle" }}>Price</th>
                          </tr>
                      </thead>
                      <tbody>
                          {filteredEvents.map((event) => (
                              <tr key={event.id}>
                                  {/* <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                                      {event.id}
                                  </td> */}
                                  <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                                      {event.title}
                                  </td>
                                  <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                                      {event.date}
                                  </td>
                                  <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                                      ${event.price}
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
        <div className="container mt-5">
          <h2>Comments</h2>
          {comment.map(this.renderComment)}
        </div>
        <form onSubmit={this.handleSubmit} className="mb-4">
          <div className="card">
            <div className="card-body">
              <div className="mb-3">
                <label htmlFor="commenthere" className="form-label">Comment:</label>
                <textarea
                  className="form-control"
                  id="commenthere"
                  rows="3"
                  required
                  value={this.state.newComment}
                  onChange={this.handleInputChange}
                ></textarea>
              </div>
              <div className="d-grid gap-2">
                <button type="submit" className="btn btn-primary">
                  Post Comment
                </button>
              </div>
            </div>
          </div>
        </form>
          <Link
                to="/UserPage/locations"
                className="btn btn-outline-dark btn-block mt-3"
                role="button"
                aria-label="Close location details"
                >
                Close
            </Link>
        </div>
      );


    }
  }


const LocationDetails = () => {
  const { id } = useParams();
  const { auth } = useAuth();
  const userName = auth.username;
  return <LocationDetailsWrapper id={id} userName={userName}/>;
};

export default LocationDetails;