import React from "react";
import { 
  FaTachometerAlt, FaUserMd, FaCalendarAlt, 
  FaStethoscope, FaFileInvoice, FaUsers, 
  FaSignOutAlt, FaHeartbeat, FaUserSecret, 
  FaChair, FaHistory, FaUserCircle, FaFileAlt,
  FaPrescription, FaCertificate, FaClipboardList
} from "react-icons/fa";

const Sidebar = ({ activeTab, setActiveTab, role }) => {
  // تحديد قائمة العناصر حسب الدور
  const getMenuItems = () => {
    switch(role) {
      case "PATIENT":
        return [
          { id: "dashboard", label: "Tableau de bord", icon: <FaTachometerAlt /> },
          { id: "appointments", label: "Mes rendez-vous", icon: <FaCalendarAlt /> },
          { id: "consultations", label: "Mes consultations", icon: <FaStethoscope /> },
          { id: "invoices", label: "Mes factures", icon: <FaFileInvoice /> },
          { id: "profile", label: "Mon profil", icon: <FaUserCircle /> }
        ];
      case "MEDECIN":
        return [
          { id: "dashboard", label: "Tableau de bord", icon: <FaTachometerAlt /> },
          { id: "consultations", label: "Consultations", icon: <FaStethoscope /> },
      
          { id: "documents", label: "Documents médicaux", icon: <FaFileAlt /> },
          { id: "appointments", label: "Mes rendez-vous", icon: <FaCalendarAlt /> },
          { id: "profile", label: "Mon profil", icon: <FaUserCircle /> }
        ];
      case "SECRETAIRE":
        return [
          { id: "dashboard", label: "Tableau de bord", icon: <FaTachometerAlt /> },
          { id: "appointments", label: "Gestion des rendez-vous", icon: <FaCalendarAlt /> },
          { id: "patients", label: "Patients", icon: <FaUsers /> },
          { id: "invoices", label: "Factures", icon: <FaFileInvoice /> },
          { id: "profile", label: "Mon profil", icon: <FaUserCircle /> }
        ];
      default: // ADMIN – affiche tous les éléments
        return [
          { id: "dashboard", label: "Tableau de bord", icon: <FaTachometerAlt /> },
          { id: "patients", label: "Patients", icon: <FaUserMd /> },
          { id: "medecins", label: "Médecins", icon: <FaUserMd /> },
          { id: "secretaires", label: "Secrétaires", icon: <FaUserSecret /> },
      
          { id: "rendezvous", label: "Rendez-vous", icon: <FaCalendarAlt /> },
          { id: "consultations", label: "Consultations", icon: <FaStethoscope /> },
          { id: "factures", label: "Factures", icon: <FaFileInvoice /> },
          { id: "users", label: "Utilisateurs", icon: <FaUsers /> },
       
          { id: "profile", label: "Mon profil", icon: <FaUserCircle /> }
        ];
    }
  };

  const menuItems = getMenuItems();
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <aside className="sidebar-modern">
      <div className="sidebar-header">
        <div className="logo-modern">
         <FaStethoscope className="logo-icon" />
          <span>MediCare</span>
        </div>
        <div className="logo-badge">
          {role === "ADMIN" ? "Admin" : role === "MEDECIN" ? "Médecin" : role === "SECRETAIRE" ? "Secrétaire" : role === "PATIENT" ? "Patient" : role}
        </div>
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
        <div className="nav-item logout" onClick={handleLogout}>
          <span className="nav-icon"><FaSignOutAlt /></span>
          <span className="nav-label">Déconnexion</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;