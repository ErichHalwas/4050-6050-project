import { useState, useEffect, useRef } from "react";
import styles from "../styles/map.module.css";
import EventCard from "../components/EventCard";

function Maps() {
    const mapRef = useRef(null);
    const [filter, setFilter] = useState("upcoming");
    const [sortBy, setSortBy] = useState("date");
    const [isMapHidden, setMapHidden] = useState(false);
    const [eventsData, setEventsData] = useState();
    const [locationName, setLocationName] = useState({ city: "", state: "" });

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;

            const res = await fetch(
                `http://localhost:8000/api/eventinfo/nearby/?lat=${latitude}&lon=${longitude}`
            );
            const events = await res.json();
            setEventsData(events);

            const geoRes = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`
            );
            const geoData = await geoRes.json();
            if (geoData.status === "OK") {
                const components = geoData.results[0].address_components;
                const city = components.find((c) =>
                    c.types.includes("locality")
                )?.long_name;
                const state = components.find((c) =>
                    c.types.includes("administrative_area_level_1")
                )?.short_name;

                if (city && state) {
                    setLocationName({ city, state });
                }
            }
        });
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
                                    Searching near{" "}
                                    <b>
                                        {locationName.city},{" "}
                                        {locationName.state}
                                    </b>
                                </p>
                                {/* <div className={styles.eventControls}>
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
                                </div> */}
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
                    {eventsData && eventsData.length > 0 ? (
                        <div className={styles.eventContainer}>
                            {eventsData.map((event, index) => (
                                <EventCard
                                    key={event.id || index}
                                    event={event}
                                />
                            ))}
                        </div>
                    ) : (
                        ""
                    )}
                </div>
                <MapComponent events={eventsData} />
            </div>
        </>
    );
}

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const MAP_ID = "6f67fbe2d6e86c96";

function MapComponent({ events = [] }) {
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

                    const pin = new google.maps.marker.PinElement({
                        background: "#2563eb", // blue
                        borderColor: "#1e3a8a", // optional darker blue border
                        glyphColor: "white",
                    });

                    new google.maps.marker.AdvancedMarkerElement({
                        map,
                        position: { lat: latitude, lng: longitude },
                        title: "You are here!",
                        content: pin.element,
                    });

                    const infoWindow = new google.maps.InfoWindow();

                    events.forEach((event) => {
                        if (!event.latitude || !event.longitude) return;

                        const marker =
                            new google.maps.marker.AdvancedMarkerElement({
                                map,
                                position: {
                                    lat: parseFloat(event.latitude),
                                    lng: parseFloat(event.longitude),
                                },
                                title: event.title,
                            });

                        marker.addListener("click", () => {
                            infoWindow.setContent(`
                                <div style="max-width: 200px;">
                                    <img 
                                        src="${event.image_url}" 
                                        alt="${event.title}"
                                        style="width: 100%; height: 100px; object-fit: cover; border-radius: 6px; margin-bottom: 0.5rem;" 
                                    />
                                    <strong>${event.title}</strong><br/>
                                    ${event.city}, ${event.state}<br/>
                                    <a href="/events/${event.id}" style="color: #2563eb; text-decoration: none;">View Event</a>
                                </div>
                            `);
                            infoWindow.open(map, marker);
                        });
                    });
                },
                (error) => console.error("Geolocation error:", error)
            );
        }
    }, [events]);

    return <div ref={mapRef} style={{ height: "100%", width: "100%" }} />;
}

export default Maps;
