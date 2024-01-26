import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import CreateEventForm from "./CreateEventForm";
import UpdateEventForm from "./UpdateEventForm";
import CreateUserForm from "./CreateUserForm";
import UpdateUserForm from "./UpdateUserForm";
import './AdminPage.css';

const AdminPage = () => (
  <>
    <Routes>
      <Route index element={<MainContent />} />
      <Route path="userDatabase" element={<UserDatabase />} />
      <Route path="eventDatabase" element={<EventDatabase />} />
      <Route path="createEvent" element={<CreateEventForm />} />
      <Route path="createUser" element={<CreateUserForm />} />
      <Route path="user/update/:userId" element={<UpdateUserForm />} />
      <Route path="event/update/:eventId" element={<UpdateEventForm />} />
      <Route path="*" element={<NoMatch />} />
    </Routes>
  </>
);

const UpdateEventButton = ({ eventId }) => {
  const navigate = useNavigate();

  const handleUpdate = () => {
    navigate(`/AdminPage/event/update/${eventId}`);
  };

  return <button className="update-btn" onClick={handleUpdate}>Update</button>;
};

const UpdateUserButton = ({ userId }) => {
  const navigate = useNavigate();

  const handleUpdate = () => {
    navigate(`/AdminPage/user/update/${userId}`);
  };

  return <button className="update-btn" onClick={handleUpdate}>Update</button>;
};

const MainContent = () => {

  return (
    <main className="container">
      <h1>Hi, admin!</h1>
      <h2>Click Event Database and User Datebase above to check and modify!</h2>
    </main>
  );
};

const UserDatabase = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3001/user")
      .then((response) => response.json())
      .then((data) => {
        setUserData(data);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, []);

  const handleDelete = (userId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (confirmDelete) {
      fetch(`http://localhost:3001/user/${userId}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (!response.ok) throw new Error("Network response was not ok.");
          setUserData((prevData) =>
            prevData.filter((user) => user._id !== userId)
          );
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  return (
    <main className="container">
      <h1>User Database</h1>
      <button className="create-btn" onClick={() => navigate("/AdminPage/createUser")}>
        Create New User
      </button>
      <div className="line"></div>
      {userData && (
        <ul>
{userData.map((user) => (
  <li key={user._id}> {/* Make sure this is the correct identifier for your user */}
    <strong>Username:</strong> {user.name}
    <br />
    <strong>Password:</strong> {user.password}
    <br />
    <UpdateUserButton userId={user._id} /> {/* This should pass the correct user ID */}
    <button onClick={() => handleDelete(user._id)}>Delete</button>
  </li>
))}
        </ul>
      )}
    </main>
  );
};

const EventDatabase = () => {
  const [eventData, setEventData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3001/event")
      .then((response) => response.json())
      .then((data) => {
        setEventData(data);
      })
      .catch((error) => {
        console.error("Error fetching event data:", error);
      });
  }, []);

  const handleDelete = (eventId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this event?");
    if (confirmDelete) {
      fetch(`http://localhost:3001/event/${eventId}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (!response.ok) throw new Error("Network response was not ok.");
          // Remove the event from the state to update the UI
          setEventData((prevData) =>
            prevData.filter((event) => event.eventId !== eventId)
          );
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  return (
    <main className="container">
      <h1>Event Database</h1>

      <button className="create-btn" onClick={() => navigate("/AdminPage/createEvent")}>
        Create New Event
      </button>
      <div className="line"></div>
      {eventData && (
        <ul>
          {eventData.map((event) => (
            <li key={event.eventId}>
              <strong>Event ID:</strong> {event.eventId}
              <br />
              <strong>Title:</strong> {event.title}
              <br />
              <strong>Description:</strong> {event.description}
              <br />
              <strong>Date:</strong> {event.date}
              <br />
              <strong>Time:</strong> {event.time}
              <br />
              <strong>Price:</strong> {event.price}
              <br />
              <strong>Presenter:</strong> {event.presenter}
              <br />
              <strong>Venue ID:</strong> {event.venueId}
              <br />
              <UpdateEventButton eventId={event.eventId} />
              <button onClick={() => handleDelete(event.eventId)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
};

const NoMatch = () => {
  const location = useLocation();
  return (
    <div>
      <h3>
        No Match for <code>{location.pathname}</code>
      </h3>
    </div>
  );
};

export default AdminPage;