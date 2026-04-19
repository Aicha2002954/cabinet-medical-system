// src/components/ProtectedRoute.js
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // npm install jwt-decode

const ProtectedRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem("token");
    if (!token) return <Navigate to="/login" replace />;

    try {
        const decoded = jwtDecode(token);
        const userRoles = decoded.roles || decoded.authorities || [];
        const hasRequiredRole = allowedRoles.some(role => userRoles.includes(role));
        if (!hasRequiredRole) return <Navigate to="/" replace />;
        return children;
    } catch (error) {
        localStorage.removeItem("token");
        return <Navigate to="/login" replace />;
    }
};

export default ProtectedRoute;