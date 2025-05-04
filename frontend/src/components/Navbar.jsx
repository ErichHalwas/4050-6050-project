import { Link, Outlet } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";
import mapPin from "../assets/map-pin.svg";

function Navbar() {
    const { user, logout } = useAuth();

    return (
        <>
            <div className="navbar">
                <div className="leftNavbar">
                    <Logo />
                    <Link to="/" id={"link"}>
                        Home
                    </Link>

                    <Link to="/map" id={"link"}>
                        Map
                    </Link>
                </div>
                <div className="rightNavbar">
                    <SearchBar />
                    {user ? (
                        <>
                            <Link
                                to={`/user/${user.username}`}
                                className="userInfoContainer"
                            >
                                <div className="pfp-container">
                                    <img
                                        src={user.pfp_url}
                                        className="pfp"
                                        alt="pfp"
                                        width="32"
                                        height="32"
                                    />
                                </div>
                                <span>{user.username}</span>
                            </Link>
                            <button onClick={logout}>Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/signup" id={"link"}>
                                Signup
                            </Link>
                            <Link to="/login" id={"link"}>
                                Login
                            </Link>
                        </>
                    )}
                </div>
            </div>
            <Outlet />
        </>
    );
}

function Logo() {
    return <img alt="logo" src={mapPin} style={{ height: "3rem" }} />;
}


function SearchBar() {
    const [searchContent, setSearchContent] = useState("");
    const [results, setResults] = useState([]);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (searchContent.trim() === "") {
                setResults([]);
                return;
            }

            fetch(`http://localhost:8000/api/eventinfo/search/?q=${encodeURIComponent(searchContent)}`)
                .then((res) => res.json())
                .then((data) => setResults(data))
                .catch((err) => console.error("Search failed:", err));
        }, 300); // debounce the API call

        return () => clearTimeout(delayDebounce);
    }, [searchContent]);

    return (
        <div className="SearchBar">
            <input
                type="text"
                placeholder="Search for an event"
                value={searchContent}
                onChange={(e) => setSearchContent(e.target.value)}
            />
            {results.length > 0 && (
                <ul>
                    {results.map((event) => (
                        <li key={event.id}>
                            <Link
                                to={`/event/${event.id}`}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f5f5f5"}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#fff"}
                            >
                                {event.title}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}

        </div>
    );
}


export default Navbar;
