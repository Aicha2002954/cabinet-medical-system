import React from "react";
import { FaBars, FaMoon, FaSun, FaBell, FaUserCircle } from "react-icons/fa";

const TopHeader = ({ activeTab, isMenuOpen, setIsMenuOpen, darkMode, toggleTheme, user }) => {
  const getTitle = () => {
    switch(activeTab) {
      // Dashboard
      case "dashboard": return "Tableau de bord";
      
      // Gestion (Admin & Secrétaire)
      case "patients": return "Gestion des patients";
      case "medecins": return "Gestion des médecins";
      case "secretaires": return "Gestion des secrétaires";
      case "rendezvous": return "Gestion des rendez-vous";
      case "consultations": return "Gestion des consultations";
      case "factures": return "Gestion des factures";
      case "users": return "Gestion des utilisateurs";
      case "documents": return "Documents patients";
      
      // Espace Médecin
      case "salleAttente": return "Salle d'attente";
  
      case "consultation": return "Consultation médicale";
      case "dossierMedical": return "Dossier médical";
      
      // Espace Patient
      case "mesRendezVous": return "Mes rendez-vous";
      case "mesConsultations": return "Mes consultations";
      case "mesFactures": return "Mes factures";
      
      // Profile
      case "profile": return "Mon profil";
      
      default: return "Cabinet Médical";
    }
  };

  // Informations dynamiques de l'utilisateur
  const userName = user ? `${user.firstName} ${user.lastName}` : "Utilisateur";
  const userRole = user?.role === "MEDECIN" ? "Médecin" : 
                   user?.role === "SECRETAIRE" ? "Secrétaire" : 
                   user?.role === "PATIENT" ? "Patient" : 
                   user?.role === "ADMIN" ? "Administrateur" : "Invité";
  
  const avatarUrl = user?.profileImageUrl 
    ? `http://localhost:8087${user.profileImageUrl}` 
    : null;

  return (
    <header className="top-header-modern">
      <div className="header-left">
        <button className="menu-toggle-modern" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <FaBars />
        </button>
        <h2>{getTitle()}</h2>
      </div>
      <div className="header-right">
        <button className="icon-btn-modern">
          <FaBell />
          <span className="notification-badge">3</span>
        </button>
        <button className="icon-btn-modern theme-toggle" onClick={toggleTheme}>
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
        <div className="user-profile-modern">
          {avatarUrl ? (
            <img src={avatarUrl} alt="avatar" className="avatar" />
          ) : (
            <FaUserCircle className="avatar-icon" style={{ fontSize: "2rem", color: "var(--text-secondary)" }} />
          )}
          <div className="user-info">
            <span className="user-name">{userName}</span>
            <span className="user-role">{userRole}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopHeader;