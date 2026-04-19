import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, PieChart, Pie, Cell, Legend,
  RadialBarChart, RadialBar
} from 'recharts';
import {
  FaUser, FaCalendarAlt, FaStethoscope, FaFileInvoice, FaHospitalUser
} from "react-icons/fa";
import './AdminDashboard.css';
import Sidebar from "../hedare/Sidebar";
import TopHeader from "../hedare/TopHeader";

// استيراد التبويبات الموجودة
import PatientsTab from "./PatientsTab";
import RendezVousTab from "./RendezVousTab";
import ConsultationsTab from "./ConsultationsTab";
import FacturesTab from "./FacturesTab";
import UsersTab from "./UsersTab";

// استيراد التبويبات الجديدة
import MedecinsTab from "./MedecinsTab";
import SecretaireTab from "./SecretaireTab";
import SalleAttenteTab from "./SalleAttenteTab";
import HistoriqueVisitesTab from "./HistoriqueVisitesTab";

const API_BASE = "http://localhost:8087";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [stats, setStats] = useState({
    patients: 0,
    rendezvous: 0,
    consultations: 0,
    factures: 0,
    medecins: 0
  });
  const [weeklyData, setWeeklyData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [completionData, setCompletionData] = useState([]);
  const [recentPatients, setRecentPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const patientsRes = await axios.get(`${API_BASE}/api/patients`, config);
      const patients = patientsRes.data;
      setStats(prev => ({ ...prev, patients: patients.length }));

      const rdvRes = await axios.get(`${API_BASE}/api/rendezvous`, config);
      const rdvs = rdvRes.data;
      setStats(prev => ({ ...prev, rendezvous: rdvs.length }));

      const consRes = await axios.get(`${API_BASE}/api/consultations`, config);
      setStats(prev => ({ ...prev, consultations: consRes.data.length }));

      const factRes = await axios.get(`${API_BASE}/api/factures`, config);
      setStats(prev => ({ ...prev, factures: factRes.data.length }));

      // Médecins via /api/profiles
      try {
        const profilesRes = await axios.get(`${API_BASE}/api/profiles`, config);
        const allUsers = profilesRes.data;
        const medecinsCount = allUsers.filter(user => user.role === "MEDECIN").length;
        setStats(prev => ({ ...prev, medecins: medecinsCount }));
      } catch (e) {
        console.warn("Médecins non chargés via /api/profiles", e);
      }

      // BarChart data
      const weekDays = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
      const weekCounts = new Array(7).fill(0);
      rdvs.forEach(rdv => {
        const date = new Date(rdv.dateTime);
        if (!isNaN(date)) {
          let day = date.getDay();
          let idx = day === 0 ? 6 : day - 1;
          weekCounts[idx]++;
        }
      });
      setWeeklyData(weekDays.map((d, i) => ({ day: d, count: weekCounts[i] })));

      // PieChart data
      const statusCount = { EN_ATTENTE: 0, CONFIRME: 0, ANNULE: 0, TERMINE: 0 };
      rdvs.forEach(rdv => {
        const s = rdv.status;
        if (statusCount.hasOwnProperty(s)) statusCount[s]++;
      });
      const pieData = Object.keys(statusCount).map(key => ({
        name: key === "EN_ATTENTE" ? "En attente" : key === "CONFIRME" ? "Confirmé" : key === "ANNULE" ? "Annulé" : "Terminé",
        value: statusCount[key],
        color: key === "CONFIRME" ? "#10b981" : key === "EN_ATTENTE" ? "#f59e0b" : key === "ANNULE" ? "#ef4444" : "#8b5cf6"
      }));
      setStatusData(pieData);

      // RadialBarChart
      const completed = rdvs.filter(r => r.status === "TERMINE").length;
      const upcoming = rdvs.filter(r => r.status === "CONFIRME" || r.status === "EN_ATTENTE").length;
      setCompletionData([
        { name: "Terminés", value: completed, fill: "#10b981" },
        { name: "À venir", value: upcoming, fill: "#3b82f6" }
      ]);

      const recent = patients.slice(-5).reverse();
      setRecentPatients(recent);
    } catch (err) {
      console.error("Erreur chargement dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark-mode", !darkMode);
  };

  const handleSetActiveTab = (tab) => {
    setActiveTab(tab);
    if (window.innerWidth <= 768) setIsMenuOpen(false);
  };

  return (
    <div className={`admin-dashboard ${darkMode ? "dark" : "light"}`}>
      <Sidebar activeTab={activeTab} setActiveTab={handleSetActiveTab} />
      <main className="main-area">
        <TopHeader
          activeTab={activeTab}
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          darkMode={darkMode}
          toggleTheme={toggleTheme}
        />
        <div className="content-wrapper">
          {activeTab === "dashboard" && (
            <div className="dashboard-view">
              {loading ? (
                <div className="loader">Chargement...</div>
              ) : (
                <>
                  {/* Cartes statistiques */}
                  <div className="stats-grid">
                    <div className="stat-card purple"><div className="stat-icon"><FaUser /></div><div className="stat-info"><h3>{stats.patients}</h3><p>Patients</p></div></div>
                    <div className="stat-card blue"><div className="stat-icon"><FaCalendarAlt /></div><div className="stat-info"><h3>{stats.rendezvous}</h3><p>Rendez-vous</p></div></div>
                    <div className="stat-card green"><div className="stat-icon"><FaStethoscope /></div><div className="stat-info"><h3>{stats.consultations}</h3><p>Consultations</p></div></div>
                    <div className="stat-card orange"><div className="stat-icon"><FaFileInvoice /></div><div className="stat-info"><h3>{stats.factures}</h3><p>Factures</p></div></div>
                    <div className="stat-card teal"><div className="stat-icon"><FaHospitalUser /></div><div className="stat-info"><h3>{stats.medecins}</h3><p>Médecins</p></div></div>
                  </div>

                  {/* Graphiques */}
                  <div className="charts-row">
                    <div className="chart-card"><h3>Rendez-vous par jour</h3><ResponsiveContainer width="100%" height={280}><BarChart data={weeklyData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="day" /><YAxis /><Tooltip /><Bar dataKey="count" fill="#3b82f6" radius={[8,8,0,0]} /></BarChart></ResponsiveContainer></div>
                    <div className="chart-card"><h3>Répartition par statut</h3><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={90} label>{statusData.map((e,i)=><Cell key={i} fill={e.color} />)}</Pie><Tooltip /><Legend /></PieChart></ResponsiveContainer></div>
                  </div>
                  <div className="charts-row single-chart"><div className="chart-card"><h3>Taux d'accomplissement</h3><ResponsiveContainer width="100%" height={300}><RadialBarChart innerRadius="30%" outerRadius="90%" data={completionData} startAngle={180} endAngle={0}><RadialBar minAngle={15} background clockWise dataKey="value" /><Legend /><Tooltip /></RadialBarChart></ResponsiveContainer></div></div>

                  {/* Derniers patients - tableau corrigé */}
                  <div className="recent-section">
                    <div className="section-header">
                      <h3>Derniers patients</h3>
                      <button className="btn-link" onClick={() => handleSetActiveTab("patients")}>Voir tous</button>
                    </div>
                    <div className="table-responsive">
                      <table className="data-table">
                        <thead>
                          <tr><th>ID</th><th>Prénom</th><th>Nom</th><th>Email</th><th>Téléphone</th></tr>
                        </thead>
                        <tbody>
                          {recentPatients.map(p => (
                            <tr key={p.id}>
                              <td>{p.id}</td>
                              <td>{p.firstName}</td>
                              <td>{p.lastName}</td>
                              <td>{p.email}</td>
                              <td>{p.phone || "—"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
          {activeTab === "patients" && <PatientsTab onPatientsUpdate={(count)=>setStats(prev=>({...prev, patients:count}))} />}
          {activeTab === "medecins" && <MedecinsTab onMedecinsUpdate={(count)=>setStats(prev=>({...prev, medecins:count}))} />}
          {activeTab === "secretaires" && <SecretaireTab onSecretaireUpdate={(count)=>console.log("Secrétaires:",count)} />}
          {activeTab === "salleAttente" && <SalleAttenteTab />}
          {activeTab === "historiqueVisites" && <HistoriqueVisitesTab />}
          {activeTab === "rendezvous" && <RendezVousTab />}
          {activeTab === "consultations" && <ConsultationsTab />}
          {activeTab === "factures" && <FacturesTab />}
          {activeTab === "users" && <UsersTab />}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;