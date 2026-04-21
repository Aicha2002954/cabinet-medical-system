import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../hedare/Sidebar";
import TopHeader from "../hedare/TopHeader";
import UserProfile from "../Profile/UserProfile";
import EditProfile from "../Profile/EditProfile";
import {
  FaCalendarAlt, FaUsers, FaFileInvoice, FaClock,
  FaSearch, FaTimes, FaStethoscope, FaUserMd,
  FaCheckCircle, FaTimesCircle, FaTrash, FaPlus
} from "react-icons/fa";
import "./PatientDashboard.css";

const PatientDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [darkMode, setDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [medecins, setMedecins] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // États pour les modals
  const [showAddAppointmentModal, setShowAddAppointmentModal] = useState(false);
  const [newAppointment, setNewAppointment] = useState({ medecinId: "", dateTime: "", motif: "" });
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const API_BASE = "http://localhost:8087";
  const getAuthHeader = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });
  const hasLoaded = useRef(false);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) { navigate("/login"); return; }
      const payload = JSON.parse(atob(token.split(".")[1]));
      const userEmail = payload.email || payload.sub;
      
      // 1. جلب المستخدم الحالي (المريض)
      const profilesRes = await axios.get(`${API_BASE}/api/profiles`, { headers: getAuthHeader() });
      const currentUser = profilesRes.data.find(u => u.email === userEmail);
      if (!currentUser) { navigate("/login"); return; }
      setUser(currentUser);

      // 2. جلب جميع الأطباء
      const allUsers = profilesRes.data;
      const medecinsData = allUsers.filter(u => u.role === "MEDECIN").map(m => ({
        userId: m.userId,
        firstName: m.firstName,
        lastName: m.lastName,
        fullName: `Dr. ${m.firstName} ${m.lastName}`
      }));
      setMedecins(medecinsData);

      // 3. جلب مواعيد المريض
      const rdvsRes = await axios.get(`${API_BASE}/api/rendezvous`, { headers: getAuthHeader() });
      const myRdvs = rdvsRes.data
        .filter(rdv => rdv.patientId === currentUser.userId)
        .map(rdv => {
          const medecin = medecinsData.find(m => m.userId === rdv.medecinId);
          return {
            id: rdv.id,
            patientId: rdv.patientId,
            medecinId: rdv.medecinId,
            medecinNom: medecin ? medecin.fullName : `Dr. ${rdv.medecinId}`,
            dateTime: rdv.dateTime,
            status: rdv.status || "EN_ATTENTE",
            motif: rdv.reason || rdv.motif || ""
          };
        })
        .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
      setAppointments(myRdvs);

      // 4. جلب استشارات المريض
      const consRes = await axios.get(`${API_BASE}/api/consultations`, { headers: getAuthHeader() });
      const myCons = consRes.data
        .filter(cons => cons.patientId === currentUser.userId)
        .map(cons => {
          const medecin = medecinsData.find(m => m.userId === cons.medecinId);
          return {
            id: cons.id,
            patientId: cons.patientId,
            medecinId: cons.medecinId,
            medecinNom: medecin ? medecin.fullName : `Dr. ${cons.medecinId}`,
            dateTime: cons.consultationDate || cons.dateTime,
            diagnostic: cons.diagnostic || "—",
            prescription: cons.prescription || "—",
            notes: cons.notes || ""
          };
        })
        .sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));
      setConsultations(myCons);

      // 5. جلب فواتير المريض
      const invRes = await axios.get(`${API_BASE}/api/factures`, { headers: getAuthHeader() });
      const myInvoices = invRes.data
        .filter(inv => inv.patientId === currentUser.userId)
        .map(inv => ({
          id: inv.id,
          patientId: inv.patientId,
          montant: inv.montant,
          date: inv.dateFacture || inv.date,
          statut: inv.statut || (inv.paye ? "PAYEE" : "IMPAYEE"),
          description: inv.description || ""
        }));
      setInvoices(myInvoices);

    } catch (err) {
      console.error("Erreur chargement:", err);
      alert("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasLoaded.current) return;
    hasLoaded.current = true;
    loadAllData();
  }, []);

  // Ajouter un rendez-vous
  const handleAddAppointment = async (e) => {
    e.preventDefault();
    if (!newAppointment.medecinId || !newAppointment.dateTime) {
      alert("Veuillez sélectionner un médecin et une date");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        patientId: user.userId,
        medecinId: Number(newAppointment.medecinId),
        dateTime: newAppointment.dateTime,
        reason: newAppointment.motif,
        status: "EN_ATTENTE"
      };
      await axios.post(`${API_BASE}/api/rendezvous`, payload, { 
        headers: getAuthHeader(),
        'Content-Type': 'application/json'
      });
      alert("Rendez-vous demandé avec succès ✅");
      setShowAddAppointmentModal(false);
      setNewAppointment({ medecinId: "", dateTime: "", motif: "" });
      loadAllData();
    } catch (err) {
      console.error(err);
      alert("Erreur: " + (err.response?.data?.message || "Vérifiez les champs"));
    } finally {
      setSubmitting(false);
    }
  };

  // Annuler un rendez-vous
  const handleCancelAppointment = async (id) => {
    if (window.confirm("Voulez-vous vraiment annuler ce rendez-vous ?")) {
      try {
        await axios.delete(`${API_BASE}/api/rendezvous/${id}`, { headers: getAuthHeader() });
        alert("Rendez-vous annulé ✅");
        loadAllData();
      } catch (err) {
        alert("Erreur lors de l'annulation");
      }
    }
  };

  const filteredAppointments = appointments.filter(rdv =>
    rdv.medecinNom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rdv.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredConsultations = consultations.filter(cons =>
    cons.medecinNom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cons.diagnostic?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredInvoices = invoices.filter(inv =>
    inv.statut?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark-mode", !darkMode);
  };

  const handleSetActiveTab = (tab) => {
    setActiveTab(tab);
    if (window.innerWidth <= 768) setIsMenuOpen(false);
    if (tab !== "profile") setIsEditingProfile(false);
  };

  if (loading) return <div className="loader">Chargement de votre espace patient...</div>;
  if (!user) return <div className="error">Impossible de charger vos données</div>;

  const upcomingAppointments = appointments.filter(a => new Date(a.dateTime) > new Date()).length;
  const pastConsultations = consultations.length;
  const totalInvoices = invoices.length;

  return (
    <div className={`admin-dashboard ${darkMode ? "dark" : "light"}`}>
      <Sidebar activeTab={activeTab} setActiveTab={handleSetActiveTab} role="PATIENT" />
      <main className="main-area">
        <TopHeader activeTab={activeTab} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} darkMode={darkMode} toggleTheme={toggleTheme} user={user} />
        <div className="content-wrapper">

          {/* DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="dashboard-view">
              <div className="stats-grid">
                <div className="stat-card purple">
                  <div className="stat-icon"><FaCalendarAlt /></div>
                  <div className="stat-info">
                    <h3>{upcomingAppointments}</h3>
                    <p>Rendez-vous à venir</p>
                  </div>
                </div>
                <div className="stat-card green">
                  <div className="stat-icon"><FaStethoscope /></div>
                  <div className="stat-info">
                    <h3>{pastConsultations}</h3>
                    <p>Consultations effectuées</p>
                  </div>
                </div>
                <div className="stat-card teal">
                  <div className="stat-icon"><FaFileInvoice /></div>
                  <div className="stat-info">
                    <h3>{totalInvoices}</h3>
                    <p>Factures</p>
                  </div>
                </div>
              </div>

              {/* Prochains rendez-vous */}
              <div className="recent-section">
                <div className="section-header">
                  <h3>📅 Prochains rendez-vous</h3>
                  <button className="btn-add" onClick={() => setShowAddAppointmentModal(true)}>
                    <FaPlus /> Prendre rendez-vous
                  </button>
                </div>
                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Date & heure</th>
                        <th>Médecin</th>
                        <th>Statut</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.filter(a => new Date(a.dateTime) > new Date()).slice(0,5).map(rdv => (
                        <tr key={rdv.id}>
                          <td>{new Date(rdv.dateTime).toLocaleString()}</td>
                          <td>{rdv.medecinNom}</td>
                          <td>
                            <span className={`badge ${rdv.status === "CONFIRME" ? "green" : "yellow"}`}>
                              {rdv.status === "CONFIRME" ? "Confirmé" : rdv.status === "EN_ATTENTE" ? "En attente" : rdv.status}
                            </span>
                          </td>
                          <td>
                            {rdv.status !== "ANNULE" && (
                              <button className="icon-btn delete" onClick={() => handleCancelAppointment(rdv.id)}>
                                <FaTimesCircle /> Annuler
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                      {upcomingAppointments === 0 && (
                        <tr>
                          <td colSpan="4" style={{textAlign:"center"}}>Aucun rendez-vous programmé</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Dernières consultations */}
              <div className="recent-section">
                <h3>🩺 Dernières consultations</h3>
                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Médecin</th>
                        <th>Diagnostic</th>
                      </tr>
                    </thead>
                    <tbody>
                      {consultations.slice(0,5).map(cons => (
                        <tr key={cons.id}>
                          <td>{new Date(cons.dateTime).toLocaleDateString()}</td>
                          <td>{cons.medecinNom}</td>
                          <td>{cons.diagnostic || "—"}</td>
                        </tr>
                      ))}
                      {consultations.length === 0 && (
                        <tr>
                          <td colSpan="3" style={{textAlign:"center"}}>Aucune consultation enregistrée</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* MES RENDEZ-VOUS */}
          {activeTab === "appointments" && (
            <div className="recent-section">
              <div className="section-header">
                <h2>📅 Tous mes rendez-vous</h2>
                <div className="search-bar">
                  <FaSearch />
                  <input 
                    type="text" 
                    placeholder="Rechercher par médecin ou statut..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                  />
                </div>
                <button className="btn-add" onClick={() => setShowAddAppointmentModal(true)}>
                  <FaPlus /> Prendre rendez-vous
                </button>
              </div>
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Date & heure</th>
                      <th>Médecin</th>
                      <th>Motif</th>
                      <th>Statut</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAppointments.map(rdv => (
                      <tr key={rdv.id}>
                        <td>{new Date(rdv.dateTime).toLocaleString()}</td>
                        <td>{rdv.medecinNom}</td>
                        <td>{rdv.motif || "—"}</td>
                        <td>
                          <span className={`badge ${rdv.status === "CONFIRME" ? "green" : "yellow"}`}>
                            {rdv.status === "CONFIRME" ? "Confirmé" : rdv.status === "EN_ATTENTE" ? "En attente" : rdv.status}
                          </span>
                        </td>
                        <td>
                          {rdv.status !== "ANNULE" && rdv.status !== "TERMINE" && (
                            <button className="icon-btn delete" onClick={() => handleCancelAppointment(rdv.id)}>
                              <FaTimesCircle /> Annuler
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {filteredAppointments.length === 0 && (
                      <tr>
                        <td colSpan="5" style={{textAlign:"center"}}>Aucun rendez-vous trouvé</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* MES CONSULTATIONS */}
          {activeTab === "consultations" && (
            <div className="recent-section">
              <div className="section-header">
                <h2>🩺 Historique des consultations</h2>
                <div className="search-bar">
                  <FaSearch />
                  <input 
                    type="text" 
                    placeholder="Rechercher par médecin ou diagnostic..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                  />
                </div>
              </div>
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Médecin</th>
                      <th>Diagnostic</th>
                      <th>Traitement</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredConsultations.map(cons => (
                      <tr key={cons.id}>
                        <td>{new Date(cons.dateTime).toLocaleDateString()}</td>
                        <td>{cons.medecinNom}</td>
                        <td>{cons.diagnostic || "—"}</td>
                        <td>{cons.prescription || "—"}</td>
                      </tr>
                    ))}
                    {filteredConsultations.length === 0 && (
                      <tr>
                        <td colSpan="4" style={{textAlign:"center"}}>Aucune consultation trouvée</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* MES FACTURES */}
          {activeTab === "invoices" && (
            <div className="recent-section">
              <div className="section-header">
                <h2>💰 Mes factures</h2>
                <div className="search-bar">
                  <FaSearch />
                  <input 
                    type="text" 
                    placeholder="Rechercher par statut..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                  />
                </div>
              </div>
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Montant</th>
                      <th>Statut</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInvoices.map(inv => (
                      <tr key={inv.id}>
                        <td>{new Date(inv.date).toLocaleDateString()}</td>
                        <td>{inv.montant} DH</td>
                        <td>
                          <span className={`badge ${inv.statut === "PAYEE" ? "green" : "red"}`}>
                            {inv.statut === "PAYEE" ? "Payée" : "Impayée"}
                          </span>
                        </td>
                        <td>{inv.description || "—"}</td>
                      </tr>
                    ))}
                    {filteredInvoices.length === 0 && (
                      <tr>
                        <td colSpan="4" style={{textAlign:"center"}}>Aucune facture trouvée</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PROFIL */}
          {activeTab === "profile" && (
            !isEditingProfile ? <UserProfile onEdit={() => setIsEditingProfile(true)} /> : <EditProfile onCancel={() => setIsEditingProfile(false)} onSuccess={() => setIsEditingProfile(false)} />
          )}
        </div>
      </main>

      {/* MODAL AJOUTER RENDEZ-VOUS */}
      {showAddAppointmentModal && (
        <div className="modal-overlay" onClick={() => setShowAddAppointmentModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>📅 Prendre un rendez-vous</h3>
              <button onClick={() => setShowAddAppointmentModal(false)}><FaTimes /></button>
            </div>
            <form onSubmit={handleAddAppointment}>
              <div className="form-grid">
                <select 
                  required 
                  onChange={e => setNewAppointment({...newAppointment, medecinId: e.target.value})}
                  value={newAppointment.medecinId}
                >
                  <option value="">Sélectionner un médecin</option>
                  {medecins.map(m => (
                    <option key={m.userId} value={m.userId}>{m.fullName}</option>
                  ))}
                </select>
                <input 
                  type="datetime-local" 
                  required 
                  onChange={e => setNewAppointment({...newAppointment, dateTime: e.target.value})}
                  value={newAppointment.dateTime}
                />
                <input 
                  type="text" 
                  placeholder="Motif (optionnel)" 
                  onChange={e => setNewAppointment({...newAppointment, motif: e.target.value})}
                  value={newAppointment.motif}
                  style={{ gridColumn: "span 2" }}
                />
              </div>
              <button type="submit" className="save-changes-btn" disabled={submitting}>
                {submitting ? "Envoi en cours..." : "Demander le rendez-vous"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;