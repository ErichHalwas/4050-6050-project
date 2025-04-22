import { useState } from "react";
import api from "../api.js";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants.js";
import "../styles/Register.css";
import { useAuth } from "../../context/AuthContext.jsx";

function LoginForm({ route, method }) {
    const { setUser } = useAuth();

    const [username, setUsername] =
        useState(
            ""
        ); /* useStates for Username, password, whether the form is loading */
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const name = method === "login" ? "Login" : "Register";

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await fetch(
                "http://localhost:8000/api/token/login/",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({ username, password }),
                }
            );
            if (!response.ok) {
                throw new Error(
                    `Error: ${response.status} - ${response.statusText}`
                );
            }
            const data = await response.json();
            setUser(data);
            navigate("/");
        } catch (error) {
            console.error("Error during form submission:", error);
            alert("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="RegisterMainContent">
            <form onSubmit={handleSubmit} className="form-container">
                <h1 id="loginheader">{"Login"}</h1>

                <label htmlFor="username-field">Username</label>
                <input
                    id="username-field"
                    className="form-input"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="janedoe123"
                />
                <label htmlFor="password-field">Password</label>
                <input
                    id="password-field"
                    className="form-input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="*******"
                />
                {/* IF THE 'password' AND 'passwordConfirm' VALUES DO NOT MATCH, IT SHOULD THROW AN ERROR */}
                <input type="submit" value="Login" id="RegisterButton"></input>
                <p>
                    Don't have an account? <a href="/signup">Register Now</a>
                </p>
            </form>
        </div>
    );
}

export default LoginForm;
