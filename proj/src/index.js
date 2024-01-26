import ReactDOM from "react-dom";
import "leaflet/dist/leaflet.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Link,
  useNavigate,
} from "react-router-dom";
import React, { useState } from "react";
import { AuthProvider, useAuth } from "./AuthContext";
import LoginPage from "./LoginPage";
import Locations from "./UserPage-Location.jsx";
import LocationDetails from "./UserPage-Specific-Location.jsx";
import Favorites from "./UserPage-Favorites.jsx";
import AdminPage from "./AdminPage.jsx";
import PrivateRoute from './PrivateRoute.jsx';

const LogoutButton = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <button className="btn btn-outline-light my-2 my-sm-0" type="button" onClick={handleLogout}>
      Log Out
    </button>
  );
};

const App = () => {
  const { auth } = useAuth();
  const user = auth.username;
  const [favoriteLocations, setFavoriteLocations] = useState([]);
  return (
    <BrowserRouter>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        {(user !== 'admin' && user) && (
          <div className="collapse navbar-collapse d-flex justify-content-between">
                      <Link className="navbar-brand" to="/UserPage/locations" style={{ marginLeft: '10px' }}>
               Home
                </Link>
                <ul className="navbar-nav">
                  <li className="nav-item">
                    <Link className="nav-link" to="/UserPage/locations">
                      Locations
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/UserPage/favorites">
                      Favorite Locations
                    </Link>
                  </li>
                </ul>
            <div className="d-flex align-items-center">
                          <span className="text-white mr-3" style={{ marginRight: '10px' }}>
                Hi! {user}!
              </span>
              <LogoutButton className="btn btn-outline-light my-2 my-sm-0" type="submit">
                <Link className="nav-link" to="/login">
                  Log Out
                </Link>
              </LogoutButton>
            </div>
          </div>
        )}
        {user === "admin" && (
          <div className="collapse navbar-collapse d-flex justify-content-between">
                      <Link className="navbar-brand" to="/AdminPage" style={{ marginLeft: '10px' }}>
               Home
                </Link>
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" to="/AdminPage/eventDatabase">
                  Event Database
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/AdminPage/userDatabase">
                  User Database
                </Link>
              </li>
            </ul>
            <div className="d-flex align-items-center">
                          <span className="text-white mr-3" style={{ marginRight: '10px' }}>
                Hi! admin!
              </span>
              <LogoutButton className="btn btn-outline-light my-2 my-sm-0" type="submit">
                <Link className="nav-link" to="/login">
                  Log Out
                </Link>
              </LogoutButton>
            </div>
          </div>
        )}
              {!user && <span className="text-white mr-3" style={{ marginLeft: '10px' }}>Please log in</span>}
      </nav>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/UserPage/locations" element={
          <PrivateRoute>
            <Locations favoriteLocations={favoriteLocations} setFavoriteLocations={setFavoriteLocations}/>
          </PrivateRoute>
        } />
        <Route path="/UserPage/locations/:id" element={
          <PrivateRoute>
            <LocationDetails />
          </PrivateRoute>
        } />
        <Route path="/UserPage/favorites" element={
          <PrivateRoute>
            <Favorites favoriteLocations={favoriteLocations} setFavoriteLocations={setFavoriteLocations}/>
          </PrivateRoute>
        } />
        <Route path="/AdminPage/*" element={
          <PrivateRoute>
            <AdminPage />
          </PrivateRoute>
        } />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
};

const root = ReactDOM.createRoot(document.querySelector("#app"));
root.render(
  <AuthProvider>
    <App />
  </AuthProvider>
);