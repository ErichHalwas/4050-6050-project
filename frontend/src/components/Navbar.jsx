import { Link, Outlet } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

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
    return <img alt="logo" src="https://placehold.co/40x40?text=Logo" />;
}

function SearchBar() {
    const [searchContent, setSearchContent] = useState("");
    const [results, setResults] = useState(" ");

    function handleSCChange(content) {
        setSearchContent(content);
    }

    return (
        <div className={"SearchBar"}>
            <input
                type="text"
                placeholder="Search for an event"
                onChange={(e) => handleSCChange(e.target.value)}
                value={searchContent}
            />
            <ul className={"searchResult"}></ul>
        </div>
    );
}

export default Navbar;
