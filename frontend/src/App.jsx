import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/login.jsx";
import Register from "./pages/Register.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Home from "./pages/home.jsx";
import NotFound from "./pages/NotFound.jsx";
import Navbar from "./components/Navbar.jsx";

function Logout() {
    localStorage.clear();
    return <Navigate to="/login" replace />;
}

function RegisterAndLogout({login}) {
    localStorage.clear();
    return <Register login={login}/>;
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navbar />}>
                    <Route index element={<Home />} />
                    <Route path="*" element={<NotFound />} />
                    <Route path="/signup" element={<RegisterAndLogout login={1}/>} />
                    <Route path="/login" element={<RegisterAndLogout login={0}/>} />

                </Route>
                <Route path="/login" element={<RegisterAndLogout login={0} />} />
                <Route path="/register" element={<RegisterAndLogout login={1}/>} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/signup" element={<RegisterAndLogout login={1}/>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
