import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/login.jsx";
import Register from "./pages/register.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Home from "./pages/home.jsx";
import NotFound from "./pages/NotFound.jsx";
import Navbar from "./components/Navbar.jsx";
import Maps from "./pages/Maps.jsx";
import MainEvent from "./pages/event.jsx";
import UserProfile from "./pages/profile.jsx";

function Logout() {
    localStorage.clear();
    return <Navigate to="/login" replace />;
}

function RegisterAndLogout() {
    localStorage.clear();
    return <Register />;
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navbar />}>
                    <Route index element={<Home />} />
                    <Route path="map" element={<Maps />} />
                    <Route path="event/:id" element={<MainEvent />} />
                    <Route path="user/:id" element={<UserProfile />} />
                    <Route path="*" element={<NotFound />} />
                </Route>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<RegisterAndLogout />} />
                <Route path="/logout" element={<Logout />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
