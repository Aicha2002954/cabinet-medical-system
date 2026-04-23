import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTrash, FaSearch, FaTimes } from "react-icons/fa";
import "./SalleAttenteTab.css";

const SalleAttenteTab = () => {
  const [waitingList, setWaitingList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const loadWaitingList = () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem("salle_attente");
      if (stored) {
        const list = JSON.parse(stored);
        list.sort((a, b) => new Date(a.arrivalTime) - new Date(b.arrivalTime));
        setWaitingList(list);
      } else {
        setWaitingList([]);
      }
    } catch (err) {
      console.error("Erreur chargement salle d'attente:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWaitingList();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      setFilteredList(waitingList.filter(p =>
        p.patientName.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    } else {
      setFilteredList(waitingList);
    }
  }, [searchTerm, waitingList]);

  const removeFromWaitingList = (id) => {
    const updated = waitingList.filter(w => w.id !== id);
    setWaitingList(updated);
    localStorage.setItem("salle_attente", JSON.stringify(updated));
    loadWaitingList();
    alert("✅ Patient retiré de la salle d'attente");
  };

  const confirmRemove = (patient) => {
    setSelectedPatient(patient);
    setShowConfirmModal(true);
  };

  if (loading) return <div className="loader">Chargement de la salle d'attente...</div>;

  return (
    <div className="premium-patients-container">
      <div className="toolbar-premium">
        <div className="search-premium">
          <FaSearch />
          <input
            type="text"
            placeholder="Rechercher un patient..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="luxury-table-wrapper">
        <table className="luxury-table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Heure d'arrivée</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredList.map(patient => (
              <tr key={patient.id}>
                <td><strong>{patient.patientName}</strong></td>
                <td>{new Date(patient.arrivalTime).toLocaleTimeString()}</td>
                <td className="action-icons">
                  <button className="icon-btn delete" onClick={() => confirmRemove(patient)} title="Retirer">
                    <FaTrash /> Retirer
                  </button>
                </td>
              </tr>
            ))}
            {filteredList.length === 0 && (
              <tr>
                <td colSpan="3" style={{ textAlign: "center" }}>Aucun patient en salle d'attente</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de confirmation */}
      {showConfirmModal && selectedPatient && (
        <div className="modal-overlay" onClick={() => setShowConfirmModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Retirer le patient</h3>
              <button onClick={() => setShowConfirmModal(false)}><FaTimes /></button>
            </div>
            <p>Voulez-vous retirer <strong>{selectedPatient.patientName}</strong> de la salle d'attente ?</p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowConfirmModal(false)}>Annuler</button>
              <button className="btn-confirm" onClick={() => { removeFromWaitingList(selectedPatient.id); setShowConfirmModal(false); }}>
           
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalleAttenteTab;