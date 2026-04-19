import React from "react";
import { 
  FaTachometerAlt, FaUserMd, FaCalendarAlt, 
  FaStethoscope, FaFileInvoice, FaUsers, 
  FaSignOutAlt, FaHeartbeat, FaUserSecret, 
  FaChair, FaHistory 
} from "react-icons/fa";

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: "dashboard", label: "Tableau de bord", icon: <FaTachometerAlt /> },
    { id: "patients", label: "Patients", icon: <FaUserMd /> },
    { id: "medecins", label: "Médecins", icon: <FaUserMd /> },  // يمكن استخدام أيقونة مختلفة
    { id: "secretaires", label: "Secrétaires", icon: <FaUserSecret /> },
    { id: "salleAttente", label: "Salle d'attente", icon: <FaChair /> },
    { id: "historiqueVisites", label: "Historique visites", icon: <FaHistory /> },
    { id: "rendezvous", label: "Rendez-vous", icon: <FaCalendarAlt /> },
    { id: "consultations", label: "Consultations", icon: <FaStethoscope /> },
    { id: "factures", label: "Factures", icon: <FaFileInvoice /> },
    { id: "users", label: "Utilisateurs", icon: <FaUsers /> },
  ];

  return (
    <aside className="sidebar-modern">
      <div className="sidebar-header">
        <div className="logo-modern">
          <FaHeartbeat className="logo-icon" />
          <span>MediCare</span>
        </div>
        <div className="logo-badge"></div>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map(item => (
          <div
            key={item.id}
            className={`nav-item ${activeTab === item.id ? "active" : ""}`}
            onClick={() => setActiveTab(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
            {activeTab === item.id && <span className="active-indicator" />}
          </div>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="nav-item logout">
          <span className="nav-icon"><FaSignOutAlt /></span>
          <span className="nav-label">Déconnexion</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;