import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTrash, FaEye, FaSearch, FaFilter, FaTimes } from "react-icons/fa";
import "./ConsultationsTab.css";

const ConsultationsTab = () => {
  const [consultations, setConsultations] = useState([]);
  const [filteredConsultations, setFilteredConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [medecinFilter, setMedecinFilter] = useState("all");
  const [medecins, setMedecins] = useState([]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const API_BASE = "http://localhost:8087";
  const getAuthHeader = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });

  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Charger tous les profils (patients + médecins)
      const profilesRes = await axios.get(`${API_BASE}/api/profiles`, { headers: getAuthHeader() });
      const allUsers = profilesRes.data;

      const patientsMap = {};
      const medecinsMap = {};
      const medecinsList = [];

      allUsers.forEach(user => {
        if (user.role === "PATIENT") {
          patientsMap[user.userId] = `${user.firstName} ${user.lastName}`;
        } else if (user.role === "MEDECIN") {
          const fullName = `Dr. ${user.firstName} ${user.lastName}`;
          medecinsMap[user.userId] = fullName;
          medecinsList.push({ userId: user.userId, fullName });
        }
      });
      setMedecins(medecinsList);

      // 2. Charger toutes les consultations
      const consRes = await axios.get(`${API_BASE}/api/consultations`, { headers: getAuthHeader() });
      const cons = consRes.data;

      // 3. Enrichir les consultations avec les noms
      const enrichedCons = cons.map(cons => ({
        ...cons,
        patientNom: patientsMap[cons.patientId] || `Patient ${cons.patientId}`,
        medecinNom: medecinsMap[cons.medecinId] || `Médecin ${cons.medecinId}`,
        dateFormatted: new Date(cons.consultationDate || cons.dateTime).toLocaleString(),
        statusText: cons.status === "PLANIFIEE" ? "Planifiée" :
                    cons.status === "EN_COURS" ? "En cours" :
                    cons.status === "TERMINEE" ? "Terminée" :
                    cons.status === "ANNULEE" ? "Annulée" : "—"
      }));

      setConsultations(enrichedCons);
      setFilteredConsultations(enrichedCons);
    } catch (err) {
      console.error("Erreur chargement consultations:", err);
      alert("Impossible de charger les consultations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let filtered = [...consultations];
    if (searchTerm) {
      filtered = filtered.filter(cons =>
        cons.patientNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cons.medecinNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cons.diagnostic?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (medecinFilter !== "all") {
      filtered = filtered.filter(cons => cons.medecinId === parseInt(medecinFilter));
    }
    setFilteredConsultations(filtered);
  }, [searchTerm, medecinFilter, consultations]);

  const deleteConsultation = async (id) => {
    if (window.confirm("Supprimer définitivement cette consultation ?")) {
      setActionLoading(true);
      try {
        await axios.delete(`${API_BASE}/api/consultations/${id}`, { headers: getAuthHeader() });
        alert("Consultation supprimée ✅");
        loadData();
      } catch (err) {
        alert("Erreur lors de la suppression");
      } finally {
        setActionLoading(false);
      }
    }
  };

  const viewDetails = (cons) => {
    setSelectedConsultation(cons);
    setShowDetailsModal(true);
  };

  if (loading) return <div className="loader">Chargement des consultations...</div>;

  return (
    <div className="premium-patients-container">
      <div className="toolbar-premium">
        <div className="search-premium">
          <FaSearch />
          <input
            type="text"
            placeholder="Rechercher par patient, médecin ou diagnostic..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <FaFilter />
          <select value={medecinFilter} onChange={(e) => setMedecinFilter(e.target.value)}>
            <option value="all">Tous les médecins</option>
            {medecins.map(m => (
              <option key={m.userId} value={m.userId}>{m.fullName}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="luxury-table-wrapper">
        <table className="luxury-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Patient</th>
              <th>Médecin</th>
              <th>Diagnostic</th>
              <th>Traitement</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredConsultations.map(cons => (
              <tr key={cons.id}>
                <td>{cons.dateFormatted}</td>
                <td><strong>{cons.patientNom}</strong></td>
                <td>{cons.medecinNom}</td>
                <td>{cons.diagnostic || "—"}</td>
                <td>{cons.prescription || cons.traitement || "—"}</td>
                <td><span className={`badge ${cons.status === "TERMINEE" ? "green" : cons.status === "EN_COURS" ? "yellow" : "blue"}`}>
                  {cons.statusText}
                </span></td>
                <td className="action-icons">
                  <button className="icon-btn view" onClick={() => viewDetails(cons)} title="Détails">
                    <FaEye />
                  </button>
                  <button className="icon-btn delete" onClick={() => deleteConsultation(cons.id)} title="Supprimer">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
            {filteredConsultations.length === 0 && <tr><td colSpan="7" style={{ textAlign: "center" }}>Aucune consultation trouvée</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Modal des détails */}
      {showDetailsModal && selectedConsultation && (
        <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Détails de la consultation</h3>
              <button onClick={() => setShowDetailsModal(false)}><FaTimes /></button>
            </div>
            <div className="details-body">
              <p><strong>Patient :</strong> {selectedConsultation.patientNom}</p>
              <p><strong>Médecin :</strong> {selectedConsultation.medecinNom}</p>
              <p><strong>Date :</strong> {selectedConsultation.dateFormatted}</p>
              <p><strong>Diagnostic :</strong> {selectedConsultation.diagnostic || "—"}</p>
              <p><strong>Traitement / Prescription :</strong> {selectedConsultation.prescription || selectedConsultation.traitement || "—"}</p>
              <p><strong>Notes :</strong> {selectedConsultation.notes || "—"}</p>
              <p><strong>Statut :</strong> {selectedConsultation.statusText}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultationsTab;