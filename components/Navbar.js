import { Link } from "react-router";
import { useState } from "react";

/*



 */
export default function Navbar() {
    return (
        <>
            <div className="Navbar">
                <div className="leftNavbar">
                    <Logo />
                    <Link to='/HomePage'>Home</Link>;
                    <Link to='/DiscoverPage'>Discover</Link>;
                    <Link to='/MapPage'>Map</Link>;
                </div>
                <div className="/rightNavbar">
                    <SearchBar />
                    <Link to='/RegisterPage'>Signup</Link>;
                    <Link to='/LoginPage'>Login</Link>
                </div>
            </div>
        </>
    );
}

function Logo() {
    // TODO
}

function SearchBar() {
    const [searchContent, setSearchContent] = useState("");
    const [results, setResults] = useState(" ");

    function handleSCChange(content) {
        setSearchContent(content);
    }

    return (
        <>
            <div className={'SearchBar'}>
                <input type='text' placeholder='Search for an event' onChange={handleSCChange} value={searchContent} />
                <ul className={'searchResult'}>
                </ul>
            </div>
        </>
    );
}

