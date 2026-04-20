import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../hedare/Sidebar";
import TopHeader from "../hedare/TopHeader";
import UserProfile from "../Profile/UserProfile";
import EditProfile from "../Profile/EditProfile";
import {
  FaCalendarAlt,
  FaStethoscope,
  FaFileInvoice,
  FaCheckCircle
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
  const [loading, setLoading] = useState(true);

  const API_BASE = "http://localhost:8087";
  const getAuthHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`
  });

  // Récupérer les informations du patient connecté
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return null;
      }
      const payload = JSON.parse(atob(token.split(".")[1]));
      const userEmail = payload.email || payload.sub;
      const res = await axios.get(`${API_BASE}/api/profiles`, {
        headers: getAuthHeader()
      });
      const currentUser = res.data.find((u) => u.email === userEmail);
      if (!currentUser) navigate("/login");
      return currentUser;
    } catch (err) {
      console.error("Erreur lors de la récupération du profil :", err);
      navigate("/login");
      return null;
    }
  };

  // Récupérer les rendez‑vous du patient
  const fetchAppointments = async (patientId) => {
    try {
      const res = await axios.get(`${API_BASE}/api/rendezvous`, {
        headers: getAuthHeader()
      });
      const myRdvs = res.data.filter((rdv) => rdv.patientId === patientId);
      setAppointments(myRdvs);
    } catch (err) {
      console.error("Erreur lors du chargement des rendez‑vous :", err);
    }
  };

  // Récupérer les consultations du patient
  const fetchConsultations = async (patientId) => {
    try {
      const res = await axios.get(`${API_BASE}/api/consultations`, {
        headers: getAuthHeader()
      });
      const myCons = res.data.filter((cons) => cons.patientId === patientId);
      setConsultations(myCons);
    } catch (err) {
      console.error("Erreur lors du chargement des consultations :", err);
    }
  };

  // Récupérer les factures du patient
  const fetchInvoices = async (patientId) => {
    try {
      const res = await axios.get(`${API_BASE}/api/factures`, {
        headers: getAuthHeader()
      });
      const myFacts = res.data.filter((fact) => fact.patientId === patientId);
      setInvoices(myFacts);
    } catch (err) {
      console.error("Erreur lors du chargement des factures :", err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const currentUser = await fetchUser();
      if (currentUser) {
        setUser(currentUser);
        await Promise.all([
          fetchAppointments(currentUser.userId),
          fetchConsultations(currentUser.userId),
          fetchInvoices(currentUser.userId)
        ]);
      }
      setLoading(false);
    };
    loadData();
  }, []);

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
  if (!user) return <div className="error">Impossible de charger vos données. Veuillez vous reconnecter.</div>;

  // Statistiques
  const upcomingAppointments = appointments.filter(
    (a) => new Date(a.dateTime) > new Date()
  ).length;
  const pastConsultations = consultations.length;
  const totalInvoices = invoices.length;

  return (
    <div className={`admin-dashboard ${darkMode ? "dark" : "light"}`}>
      <Sidebar activeTab={activeTab} setActiveTab={handleSetActiveTab} role="PATIENT" />
      <main className="main-area">
        <TopHeader
          activeTab={activeTab}
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          darkMode={darkMode}
          toggleTheme={toggleTheme}
          user={user}
        />
        <div className="content-wrapper">
          {/* Tableau de bord principal */}
          {activeTab === "dashboard" && (
            <div className="dashboard-view">
              {/* Cartes statistiques */}
              <div className="stats-grid">
                <div className="stat-card purple">
                  <div className="stat-icon"><FaCalendarAlt /></div>
                  <div className="stat-info"><h3>{upcomingAppointments}</h3><p>Rendez‑vous à venir</p></div>
                </div>
                <div className="stat-card blue">
                  <div className="stat-icon"><FaCheckCircle /></div>
                  <div className="stat-info"><h3>{pastConsultations}</h3><p>Consultations effectuées</p></div>
                </div>
                <div className="stat-card green">
                  <div className="stat-icon"><FaFileInvoice /></div>
                  <div className="stat-info"><h3>{totalInvoices}</h3><p>Factures</p></div>
                </div>
              </div>

              {/* Prochains rendez‑vous */}
              <div className="recent-section">
                <h3>📅 Prochains rendez‑vous</h3>
                <div className="table-responsive">
                  <table className="data-table">
                    <thead><tr><th>Date & heure</th><th>Médecin</th><th>Statut</th></tr></thead>
                    <tbody>
                      {appointments.filter(a => new Date(a.dateTime) > new Date()).slice(0,5).map(rdv => (
                        <tr key={rdv.id}>
                          <td>{new Date(rdv.dateTime).toLocaleString()}</td>
                          <td>{rdv.medecinNom || "Docteur"}</td>
                          <td><span className={`badge ${rdv.status === "CONFIRME" ? "green" : "yellow"}`}>
                            {rdv.status === "CONFIRME" ? "Confirmé" : rdv.status === "EN_ATTENTE" ? "En attente" : rdv.status}
                          </span></td>
                        </tr>
                      ))}
                      {upcomingAppointments === 0 && <tr><td colSpan="3">Aucun rendez‑vous programmé</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Dernières consultations */}
              <div className="recent-section">
                <h3>🩺 Dernières consultations</h3>
                <div className="table-responsive">
                  <table className="data-table">
                    <thead><tr><th>Date</th><th>Médecin</th><th>Diagnostic</th></tr></thead>
                    <tbody>
                      {consultations.slice(-5).reverse().map(cons => (
                        <tr key={cons.id}>
                          <td>{new Date(cons.dateTime).toLocaleDateString()}</td>
                          <td>{cons.medecinNom || "Docteur"}</td>
                          <td>{cons.diagnostic || "—"}</td>
                        </tr>
                      ))}
                      {consultations.length === 0 && <tr><td colSpan="3">Aucune consultation enregistrée</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )} {/* Fin de dashboard-view */}

          {/* Mes rendez‑vous */}
          {activeTab === "appointments" && (
            <div className="recent-section">
              <h2>📅 Tous mes rendez‑vous</h2>
              <div className="table-responsive">
                <table className="data-table">
                  <thead><tr><th>Date & heure</th><th>Médecin</th><th>Statut</th></tr></thead>
                  <tbody>
                    {appointments.map(rdv => (
                      <tr key={rdv.id}>
                        <td>{new Date(rdv.dateTime).toLocaleString()}</td>
                        <td>{rdv.medecinNom || "Docteur"}</td>
                        <td><span className={`badge ${rdv.status === "CONFIRME" ? "green" : "yellow"}`}>
                          {rdv.status === "CONFIRME" ? "Confirmé" : rdv.status === "EN_ATTENTE" ? "En attente" : rdv.status}
                        </span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Mes consultations */}
          {activeTab === "consultations" && (
            <div className="recent-section">
              <h2>🩺 Historique des consultations</h2>
              <div className="table-responsive">
                <table className="data-table">
                  <thead><tr><th>Date</th><th>Médecin</th><th>Diagnostic</th><th>Traitement</th></tr></thead>
                  <tbody>
                    {consultations.map(cons => (
                      <tr key={cons.id}>
                        <td>{new Date(cons.dateTime).toLocaleDateString()}</td>
                        <td>{cons.medecinNom || "Docteur"}</td>
                        <td>{cons.diagnostic || "—"}</td>
                        <td>{cons.traitement || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Mes factures */}
          {activeTab === "invoices" && (
            <div className="recent-section">
              <h2>💰 Mes factures</h2>
              <div className="table-responsive">
                <table className="data-table">
                  <thead><tr><th>N° Facture</th><th>Date</th><th>Montant</th><th>Statut</th></tr></thead>
                  <tbody>
                    {invoices.map(fact => (
                      <tr key={fact.id}>
                        <td>{fact.numero || fact.id}</td>
                        <td>{new Date(fact.date).toLocaleDateString()}</td>
                        <td>{fact.montant} DH</td>
                        <td><span className={`badge ${fact.paye ? "green" : "red"}`}>{fact.paye ? "Payée" : "Impayée"}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Mon profil */}
          {activeTab === "profile" && (
            !isEditingProfile ? (
              <UserProfile onEdit={() => setIsEditingProfile(true)} />
            ) : (
              <EditProfile
                onCancel={() => setIsEditingProfile(false)}
                onSuccess={() => setIsEditingProfile(false)}
              />
            )
          )}
        </div>
      </main>
    </div>
  );
};

export default PatientDashboard;