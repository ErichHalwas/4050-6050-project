export const fetchWithAuth = async (url, options = {}) => {
    const defaultOptions = {
        credentials: "include",
        ...options,
    };

    let res = await fetch(url, defaultOptions);

    if (res.status === 401) {
        const refreshed = await refreshAccessToken();

        if (refreshed) {
            res = await fetch(url, defaultOptions);
        }
    }

    return res;
};

const refreshAccessToken = async () => {
    try {
        const res = await fetch("http://localhost:8000/api/token/refresh/", {
            method: "POST",
            credentials: "include",
        });
        return res.ok;
    } catch {
        return false;
    }
};
