import React from "react";
import { FaCalendarAlt } from "react-icons/fa";

const HistoriqueVisitesTab = () => {
  return (
    <div className="management-section">
      <h2>Historique des visites</h2>
      <div className="luxury-table-wrapper">
        <table className="luxury-table">
          <thead><tr><th>Date</th><th>Patient</th><th>Médecin</th><th>Diagnostic</th></tr></thead>
          <tbody><tr><td colSpan="4" style={{textAlign:"center"}}>Aucune visite enregistrée</td></tr></tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoriqueVisitesTab;