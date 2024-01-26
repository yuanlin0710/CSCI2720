import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";
import SpeechContent from './accessibility.jsx';


const Favorites = ({ favoriteLocations, setFavoriteLocations }) => {
        const { auth } = useAuth();
        const user = auth.username;
    useEffect(() => {
        const fetchFav = async () => {
            try {
                // Fetch venues and events in parallel
                const [favResponse] = await Promise.all([
                    fetch(`http://localhost:3001/fav/${user}`)
                ]);

                if (!favResponse.ok) {
                    throw new Error('HTTP error when fetching favourite locations');
                }

                const fav = await favResponse.json();
                console.log(fav);
                const newLocations = fav.map((item, index) => ({
                    id: item.venueId || index, // Use item.id if available, otherwise use index
                    name: item.venue_name || `Location ${index}`,
                }));

                // Update the locations state
                setFavoriteLocations(newLocations);

            } catch (error) {
                console.error("Failed to fetch favourite locations:", error);
            }
        };

        // Call the fetch function
        fetchFav();
    }, []);
        return (
            <div className="container mt-5">
                <h1 className="text-center mb-4">Your Favorite Locations!</h1>
                {favoriteLocations.length > 0 ? (
                    <table className="table table-hover mt-3">
                        <thead className="thead-light">
                            <tr>
                                <th style={{ textAlign: "center", verticalAlign: "middle" }}>#</th>
                                <th style={{ textAlign: "center", verticalAlign: "middle" }}>Location Name</th>
                                <th style={{ textAlign: "center", verticalAlign: "middle" }}>Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {favoriteLocations.map((location) => (
                                <tr key={location.id}>
                                    <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                                        {location.id}
                                    </td>
                                    <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                                        {location.name}
                                    </td>
                                    <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                                        <Link
                                            to={`/UserPage/locations/${location.id}`}
                                            className="btn btn-outline-info">
                                            View Details
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <h2 className="text-center mb-4">Nothing have been added here!</h2>
                )}
            <SpeechContent locs={favoriteLocations}/>
            </div>
            
        );
    }


export default Favorites;
