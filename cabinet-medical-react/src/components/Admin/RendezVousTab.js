import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaCalendarAlt, FaCheckCircle, FaTimesCircle, FaTrash, FaEdit, FaSearch, FaFilter } from "react-icons/fa";
import "./RendezVousTab.css";

const RendezVousTab = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [medecinFilter, setMedecinFilter] = useState("all");
  const [medecins, setMedecins] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedRdv, setSelectedRdv] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const API_BASE = "http://localhost:8087";
  const getAuthHeader = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });

  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Charger tous les profils (users)
      const profilesRes = await axios.get(`${API_BASE}/api/profiles`, { headers: getAuthHeader() });
      const allUsers = profilesRes.data;

      // 2. Créer des maps pour les patients et les médecins
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

      // 3. Charger tous les rendez-vous
      const rdvRes = await axios.get(`${API_BASE}/api/rendezvous`, { headers: getAuthHeader() });
      const rdvs = rdvRes.data;

      // 4. Enrichir les rendez-vous avec les noms
      const enrichedRdvs = rdvs.map(rdv => ({
        ...rdv,
        patientNom: patientsMap[rdv.patientId] || `Patient ${rdv.patientId} (non trouvé)`,
        medecinNom: medecinsMap[rdv.medecinId] || `Dr. ${rdv.medecinId} (non trouvé)`,
        dateTimeFormatted: new Date(rdv.dateTime).toLocaleString(),
        statusText: getStatusText(rdv.status)
      }));

      setAppointments(enrichedRdvs);
      setFilteredAppointments(enrichedRdvs);
    } catch (err) {
      console.error("Erreur chargement rendez-vous:", err);
      alert("Impossible de charger les rendez-vous");
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case "EN_ATTENTE": return "En attente";
      case "CONFIRME": return "Confirmé";
      case "TERMINE": return "Terminé";
      case "ANNULE": return "Annulé";
      default: return status;
    }
  };

  const getStatusClass = (status) => {
    switch(status) {
      case "EN_ATTENTE": return "badge yellow";
      case "CONFIRME": return "badge green";
      case "TERMINE": return "badge blue";
      case "ANNULE": return "badge red";
      default: return "badge";
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let filtered = [...appointments];
    if (searchTerm) {
      filtered = filtered.filter(rdv =>
        rdv.patientNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rdv.medecinNom.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (statusFilter !== "all") {
      filtered = filtered.filter(rdv => rdv.status === statusFilter);
    }
    if (medecinFilter !== "all") {
      filtered = filtered.filter(rdv => rdv.medecinId === parseInt(medecinFilter));
    }
    setFilteredAppointments(filtered);
  }, [searchTerm, statusFilter, medecinFilter, appointments]);

  const updateStatus = async (id, newStatus) => {
    setActionLoading(true);
    try {
      await axios.patch(`${API_BASE}/api/rendezvous/${id}/status`, null, {
        params: { status: newStatus },
        headers: getAuthHeader()
      });
      alert(`Rendez-vous ${newStatus === "CONFIRME" ? "confirmé" : "annulé"} ✅`);
      loadData();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la mise à jour");
    } finally {
      setActionLoading(false);
      setShowConfirmModal(false);
    }
  };

  const deleteAppointment = async (id) => {
    if (window.confirm("Supprimer définitivement ce rendez-vous ?")) {
      setActionLoading(true);
      try {
        await axios.delete(`${API_BASE}/api/rendezvous/${id}`, { headers: getAuthHeader() });
        alert("Rendez-vous supprimé ✅");
        loadData();
      } catch (err) {
        alert("Erreur lors de la suppression");
      } finally {
        setActionLoading(false);
      }
    }
  };

  const openConfirmModal = (rdv) => {
    setSelectedRdv(rdv);
    setShowConfirmModal(true);
  };

  if (loading) return <div className="loader">Chargement des rendez-vous...</div>;

  return (
    <div className="premium-patients-container">
      <div className="toolbar-premium">
        <div className="search-premium">
          <FaSearch />
          <input
            type="text"
            placeholder="Rechercher par patient ou médecin..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <FaFilter />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">Tous les statuts</option>
            <option value="EN_ATTENTE">En attente</option>
            <option value="CONFIRME">Confirmé</option>
            <option value="TERMINE">Terminé</option>
            <option value="ANNULE">Annulé</option>
          </select>
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
              <th>Date & heure</th>
              <th>Patient</th>
              <th>Médecin</th>
              <th>Motif</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map(rdv => (
              <tr key={rdv.id}>
                <td>{rdv.dateTimeFormatted}</td>
                <td><strong>{rdv.patientNom}</strong></td>
                <td>{rdv.medecinNom}</td>
                <td>{rdv.reason || rdv.motif || "—"}</td>
                <td><span className={getStatusClass(rdv.status)}>{rdv.statusText}</span></td>
                <td className="action-icons">
                  {rdv.status === "EN_ATTENTE" && (
                    <button className="icon-btn confirm" onClick={() => openConfirmModal(rdv)} title="Confirmer">
                      <FaCheckCircle />
                    </button>
                  )}
                  {rdv.status === "CONFIRME" && rdv.status !== "TERMINE" && (
                    <button className="icon-btn cancel" onClick={() => updateStatus(rdv.id, "ANNULE")} title="Annuler">
                      <FaTimesCircle />
                    </button>
                  )}
                  <button className="icon-btn delete" onClick={() => deleteAppointment(rdv.id)} title="Supprimer">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
            {filteredAppointments.length === 0 && (
              <tr><td colSpan="6" style={{ textAlign: "center" }}>Aucun rendez-vous trouvé</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de confirmation */}
      {showConfirmModal && selectedRdv && (
        <div className="modal-overlay" onClick={() => setShowConfirmModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Confirmer le rendez-vous</h3>
              <button onClick={() => setShowConfirmModal(false)}>✖</button>
            </div>
            <p>Patient: <strong>{selectedRdv.patientNom}</strong></p>
            <p>Médecin: <strong>{selectedRdv.medecinNom}</strong></p>
            <p>Date: <strong>{selectedRdv.dateTimeFormatted}</strong></p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowConfirmModal(false)}>Annuler</button>
              <button className="btn-confirm" onClick={() => updateStatus(selectedRdv.id, "CONFIRME")} disabled={actionLoading}>
                {actionLoading ? "Confirmation..." : "Confirmer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RendezVousTab;