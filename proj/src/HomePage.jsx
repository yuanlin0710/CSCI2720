import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import "bootstrap/dist/css/bootstrap.min.css";

const AdminPage = () => (
    <> 
      <Routes>
        <Route path="*" element={<NoMatch />} />
      </Routes>
    </>
  );
  
  function NoMatch() {
    let location = useLocation();
    return (
      <div>
        <h2>404 Error Found</h2>
        <h3>
          {" "}
          No Match for <code>{location.pathname}</code>
        </h3>
      </div>
    );
  }

export default AdminPage;