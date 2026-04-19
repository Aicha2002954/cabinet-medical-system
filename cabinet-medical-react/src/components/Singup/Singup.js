import React, { useState } from "react";
import "./SignUp.css";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { FaUser, FaEnvelope, FaLock, FaPhone, FaCity, FaStethoscope } from "react-icons/fa";

const Signup = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        city: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "PATIENT"
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Les mots de passe ne correspondent pas");
            return;
        }
        try {
            await api.post("/api/profiles", {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password,
                phone: formData.phone,
                address: formData.city,
                role: formData.role
            });
            alert("Compte créé avec succès. Veuillez vous connecter.");
            navigate("/login");
        } catch (err) {
            console.error(err);
            alert("Erreur lors de l'inscription");
        }
    };

    return (
        <div className="signup-container">
            {/* Navbar identique à Login */}
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
                        <button onClick={() => navigate("/login")} className="login-nav-btn">
                            Connexion
                        </button>
                    </div>
                </div>
            </nav>

            <div className="signup-wrapper">
                <div className="signup-card">
                    <h2>Créer un compte 👤</h2>
                    <p>Inscrivez-vous pour accéder à la plateforme médicale.</p>

                    <form onSubmit={handleSubmit} className="signup-form">
                        {/* سطر: الاسم الأول + الاسم الأخير */}
                        <div className="input-row">
                            <div className="input-group">
                                <FaUser className="icon" />
                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="Prénom"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <FaUser className="icon" />
                                <input
                                    type="text"
                                    name="lastName"
                                    placeholder="Nom"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* سطر: الهاتف + المدينة */}
                        <div className="input-row">
                            <div className="input-group">
                                <FaPhone className="icon" />
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="Téléphone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="input-group">
                                <FaCity className="icon" />
                                <input
                                    type="text"
                                    name="city"
                                    placeholder="Ville"
                                    value={formData.city}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* حقل البريد الإلكتروني (كامل العرض) */}
                        <div className="input-group">
                            <FaEnvelope className="icon" />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email professionnel"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* سطر: كلمة المرور + تأكيد كلمة المرور */}
                        <div className="input-row">
                            <div className="input-group">
                                <FaLock className="icon" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Mot de passe"
                                    value={formData.password}
                                    onChange={handleChange}
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
                            <div className="input-group">
                                <FaLock className="icon" />
                                <input
                                    type={showConfirm ? "text" : "password"}
                                    name="confirmPassword"
                                    placeholder="Confirmer"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                                <button
                                    type="button"
                                    className="show-btn"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                >
                                    {showConfirm ? "🙈" : "👁️"}
                                </button>
                            </div>
                        </div>

                        {/* قائمة الدور (كامل العرض) */}
                        <div className="input-group select-group">
                            <select name="role" value={formData.role} onChange={handleChange}>
                                <option value="PATIENT">Patient</option>
                                <option value="MEDECIN">Médecin</option>
                                <option value="SECRETAIRE">Secrétaire</option>
                            </select>
                        </div>

                        <button type="submit" className="signup-btn">S’inscrire</button>

                        <div className="login-redirect">
                            <p>Déjà un compte ?</p>
                            <button onClick={() => navigate("/login")} className="login-link-btn">
                                Connectez-vous
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;