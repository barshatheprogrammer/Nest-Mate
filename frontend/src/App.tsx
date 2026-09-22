import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import Explore from "./pages/Explore";
import RoommateProfile from "./pages/RoommateProfile";
import SSOCallback from "./pages/SSOCallback";
import "./globals.css";
import LenisScroll from "./components/LenisScroll";

export default function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="App">
                    <LenisScroll />
                    <Navbar />
                    <main>
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/discover" element={<Navigate to="/explore" replace />} />
                            <Route path="/explore" element={<Explore />} />
                            <Route path="/roommates/:id" element={<RoommateProfile />} />
                            <Route path="/sso-callback" element={<SSOCallback />} />
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </Router>
        </AuthProvider>
    );
}