import React from "react";
import { FaBars, FaMoon, FaSun, FaBell, FaUserCircle } from "react-icons/fa";

const TopHeader = ({ activeTab, isMenuOpen, setIsMenuOpen, darkMode, toggleTheme, user }) => {
  const getTitle = () => {
    switch(activeTab) {
      case "dashboard": return "Tableau de bord";
      case "patients": return "Gestion des patients";
      case "medecins": return "Gestion des médecins";
      case "secretaires": return "Gestion des secrétaires";
      case "salleAttente": return "Salle d'attente";
      case "historiqueVisites": return "Historique des visites";
      case "rendezvous": return "Gestion des rendez-vous";
      case "consultations": return "Gestion des consultations";
      case "factures": return "Gestion des factures";
      case "users": return "Gestion des utilisateurs";
      case "profile": return "Mon profil";
      default: return "Cabinet Médical";
    }
  };

  // Informations dynamiques de l'utilisateur
  const userName = user ? `${user.firstName} ${user.lastName}` : "Admin";
  const userRole = user?.role || "Invité";
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