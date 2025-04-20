import { useState, useEffect, useRef } from "react";
import styles from "../styles/map.module.css";
import EventCard from "../components/EventCard";

function Maps() {
    const mapRef = useRef(null);
    const [filter, setFilter] = useState("upcoming");
    const [sortBy, setSortBy] = useState("date");
    const [isMapHidden, setMapHidden] = useState(false);

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
                <MapComponent />
            </div>
        </>
    );
}

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const MAP_ID = "6f67fbe2d6e86c96";

function MapComponent() {
    const mapRef = useRef(null);

    useEffect(() => {
        const scriptId = "google-maps-script";

        if (!window.google && !document.getElementById(scriptId)) {
            const script = document.createElement("script");
            script.id = scriptId;
            script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&v=beta&libraries=marker`;
            script.async = true;
            script.defer = true;

            script.onload = () => initMap();
            document.head.appendChild(script);
        } else if (window.google) {
            initMap();
        }

        function initMap() {
            if (!mapRef.current) return;

            navigator.geolocation.getCurrentPosition(
                ({ coords: { latitude, longitude } }) => {
                    const map = new window.google.maps.Map(mapRef.current, {
                        center: { lat: latitude, lng: longitude },
                        zoom: 12,
                        mapId: MAP_ID,
                    });

                    new google.maps.marker.AdvancedMarkerElement({
                        map,
                        position: { lat: latitude, lng: longitude },
                        title: "You are here!",
                    });
                },
                (error) => console.error("Geolocation error:", error)
            );
        }
    }, []);

    return <div ref={mapRef} style={{ height: "100%", width: "100%" }} />;
}

export default Maps;
