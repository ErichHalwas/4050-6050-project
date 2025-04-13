import { useEffect, useRef } from "react";

function Maps() {
    const mapRef = useRef(null);

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
        <div
            ref={mapRef}
            style={{
                width: "100%",
                height: "100vh",
            }}
        ></div>
    );
}

export default Maps;