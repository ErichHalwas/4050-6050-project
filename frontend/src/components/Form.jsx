import {useState} from 'react';
import api from '../api.js';
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants.js';
import '../styles/Form.css';

function Form({route, method}) {
    const [username, setUsername] = useState('');
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
            if (response.status !== 201 && response.status !== 200) {
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

    return <form onSubmit={handleSubmit} className="form-container">
        <h1>{name}</h1>
        <input
            className="form-input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
        />
        <input
            className="form-input"
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
        />
        <button className="form-button" type="submit">{name}</button>
    </form>
}

export default Form;