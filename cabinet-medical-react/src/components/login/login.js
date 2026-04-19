import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./login.css";
import { FaUser, FaLock, FaStethoscope } from "react-icons/fa";

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await api.post("/v1/users/login", { email, password });
            const { accessToken } = res.data;
            localStorage.setItem("token", accessToken);
            const payload = JSON.parse(atob(accessToken.split(".")[1]));
            const userRoles = payload.roles || payload.authorities || [];
            if (userRoles.includes("ADMIN")) navigate("/admin");
            else if (userRoles.includes("MEDECIN")) navigate("/medecin");
            else if (userRoles.includes("SECRETAIRE")) navigate("/secretaire");
            else navigate("/patient");
        } catch (err) {
            console.error(err);
            setError("Email ou mot de passe incorrect");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            {/* Navbar médicale avec lien inscription */}
            <nav className="navbar">
                <div className="nav-container">
                    <div className="logo-area">
                        <FaStethoscope className="logo-icon" />
                        <span className="logo-text">MediCare</span>
                    </div>
                    <div className="nav-links">
                        <a href="/">Accueil</a>
                        <a href="#services">Services</a>
                        <a href="#contact">Contact</a>
                        <button onClick={() => navigate("/signup")} className="signup-nav-btn">
                            Inscription
                        </button>
                    </div>
                </div>
            </nav>

            {/* Formulaire uniquement, centré */}
            <div className="login-wrapper-solo">
                <div className="login-card-solo">
                    <div className="login-form-solo">
                        <h2>Connexion</h2>
                        <p>Connectez-vous à votre espace médical</p>

                        <form onSubmit={handleLogin}>
                            <div className="input-group">
                                <FaUser className="icon" />
                                <input
                                    type="email"
                                    placeholder="Email professionnel"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <FaLock className="icon" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Mot de passe"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="show-btn"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? "🙈" : "👁️"}
                                </button>
                            </div>

                            {error && <div className="error-message">{error}</div>}

                            <button type="submit" className="login-btn" disabled={loading}>
                                {loading ? "Connexion..." : "Se connecter"}
                            </button>

                            <div className="signup-link">
                                <p>Pas encore de compte ?</p>
                                <button onClick={() => navigate("/signup")} className="signup-link-btn">
                                    Créer un compte
                                </button>
                            </div>

                            <a href="/forgot-password" className="forgot-link">
                                Mot de passe oublié ?
                            </a>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;