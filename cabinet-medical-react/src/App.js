import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/login/login";
import Signup from "./components/Singup/Singup";
import Home from './components/Home/Home';
import AdminDashboard from "./components/Admin/AdminDashboard";
import Dashboard from "./components/Dashboard";
import UserProfile from "./components/Profile/UserProfile";   // صحيح
import EditProfile from "./components/Profile/EditProfile";   // صحيح

function App() {
    const token = localStorage.getItem("token");
    
    const getUserRole = () => {
        if (!token) return null;
        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            const roles = payload.roles || payload.authorities || [];
            if (roles.includes("ADMIN")) return "ADMIN";
            if (roles.includes("MEDECIN")) return "MEDECIN";
            if (roles.includes("SECRETAIRE")) return "SECRETAIRE";
            if (roles.includes("PATIENT")) return "PATIENT";
            return null;
        } catch(e) { return null; }
    };

    const role = getUserRole();

    const getDefaultRoute = () => {
        switch(role) {
            case "ADMIN": return "/admin";
            case "MEDECIN": return "/medecin";
            case "SECRETAIRE": return "/secretaire";
            case "PATIENT": return "/patient";
            default: return "/login";
        }
    };

    const isAuthenticated = !!token;

    return (
        <BrowserRouter>
            <Routes>
                
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                
                <Route path="/profile" element={isAuthenticated ? <UserProfile /> : <Navigate to="/login" />} />
                <Route path="/edit-profile" element={isAuthenticated ? <EditProfile /> : <Navigate to="/login" />} />
                
                <Route path="/" element={<Navigate to={getDefaultRoute()} />} />
                <Route path="/admin" element={role === "ADMIN" ? <AdminDashboard /> : <Navigate to="/login" />} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;