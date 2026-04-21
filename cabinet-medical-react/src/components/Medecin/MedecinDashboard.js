import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../hedare/Sidebar";
import TopHeader from "../hedare/TopHeader";
import UserProfile from "../Profile/UserProfile";
import EditProfile from "../Profile/EditProfile";
import {
  FaCalendarAlt, FaUsers, FaClock,
  FaSearch, FaTimes, FaPrint, FaFileAlt,
  FaStethoscope
} from "react-icons/fa";
import "./MedecinDashboard.css";

const MedecinDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [darkMode, setDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [waitingList, setWaitingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showConsultationModal, setShowConsultationModal] = useState(false);
  const [consultationData, setConsultationData] = useState({ diagnostic: "", prescription: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // États pour les documents
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [documentType, setDocumentType] = useState("ordonnance");
  const [documentContent, setDocumentContent] = useState("");

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
      
      const profilesRes = await axios.get(`${API_BASE}/api/profiles`, { headers: getAuthHeader() });
      const currentUser = profilesRes.data.find(u => u.email === userEmail);
      if (!currentUser) { navigate("/login"); return; }
      setUser(currentUser);

      const allUsers = profilesRes.data;
      const patientsMap = {};
      allUsers.filter(u => u.role === "PATIENT").forEach(p => {
        patientsMap[p.userId] = `${p.firstName} ${p.lastName}`;
      });

      // جلب المواعيد
      let appointmentsData = [];
      try {
        const rdvsRes = await axios.get(`${API_BASE}/api/rendezvous`, { headers: getAuthHeader() });
        appointmentsData = rdvsRes.data
          .filter(rdv => rdv.medecinId === currentUser.userId)
          .map(rdv => ({
            id: rdv.id,
            patientId: rdv.patientId,
            patientNom: patientsMap[rdv.patientId] || `Patient ${rdv.patientId}`,
            dateTime: rdv.dateTime,
            status: rdv.status || "EN_ATTENTE"
          }))
          .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
      } catch (err) {
        console.warn("Erreur chargement rendez-vous:", err);
      }
      setAppointments(appointmentsData);

      // جلب الاستشارات
      let consultationsData = [];
      try {
        const consRes = await axios.get(`${API_BASE}/api/consultations`, { headers: getAuthHeader() });
        consultationsData = consRes.data
          .filter(cons => cons.medecinId === currentUser.userId)
          .map(cons => ({
            id: cons.id,
            patientId: cons.patientId,
            patientNom: patientsMap[cons.patientId] || `Patient ${cons.patientId}`,
            dateTime: cons.consultationDate || cons.dateTime,
            diagnostic: cons.diagnostic || "—",
            traitement: cons.prescription || cons.traitement || "—",
            notes: cons.notes || ""
          }));
      } catch (err) {
        console.warn("Erreur chargement consultations:", err);
      }
      setConsultations(consultationsData);

      // Salle d'attente: المواعيد القادمة (اليوم أو المستقبل) التي لم يتم استشارتها
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      
      const futureAppointments = appointmentsData.filter(a => {
        const date = new Date(a.dateTime);
        return !isNaN(date) && date >= now;
      });
      
      const consultedPatientIds = consultationsData.map(c => c.patientId);
      
      const waiting = futureAppointments
        .filter(a => !consultedPatientIds.includes(a.patientId))
        .map(a => ({
          id: a.id,
          patientId: a.patientId,
          patientName: a.patientNom,
          arrivalTime: a.dateTime
        }));
      setWaitingList(waiting);

    } catch (err) {
      console.error("Erreur chargement:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasLoaded.current) return;
    hasLoaded.current = true;
    loadAllData();
  }, []);

  const validateConsultation = (patient) => {
    setSelectedPatient(patient);
    setConsultationData({ diagnostic: "", prescription: "", notes: "" });
    setShowConsultationModal(true);
  };

  const handleSaveConsultation = async (e) => {
    e.preventDefault();
    if (!consultationData.diagnostic) {
      alert("Veuillez entrer un diagnostic");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        patientId: Number(selectedPatient.patientId),
        medecinId: Number(user.userId),
        rendezVousId: selectedPatient.id || null,
        consultationDate: new Date().toISOString(),
        diagnostic: consultationData.diagnostic,
        prescription: consultationData.prescription || "",
        notes: consultationData.notes || "",
        status: "TERMINEE"
      };
      
      await axios.post(`${API_BASE}/api/consultations`, payload, { 
        headers: getAuthHeader(),
        'Content-Type': 'application/json'
      });
      
      alert("Consultation enregistrée ✅");
      setShowConsultationModal(false);
      loadAllData();
    } catch (err) {
      console.error(err.response?.data);
      alert("Erreur: " + (err.response?.data?.message || "Voir console"));
    } finally {
      setSubmitting(false);
    }
  };

  // Fonctions pour les documents
  const openDocumentModal = (patient) => {
    setSelectedPatient(patient);
    setDocumentType("ordonnance");
    setDocumentContent("");
    setShowDocumentModal(true);
  };

  const handlePrintDocument = () => {
    const printWindow = window.open();
    let title = "";
    let content = "";
    switch(documentType) {
      case "ordonnance":
        title = "Ordonnance médicale";
        content = documentContent || "Paracétamol 500mg, 3 fois par jour pendant 5 jours";
        break;
      case "certificat":
        title = "Certificat médical";
        content = documentContent || "Certifie que le patient a été examiné et ne présente aucune contre-indication.";
        break;
      case "compteRendu":
        title = "Compte rendu de consultation";
        content = documentContent || "Consultation pour contrôle de routine. Patient en bonne santé.";
        break;
      default:
        title = "Document médical";
        content = documentContent;
    }
    printWindow.document.write(`
      <html>
        <head><title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 2rem; }
          h1 { color: #2c7da0; }
          .header { text-align: center; margin-bottom: 2rem; }
          .date { text-align: right; margin-bottom: 1rem; }
          .patient-info { margin-bottom: 1.5rem; padding: 1rem; background: #f0f0f0; border-radius: 8px; }
          .content { margin: 1.5rem 0; }
          .footer { margin-top: 2rem; text-align: center; font-size: 0.8rem; color: #666; }
        </style>
      </head>
      <body>
        <div class="header"><h1>${title}</h1><p>Cabinet Médical MediCare</p></div>
        <div class="date">Date: ${new Date().toLocaleDateString()}</div>
        <div class="patient-info"><strong>Patient:</strong> ${selectedPatient?.patientName}<br/><strong>Médecin:</strong> Dr. ${user?.firstName} ${user?.lastName}</div>
        <div class="content">${content}</div>
        <div class="footer">Signature du médecin: ___________________</div>
      </body>
      </html>
    `);
    printWindow.print();
    setShowDocumentModal(false);
  };

  const filteredConsultations = consultations.filter(cons =>
    cons.patientNom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cons.diagnostic?.toLowerCase().includes(searchTerm.toLowerCase())
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

  if (loading) return <div className="loader">Chargement...</div>;
  if (!user) return <div className="error">Erreur de chargement</div>;

  const today = new Date().toDateString();
  const todayAppointmentsCount = appointments.filter(a => {
    const date = new Date(a.dateTime);
    return !isNaN(date) && date.toDateString() === today;
  }).length;
  const upcomingAppointments = appointments.filter(a => {
    const date = new Date(a.dateTime);
    return !isNaN(date) && date > new Date();
  }).length;
  const totalConsultations = consultations.length;

  return (
    <div className={`admin-dashboard ${darkMode ? "dark" : "light"}`}>
      <Sidebar activeTab={activeTab} setActiveTab={handleSetActiveTab} role="MEDECIN" />
      <main className="main-area">
        <TopHeader activeTab={activeTab} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} darkMode={darkMode} toggleTheme={toggleTheme} user={user} />
        <div className="content-wrapper">

          {/* DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="dashboard-view">
              <div className="stats-grid">
                <div className="stat-card purple"><div className="stat-icon"><FaCalendarAlt /></div><div className="stat-info"><h3>{todayAppointmentsCount}</h3><p>Rendez-vous aujourd'hui</p></div></div>
                <div className="stat-card blue"><div className="stat-icon"><FaClock /></div><div className="stat-info"><h3>{upcomingAppointments}</h3><p>À venir</p></div></div>
                <div className="stat-card green"><div className="stat-icon"><FaStethoscope /></div><div className="stat-info"><h3>{totalConsultations}</h3><p>Consultations</p></div></div>
                <div className="stat-card teal"><div className="stat-icon"><FaUsers /></div><div className="stat-info"><h3>{waitingList.length}</h3><p>En salle d'attente</p></div></div>
              </div>

              {/* Salle d'attente */}
              <div className="recent-section">
                <div className="section-header">
                  <h3>🚪 Salle d'attente</h3>
                  <button className="btn-link" onClick={() => handleSetActiveTab("waiting")}>Voir tout</button>
                </div>
                <div className="table-responsive">
                  <table className="data-table">
                    <thead><tr><th>Patient</th><th>Date & heure</th><th>Actions</th></tr></thead>
                    <tbody>
                      {waitingList.slice(0,5).map(w => (
                        <tr key={w.id}>
                          <td>{w.patientName}</td>
                          <td>{new Date(w.arrivalTime).toLocaleString()}</td>
                          <td>
                            <button className="icon-btn view" onClick={() => validateConsultation(w)}><FaStethoscope /> Consulter</button>
                            <button className="icon-btn" onClick={() => openDocumentModal(w)}><FaFileAlt /> Document</button>
                          </td>
                        </tr>
                      ))}
                      {waitingList.length === 0 && (
                        <tr><td colSpan="3" style={{textAlign:"center"}}>Aucun patient en salle d'attente</td>
                      </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Rendez-vous du jour */}
              <div className="recent-section">
                <h3>📅 Rendez-vous du jour</h3>
                <div className="table-responsive">
                  <table className="data-table">
                    <thead><tr><th>Heure</th><th>Patient</th><th>Statut</th></tr></thead>
                    <tbody>
                      {appointments.filter(a => {
                        const date = new Date(a.dateTime);
                        return !isNaN(date) && date.toDateString() === today;
                      }).slice(0,5).map(rdv => (
                        <tr key={rdv.id}>
                          <td>{new Date(rdv.dateTime).toLocaleTimeString()}</td>
                          <td>{rdv.patientNom}</td>
                          <td><span className={`badge ${rdv.status === "CONFIRME" ? "green" : "yellow"}`}>{rdv.status}</span></td>
                          
                        </tr>
                      ))}
                      {todayAppointmentsCount === 0 && (
                        <tr><td colSpan="4" style={{textAlign:"center"}}>Aucun rendez-vous aujourd'hui</td>
                      </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* SALLE D'ATTENTE COMPLETE */}
          {activeTab === "waiting" && (
            <div className="recent-section">
              <h2>🚪 Salle d'attente</h2>
              <div className="table-responsive">
                <table className="data-table">
                  <thead><tr><th>Patient</th><th>Date & heure</th></tr></thead>
                  <tbody>
                    {waitingList.map(w => (
                      <tr key={w.id}>
                        <td>{w.patientName}</td>
                        <td>{new Date(w.arrivalTime).toLocaleString()}</td>
                        <td>
                          <button className="icon-btn view" onClick={() => validateConsultation(w)}><FaStethoscope /> Consulter</button>
                         
                        </td>
                      </tr>
                    ))}
                    {waitingList.length === 0 && (
                      <tr><td colSpan="3" style={{textAlign:"center"}}>Aucun patient en salle d'attente</td>
                    </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* CONSULTATIONS */}
          {activeTab === "consultations" && (
            <div className="recent-section">
              <div className="section-header">
                <h2>🩺 Historique des consultations</h2>
                <div className="search-bar">
                  <FaSearch />
                  <input type="text" placeholder="Rechercher..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
              </div>
              <div className="table-responsive">
                <table className="data-table">
                  <thead><tr><th>Date</th><th>Patient</th><th>Diagnostic</th><th>Traitement</th></tr></thead>
                  <tbody>
                    {filteredConsultations.map(cons => (
                      <tr key={cons.id}>
                        <td>{new Date(cons.dateTime).toLocaleDateString()}</td>
                        <td>{cons.patientNom}</td>
                        <td>{cons.diagnostic || "—"}</td>
                        <td>{cons.traitement || "—"}</td>
                      </tr>
                    ))}
                    {filteredConsultations.length === 0 && (
                      <tr><td colSpan="4" style={{textAlign:"center"}}>Aucune consultation</td>
                    </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* MES RENDEZ-VOUS */}
          {activeTab === "appointments" && (
            <div className="recent-section">
              <h2>📅 Tous mes rendez-vous</h2>
              <div className="table-responsive">
                <table className="data-table">
                  <thead><tr><th>Date & heure</th><th>Patient</th><th>Statut</th></tr></thead>
                  <tbody>
                    {appointments.map(rdv => (
                      <tr key={rdv.id}>
                        <td>{new Date(rdv.dateTime).toLocaleString()}</td>
                        <td>{rdv.patientNom}</td>
                        <td><span className={`badge ${rdv.status === "CONFIRME" ? "green" : "yellow"}`}>{rdv.status}</span></td>
                       
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* DOCUMENTS */}
          {activeTab === "documents" && (
            <div className="recent-section">
              <h2>📄 Documents médicaux</h2>
              <div className="table-responsive">
                <table className="data-table">
                  <thead><tr><th>Patient</th><th>Type</th><th>Date</th><th>Actions</th></tr></thead>
                  <tbody>
                    {appointments.map(rdv => (
                      <tr key={rdv.id}>
                        <td>{rdv.patientNom}</td>
                        <td>
                          <select onChange={(e) => setDocumentType(e.target.value)}>
                            <option value="ordonnance">Ordonnance</option>
                            <option value="certificat">Certificat médical</option>
                            <option value="compteRendu">Compte rendu</option>
                          </select>
                        </td>
                        <td>{new Date().toLocaleDateString()}</td>
                        <td><button className="icon-btn" onClick={() => openDocumentModal(rdv)}><FaPrint /> Imprimer</button></td>
                      </tr>
                    ))}
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

      {/* MODAL CONSULTATION */}
      {showConsultationModal && (
        <div className="modal-overlay" onClick={() => setShowConsultationModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Consultation - {selectedPatient?.patientName}</h3>
              <button onClick={() => setShowConsultationModal(false)}><FaTimes /></button>
            </div>
            <form onSubmit={handleSaveConsultation}>
              <textarea placeholder="Diagnostic *" rows="3" value={consultationData.diagnostic} onChange={(e) => setConsultationData({...consultationData, diagnostic: e.target.value})} required />
              <textarea placeholder="Prescription / Traitement" rows="3" value={consultationData.prescription} onChange={(e) => setConsultationData({...consultationData, prescription: e.target.value})} />
              <textarea placeholder="Notes" rows="2" value={consultationData.notes} onChange={(e) => setConsultationData({...consultationData, notes: e.target.value})} />
              <button type="submit" className="save-changes-btn" disabled={submitting}>
                {submitting ? "Enregistrement..." : "Enregistrer"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DOCUMENT */}
      {showDocumentModal && (
        <div className="modal-overlay" onClick={() => setShowDocumentModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>📄 Établir un document - {selectedPatient?.patientName}</h3>
              <button onClick={() => setShowDocumentModal(false)}><FaTimes /></button>
            </div>
            <div className="form-grid">
              <select value={documentType} onChange={(e) => setDocumentType(e.target.value)}>
                <option value="ordonnance">Ordonnance</option>
                <option value="certificat">Certificat médical</option>
                <option value="compteRendu">Compte rendu</option>
              </select>
              <textarea placeholder="Contenu du document..." rows="6" value={documentContent} onChange={(e) => setDocumentContent(e.target.value)} />
            </div>
            <button className="save-changes-btn" onClick={handlePrintDocument}><FaPrint /> Imprimer</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedecinDashboard;