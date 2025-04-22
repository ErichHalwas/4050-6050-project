import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/home.module.css";
import EventCard from "../components/EventCard";
import BRBlob from "../assets/home_br_blob.svg";
import TLBlob from "../assets/home_tl_blob.svg";

function Home() {
    useEffect(() => {
        const navbar = document.querySelector(".navbar");
        const hero = document.getElementById("hero");

        hero.style.marginTop = `-${navbar.clientHeight}px`;
    }, []);

    const token = import.meta.env.VITE_IPINFO_TOKEN;

    const [topEvents, setTopEvents] = useState([]);
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [zipCode, setZipCode] = useState("00000");

    useEffect(() => {
        const fetchLocationAndEvents = async () => {
            try {
                const token = import.meta.env.VITE_IPINFO_TOKEN;
                const geoRes = await fetch(
                    `https://ipinfo.io/json?token=${token}`
                );
                const geoData = await geoRes.json();

                setZipCode(geoData.postal);
                const [lat, lon] = geoData.loc.split(",");

                // Get nearby events
                const res = await fetch(
                    `http://localhost:8000/api/eventinfo/nearby/?lat=${lat}&lon=${lon}`
                );
                const events = await res.json();

                if (!Array.isArray(events)) return;

                // Top 3 by popularity (attendees length)
                const top = [...events]
                    .sort(
                        (a, b) =>
                            (b.attendees?.length || 0) -
                            (a.attendees?.length || 0)
                    )
                    .slice(0, 3);

                // First 3 upcoming by start_time (assumes ISO 8601 format)
                const upcoming = [...events]
                    .filter((e) => new Date(e.start_time) > new Date())
                    .sort(
                        (a, b) =>
                            new Date(a.start_time) - new Date(b.start_time)
                    )
                    .slice(0, 3);
                setTopEvents(top);
                setUpcomingEvents(upcoming);
            } catch (err) {
                console.error("Error loading events:", err);
            }
        };

        fetchLocationAndEvents();
    }, []);

    return (
        <>
            <HeroSection />
            <FeaturedSection zipCode={zipCode} eventsData={topEvents} />
            <UpcomingSection zipCode={zipCode} eventsData={upcomingEvents} />
            <CommunitySection />
        </>
    );
}

function HeroSection() {
    return (
        <>
            <section
                id="hero"
                className={styles.heroSection}
                style={{ backgroundImage: 'url("home-bg.webp")' }}
            >
                <h1>Discover Events Near You</h1>
                <div>
                    <Link className="bright-button">Find Events Now</Link>{" "}
                    <Link className="bright-button-alternate">
                        Browse Categories
                    </Link>
                </div>
            </section>
        </>
    );
}

function FeaturedSection({ zipCode, eventsData = [] }) {
    return (
        <section className={styles.featuredSection}>
            <div className={styles.wrapper}>
                <div className={styles.title}>
                    <h2>Featured Events</h2>
                    <p>near {zipCode || "your location"}</p>
                </div>

                <div className={styles.eventContainer}>
                    {eventsData.length > 0 ? (
                        eventsData.map((event) => (
                            <EventCard key={event.id} event={event} />
                        ))
                    ) : (
                        <p>No featured events found nearby.</p>
                    )}
                </div>

                <div className={styles.ctaContainer}>
                    <p>
                        Didn't find the perfect event? Discover even more
                        exciting happenings near you!
                    </p>
                    <Link to="/map" className="dark-button">
                        See More Events
                    </Link>
                </div>
            </div>

            <div className={styles.blobTopLeft}>
                <img src={TLBlob} alt="decorative blob" />
            </div>
        </section>
    );
}

function UpcomingSection({ zipCode, eventsData = [] }) {
    return (
        <>
            <section className={styles.upcomingSection}>
                <div className={styles.wrapper}>
                    <div className={styles.title}>
                        <h2>Events Happening Soon</h2>
                        <p>near {zipCode || "your location"}</p>
                    </div>

                    <div className={styles.eventContainer}>
                        {eventsData.length > 0 ? (
                            eventsData.map((event) => (
                                <EventCard key={event.id} event={event} />
                            ))
                        ) : (
                            <p>No featured events found nearby.</p>
                        )}
                    </div>

                    <div className={styles.ctaContainer}>
                        <p>
                            Didn't find the perfect event? Discover even more
                            exciting happenings near you!
                        </p>
                        <Link to="/map" className="dark-button">
                            See More Events
                        </Link>
                    </div>
                </div>

                <div className={styles.blobBottomRight}>
                    <img src={BRBlob} alt="decorative blob" />
                </div>
            </section>
        </>
    );
}

function CommunitySection() {
    return (
        <>
            <section className={`${styles.communitySection} ${styles.white}`}>
                <div className={styles.wrapper}>
                    <div className={`${styles.title}`}>
                        <h2>Got an Event? Share It With the Community!</h2>
                        <p>
                            Hosting a concert, festival, or gathering? Let
                            others know! Submit your event and be part of the
                            exciting happenings near you.
                        </p>
                    </div>

                    <div className={styles.halfgrid}>
                        <div>
                            <h3>Reach a Larger Audience</h3>
                            <p>
                                Reach a larger local audience actively seeking
                                events like yours.
                            </p>
                            <p>
                                Increase discoverability by targeting users
                                specifically interested in your event type.
                            </p>
                            <p>
                                Drive higher attendance by providing easy access
                                to your event listing.
                            </p>
                        </div>

                        <div>
                            <img src="https://blog.ted.com/wp-content/uploads/sites/2/2014/12/15447807795_55bb873910_k.jpg"></img>
                        </div>

                        <div>
                            <img src="https://info.eventvesta.com/wp-content/uploads/2023/08/Outlandia-Giveaway-social-media-post-example.jpg"></img>
                        </div>

                        <div>
                            <h3>Easy Promotion & Management</h3>
                            <p>
                                List your event quickly and easily with our
                                simple submission process.
                            </p>
                            <p>
                                Update event details instantly, keeping
                                attendees informed of any changes.
                            </p>
                            <p>
                                Manage all event aspects centrally, saving time
                                and reducing stress.
                            </p>
                        </div>

                        <div>
                            <h3>Boost Your Event’s Visibility</h3>
                            <p>
                                Gain prominent homepage placement to maximize
                                event visibility and views.
                            </p>
                            <p>
                                Ensure easy location discovery by displaying
                                your event on the map.
                            </p>
                            <p>
                                Enhance discoverability through targeted
                                category listings, reaching your ideal audience.
                            </p>
                        </div>

                        <div>
                            <img src="https://mode.com/resources/images/gallery/google-maps-with-markers-1.png"></img>
                        </div>
                    </div>

                    <div className={styles.ctaContainer}>
                        <p>
                            Ready to share your event and get it in front of
                            local attendees?
                        </p>
                        <Link className="bright-button" to="/signup">
                            Add Your Events
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Home;
