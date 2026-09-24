import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import Explore from "./pages/Explore";
import FlatDetails from "./pages/FlatDetails";
import Matches from "./pages/Matches";
import Requests from "./pages/Requests";
import Messages from "./pages/Messages";
import SSOCallback from "./pages/SSOCallback";
import OwnerDashboard from "./pages/Owner/OwnerDashboard";
import OwnerFlats from "./pages/Owner/OwnerFlats";
import OwnerFlatForm from "./pages/Owner/OwnerFlatForm";
import OwnerInterests from "./pages/Owner/OwnerInterests";
import OwnerProfile from "./pages/Owner/OwnerProfile";
import OwnerLayout from "./layouts/OwnerLayout";

import AdminLogin from "./pages/Admin/AdminLogin";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminStudents from "./pages/Admin/AdminStudents";
import AdminOwners from "./pages/Admin/AdminOwners";
import AdminFlats from "./pages/Admin/AdminFlats";
import AdminReports from "./pages/Admin/AdminReports";
import AdminPlaceholder from "./pages/Admin/AdminPlaceholder";

import "./globals.css";
import LenisScroll from "./components/LenisScroll";

const AppContent = () => {
    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith('/admin');

    return (
        <div className="App">
            <LenisScroll />
            {!isAdminRoute && <Navbar />}
            <main>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/discover" element={<Navigate to="/explore" replace />} />
                    <Route path="/explore" element={<Explore />} />
                    <Route path="/flats/:id" element={<FlatDetails />} />
                    <Route path="/matches" element={<Matches />} />
                    <Route path="/requests" element={<Requests />} />
                    <Route path="/messages" element={<Messages />} />
                    <Route path="/sso-callback" element={<SSOCallback />} />
                    
                    {/* Owner Routes wrapped in Sidebar Layout */}
                    <Route path="/owner" element={<OwnerLayout />}>
                        <Route path="dashboard" element={<OwnerDashboard />} />
                        <Route path="flats" element={<OwnerFlats />} />
                        <Route path="flats/add" element={<OwnerFlatForm />} />
                        <Route path="flats/:id/edit" element={<OwnerFlatForm />} />
                        <Route path="interests" element={<OwnerInterests />} />
                        <Route path="profile" element={<OwnerProfile />} />
                    </Route>

                    {/* Admin Login Route */}
                    <Route path="/admin/login" element={<AdminLogin />} />

                    {/* Admin Routes wrapped in Sidebar Layout */}
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route path="dashboard" element={<AdminDashboard />} />
                        <Route path="students" element={<AdminStudents />} />
                        <Route path="owners" element={<AdminOwners />} />
                        <Route path="flats" element={<AdminFlats />} />
                        <Route path="flats/reported" element={<AdminPlaceholder title="Reported Flats" />} />
                        <Route path="matches" element={<AdminPlaceholder title="Matches" />} />
                        <Route path="connections" element={<AdminPlaceholder title="Connections" />} />
                        <Route path="reports" element={<AdminReports />} />
                        <Route path="reviews" element={<AdminPlaceholder title="Reviews" />} />
                        <Route path="analytics" element={<AdminPlaceholder title="Analytics" />} />
                        <Route path="notifications" element={<AdminPlaceholder title="Notifications" />} />
                        <Route path="activity" element={<AdminPlaceholder title="Activity Log" />} />
                        <Route path="settings" element={<AdminPlaceholder title="Settings" />} />
                    </Route>
                </Routes>
            </main>
            {!isAdminRoute && <Footer />}
        </div>
    );
};

export default function App() {
    return (
        <AuthProvider>
            <Router>
                <AppContent />
            </Router>
        </AuthProvider>
    );
}