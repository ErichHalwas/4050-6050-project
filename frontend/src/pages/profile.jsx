import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "../styles/profilePage.module.css";
import EventCard from "../components/EventCard";
import { useAuth } from "../../context/AuthContext";
import { fetchWithAuth } from "../../utils/fetchWithAuth";

function User({ username }) {
    const [userData, setUserData] = useState(null);


    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(
                    `http://localhost:8000/api/userinfo/${username}/`,
                    {
                        credentials: "include",
                    }
                );
                if (!res.ok) throw new Error("Failed to fetch user");
                const data = await res.json();
                setUserData(data);
            } catch (err) {
                console.error("Error fetching user:", err);
            }
        };

        if (username) {
            fetchUser();
        }
    }, [username]);

    if (!userData) return null;
    return (
        <div className={styles.user}>
            <div className={styles.pfp}>
                <img className="pfp" src={userData.pfp_url}></img>
            </div>
            <div>
                <p className={styles.displayName}>{username}</p>
            </div>
        </div>
    );
}

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState("created");
    const [password, setPassword] = useState("");
    const [events, setEvents] = useState({
        created: [],
        saved: [],
        attending: [],
    });
    const { id } = useParams();
    const { user } = useAuth();

    const tabs = ["created", "saved", "attending", "profile"]; // This array defines the available tabs

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const [createdRes, savedRes, attendingRes] = await Promise.all([
                    fetch(`http://localhost:8000/api/userinfo/${id}/hosted/`, {
                        credentials: "include",
                    }),
                    fetch(`http://localhost:8000/api/userinfo/${id}/saved/`, {
                        credentials: "include",
                    }),
                    fetch(
                        `http://localhost:8000/api/userinfo/${id}/attending/`,
                        {
                            credentials: "include",
                        }
                    ),
                ]);

                if (!createdRes.ok || !savedRes.ok || !attendingRes.ok) {
                    throw new Error("One or more event fetches failed");
                }

                const [created, saved, attending] = await Promise.all([
                    createdRes.json(),
                    savedRes.json(),
                    attendingRes.json(),
                ]);

                setEvents({ created, saved, attending });
            } catch (err) {
                console.error("Error fetching profile events:", err);
            }
        };

        fetchEvents();
    }, [id]);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showPassCheckModal, setShowPassCheckModal] = useState(false);
    const [showContinueModal, setShowContinueModal] = useState(false);
    const [showEmailEditModal, setShowEmailEditModal] = useState(false);
    const [showUsernameEditModal, setShowUsernameEditModal] = useState(false);
    const [showPasswordEditModal, setShowPasswordEditModal] = useState(false);

    const handleOpenModal = () => setShowCreateModal(true);
    const handleCloseModal = () => setShowCreateModal(false);

    const handleOpenPassCheck = () => setShowPassCheckModal(true);
    const handleClosePassCheck = () => setShowPassCheckModal(false);

    const handleOpenEmailEditModal = () => setShowEmailEditModal(true);
    const handleCloseEmailEditModal = () => setShowEmailEditModal(false);

    const handleOpenUsernameEditModal = () => setShowUsernameEditModal(true);
    const handleCloseUsernameEditModal = () => setShowUsernameEditModal(false);

    const handleOpenPasswordEditModal = () => setShowPasswordEditModal(true);
    const handleClosePasswordEditModal = () => setShowPasswordEditModal(false);



    const handleOpenContinueCheck = () => setShowContinueModal(true);
    const handleCloseContinueCheck = () => setShowContinueModal(false);

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
    const [profileForm, setProfileForm] = useState({
        username: "",
        email: "",
        password: "",
    });

    const handleContinue = async (e) => {
        e.preventDefault();
        setShowContinueModal(false);
        setShowPassCheckModal(true);
    };
    const handleCancel = async (e) => {
        e.preventDefault()
        setShowContinueModal(false);
    };


    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        if (profileForm.username === "") {
            console.log("Hello");
            setProfileForm({...profileForm, username: id});

        }
        try {
            const response = await fetch(`http://localhost:8000/api/userinfo/${id}/`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        username: profileForm.username,
                        email: profileForm.email,
                    }),
                }
            );
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            alert("Email Updated!");
            handleCloseUsernameEditModal();
            handleClosePasswordEditModal();
            handleCloseEmailEditModal();
        } catch (error) {
            console.error("Error during profile update:", error);
            alert("An error occured. Please try again.");
        }
    };



    const handlePassVerif = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(
                "http://localhost:8000/api/token/login/",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({ username: id, password }),
                }
            );
            if (!response.ok) {
                throw new Error(
                    `Error: ${response.status} - ${response.statusText}`
                );
            }
            const data = await response.json();
            handleClosePassCheck();
        } catch (error) {
            console.error("Error during form submission:", error);
            alert("An error occurred. Please try again.");
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
            formData.append("image_url", eventForm.image); // Must match model field
        }

        try {
            const res = await fetchWithAuth(
                "http://localhost:8000/api/eventinfo/",
                {
                    method: "POST",
                    body: formData,
                }
            );

            if (!res.ok) {
                const errorData = await res.json();
                console.error("Validation error:", errorData);
                throw new Error("Failed to create event");
            }

            handleCloseModal();
        } catch (err) {
            console.error("Error creating event:", err);
        }
    };


    return (
        <div className={styles.wrapper}>
            <User username={id} />
            {user?.username === id && (
                <>
                    <button
                        onClick={handleOpenModal}
                        className={styles.createButton}
                    >
                        + Create Event
                    </button>
                </>
            )}

            {showCreateModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h2>Create New Event</h2>
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
                            <button type="submit">Submit</button>
                            <button type="button" onClick={handleCloseModal}>
                                Cancel
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {showEmailEditModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h2>Edit Email Address</h2>
                        <form onSubmit={handleProfileUpdate}>
                            <input
                                type="email"
                                placeholder="New Email Address"
                                onChange = {(e) =>
                                    setProfileForm({...profileForm, email: e.target.value})
                                }
                            />
                            <button type="submit">Update Email Address</button>
                        </form>
                    </div>
                </div>
            )}
            {showUsernameEditModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h2>Edit Username</h2>
                        <form onSubmit={handleProfileUpdate}>
                            <input
                                type="username"
                                placeholder="New Username"
                                onChange = {(e) =>
                                    setProfileForm({...profileForm, username: e.target.value})
                                }
                            />
                            <button type="submit">Update Email Address</button>
                        </form>
                    </div>
                </div>
            )}
            {showPasswordEditModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h2>Edit Password</h2>
                        <form onSubmit={handleProfileUpdate}>
                            <input
                                type="password"
                                placeholder="New Password"
                                onChange = {(e) =>
                                    setProfileForm({...profileForm, password: e.target.value})
                                }
                            />
                            <button type="submit">Update Email Address</button>
                        </form>
                    </div>
                </div>
            )}

            {showContinueModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h2>Are you sure?</h2>
                        <button type="button" onClick={handleContinue}>Continue</button>
                        <br/>
                        <button type="button" onClick={handleCancel}>Cancel</button>
                    </div>
                </div>
            )}

            {showPassCheckModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h2>Enter your password to continue</h2>

                        <form onSubmit={handlePassVerif}>
                            <input
                                type="password"
                                placeholder="********"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button type="submit">Continue</button>
                        </form>
                    </div>
                </div>
            )}

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
            {/*content rendering section*/}

            <div className={styles.eventContainer}>
                {activeTab === "profile" ? (
                        <div className={styles.profileEdit}>
                            <h2>Edit Profile Info</h2>
                            <button onClick={handleOpenUsernameEditModal}>Change Username</button>
                            <br/>
                            <button onClick={handleOpenEmailEditModal}>Change Email</button>
                            <br/>
                            <button onClick={handleOpenPasswordEditModal}>Change Password</button>
                            <br/>
                            <button onClick={handleOpenContinueCheck} className={styles.deleteAccount}>Delete Account</button>

                            {/* Replace this div with profile info eiditng form */}
                        </div>
                    ) : (
                        events[activeTab].map((event, i) => (
                            <EventCard key={`${activeTab}-${i}`} event={event} />
                        ))
                )}
            </div>
        </div>
    );
}

