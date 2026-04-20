import React from "react";
import { FaUser, FaClock } from "react-icons/fa";

const SalleAttenteTab = () => {
  return (
    <div className="management-section">
      <h2>Salle d'attente</h2>
      <div className="stats-premium-row">
        <div className="stat-premium-card"><FaUser /> <span>0</span> <label>En attente</label></div>
        <div className="stat-premium-card"><FaClock /> <span>0 min</span> <label>Temps moyen</label></div>
      </div>
      <div className="luxury-table-wrapper">
        <table className="luxury-table">
          <thead><tr><th>Patient</th><th>Heure d'arrivée</th><th>Statut</th><th>Action</th></tr></thead>
          <tbody><tr><td colSpan="4" style={{textAlign:"center"}}>Aucun patient en salle d'attente</td></tr></tbody>
        </table>
      </div>
    </div>
  );
};

export default SalleAttenteTab;