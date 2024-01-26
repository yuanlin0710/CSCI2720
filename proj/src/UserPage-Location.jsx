import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup,useMap } from "react-leaflet";
import L from "leaflet";
import { Link } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import "bootstrap/dist/css/bootstrap.min.css";
import SpeechContent from './accessibility.jsx';
import { useAuth } from './AuthContext'; 



const icon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});


const Locations = ({ favoriteLocations, setFavoriteLocations }) => {
    const [locations, setLocations] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [latestUpdateTime, setLatestUpdateTime] = useState(null);

    const { auth } = useAuth();
    const user = auth.username;
    useEffect(() => {
        const fetchVenueAndEvents = async () => {
            try {
                // Fetch venues and events in parallel
                const [venueResponse, eventsResponse, favResponse] = await Promise.all([
                    fetch('http://localhost:3001/venue'),
                    fetch('http://localhost:3001/event'),
                    fetch(`http://localhost:3001/fav/${user}`)
                ]);

                if (!venueResponse.ok || !eventsResponse.ok || !favResponse.ok) {
                    throw new Error('HTTP error when fetching venues or events');
                }

                const venues = await venueResponse.json();
                const events = await eventsResponse.json();
                const fav = await favResponse.json();
                // Create a map of venueId to eventsCount
                const eventsCountMap = events.reduce((acc, event) => {
                    acc[event.venueId] = (acc[event.venueId] || 0) + 1;
                    return acc;
                }, {});
                console.log(eventsCountMap);

                // Combine the venues with their eventsCount
                const newLocations = venues.map((item, index) => ({
                    id: item.venueId || index, // Use item.id if available, otherwise use index
                    name: item.venue_name || `Location ${index}`,
                    lat: item.latitude || Math.random() * 100 - 50,
                    lng: item.longitude || Math.random() * 360 - 180,
                    price: item.price || Math.floor(Math.random() * 500),
                    eventsCount: eventsCountMap[item.venueId] || 0, // Default to 0 if no events are found for the venue
                }));
                const newFav = fav.map((item, index) => ({
                    id: item.venueId || index, // Use item.id if available, otherwise use index
                    name: item.venue_name || `Location ${index}`,
                }));

                setFavoriteLocations(newFav);
                // Update the locations state
                setLocations(newLocations);
                const currentTime = new Date().toLocaleString();
                setLatestUpdateTime(currentTime);
                
            } catch (error) {
                console.error("Failed to fetch venues or events:", error);
            }
        };

        // Call the fetch function
        fetchVenueAndEvents();
    }, [setFavoriteLocations, user]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter locations based on the search term in the location name
  const filteredLocations = locations.filter((location) =>
  location.name.toLowerCase().includes(searchTerm.toLowerCase())
);

  const handleSort = () => {
    const sortedLocations = [...locations].sort((a, b) => {
      const diff = a.eventsCount - b.eventsCount;
      if (sortOrder === 'asc') {
        return diff;
      }
      return -diff;
    });
    setLocations(sortedLocations);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); // Toggle the sort order
  };

  const addLocationToFavorites = (locationId) => {
    const location = locations.find((loc) => loc.id === locationId);
    if (location) {
        const isFavorite = favoriteLocations.some((loc) => loc.id === locationId);
        if (isFavorite) {
            setFavoriteLocations((prevFavorites) =>
                prevFavorites.filter((loc) => loc.id !== locationId)
            );
            fetch(`http://localhost:3001/favupdate/${user}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ locid: locationId })
            })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    }
                    throw new Error('Network response was not ok.');
                })
                .then(data => {
                    console.log('Favorite locations updated:', data);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
            
        } else {
            setFavoriteLocations((prevFavorites) => [...prevFavorites, location]);
            fetch(`http://localhost:3001/favupdate/${user}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ locid: locationId })
            })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    }
                    throw new Error('Network response was not ok.');
                })
                .then(data => {
                    console.log('Favorite locations updated:', data);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        };
        
    }
};
  const RecenterAutomatically = ({lat,lng}) => {
    const map = useMap();
    useEffect(() => {
      map.setView([lat, lng]);
    }, [lat, lng, map]);
    return null;
  }


return (
  <div className="container mt-5">
    <h2 className="text-center mb-4">Locations</h2>
    <p className="text-center">
  Latest Update: {latestUpdateTime}
    </p>      
    <input
      type="text"
      className="form-control mb-2"
      placeholder="Search locations by name..."
      value={searchTerm}
      onChange={handleSearchChange}
    />
    <table className="table table-hover mt-3">
      <thead className="thead-light">
        <tr>
          <th style={{ textAlign: "center", verticalAlign: "middle" }}>#</th>
          <th style={{ textAlign: "center", verticalAlign: "middle" }}>Location Name</th>
          <th style={{ textAlign: "center", verticalAlign: "middle" }}>
            <button onClick={handleSort} className="btn btn-light">
              Events Count {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </th>
          <th style={{ textAlign: "center", verticalAlign: "middle" }}>Details</th>
          <th style={{ textAlign: "center", verticalAlign: "middle" }}>Add to Favorites</th>
        </tr>
      </thead>
      <tbody>
  {filteredLocations.map((location) => (
    <tr key={location.id}>
      <td style={{ textAlign: "center", verticalAlign: "middle" }}>
        {location.id}
      </td>
      <td style={{ textAlign: "center", verticalAlign: "middle" }}>
        {location.name}
      </td>
      <td style={{ textAlign: "center", verticalAlign: "middle" }}>
        {location.eventsCount}
      </td>
      <td style={{ textAlign: "center", verticalAlign: "middle" }}>
        <Link
          to={`/UserPage/locations/${location.id}`}
          className="btn btn-outline-info">
          View Details
        </Link>
      </td>
      <td style={{ textAlign: "center", verticalAlign: "middle" }}
          onClick={() => addLocationToFavorites(location.id)}>
        {favoriteLocations.find((loc) => loc.id === location.id) ? (
          <span role="img" aria-label="Added to Favorites" style={{ color: '#FFD700' }}>
            &#9733; {/* Filled star */}
          </span>
        ) : (
          <span role="img" aria-label="Add to Favorites">
            &#9734; {/* Empty star */}
          </span>
        )}
      </td>
    </tr>
  ))}
</tbody>
      </table>
        <MapContainer
          center={[0, 0]}
          zoom={10}
          style={{ height: "500px", width: "100%" }}
          className="shadow rounded mb-4"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
            {filteredLocations.map((location) => (
            <Marker
              key={location.id}
              position={[location.lat, location.lng]}
              icon={icon}
            >
              <Popup>{location.name}</Popup>
            </Marker>
          ))}
          {locations.map((location) => (<RecenterAutomatically lat={location.lat} lng={location.lng} />))}
          
        </MapContainer>
        <SpeechContent locs={filteredLocations}/>
      </div>
    );
  };

  export default Locations;
