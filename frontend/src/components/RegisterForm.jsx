import {useState} from 'react';
import api from '../api.js';
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants.js';
import '../styles/Register.css';

function RegisterForm({route, method}) {
    const [username, setUsername] = useState(''); /* useStates for Username, password, whether the form is loading */
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const name = method === 'login' ? 'Login' : 'Register';

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("handlesubmit");

        if (password !== passwordConfirm) { // confirms that the passwords match
            console.error("Passwords do not match.");
            alert("Passwords do not match. Please try again.");
            return;
        }
        try {
            setLoading(true);

            const response = await fetch('http://localhost:8000/api/userinfo/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({username, email, password})
            });
            if (!response.ok) {
                throw new Error(`Error: ${response.status} - ${response.statusText}`);
            }
            const data = await response.json();
            console.log(response.status);
            navigate('/login');
        }  catch (error) {
            console.error("Error during form submission:", error);
            alert("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    /*
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.post(route, {
                username,
                email,
                password,
            });
            if (response.status !== 201 && response.status !== 200) { // This if statement ends the function if the api response throws an error
                console.error('Error during login:', response.data);
                setLoading(false);
                return;
            }
            if (method === "login") {
                localStorage.setItem(ACCESS_TOKEN, response.data.access);
                localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
                navigate('/');
            } else {
                navigate('/login');
            }
        } catch (error) {
            console.error('Error during login:', error);
        } finally {
            setLoading(false);
        }
     */

    return(
    <div className='RegisterMainContent'>

        <form onSubmit={handleSubmit} className="form-container">
            <h1>{'Get Started Now'}</h1>
            <h5>Create an account or log in.</h5>
            <h3>Username</h3>
            <input
                className="form-input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="janedoe123"
            />
            <h3>Email</h3>
            <input
                className="form-input"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jandoe@email.com"
            />
            <h3>Password</h3>
            <input
                className="form-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="*******"
            />
            <h3>Confirm Password</h3>
            <input
                className="form-input"
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                placeholder="********"
            />
            {/* IF THE 'password' AND 'passwordConfirm' VALUES DO NOT MATCH, IT SHOULD THROW AN ERROR */}
            <input type='submit' value='Register' id='RegisterButton'></input>
            <p>Already have an account? <a href="/login">Sign in</a></p>
            <p>By creating an account, you agree to the <br /><a href="google.com">Terms of Service</a> and the <a>Privacy Policy</a></p>
        </form>
    </div>
    );
}

export default RegisterForm;