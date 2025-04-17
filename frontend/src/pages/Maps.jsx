import { useState, useEffect, useRef } from "react";
import styles from "../styles/map.module.css";
import EventCard from "../components/EventCard";

function Maps() {
    const mapRef = useRef(null);
    const [filter, setFilter] = useState("upcoming");
    const [sortBy, setSortBy] = useState("date");
    const [isMapHidden, setMapHidden] = useState(false);

    useEffect(() => {
        // Checking for geolocation
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;

                    // Initialize the map
                    const map = new window.google.maps.Map(mapRef.current, {
                        center: { lat: latitude, lng: longitude },
                        zoom: 12,
                    });

                    // Add a marker at the user's location
                    new window.google.maps.Marker({
                        position: { lat: latitude, lng: longitude },
                        map,
                        title: "You are here!",
                    });
                },
                (error) => {
                    console.error("Error getting geolocation:", error);
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    }, []);

    return (
        <>
            <div className={styles.container}>
                <div
                    className={`${styles.eventDisplay} ${
                        isMapHidden ? styles.hideMap : ""
                    }`}
                >
                    <div>
                        <div className={styles.topContainer}>
                            <div>
                                <p>
                                    Searching near <b>City, State</b>
                                </p>
                                <div className={styles.eventControls}>
                                    <div className={styles.controlGroup}>
                                        <label htmlFor="filterSelect">
                                            Filter
                                        </label>
                                        <select id="filterSelect">
                                            <option value="upcoming">
                                                Upcoming
                                            </option>
                                            <option value="past">Past</option>
                                            <option value="all">All</option>
                                        </select>
                                    </div>

                                    <div className={styles.controlGroup}>
                                        <label htmlFor="sortSelect">
                                            Sort by
                                        </label>
                                        <select id="sortSelect">
                                            <option value="date">Date</option>
                                            <option value="name">Name</option>
                                            <option value="popularity">
                                                Popularity
                                            </option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <button
                                    onClick={() => setMapHidden(!isMapHidden)}
                                >
                                    {isMapHidden ? "Show Map" : "Hide Map"}
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className={styles.eventContainer}>
                        <EventCard />
                        <EventCard />
                        <EventCard />
                        <EventCard />
                        <EventCard />
                        <EventCard />
                        <EventCard />
                    </div>
                </div>
                <div
                    ref={mapRef}
                    style={{
                        width: "100%",
                        height: "100%",
                    }}
                ></div>
            </div>
        </>
    );
}

export default Maps;
