import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTrash, FaEye, FaEdit, FaSearch, FaFilter, FaTimes, FaSave, FaCheckCircle } from "react-icons/fa";
import "./FacturesTab.css";

const FacturesTab = () => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [editData, setEditData] = useState({ montant: "", statut: "" });
  const [actionLoading, setActionLoading] = useState(false);

  const API_BASE = "http://localhost:8087";
  const getAuthHeader = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });

  const loadData = async () => {
    setLoading(true);
    try {
      const profilesRes = await axios.get(`${API_BASE}/api/profiles`, { headers: getAuthHeader() });
      const allUsers = profilesRes.data;
      const patientsMap = {};
      allUsers.filter(u => u.role === "PATIENT").forEach(p => {
        patientsMap[p.userId] = `${p.firstName} ${p.lastName}`;
      });

      const factRes = await axios.get(`${API_BASE}/api/factures`, { headers: getAuthHeader() });
      const facts = factRes.data;

      const enrichedFacts = facts.map(fact => ({
        ...fact,
        patientNom: patientsMap[fact.patientId] || `Patient ${fact.patientId}`,
        dateFormatted: fact.dateFacture ? new Date(fact.dateFacture).toLocaleDateString() : (fact.date ? new Date(fact.date).toLocaleDateString() : "Date inconnue"),
        statusText: fact.statut === "PAYEE" ? "Payée" : fact.statut === "IMPAYEE" ? "Impayée" : fact.statut === "ANNULEE" ? "Annulée" : fact.statut || "Inconnu"
      }));

      setInvoices(enrichedFacts);
      setFilteredInvoices(enrichedFacts);
    } catch (err) {
      console.error("Erreur chargement factures:", err);
      alert("Impossible de charger les factures");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  useEffect(() => {
    let filtered = [...invoices];
    if (searchTerm) {
      filtered = filtered.filter(inv =>
        inv.patientNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.montant.toString().includes(searchTerm)
      );
    }
    if (statusFilter !== "all") {
      filtered = filtered.filter(inv => inv.statut === statusFilter);
    }
    setFilteredInvoices(filtered);
  }, [searchTerm, statusFilter, invoices]);

  const updateInvoiceStatus = async (id, newStatus) => {
    if (newStatus === "PAYEE" && window.confirm("Marquer cette facture comme payée ?")) {
      setActionLoading(true);
      try {
        await axios.patch(`${API_BASE}/api/factures/${id}/status`, null, {
          params: { status: newStatus },
          headers: getAuthHeader()
        });
        alert("Facture marquée payée ✅");
        loadData();
      } catch (err) {
        console.error(err);
        alert("Erreur lors de la mise à jour");
      } finally {
        setActionLoading(false);
      }
    }
  };

  const deleteInvoice = async (id) => {
    if (window.confirm("Supprimer définitivement cette facture ?")) {
      setActionLoading(true);
      try {
        await axios.delete(`${API_BASE}/api/factures/${id}`, { headers: getAuthHeader() });
        alert("Facture supprimée ✅");
        loadData();
      } catch (err) {
        alert("Erreur lors de la suppression");
      } finally {
        setActionLoading(false);
      }
    }
  };

  const openEditModal = (invoice) => {
    setSelectedInvoice(invoice);
    setEditData({ montant: invoice.montant, statut: invoice.statut });
    setShowEditModal(true);
  };

  const saveEdit = async () => {
    if (!selectedInvoice) return;
    setActionLoading(true);
    try {
      await axios.put(`${API_BASE}/api/factures/${selectedInvoice.id}`, {
        montant: editData.montant,
        statut: editData.statut
      }, { headers: getAuthHeader() });
      alert("Facture modifiée ✅");
      setShowEditModal(false);
      loadData();
    } catch (err) {
      alert("Erreur lors de la modification");
    } finally {
      setActionLoading(false);
    }
  };

  const viewDetails = (invoice) => {
    setSelectedInvoice(invoice);
    setShowDetailsModal(true);
  };

  if (loading) return <div className="loader">Chargement des factures...</div>;

  return (
    <div className="premium-patients-container">
      <div className="toolbar-premium">
        <div className="search-premium">
          <FaSearch />
          <input
            type="text"
            placeholder="Rechercher par patient ou montant..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <FaFilter />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">Tous les statuts</option>
            <option value="PAYEE">Payée</option>
            <option value="IMPAYEE">Impayée</option>
            <option value="ANNULEE">Annulée</option>
          </select>
        </div>
      </div>

      <div className="luxury-table-wrapper">
        <table className="luxury-table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Date</th>
              <th>Montant</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.map(inv => (
              <tr key={inv.id}>
                <td><strong>{inv.patientNom}</strong></td>
                <td>{inv.dateFormatted}</td>
                <td>{inv.montant} DH</td>
                <td>
                  <span className={`badge ${inv.statut === "PAYEE" ? "green" : inv.statut === "IMPAYEE" ? "red" : "yellow"}`}>
                    {inv.statusText}
                  </span>
                </td>
                <td className="action-icons">
                  <button className="icon-btn view" onClick={() => viewDetails(inv)} title="Détails">
                    <FaEye />
                  </button>
                  <button className="icon-btn edit" onClick={() => openEditModal(inv)} title="Modifier">
                    <FaEdit />
                  </button>
                  {inv.statut !== "PAYEE" && (
                    <button className="icon-btn pay" onClick={() => updateInvoiceStatus(inv.id, "PAYEE")} title="Marquer payée">
                      <FaCheckCircle /> Payée
                    </button>
                  )}
                  <button className="icon-btn delete" onClick={() => deleteInvoice(inv.id)} title="Supprimer">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
            {filteredInvoices.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>Aucune facture trouvée</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Détails */}
      {showDetailsModal && selectedInvoice && (
        <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Détails de la facture</h3>
              <button onClick={() => setShowDetailsModal(false)}><FaTimes /></button>
            </div>
            <div className="details-body">
              <p><strong>Patient :</strong> {selectedInvoice.patientNom}</p>
              <p><strong>ID Patient :</strong> {selectedInvoice.patientId}</p>
              <p><strong>Date :</strong> {selectedInvoice.dateFormatted}</p>
              <p><strong>Montant :</strong> {selectedInvoice.montant} DH</p>
              <p><strong>Statut :</strong> {selectedInvoice.statusText}</p>
              <p><strong>Description :</strong> {selectedInvoice.description || "—"}</p>
            </div>
          </div>
        </div>
      )}

      {/* Modal Édition */}
      {showEditModal && selectedInvoice && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Modifier la facture</h3>
              <button onClick={() => setShowEditModal(false)}><FaTimes /></button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); saveEdit(); }}>
              <div className="form-grid">
                <label>Patient (non modifiable)</label>
                <input type="text" value={selectedInvoice.patientNom} disabled />
                <label>Montant (DH)</label>
                <input type="number" value={editData.montant} onChange={(e) => setEditData({...editData, montant: e.target.value})} required />
                <label>Statut</label>
                <select value={editData.statut} onChange={(e) => setEditData({...editData, statut: e.target.value})}>
                  <option value="IMPAYEE">Impayée</option>
                  <option value="PAYEE">Payée</option>
                  <option value="ANNULEE">Annulée</option>
                </select>
              </div>
              <button type="submit" className="save-changes-btn" disabled={actionLoading}>
                {actionLoading ? "Enregistrement..." : <><FaSave /> Enregistrer</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacturesTab;