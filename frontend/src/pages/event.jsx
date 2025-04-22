import React, { useState, useEffect } from "react";
import styles from "../styles/mainEvent.module.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchWithAuth } from "../../utils/fetchWithAuth";
import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";

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

export default function EventPage() {
    const { id } = useParams();
    const [eventData, setEventData] = useState(null);
    const [creatorData, setCreatorData] = useState(null);
    const { user } = useAuth();
    const [eventForm, setEventForm] = useState({
        title: "",
        description: "",
        start_time: "",
        end_time: "",
        image: null,
        street: "",
        city: "",
        state: "",
        zipcode: "",
    });
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingEventId, setEditingEventId] = useState(null);
    const navigate = useNavigate();

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

    const handleEditEvent = (eventData) => {
        setEventForm({
            title: eventData.title,
            description: eventData.description,
            start_time: new Date(eventData.start_time)
                .toISOString()
                .slice(0, 16),
            end_time: new Date(eventData.end_time).toISOString().slice(0, 16),
            street: eventData.street,
            city: eventData.city,
            state: eventData.state,
            zipcode: eventData.zipcode,
            image: null,
        });
        setEditingEventId(eventData.id);
        setShowCreateModal(true);
    };

    const handleDeleteEvent = async (eventId) => {
        try {
            const res = await fetchWithAuth(
                `http://localhost:8000/api/eventinfo/${eventId}/`,
                { method: "DELETE" }
            );

            if (!res.ok) throw new Error("Delete failed");

            navigate(`/user/${user.username}`);
        } catch (err) {
            console.error("Error deleting event:", err);
        }
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", eventForm.title);
        formData.append("description", eventForm.description);
        formData.append("start_time", eventForm.start_time);
        formData.append("end_time", eventForm.end_time);
        formData.append("street", eventForm.street);
        formData.append("city", eventForm.city);
        formData.append("state", eventForm.state);
        formData.append("zipcode", eventForm.zipcode);

        if (eventForm.image) {
            formData.append("image_url", eventForm.image); // Match your model field
        }

        const url = `http://localhost:8000/api/eventinfo/${editingEventId}/`;

        const method = "PUT";

        try {
            const res = await fetchWithAuth(url, {
                method,
                body: formData,
            });

            if (!res.ok) {
                const errorData = await res.json();
                console.error("Validation error:", errorData);
                throw new Error("Failed to submit event");
            }

            setEditingEventId(null);
            setEventForm({
                title: "",
                description: "",
                start_time: "",
                end_time: "",
                image: null,
                street: "",
                city: "",
                state: "",
                zipcode: "",
            });
            setShowCreateModal(false);
        } catch (err) {
            console.error("Error submitting event:", err);
        }
    };

    const handleCloseModal = () => {
        setEditingEventId(null);
        setShowCreateModal(false);
        setEventForm({
            title: "",
            description: "",
            start_time: "",
            end_time: "",
            image: null,
            street: "",
            city: "",
            state: "",
            zipcode: "",
        });
    };

    return (
        <div className={styles.wrapper}>
            <Header user={user} event={eventData} />
            <Creator
                username={creatorData.username}
                email={creatorData.email}
                pfp={creatorData.pfp_url}
                event={eventData}
                onEdit={handleEditEvent}
                onDelete={handleDeleteEvent}
            />
            {showCreateModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h2>
                            {editingEventId ? "Edit Event" : "Create New Event"}
                        </h2>
                        <form onSubmit={handleCreateEvent}>
                            <input
                                type="text"
                                placeholder="Title"
                                value={eventForm.title}
                                onChange={(e) =>
                                    setEventForm({
                                        ...eventForm,
                                        title: e.target.value,
                                    })
                                }
                                required
                            />
                            <textarea
                                placeholder="Description"
                                value={eventForm.description}
                                onChange={(e) =>
                                    setEventForm({
                                        ...eventForm,
                                        description: e.target.value,
                                    })
                                }
                                required
                            />
                            <label>Start Time:</label>
                            <input
                                type="datetime-local"
                                value={eventForm.start_time}
                                onChange={(e) =>
                                    setEventForm({
                                        ...eventForm,
                                        start_time: e.target.value,
                                    })
                                }
                                required
                            />
                            <label>End Time:</label>
                            <input
                                type="datetime-local"
                                value={eventForm.end_time}
                                onChange={(e) =>
                                    setEventForm({
                                        ...eventForm,
                                        end_time: e.target.value,
                                    })
                                }
                                required
                            />
                            <input
                                type="text"
                                placeholder="Street"
                                value={eventForm.street}
                                onChange={(e) =>
                                    setEventForm({
                                        ...eventForm,
                                        street: e.target.value,
                                    })
                                }
                                required
                            />
                            <input
                                type="text"
                                placeholder="City"
                                value={eventForm.city}
                                onChange={(e) =>
                                    setEventForm({
                                        ...eventForm,
                                        city: e.target.value,
                                    })
                                }
                                required
                            />
                            <input
                                type="text"
                                placeholder="State"
                                value={eventForm.state}
                                onChange={(e) =>
                                    setEventForm({
                                        ...eventForm,
                                        state: e.target.value,
                                    })
                                }
                                required
                            />
                            <input
                                type="text"
                                placeholder="Zip Code"
                                value={eventForm.zipcode}
                                onChange={(e) =>
                                    setEventForm({
                                        ...eventForm,
                                        zipcode: e.target.value,
                                    })
                                }
                                required
                            />

                            <label>Image (optional):</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    setEventForm({
                                        ...eventForm,
                                        image: e.target.files[0],
                                    })
                                }
                            />

                            <button type="submit">
                                {editingEventId ? "Save Changes" : "Submit"}
                            </button>
                            <button type="button" onClick={handleCloseModal}>
                                Cancel
                            </button>
                        </form>
                    </div>
                </div>
            )}
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

function Creator({ username, email, pfp, event, onEdit, onDelete }) {
    const { user } = useAuth();
    const currentUser = user?.username;
    const isOwner = currentUser === username;

    return (
        <div className={styles.creatorContainer}>
            <Link className={styles.creator} to={`/user/${username}`}>
                <div className={styles.profilePic}>
                    <img
                        src={pfp}
                        className="pfp"
                        alt={`${username}'s profile`}
                    />
                </div>
                <div>
                    <p className={styles.displayName}>{username}</p>
                    <p className={styles.username}>{email}</p>
                </div>
            </Link>

            {isOwner && (
                <div className={styles.actions}>
                    <button
                        className={styles.editButton}
                        onClick={() => onEdit?.(event)}
                    >
                        Edit
                    </button>
                    <button
                        className={styles.deleteButton}
                        onClick={() => {
                            if (
                                confirm(
                                    "Are you sure you want to delete this event?"
                                )
                            ) {
                                onDelete?.(event.id);
                            }
                        }}
                    >
                        Delete
                    </button>
                </div>
            )}
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
