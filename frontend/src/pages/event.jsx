import React, { useState, useEffect } from "react";
import styles from "../styles/mainEvent.module.css";
import { Link, useParams } from "react-router-dom";
import { fetchWithAuth } from "../../utils/fetchWithAuth";
import { useAuth } from "../../context/AuthContext";

async function fetchEventById(id) {
    const res = await fetch(`http://localhost:8000/api/eventinfo/${id}/`);
    if (!res.ok) throw new Error("Failed to fetch event");
    return await res.json();
}

async function fetchUser(username) {
    const res = await fetch(`http://localhost:8000/api/userinfo/${username}/`);
    if (!res.ok) throw new Error("Failed to fetch user");
    return await res.json();
}

export default function EventCard() {
    const { id } = useParams();
    const [eventData, setEventData] = useState(null);
    const [creatorData, setCreatorData] = useState(null);

    useEffect(() => {
        const loadEvent = async () => {
            try {
                const event = await fetchEventById(id);
                setEventData(event);

                const creator = await fetchUser(event.host);
                setCreatorData(creator);
            } catch (err) {
                console.error("Error loading event:", err);
            }
        };

        loadEvent();
    }, [id]);

    if (!eventData || !creatorData)
        return <div className={styles.wrapper}>Loading...</div>;

    const { user } = useAuth();

    return (
        <div className={styles.wrapper}>
            <Header user={user} event={eventData} />
            {creator({
                username: creatorData.username,
                email: creatorData.email,
                pfp: creatorData.pfp_url,
            })}
            {mainContent(eventData.title, eventData.description)}
            {details({
                Attendees: `${eventData.attendees.length} attending`,
                Date: eventData.start_time?.split(" ")[0] || "",
                Time:
                    eventData.start_time?.split(" ")[1] +
                    " - " +
                    eventData.end_time?.split(" ")[1],
                Location: `${eventData.street}, ${eventData.city}, ${eventData.state} ${eventData.zipcode}`,
            })}
        </div>
    );
}

function Header({ user, event }) {
    const [isSaved, setIsSaved] = useState(false);
    const [isAttending, setIsAttending] = useState(false);

    useEffect(() => {
        if (event && user) {
            setIsSaved(event.saved_by.includes(user.username));
            setIsAttending(event.attendees.includes(user.username));
        }
    }, [event, user]);

    const handleSaveToggle = async () => {
        const endpoint = isSaved ? "unsave_event" : "save_event";
        const res = await fetchWithAuth(
            `http://localhost:8000/api/eventinfo/${event.id}/${endpoint}/`,
            { method: "POST" }
        );
        if (res.ok) setIsSaved(!isSaved);
    };

    const handleAttendToggle = async () => {
        const endpoint = isAttending ? "unattend" : "attend";
        const res = await fetchWithAuth(
            `http://localhost:8000/api/eventinfo/${event.id}/${endpoint}/`,
            { method: "POST" }
        );
        if (res.ok) setIsAttending(!isAttending);
    };

    return (
        <div className={styles.header}>
            <div className={styles.buttons}>
                <button
                    onClick={handleSaveToggle}
                    className={`${styles.button} ${
                        isSaved ? styles.active : ""
                    }`}
                >
                    {isSaved ? "Unsave" : "Save"}
                </button>
                <button
                    onClick={handleAttendToggle}
                    className={`${styles.button} ${
                        isAttending ? styles.active : ""
                    }`}
                >
                    {isAttending ? "Unattend" : "Attend"}
                </button>
            </div>
            <img
                src={event.image_url}
                alt="Event Header"
                className={styles.image}
            />
        </div>
    );
}

function creator({ username, email, pfp }) {
    return (
        <Link className={styles.creator} to={`/user/${username}`}>
            <div className={styles.profilePic}>
                <img src={pfp} className="pfp"></img>
            </div>
            <div>
                <p className={styles.displayName}>{username}</p>
                <p className={styles.username}>{email}</p>
            </div>
        </Link>
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
