import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        try {
            const res = await fetch("http://localhost:8000/api/userinfo/me/", {
                credentials: "include",
            });

            if (res.status === 401) {
                const refreshed = await tryRefreshToken();
                if (!refreshed) throw new Error("Refresh failed");

                const retryRes = await fetch(
                    "http://localhost:8000/api/userinfo/me/",
                    {
                        credentials: "include",
                    }
                );
                if (!retryRes.ok)
                    throw new Error("User fetch failed after refresh");
                const data = await retryRes.json();
                setUser(data);
                return;
            }

            const data = await res.json();
            setUser(data);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        await fetch("http://localhost:8000/api/token/logout/", {
            method: "POST",
            credentials: "include",
        });
        setUser(null);
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
