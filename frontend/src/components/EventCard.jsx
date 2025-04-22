import { Link } from "react-router-dom";

function EventCard({ event }) {
    console.log(event);
    return (
        <Link
            to={`/event/${event.id}`}
            style={{
                backgroundColor: "#f5f5f5",
                width: "300px",
                height: "400px",
                borderRadius: "10px",
                overflow: "hidden",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                display: "flex",
                flexDirection: "column",
                textDecoration: "none",
            }}
        >
            <img
                src={event.image_url}
                alt="event"
                style={{
                    width: "100%",
                    height: "150px",
                    objectFit: "cover",
                }}
            />
            <div style={{ padding: "1rem", flex: 1 }}>
                <h3
                    style={{
                        margin: "0 0 0.5rem 0",
                        fontSize: "1.2rem",
                        color: "black",
                    }}
                >
                    {event.title}
                </h3>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "#666" }}>
                    {event.city}, {event.state}
                </p>
                <p
                    style={{
                        fontSize: "0.85rem",
                        marginTop: "0.5rem",
                        color: "#444",
                    }}
                >
                    {event.start_time}
                </p>
                <p
                    style={{
                        marginTop: "1rem",
                        fontSize: "0.85rem",
                        color: "#333",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                    }}
                >
                    {event.description}
                </p>
            </div>
        </Link>
    );
}

export default EventCard;
