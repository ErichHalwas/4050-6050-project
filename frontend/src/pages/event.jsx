import React, { useState, useEffect } from "react";
import styles from "../styles/mainEvent.module.css";
import { useParams } from "react-router-dom";

// Mock fetch function to simulate getting event data
function fetchEventById(id) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                title: "Sunset Yoga & Sound Bath in the Garden",
                description: `Rejuvenate your body and mind with a peaceful outdoor yoga session followed by a meditative sound bath.
Surrounded by lush greenery and the golden glow of sunset, you'll flow through a gentle sequence designed for all levels.

Afterward, unwind on your mat as healing frequencies wash over you under the open sky.

Mats, refreshments, and cozy blankets provided.
Come as you are — barefoot and stress-free.`,
                headerImage: "/imagesrc",
                creator: {
                    displayName: "Jane Doe",
                    username: "@janedow",
                },
                details: {
                    Attendees: "30 attendees",
                    Date: "April 21, 2025",
                    Time: "6:45pm - 8:00pm",
                    Venue: "Sunset Garden Studio",
                    Location: "1024 Willow Ln, Savannah, GA",
                    RSVP: "Required",
                    Sounds: "Crystal Bowls, Chimes, Wind Harp",
                },
            });
        }, 500);
    });
}

export default function EventCard() {
    const { id } = useParams();
    const [eventData, setEventData] = useState(null);

    useEffect(() => {
        fetchEventById(id).then(setEventData);
    }, [id]);

    if (!eventData) return <div className={styles.wrapper}>Loading...</div>;

    return (
        <div className={styles.wrapper}>
            {header(eventData.headerImage)}
            {creator(eventData.creator)}
            {mainContent(eventData.title, eventData.description)}
            {details(eventData.details)}
        </div>
    );
}

function header(headerImage) {
    return (
        <div className={styles.header}>
            <div className={styles.buttons}>
                <button>Save</button>
                <button>Attend</button>
            </div>
            <img
                src={headerImage}
                alt="Event Header"
                className={styles.image}
            />
        </div>
    );
}

function creator({ displayName, username }) {
    return (
        <div className={styles.creator}>
            <div className={styles.profilePic}></div>
            <div>
                <p className={styles.displayName}>{displayName}</p>
                <p className={styles.username}>{username}</p>
            </div>
        </div>
    );
}

function mainContent(title, description) {
    return (
        <div className={styles.body}>
            <h2>{title}</h2>
            <p>{description}</p>
        </div>
    );
}

function details(detailsObj) {
    return (
        <div className={styles.details}>
            {Object.entries(detailsObj).map(([label, value], index) => (
                <p key={index}>
                    <span className={styles.label}>{label}</span>
                    <span>{value}</span>
                </p>
            ))}
        </div>
    );
}
