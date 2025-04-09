import {Navigate} from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import api from '../api';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';
import { useEffect, useState } from 'react';

function ProtectedRoute({ children }) {
    const [isAuthorized, setIsAuthorized] = useState(null);

    useEffect(() => {
        auth().catch(() => setIsAuthorized(false));
    }, []);

    const refreshToken = async () => {
        try {
            const response = await api.post('api/token/refresh/', {
                refresh: localStorage.getItem(REFRESH_TOKEN),
            });
            if (response.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, response.data.access);
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error('Error refreshing token:', error);
        }
        return false;
    };

    const auth = async() => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) {
            console.error('No access token found');
            setIsAuthorized(false);
            return;
        }

        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp < currentTime) {
            const refreshed = await refreshToken();
            if (!refreshed) {
                console.error('Failed to refresh token');
                setIsAuthorized(false);
                return;
            }
        } else {
            console.log('Token is valid, no need to refresh');
            setIsAuthorized(true);
        }
    }

    if (isAuthorized === null) {
        return <div>Loading...</div>;
    }

    return isAuthorized ? children : <Navigate to="/login" />;

}

export default ProtectedRoute;