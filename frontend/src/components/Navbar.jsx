import { Link, Outlet } from "react-router-dom";
import { useState } from "react";

function Navbar() {
    return (
        <>
            <div className="navbar">
                <div className="leftNavbar">
                    <Logo />
                    <Link to="/" id={"link"}>
                        Home
                    </Link>
                    <Link to="/discover" id={"link"}>
                        Discover
                    </Link>
                    <Link to="/map"  id={"link"}>
                        Map
                    </Link>
                </div>
                <div className="rightNavbar">
                    <SearchBar />
                    <Link to="/signup" id={"link"}>
                        Signup
                    </Link>
                    <Link to="/login" id={"link"}>
                        Login
                    </Link>
                </div>
            </div>
            <Outlet />
        </>
    );
}

function Logo() {
    return <img alt="logo" />;
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
