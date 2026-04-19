import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from "../hedare/Sidebar";
import TopHeader from "../hedare/TopHeader";
import "./UserProfile.css";
import {
    FaUserCircle, FaEnvelope, FaArrowLeft,
    FaPhone, FaMapMarkerAlt, FaIdCard, FaUserEdit
} from 'react-icons/fa';

const UserProfile = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("profile");

    const GATEWAY_URL = "http://localhost:8087";
    const API_URL = `${GATEWAY_URL}/api/profiles`;
    const IMAGE_BASE_URL = `${GATEWAY_URL}/api/profiles/uploads`;

    const handleBack = () => {
        const role = userData?.role || "PATIENT";
        switch (role) {
            case "ADMIN": navigate('/admin'); break;
            case "MEDECIN": navigate('/medecin'); break;
            case "SECRETAIRE": navigate('/secretaire'); break;
            case "PATIENT": default: navigate('/patient'); break;
        }
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return navigate('/login');
                const payload = JSON.parse(atob(token.split('.')[1]));
                const userId = payload.userId;
                const response = await axios.get(`${API_URL}/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUserData(response.data);
            } catch (error) {
                console.error("Erreur chargement profil:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [navigate]);

    if (loading) return <div className="loading-screen">Chargement du profil...</div>;
    if (!userData) return <div className="error-screen">Impossible de charger le profil.</div>;

    const userRole = userData.role || "PATIENT";

    return (
        <div className="admin-container" onClick={() => setIsMenuOpen(false)}>
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} role={userRole} />

            <main className="main-content">
                <TopHeader activeTab="Mon Profil" isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} user={userData} />

                <section className="profile-page-wrapper">
                    <div className="profile-header-actions">
                        <button className="back-btn" onClick={handleBack}>
                            <FaArrowLeft /> Retour
                        </button>
                    </div>

                    <div className="profile-container">
                        <div className="profile-card-header">
                            <div className="profile-header-main">
                                <div className="avatar-section">
                                    {userData.profileImageUrl ? (
                                        <img
                                            src={`${IMAGE_BASE_URL}/${userData.profileImageUrl}`}
                                            alt="Profile"
                                            className="profile-avatar-img"
                                        />
                                    ) : (
                                        <FaUserCircle size={120} className="default-avatar-icon" />
                                    )}
                                </div>
                                <div className="user-primary-info">
                                    <h1>{userData.firstName} {userData.lastName}</h1>
                                    <span className="role-tag">{userRole}</span>
                                </div>
                            </div>
                        </div>

                        <div className="profile-info-grid">
                            <div className="info-item">
                                <div className="info-icon-box"><FaEnvelope /></div>
                                <div className="info-text"><label>Email</label><p>{userData.email}</p></div>
                            </div>
                            <div className="info-item">
                                <div className="info-icon-box"><FaPhone /></div>
                                <div className="info-text"><label>Téléphone</label><p>{userData.phone || "Non défini"}</p></div>
                            </div>
                            <div className="info-item">
                                <div className="info-icon-box"><FaIdCard /></div>
                                <div className="info-text"><label>CIN</label><p>{userData.cin || "Non défini"}</p></div>
                            </div>
                            <div className="info-item">
                                <div className="info-icon-box"><FaMapMarkerAlt /></div>
                                <div className="info-text"><label>Zone</label><p>{userData.zone || "Non défini"}</p></div>
                            </div>
                            <div className="info-item full-width">
                                <div className="info-icon-box"><FaMapMarkerAlt /></div>
                                <div className="info-text"><label>Adresse</label><p>{userData.address || "Non défini"}</p></div>
                            </div>
                        </div>

                        <div className="profile-footer-actions">
                            <button className="edit-profile-btn" onClick={() => navigate('/edit-profile', { state: { userData } })}>
                                <FaUserEdit /> Modifier mes informations
                            </button>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default UserProfile;