import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/login/login";
import Signup from "./components/Singup/Singup";
import Home from './components/Home/Home';
import AdminDashboard from "./components/Admin/AdminDashboard";
import Dashboard from "./components/Dashboard";
import UserProfile from "./components/Profile/UserProfile";
import EditProfile from "./components/Profile/EditProfile";
import PatientDashboard from "./components/Patient/PatientDashboard";
import MedecinDashboard from "./components/Medecin/MedecinDashboard";
import SecretaireDashboard from "./components/Secretaire/SecretaireDashboard";

function App() {
    const token = localStorage.getItem("token");
    
    // ✅ دالة لجلب الدور من localStorage أولاً
    const getUserRole = () => {
        // 1. أولاً: جرب من localStorage.user (حيث نخزن معلومات المستخدم بعد login)
        const userStr = localStorage.getItem("user");
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                if (user.roles && user.roles.length > 0) {
                    console.log("🎭 Rôle depuis localStorage.user:", user.roles[0]);
                    return user.roles[0];
                }
            } catch(e) {
                console.error("Erreur parsing user:", e);
            }
        }
        
        // 2. ثانياً: جرب من التوكن
        if (!token) return null;
        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            const roles = payload.roles || payload.authorities || [];
            console.log("🎭 Rôles depuis le token:", roles);
            
            if (roles.includes("ADMIN")) return "ADMIN";
            if (roles.includes("MEDECIN")) return "MEDECIN";
            if (roles.includes("SECRETAIRE")) return "SECRETAIRE";
            if (roles.includes("PATIENT")) return "PATIENT";
            return null;
        } catch(e) { 
            console.error("Erreur décodage token:", e);
            return null; 
        }
    };

    const role = getUserRole();
    console.log("🎯 Rôle final détecté:", role);
    console.log("🔑 Token présent:", !!token);
    console.log("📦 Contenu de localStorage.user:", localStorage.getItem("user"));

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

    // ✅ إذا كان هناك توكن ولكن لا يوجد دور، نستخدم مسار افتراضي
    if (token && !role) {
        console.warn("⚠️ Token présent mais pas de rôle, redirection vers /patient par défaut");
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                
                <Route path="/profile" element={isAuthenticated ? <UserProfile /> : <Navigate to="/login" />} />
                <Route path="/edit-profile" element={isAuthenticated ? <EditProfile /> : <Navigate to="/login" />} />
                
                <Route path="/dashboard" element={<Dashboard />} />
                
                {/* ✅ Routes protégées par rôle */}
                <Route 
                    path="/admin" 
                    element={role === "ADMIN" ? <AdminDashboard /> : <Navigate to="/login" />} 
                />
                <Route 
                    path="/patient" 
                    element={role === "PATIENT" ? <PatientDashboard /> : <Navigate to="/login" />} 
                />
                <Route 
                    path="/medecin" 
                    element={role === "MEDECIN" ? <MedecinDashboard /> : <Navigate to="/login" />} 
                />
                <Route 
                    path="/secretaire" 
                    element={role === "SECRETAIRE" ? <SecretaireDashboard /> : <Navigate to="/login" />} 
                />
                
                {/* ✅ Route par défaut */}
                <Route path="*" element={<Navigate to={getDefaultRoute()} />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;