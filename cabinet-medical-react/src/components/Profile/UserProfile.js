import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./UserProfile.css";
import {
    FaUserCircle, FaEnvelope, FaArrowLeft,
    FaPhone, FaMapMarkerAlt, FaIdCard, FaUserEdit
} from 'react-icons/fa';

const UserProfile = ({ onEdit }) => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

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
        <div className="profile-view-wrapper">
            <div className="profile-view-header">
                <button className="back-btn" onClick={handleBack}>
                    <FaArrowLeft /> Retour
                </button>
                <h2>Mon profil</h2>
            </div>

            <div className="profile-view-card">
                <div className="profile-view-avatar">
                    {userData.profileImageUrl ? (
                        <img
                            src={`${IMAGE_BASE_URL}/${userData.profileImageUrl}`}
                            alt="avatar"
                            className="avatar-preview"
                        />
                    ) : (
                        <FaUserCircle size={100} className="default-avatar" />
                    )}
                </div>

                <div className="profile-view-info">
                    <div className="info-row">
                        <div className="info-label">Nom complet</div>
                        <div className="info-value">{userData.firstName} {userData.lastName}</div>
                    </div>
                    <div className="info-row">
                        <div className="info-label">Email</div>
                        <div className="info-value">{userData.email}</div>
                    </div>
                    <div className="info-row">
                        <div className="info-label">Téléphone</div>
                        <div className="info-value">{userData.phone || "Non renseigné"}</div>
                    </div>
                    <div className="info-row">
                        <div className="info-label">CIN</div>
                        <div className="info-value">{userData.cin || "Non renseigné"}</div>
                    </div>
                    <div className="info-row">
                        <div className="info-label">Zone</div>
                        <div className="info-value">{userData.zone || "Non renseignée"}</div>
                    </div>
                    <div className="info-row">
                        <div className="info-label">Adresse</div>
                        <div className="info-value">{userData.address || "Non renseignée"}</div>
                    </div>
                    <div className="info-row">
                        <div className="info-label">Rôle</div>
                        <div className="info-value role-badge">{userRole}</div>
                    </div>
                </div>

                <div className="profile-view-actions">
                    <button className="edit-btn" onClick={onEdit}>
                        <FaUserEdit /> Modifier mes informations
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;