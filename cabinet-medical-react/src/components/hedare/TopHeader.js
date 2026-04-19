import React from "react";
import { FaBars, FaMoon, FaSun, FaBell, FaUserCircle } from "react-icons/fa";

const TopHeader = ({ activeTab, isMenuOpen, setIsMenuOpen, darkMode, toggleTheme }) => {
  const getTitle = () => {
    switch(activeTab) {
      case "dashboard": return "Tableau de bord";
      case "patients": return "Gestion des patients";
      case "rendezvous": return "Gestion des rendez-vous";
      case "consultations": return "Gestion des consultations";
      case "factures": return "Gestion des factures";
      case "users": return "Gestion des utilisateurs";
      default: return "Cabinet Médical";
    }
  };

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
          <img 
            src="https://randomuser.me/api/portraits/men/32.jpg" 
            alt="Admin" 
            className="avatar"
          />
          <div className="user-info">
            <span className="user-name">Dr. Ahmed</span>
            <span className="user-role">Administrateur</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopHeader;