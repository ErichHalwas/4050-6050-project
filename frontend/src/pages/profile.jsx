import React, { useState, useEffect } from "react";
import styles from "../styles/profilePage.module.css";
import EventCard from "../components/EventCard";

function User({ displayName, username }) {
    return (
        <div className={styles.user}>
            <div className={styles.pfp}></div>
            <div>
                <p className={styles.displayName}>{displayName}</p>
                <p className={styles.username}>{username}</p>
            </div>
        </div>
    );
}

// Mock fetch function
function fetchProfileEvents() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                created: Array(4).fill(null),
                saved: Array(2).fill(null),
                attending: Array(5).fill(null),
            });
        }, 500); // Simulate network delay
    });
}

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState("created");
    const [events, setEvents] = useState({
        created: [],
        saved: [],
        attending: [],
    });

    const tabs = ["created", "saved", "attending"];

    useEffect(() => {
        fetchProfileEvents().then(setEvents);
    }, []);

    return (
        <div className={styles.wrapper}>
            <User displayName="Jane Doe" username="@janedoe" />

            <div className={styles.tabs}>
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        className={`${styles.tab} ${
                            activeTab === tab ? styles.active : ""
                        }`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            <div className={styles.eventContainer}>
                {events[activeTab].map((_, i) => (
                    <EventCard key={`${activeTab}-${i}`} />
                ))}
            </div>
        </div>
    );
}
