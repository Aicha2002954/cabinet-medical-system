import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import "./EditProfile.css";
import { FaUserCircle, FaCamera, FaSave, FaArrowLeft } from "react-icons/fa";

const EditProfile = ({ onCancel, onSuccess }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { userData: initialUserData } = location.state || {};

    const GATEWAY_URL = "http://localhost:8087";
    const API_URL = `${GATEWAY_URL}/api/profiles`;
    const IMAGE_BASE_URL = `${GATEWAY_URL}/api/profiles/uploads`;

    const [formData, setFormData] = useState(initialUserData || {});
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(
        initialUserData?.profileImageUrl ? `${IMAGE_BASE_URL}/${initialUserData.profileImageUrl}` : null
    );
    const [userId, setUserId] = useState(null);
    const [loadingUser, setLoadingUser] = useState(!initialUserData);

    useEffect(() => {
        if (initialUserData) {
            setUserId(initialUserData.userId);
            return;
        }

        const fetchUserByEmail = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    navigate('/login');
                    return;
                }
                const payload = JSON.parse(atob(token.split('.')[1]));
                const userEmail = payload.email || payload.sub;
                const res = await axios.get(API_URL, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const currentUser = res.data.find(u => u.email === userEmail);
                if (currentUser) {
                    setFormData(currentUser);
                    setUserId(currentUser.userId);
                    if (currentUser.profileImageUrl) {
                        setPreviewUrl(`${IMAGE_BASE_URL}/${currentUser.profileImageUrl}`);
                    }
                } else {
                    alert("Utilisateur non trouvé");
                    onCancel();
                }
            } catch (err) {
                console.error(err);
                alert("Erreur lors du chargement du profil");
            } finally {
                setLoadingUser(false);
            }
        };

        fetchUserByEmail();
    }, [initialUserData, navigate, onCancel]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!userId) {
            alert("Erreur: identifiant utilisateur manquant.");
            return;
        }
        const formDataToSend = new FormData();
        formDataToSend.append("firstName", formData.firstName || "");
        formDataToSend.append("lastName", formData.lastName || "");
        formDataToSend.append("phone", formData.phone || "");
       
        formDataToSend.append("address", formData.address || "");
        if (selectedFile) {
            formDataToSend.append("file", selectedFile);
        }

        try {
            await axios.put(`${API_URL}/${userId}`, formDataToSend, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            alert("Profil mis à jour avec succès ! ✅");
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Erreur:", error);
            alert("Erreur lors de la modification.");
        }
    };

    if (loadingUser) return <div className="loading-screen">Chargement du formulaire...</div>;

    return (
        <div className="edit-profile-wrapper">
            <div className="edit-header">
                <button type="button" onClick={onCancel} className="btn-back">
                    <FaArrowLeft /> Retour
                </button>
                <h2>Modifier mes informations</h2>
            </div>

            <form className="edit-form-card" onSubmit={handleSave}>
              

                <div className="form-grid">
                    <div className="field-group">
                        <label>Prénom</label>
                        <input name="firstName" value={formData.firstName || ''} onChange={handleChange} />
                    </div>
                    <div className="field-group">
                        <label>Nom</label>
                        <input name="lastName" value={formData.lastName || ''} onChange={handleChange} />
                    </div>
                    <div className="field-group">
                        <label>Téléphone</label>
                        <input name="phone" value={formData.phone || ''} onChange={handleChange} />
                    </div>
                    
                    <div className="field-group full-width">
                        <label>Adresse</label>
                        <input name="address" value={formData.address || ''} onChange={handleChange} />
                    </div>
                </div>

                <button type="submit" className="btn-update-profile">
                    <FaSave /> Enregistrer les modifications
                </button>
            </form>
        </div>
    );
};

export default EditProfile;