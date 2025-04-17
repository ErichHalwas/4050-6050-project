import {useState} from 'react';
import api from '../api.js';
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants.js';
import '../styles/Register.css';

function LoginForm({route, method}) {
    const [username, setUsername] = useState(''); /* useStates for Username, password, whether the form is loading */
    const [password, setPassword] = useState('');

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const name = method === 'login' ? 'Login' : 'Register';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.post(route, {
                username,
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
    }

    return(
        <div className='RegisterMainContent'>

            <form onSubmit={handleSubmit} className="form-container">
                <h1 id='loginheader'>{'Login'}</h1>

                <h3>Username</h3>
                <input
                    className="form-input"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="janedoe123"
                />
                <h3>Password</h3>
                <input
                    className="form-input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="*******"
                />
                {/* IF THE 'password' AND 'passwordConfirm' VALUES DO NOT MATCH, IT SHOULD THROW AN ERROR */}
                <input type='submit' value='Login' id='RegisterButton'></input>
                <p>Don't have an account? <a href="/signup">Register Now</a></p>
            </form>
        </div>
    );
}

export default LoginForm;