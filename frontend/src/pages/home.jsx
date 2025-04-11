import { useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/home.module.css";
import EventCard from "../components/EventCard";

function Home() {
    useEffect(() => {
        const navbar = document.querySelector(".navbar");
        const hero = document.getElementById("hero");

        hero.style.marginTop = `-${navbar.clientHeight}px`;
    }, []);

    return (
        <>
            <HeroSection />
            <FeaturedSection />
            <UpcomingSection />
            <CommunitySection />
        </>
    );
}

function HeroSection() {
    return (
        <>
            <section id="hero" className={styles.heroSection}>
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

function FeaturedSection() {
    return (
        <>
            <section className={styles.featuredSection}>
                <div className={styles.wrapper}>
                    <div className={styles.title}>
                        <h2>Featured Events</h2>
                        <p>within 20 miles of 30603</p>
                    </div>
                    <div className={styles.eventContainer}>
                        <EventCard />
                        <EventCard />
                        <EventCard />
                    </div>
                    <div className={styles.ctaContainer}>
                        <p>
                            Didn't find the perfect event? Discover even more
                            exciting happenings near you!
                        </p>
                        <Link className="dark-button">See More Events</Link>
                    </div>
                </div>
                <div className={styles.blobTopLeft}>
                    <img></img>
                </div>
            </section>
        </>
    );
}

function UpcomingSection() {
    return (
        <>
            <section className={styles.upcomingSection}>
                <div className={styles.wrapper}>
                    <div className={styles.title}>
                        <h2>Events Happening Soon</h2>
                        <p>within 20 miles of 30603</p>
                    </div>
                    <div className={styles.eventContainer}>
                        <EventCard />
                        <EventCard />
                        <EventCard />
                    </div>
                    <div className={styles.ctaContainer}>
                        <p>
                            Didn't find the perfect event? Discover even more
                            exciting happenings near you!
                        </p>
                        <Link className="dark-button">See More Events</Link>
                    </div>
                </div>

                <div className={styles.blobBottomRight}>
                    <img></img>
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
                            <img></img>
                        </div>

                        <div>
                            <img></img>
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
                            <img></img>
                        </div>
                    </div>

                    <div className={styles.ctaContainer}>
                        <p>
                            Ready to share your event and get it in front of
                            local attendees?
                        </p>
                        <Link className="bright-button">Add Your Events</Link>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Home;
