import { Link } from "react-router";
import { useState } from "react";

/*
Currently broken but they will be fixed
in a later update.

<Link to='/HomePage'>Home</Link>;
<Link to='/DiscoverPage'>Discover</Link>;
<Link to='/MapPage'>Map</Link>;

 <Link to='/RegisterPage'>Signup</Link>;
 <Link to='/LoginPage'>Login</Link>

 */
export default function Navbar() {
    return (
        <>
            <div className="Navbar">
                <div className="leftNavbar">
                    <Logo />
                    <a href='' id={'link'}>Home</a>
                    <a href='' id={'link'}>Discover</a>
                    <a href='' id={'link'}>Map</a>
                </div>
                <div className="/rightNavbar">
                    <SearchBar />
                    <a href='' id={'link'}>Signup</a>
                    <a href='' id={'link'}>Login</a>
                </div>
            </div>
        </>
    );
}

function Logo() {
    return (
       <img src={require('../images/logo-generic.png')} alt="logo" />
    );
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

