import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../hedare/Sidebar";
import TopHeader from "../hedare/TopHeader";
import UserProfile from "../Profile/UserProfile";
import EditProfile from "../Profile/EditProfile";
import {
  FaCalendarAlt, FaUsers, FaFileInvoice, FaClock,
  FaUserPlus, FaTrash, FaEdit, FaSearch, FaPrint, FaPlus, FaTimes, FaCheckCircle
} from "react-icons/fa";
import "./SecretaireDashboard.css";

const SecretaireDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [darkMode, setDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [medecins, setMedecins] = useState([]);
  const [waitingList, setWaitingList] = useState([]);
  const [loading, setLoading] = useState(true);
  // تم حذف recentDocs

  // États pour les modals
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [showEditPatientModal, setShowEditPatientModal] = useState(false);
  const [currentPatient, setCurrentPatient] = useState(null);
  const [newPatient, setNewPatient] = useState({ firstName: "", lastName: "", email: "", phone: "", address: "", city: "" });
  const [editPatientData, setEditPatientData] = useState({ firstName: "", lastName: "", email: "", phone: "", address: "", city: "" });
  const [submitting, setSubmitting] = useState(false);

  const [showAddAppointmentModal, setShowAddAppointmentModal] = useState(false);
  const [newAppointment, setNewAppointment] = useState({ patientId: "", medecinId: "", dateTime: "", motif: "" });
  
  // États pour modification rendez-vous
  const [showEditAppointmentModal, setShowEditAppointmentModal] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [editAppointmentData, setEditAppointmentData] = useState({ patientId: "", medecinId: "", dateTime: "", motif: "" });

  const [showAddInvoiceModal, setShowAddInvoiceModal] = useState(false);
  const [showEditInvoiceModal, setShowEditInvoiceModal] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState(null);
  const [newInvoice, setNewInvoice] = useState({ patientId: "", montant: "", description: "" });
  const [editInvoiceData, setEditInvoiceData] = useState({ montant: "", statut: "" });

  // تم حذف جميع حالات المستندات:
  // searchPatientDoc, patientDocs, showDocsModal, selectedPatientDoc, showAddDocModal, newDocType, newDocContent

  const API_BASE = "http://localhost:8087";
  const getAuthHeader = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });
  const hasLoaded = useRef(false);

  // ------------------------------------------------------------------
  // 1. Chargement des données
  // ------------------------------------------------------------------
  const loadAllData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) { navigate("/login"); return; }
      const payload = JSON.parse(atob(token.split(".")[1]));
      const userEmail = payload.email || payload.sub;
      const profilesRes = await axios.get(`${API_BASE}/api/profiles`, { headers: getAuthHeader() });
      const currentUser = profilesRes.data.find(u => u.email === userEmail);
      if (!currentUser) { navigate("/login"); return; }
      setUser(currentUser);

      const allUsers = profilesRes.data;
      const patientsData = allUsers.filter(u => u.role === "PATIENT");
      const medecinsData = allUsers.filter(u => u.role === "MEDECIN");

      const [invoicesRes, rdvsRes] = await Promise.all([
        axios.get(`${API_BASE}/api/factures`, { headers: getAuthHeader() }),
        axios.get(`${API_BASE}/api/rendezvous`, { headers: getAuthHeader() })
      ]);

      const invoicesData = invoicesRes.data;
      const rdvsData = rdvsRes.data;

      const patientsMap = {};
      patientsData.forEach(p => { patientsMap[p.userId] = `${p.firstName} ${p.lastName}`; });
      const medecinsMap = {};
      medecinsData.forEach(m => { medecinsMap[m.userId] = `Dr. ${m.firstName} ${m.lastName}`; });

      const enrichedRdvs = rdvsData.map(rdv => ({
        ...rdv,
        patientNom: patientsMap[rdv.patientId] || `Patient ${rdv.patientId}`,
        medecinNom: medecinsMap[rdv.medecinId] || `Dr. ${rdv.medecinId}`,
        motif: rdv.reason || rdv.motif || ""
      }));

      const enrichedInvoices = invoicesData.map(inv => ({
        ...inv,
        patientNom: patientsMap[inv.patientId] || `Patient ${inv.patientId}`
      }));

      setPatients(patientsData);
      setMedecins(medecinsData);
      setInvoices(enrichedInvoices);
      setAppointments(enrichedRdvs);

      const stored = localStorage.getItem("salle_attente");
      setWaitingList(stored ? JSON.parse(stored) : []);

      // تم حذف تحميل المستندات من localStorage

    } catch (err) {
      console.error(err);
      alert("Erreur lors du chargement des données.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasLoaded.current) return;
    hasLoaded.current = true;
    loadAllData();
  }, []);

  // ------------------------------------------------------------------
  // 2. Gestion des patients
  // ------------------------------------------------------------------
  const handleAddPatient = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const profilePayload = { ...newPatient, role: "PATIENT", password: "default123", confirmPassword: "default123" };
      const profileRes = await axios.post(`${API_BASE}/api/profiles`, profilePayload, {
        headers: { ...getAuthHeader(), 'Content-Type': 'application/json' }
      });
      const newUserId = profileRes.data.userId;

      try {
        const patientPayload = {
          id: newUserId,
          firstName: newPatient.firstName,
          lastName: newPatient.lastName,
          email: newPatient.email,
          phone: newPatient.phone,
          address: newPatient.address,
          city: newPatient.city
        };
        await axios.post(`${API_BASE}/api/patients`, patientPayload, { headers: getAuthHeader() });
      } catch (patientErr) {
        console.warn("Erreur création patient-service:", patientErr.response?.data);
      }

      alert("Patient ajouté avec succès ✅");
      setShowAddPatientModal(false);
      setNewPatient({ firstName: "", lastName: "", email: "", phone: "", address: "", city: "" });
      loadAllData();
    } catch (err) {
      console.error(err);
      alert("Erreur: " + (err.response?.data?.message || "Vérifiez les champs"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditPatient = (patient) => {
    setCurrentPatient(patient);
    setEditPatientData({
      firstName: patient.firstName,
      lastName: patient.lastName,
      email: patient.email,
      phone: patient.phone || "",
      address: patient.address || "",
      city: patient.zone || patient.city || ""
    });
    setShowEditPatientModal(true);
  };

  const handleUpdatePatient = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("firstName", editPatientData.firstName);
      formData.append("lastName", editPatientData.lastName);
      formData.append("email", editPatientData.email);
      formData.append("phone", editPatientData.phone);
      formData.append("address", editPatientData.address);
      formData.append("zone", editPatientData.city);
      await axios.put(`${API_BASE}/api/profiles/${currentPatient.userId}`, formData, { headers: getAuthHeader() });
      
      try {
        await axios.put(`${API_BASE}/api/patients/${currentPatient.userId}`, editPatientData, { headers: getAuthHeader() });
      } catch (err) { }
      
      alert("Patient modifié ✅");
      setShowEditPatientModal(false);
      loadAllData();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la modification");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePatient = async (userId) => {
    if (window.confirm("Supprimer définitivement ce patient ?")) {
      try {
        await axios.delete(`${API_BASE}/api/profiles/${userId}`, { headers: getAuthHeader() });
        await axios.delete(`${API_BASE}/api/patients/${userId}`, { headers: getAuthHeader() }).catch(() => {});
        alert("Patient supprimé ✅");
        loadAllData();
      } catch (err) {
        alert("Erreur lors de la suppression");
      }
    }
  };

  // ------------------------------------------------------------------
  // 3. Gestion des rendez-vous (avec modification)
  // ------------------------------------------------------------------
  const handleDeleteAppointment = async (id) => {
    if (window.confirm("Supprimer ce rendez-vous ?")) {
      try {
        await axios.delete(`${API_BASE}/api/rendezvous/${id}`, { headers: getAuthHeader() });
        loadAllData();
      } catch (err) {
        alert("Erreur lors de la suppression");
      }
    }
  };

  const handleAddAppointment = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const patientId = parseInt(newAppointment.patientId, 10);
      const patientFromProfiles = patients.find(p => p.userId === patientId);
      if (!patientFromProfiles) {
        alert("Patient introuvable dans le système.");
        setSubmitting(false);
        return;
      }
      await axios.post(`${API_BASE}/api/rendezvous`, newAppointment, { headers: getAuthHeader() });
      alert("Rendez-vous ajouté ✅");
      setShowAddAppointmentModal(false);
      setNewAppointment({ patientId: "", medecinId: "", dateTime: "", motif: "" });
      loadAllData();
    } catch (err) {
      console.error(err);
      alert("Erreur: " + (err.response?.data?.message || "Vérifiez les champs"));
    } finally {
      setSubmitting(false);
    }
  };

  // Modification rendez-vous
  const handleEditAppointment = (appointment) => {
    setCurrentAppointment(appointment);
    setEditAppointmentData({
      patientId: appointment.patientId,
      medecinId: appointment.medecinId,
      dateTime: appointment.dateTime,
      motif: appointment.motif || ""
    });
    setShowEditAppointmentModal(true);
  };

  const handleUpdateAppointment = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.put(`${API_BASE}/api/rendezvous/${currentAppointment.id}`, editAppointmentData, { 
        headers: getAuthHeader(),
        'Content-Type': 'application/json'
      });
      alert("✅ Rendez-vous modifié");
      setShowEditAppointmentModal(false);
      loadAllData();
    } catch (err) {
      alert("Erreur lors de la modification");
    } finally {
      setSubmitting(false);
    }
  };

  const confirmAppointment = async (id) => {
    try {
      await axios.patch(`${API_BASE}/api/rendezvous/${id}/status`, null, {
        params: { status: "CONFIRME" },
        headers: getAuthHeader()
      });
      alert("✅ Rendez-vous confirmé");
      loadAllData();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la confirmation");
    }
  };

  const addToWaitingListFromAppointment = (patientId, patientName, rendezVousId) => {
    const alreadyInWaiting = waitingList.some(w => w.patientId === patientId);
    if (alreadyInWaiting) {
      alert("Ce patient est déjà dans la salle d'attente");
      return;
    }
    const newEntry = {
      id: Date.now(),
      patientId,
      patientName,
      rendezVousId,
      arrivalTime: new Date().toISOString()
    };
    const updated = [...waitingList, newEntry];
    setWaitingList(updated);
    localStorage.setItem("salle_attente", JSON.stringify(updated));
    alert("✅ Patient ajouté à la salle d'attente");
  };

  const addToWaitingList = (patientId) => {
    const patient = patients.find(p => p.userId === patientId);
    if (!patient) return;
    const alreadyInWaiting = waitingList.some(w => w.patientId === patientId);
    if (alreadyInWaiting) {
      alert("Ce patient est déjà dans la salle d'attente");
      return;
    }
    const newEntry = {
      id: Date.now(),
      patientId,
      patientName: `${patient.firstName} ${patient.lastName}`,
      arrivalTime: new Date().toISOString()
    };
    const updated = [...waitingList, newEntry];
    setWaitingList(updated);
    localStorage.setItem("salle_attente", JSON.stringify(updated));
    alert("✅ Patient ajouté à la salle d'attente");
  };

  const removeFromWaitingList = (id) => {
    if (window.confirm("Retirer ce patient de la salle d'attente ?")) {
      const updated = waitingList.filter(w => w.id !== id);
      setWaitingList(updated);
      localStorage.setItem("salle_attente", JSON.stringify(updated));
      alert("✅ Patient retiré de la salle d'attente");
    }
  };

  // ------------------------------------------------------------------
  // 4. Gestion des factures
  // ------------------------------------------------------------------
  const handleAddInvoice = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = { patientId: newInvoice.patientId, montant: newInvoice.montant, description: newInvoice.description, statut: "IMPAYEE" };
      await axios.post(`${API_BASE}/api/factures`, payload, { headers: getAuthHeader() });
      alert("Facture ajoutée ✅");
      setShowAddInvoiceModal(false);
      setNewInvoice({ patientId: "", montant: "", description: "" });
      loadAllData();
    } catch (err) {
      alert("Erreur: " + (err.response?.data?.message || "Vérifiez les champs"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditInvoice = (invoice) => {
    setCurrentInvoice(invoice);
    setEditInvoiceData({ montant: invoice.montant, statut: invoice.statut });
    setShowEditInvoiceModal(true);
  };

  const handleUpdateInvoice = async () => {
    setSubmitting(true);
    try {
      await axios.put(`${API_BASE}/api/factures/${currentInvoice.id}`, editInvoiceData, { headers: getAuthHeader() });
      alert("Facture modifiée ✅");
      setShowEditInvoiceModal(false);
      loadAllData();
    } catch (err) {
      alert("Erreur lors de la modification");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteInvoice = async (id) => {
    if (window.confirm("Supprimer cette facture ?")) {
      try {
        await axios.delete(`${API_BASE}/api/factures/${id}`, { headers: getAuthHeader() });
        loadAllData();
      } catch (err) {
        alert("Erreur lors de la suppression");
      }
    }
  };

  // ------------------------------------------------------------------
  // تم حذف جميع وظائف المستندات:
  // searchDocuments, addDocument, deleteDocument, printDocument
  // ------------------------------------------------------------------

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark-mode", !darkMode);
  };

  const handleSetActiveTab = (tab) => {
    setActiveTab(tab);
    if (window.innerWidth <= 768) setIsMenuOpen(false);
    if (tab !== "profile") setIsEditingProfile(false);
  };

  if (loading) return <div className="loader">Chargement de l'espace secrétariat...</div>;
  if (!user) return <div className="error">Impossible de charger vos données. Veuillez vous reconnecter.</div>;

  const todayAppointments = appointments.filter(a => new Date(a.dateTime).toDateString() === new Date().toDateString()).length;
  const upcomingAppointments = appointments.filter(a => new Date(a.dateTime) > new Date()).length;

  return (
    <div className={`admin-dashboard ${darkMode ? "dark" : "light"}`}>
      <Sidebar activeTab={activeTab} setActiveTab={handleSetActiveTab} role="SECRETAIRE" />
      <main className="main-area">
        <TopHeader activeTab={activeTab} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} darkMode={darkMode} toggleTheme={toggleTheme} user={user} />
        <div className="content-wrapper">

          {/* DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="dashboard-view">
              <div className="stats-grid">
                <div className="stat-card purple"><div className="stat-icon"><FaCalendarAlt /></div><div className="stat-info"><h3>{todayAppointments}</h3><p>Rendez-vous aujourd'hui</p></div></div>
                <div className="stat-card blue"><div className="stat-icon"><FaClock /></div><div className="stat-info"><h3>{upcomingAppointments}</h3><p>À venir</p></div></div>
                <div className="stat-card green"><div className="stat-icon"><FaUsers /></div><div className="stat-info"><h3>{patients.length}</h3><p>Patients enregistrés</p></div></div>
                <div className="stat-card teal"><div className="stat-icon"><FaFileInvoice /></div><div className="stat-info"><h3>{invoices.length}</h3><p>Factures</p></div></div>
              </div>

              {/* Salle d'attente */}
              <div className="recent-section">
                <div className="section-header">
                  <h3>🚪 Salle d'attente</h3>
                  <select onChange={(e) => addToWaitingList(parseInt(e.target.value))} defaultValue="">
                    <option value="">+ Ajouter patient</option>
                    {patients.map(p => <option key={p.userId} value={p.userId}>{p.firstName} {p.lastName}</option>)}
                  </select>
                </div>
                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Patient</th>
                        <th>Arrivée</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {waitingList.map(w => (
                        <tr key={w.id}>
                          <td>{w.patientName}</td>
                          <td>{new Date(w.arrivalTime).toLocaleTimeString()}</td>
                          <td><button className="icon-btn delete" onClick={() => removeFromWaitingList(w.id)}><FaTrash /></button></td>
                        </tr>
                      ))}
                      {waitingList.length === 0 && (
                        <tr>
                          <td colSpan="3">Aucun patient en attente</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Rendez-vous à venir */}
              <div className="recent-section">
                <div className="section-header">
                  <h3>📅 Rendez-vous à venir</h3>
                  <button className="btn-add" onClick={() => setShowAddAppointmentModal(true)}><FaPlus /> Ajouter rendez-vous</button>
                </div>
                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Date & heure</th>
                        <th>Patient</th>
                        <th>Médecin</th>
                        <th>Statut</th>
                        <th>Confirmation</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.filter(a => new Date(a.dateTime) > new Date()).slice(0,8).map(rdv => (
                        <tr key={rdv.id}>
                          <td>{new Date(rdv.dateTime).toLocaleString()}</td>
                          <td>{rdv.patientNom}</td>
                          <td>{rdv.medecinNom}</td>
                          <td>
                            <span className={`badge ${rdv.status === "CONFIRME" ? "green" : rdv.status === "EN_ATTENTE" ? "yellow" : "red"}`}>
                              {rdv.status === "CONFIRME" ? "Confirmé" : rdv.status === "EN_ATTENTE" ? "En attente" : rdv.status === "TERMINE" ? "Terminé" : rdv.status === "ANNULE" ? "Annulé" : rdv.status}
                            </span>
                          </td>
                          <td className="action-icons">
                            {rdv.status === "EN_ATTENTE" && (
                              <button className="icon-btn confirm" onClick={() => confirmAppointment(rdv.id)}>
                                <FaCheckCircle /> Confirmer
                              </button>
                            )}
                            {rdv.status === "CONFIRME" && (
                              <button className="icon-btn waiting" onClick={() => addToWaitingListFromAppointment(rdv.patientId, rdv.patientNom, rdv.id)}>
                                <FaClock /> Ajouter à l'attente
                              </button>
                            )}
                          </td>
                          <td>
                            <button className="icon-btn edit" onClick={() => handleEditAppointment(rdv)}>
                              <FaEdit /> 
                            </button>
                            <button className="icon-btn delete" onClick={() => handleDeleteAppointment(rdv.id)}>
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {upcomingAppointments === 0 && (
                        <tr>
                          <td colSpan="6">Aucun rendez-vous programmé</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* تم حذف قسم Derniers documents */}
              
            </div>
          )}

          {/* PATIENTS */}
          {activeTab === "patients" && (
            <div className="recent-section">
              <div className="section-header">
                <h2>👥 Liste des patients</h2>
                <button className="btn-add" onClick={() => setShowAddPatientModal(true)}><FaUserPlus /> Ajouter patient</button>
              </div>
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Nom</th>
                      <th>Email</th>
                      <th>Téléphone</th>
                      <th>Adresse</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patients.map(p => (
                      <tr key={p.userId}>
                        <td>{p.firstName} {p.lastName}</td>
                        <td>{p.email}</td>
                        <td>{p.phone || "—"}</td>
                        <td>{p.address || "—"}</td>
                        <td className="action-icons">
                          <button className="icon-btn edit" onClick={() => handleEditPatient(p)}><FaEdit /></button>
                          {user?.role === "ADMIN" && (
                            <button className="icon-btn delete" onClick={() => handleDeletePatient(p.userId)}><FaTrash /></button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TOUS LES RENDEZ-VOUS */}
          {activeTab === "appointments" && (
            <div className="recent-section">
              <div className="section-header">
                <h2>📅 Tous les rendez-vous</h2>
                <button className="btn-add" onClick={() => setShowAddAppointmentModal(true)}><FaPlus /> Nouveau rendez-vous</button>
              </div>
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Date & heure</th>
                      <th>Patient</th>
                      <th>Médecin</th>
                      <th>Statut</th>
                      <th>Confirmation</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map(rdv => (
                      <tr key={rdv.id}>
                        <td>{new Date(rdv.dateTime).toLocaleString()}</td>
                        <td>{rdv.patientNom}</td>
                        <td>{rdv.medecinNom}</td>
                        <td>
                          <span className={`badge ${rdv.status === "CONFIRME" ? "green" : rdv.status === "EN_ATTENTE" ? "yellow" : "red"}`}>
                            {rdv.status === "CONFIRME" ? "Confirmé" : rdv.status === "EN_ATTENTE" ? "En attente" : rdv.status === "TERMINE" ? "Terminé" : rdv.status === "ANNULE" ? "Annulé" : rdv.status}
                          </span>
                        </td>
                        <td className="action-icons">
                          {rdv.status === "EN_ATTENTE" && (
                            <button className="icon-btn confirm" onClick={() => confirmAppointment(rdv.id)}>
                              <FaCheckCircle /> Confirmer
                            </button>
                          )}
                          {rdv.status === "CONFIRME" && (
                            <button className="icon-btn waiting" onClick={() => addToWaitingListFromAppointment(rdv.patientId, rdv.patientNom, rdv.id)}>
                              <FaClock /> Ajouter à l'attente
                            </button>
                          )}
                        </td>
                        <td>
                          <button className="icon-btn edit" onClick={() => handleEditAppointment(rdv)}>
                            <FaEdit />
                          </button>
                          <button className="icon-btn delete" onClick={() => handleDeleteAppointment(rdv.id)}>
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {appointments.length === 0 && (
                      <tr>
                        <td colSpan="6">Aucun rendez-vous trouvé</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* FACTURES */}
          {activeTab === "invoices" && (
            <div className="recent-section">
              <div className="section-header">
                <h2>💰 Factures</h2>
                <button className="btn-add" onClick={() => setShowAddInvoiceModal(true)}><FaPlus /> Nouvelle facture</button>
              </div>
              <div className="table-responsive">
                <table className="data-table">
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
                    {invoices.map(inv => {
                      let formattedDate = "Date inconnue";
                      if (inv.dateFacture) {
                        const dateObj = new Date(inv.dateFacture);
                        if (!isNaN(dateObj.getTime())) formattedDate = dateObj.toLocaleDateString();
                      }
                      let statutClass = "badge";
                      let statutText = inv.statut || "Inconnu";
                      if (inv.statut === "PAYEE") statutClass = "badge green";
                      else if (inv.statut === "IMPAYEE") statutClass = "badge red";
                      else if (inv.statut === "ANNULEE") statutClass = "badge yellow";
                      return (
                        <tr key={inv.id}>
                          <td>{inv.patientNom}</td>
                          <td>{formattedDate}</td>
                          <td>{inv.montant} DH</td>
                          <td><span className={statutClass}>{statutText}</span></td>
                          <td className="action-icons">
                            <button className="icon-btn edit" onClick={() => handleEditInvoice(inv)}><FaEdit /></button>
                            <button className="icon-btn delete" onClick={() => handleDeleteInvoice(inv.id)}><FaTrash /></button>
                          </td>
                        </tr>
                      );
                    })}
                    {invoices.length === 0 && (
                      <tr>
                        <td colSpan="5">Aucune facture enregistrée</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* تم حذف علامة التبويب DOCUMENTS DYNAMIQUES */}

          {/* PROFIL */}
          {activeTab === "profile" && (
            !isEditingProfile ? <UserProfile onEdit={() => setIsEditingProfile(true)} /> : <EditProfile onCancel={() => setIsEditingProfile(false)} onSuccess={() => setIsEditingProfile(false)} />
          )}
        </div>
      </main>

      {/* MODAL AJOUT PATIENT */}
      {showAddPatientModal && (
        <div className="modal-overlay" onClick={() => setShowAddPatientModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h3>Ajouter un patient</h3><button onClick={() => setShowAddPatientModal(false)}><FaTimes /></button></div>
            <form onSubmit={handleAddPatient}>
              <div className="form-grid">
                <input placeholder="Prénom" value={newPatient.firstName} onChange={e => setNewPatient({...newPatient, firstName:e.target.value})} required />
                <input placeholder="Nom" value={newPatient.lastName} onChange={e => setNewPatient({...newPatient, lastName:e.target.value})} required />
                <input placeholder="Email" type="email" value={newPatient.email} onChange={e => setNewPatient({...newPatient, email:e.target.value})} required />
                <input placeholder="Téléphone" value={newPatient.phone} onChange={e => setNewPatient({...newPatient, phone:e.target.value})} />
                <input placeholder="Adresse" value={newPatient.address} onChange={e => setNewPatient({...newPatient, address:e.target.value})} />
                <input placeholder="Ville" value={newPatient.city} onChange={e => setNewPatient({...newPatient, city:e.target.value})} />
              </div>
              <button type="submit" disabled={submitting}>{submitting ? "Création..." : "Créer"}</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL MODIFIER PATIENT */}
      {showEditPatientModal && (
        <div className="modal-overlay" onClick={() => setShowEditPatientModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h3>Modifier le patient</h3><button onClick={() => setShowEditPatientModal(false)}><FaTimes /></button></div>
            <form onSubmit={handleUpdatePatient}>
              <div className="form-grid">
                <input placeholder="Prénom" value={editPatientData.firstName} onChange={e => setEditPatientData({...editPatientData, firstName:e.target.value})} required />
                <input placeholder="Nom" value={editPatientData.lastName} onChange={e => setEditPatientData({...editPatientData, lastName:e.target.value})} required />
                <input placeholder="Email" type="email" value={editPatientData.email} onChange={e => setEditPatientData({...editPatientData, email:e.target.value})} required />
                <input placeholder="Téléphone" value={editPatientData.phone} onChange={e => setEditPatientData({...editPatientData, phone:e.target.value})} />
                <input placeholder="Adresse" value={editPatientData.address} onChange={e => setEditPatientData({...editPatientData, address:e.target.value})} />
                <input placeholder="Ville" value={editPatientData.city} onChange={e => setEditPatientData({...editPatientData, city:e.target.value})} />
              </div>
              <button type="submit" disabled={submitting}>{submitting ? "Modification..." : "Modifier"}</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL AJOUT RENDEZ-VOUS */}
      {showAddAppointmentModal && (
        <div className="modal-overlay" onClick={() => setShowAddAppointmentModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h3>Ajouter un rendez-vous</h3><button onClick={() => setShowAddAppointmentModal(false)}><FaTimes /></button></div>
            <form onSubmit={handleAddAppointment}>
              <select required onChange={e => setNewAppointment({...newAppointment, patientId: e.target.value})}>
                <option value="">Sélectionner un patient</option>
                {patients.map(p => <option key={p.userId} value={p.userId}>{p.firstName} {p.lastName}</option>)}
              </select>
              <select required onChange={e => setNewAppointment({...newAppointment, medecinId: e.target.value})}>
                <option value="">Sélectionner un médecin</option>
                {medecins.map(m => <option key={m.userId} value={m.userId}>Dr. {m.firstName} {m.lastName}</option>)}
              </select>
              <input type="datetime-local" required onChange={e => setNewAppointment({...newAppointment, dateTime: e.target.value})} />
              <input type="text" placeholder="Motif" onChange={e => setNewAppointment({...newAppointment, motif: e.target.value})} />
              <button type="submit" disabled={submitting}>{submitting ? "Ajout..." : "Ajouter"}</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL MODIFIER RENDEZ-VOUS */}
      {showEditAppointmentModal && (
        <div className="modal-overlay" onClick={() => setShowEditAppointmentModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h3>Modifier le rendez-vous</h3><button onClick={() => setShowEditAppointmentModal(false)}><FaTimes /></button></div>
            <form onSubmit={handleUpdateAppointment}>
              <select required value={editAppointmentData.patientId} onChange={e => setEditAppointmentData({...editAppointmentData, patientId: e.target.value})}>
                <option value="">Sélectionner un patient</option>
                {patients.map(p => <option key={p.userId} value={p.userId}>{p.firstName} {p.lastName}</option>)}
              </select>
              <select required value={editAppointmentData.medecinId} onChange={e => setEditAppointmentData({...editAppointmentData, medecinId: e.target.value})}>
                <option value="">Sélectionner un médecin</option>
                {medecins.map(m => <option key={m.userId} value={m.userId}>Dr. {m.firstName} {m.lastName}</option>)}
              </select>
              <input type="datetime-local" required value={editAppointmentData.dateTime} onChange={e => setEditAppointmentData({...editAppointmentData, dateTime: e.target.value})} />
              <input type="text" placeholder="Motif" value={editAppointmentData.motif} onChange={e => setEditAppointmentData({...editAppointmentData, motif: e.target.value})} style={{ gridColumn: "span 2" }} />
              <button type="submit" disabled={submitting}>{submitting ? "Modification..." : "Modifier"}</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL AJOUT FACTURE */}
      {showAddInvoiceModal && (
        <div className="modal-overlay" onClick={() => setShowAddInvoiceModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h3>Ajouter une facture</h3><button onClick={() => setShowAddInvoiceModal(false)}><FaTimes /></button></div>
            <form onSubmit={handleAddInvoice}>
              <select required onChange={e => setNewInvoice({...newInvoice, patientId: e.target.value})}>
                <option value="">Sélectionner un patient</option>
                {patients.map(p => <option key={p.userId} value={p.userId}>{p.firstName} {p.lastName}</option>)}
              </select>
              <input type="number" placeholder="Montant" required onChange={e => setNewInvoice({...newInvoice, montant: e.target.value})} />
              <input type="text" placeholder="Description" onChange={e => setNewInvoice({...newInvoice, description: e.target.value})} />
              <button type="submit" disabled={submitting}>{submitting ? "Ajout..." : "Ajouter"}</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL MODIFIER FACTURE */}
      {showEditInvoiceModal && (
        <div className="modal-overlay" onClick={() => setShowEditInvoiceModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h3>Modifier la facture</h3><button onClick={() => setShowEditInvoiceModal(false)}><FaTimes /></button></div>
            <form onSubmit={e => { e.preventDefault(); handleUpdateInvoice(); }}>
              <input type="number" placeholder="Montant" value={editInvoiceData.montant} onChange={e => setEditInvoiceData({...editInvoiceData, montant:e.target.value})} required />
              <select value={editInvoiceData.statut} onChange={e => setEditInvoiceData({...editInvoiceData, statut:e.target.value})}>
                <option value="PAYEE">Payée</option>
                <option value="IMPAYEE">Impayée</option>
                <option value="ANNULEE">Annulée</option>
              </select>
              <button type="submit" disabled={submitting}>{submitting ? "Modification..." : "Modifier"}</button>
            </form>
          </div>
        </div>
      )}

      {/* تم حذف MODAL AJOUT DOCUMENT */}

    </div>
  );
};

export default SecretaireDashboard;