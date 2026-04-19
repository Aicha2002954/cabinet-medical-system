import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, PieChart, Pie, Cell, Legend,
  RadialBarChart, RadialBar
} from 'recharts';
import {
  FaUserMd, FaCalendarAlt, FaStethoscope, FaFileInvoice, FaUser,
  FaHospitalUser, FaSignOutAlt, FaBars, FaMoon, FaSun, FaBell,
  FaChartLine, FaUsers
} from "react-icons/fa";
import './AdminDashboard.css';

import PatientsTab from "./PatientsTab";
import RendezVousTab from "./RendezVousTab";
import ConsultationsTab from "./ConsultationsTab";
import FacturesTab from "./FacturesTab";
import UsersTab from "./UsersTab";

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
    medecins: 0,
    completedRdvs: 0,
    upcomingRdvs: 0
  });
  const [weeklyData, setWeeklyData] = useState([]);           // BarChart
  const [statusData, setStatusData] = useState([]);           // PieChart
  const [completionData, setCompletionData] = useState([]);   // RadialBarChart
  const [recentPatients, setRecentPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // 1. Patients
      const patientsRes = await axios.get(`${API_BASE}/api/patients`, config);
      const patients = patientsRes.data;
      setStats(prev => ({ ...prev, patients: patients.length }));

      // 2. Rendez-vous
      const rdvRes = await axios.get(`${API_BASE}/api/rendezvous`, config);
      const rdvs = rdvRes.data;
      setStats(prev => ({ ...prev, rendezvous: rdvs.length }));

      // 3. Consultations
      const consRes = await axios.get(`${API_BASE}/api/consultations`, config);
      setStats(prev => ({ ...prev, consultations: consRes.data.length }));

      // 4. Factures
      const factRes = await axios.get(`${API_BASE}/api/factures`, config);
      setStats(prev => ({ ...prev, factures: factRes.data.length }));

      // 5. Médecins
      try {
        const medRes = await axios.get(`${API_BASE}/api/users?role=MEDECIN`, config);
        setStats(prev => ({ ...prev, medecins: medRes.data.length }));
      } catch (e) { console.warn("Médecins non chargés", e); }

      // 6. BarChart: Rendez-vous par jour de la semaine
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

      // 7. PieChart: Répartition par statut
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

      // 8. RadialBarChart: Taux d'accomplissement
      const completed = rdvs.filter(r => r.status === "TERMINE").length;
      const upcoming = rdvs.filter(r => r.status === "CONFIRME" || r.status === "EN_ATTENTE").length;
      setStats(prev => ({ ...prev, completedRdvs: completed, upcomingRdvs: upcoming }));
      setCompletionData([
        { name: "Terminés", value: completed, fill: "#10b981" },
        { name: "À venir / En cours", value: upcoming, fill: "#3b82f6" }
      ]);

      // 9. Derniers patients
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className={`admin-dashboard ${darkMode ? "dark" : "light"}`}>
      <aside className={`sidebar ${sidebarCollapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          <div className="logo">
            <FaStethoscope className="logo-icon" />
            {!sidebarCollapsed && <span>MediCare Admin</span>}
          </div>
          <button className="collapse-btn" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
            <FaBars />
          </button>
        </div>
        <ul className="sidebar-nav">
          <li className={activeTab === "dashboard" ? "active" : ""} onClick={() => setActiveTab("dashboard")}>
            <FaChartLine /> {!sidebarCollapsed && <span>Tableau de bord</span>}
          </li>
          <li className={activeTab === "patients" ? "active" : ""} onClick={() => setActiveTab("patients")}>
            <FaUser /> {!sidebarCollapsed && <span>Patients</span>}
          </li>
          <li className={activeTab === "rendezvous" ? "active" : ""} onClick={() => setActiveTab("rendezvous")}>
            <FaCalendarAlt /> {!sidebarCollapsed && <span>Rendez-vous</span>}
          </li>
          <li className={activeTab === "consultations" ? "active" : ""} onClick={() => setActiveTab("consultations")}>
            <FaStethoscope /> {!sidebarCollapsed && <span>Consultations</span>}
          </li>
          <li className={activeTab === "factures" ? "active" : ""} onClick={() => setActiveTab("factures")}>
            <FaFileInvoice /> {!sidebarCollapsed && <span>Factures</span>}
          </li>
          <li className={activeTab === "users" ? "active" : ""} onClick={() => setActiveTab("users")}>
            <FaUsers /> {!sidebarCollapsed && <span>Utilisateurs</span>}
          </li>
        </ul>
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <FaSignOutAlt /> {!sidebarCollapsed && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>

      <main className="main-area">
        <header className="top-header">
          <div className="header-left">
            <h2>{activeTab === "dashboard" ? "Tableau de bord" : 
                 activeTab === "patients" ? "Gestion des patients" :
                 activeTab === "rendezvous" ? "Rendez-vous" :
                 activeTab === "consultations" ? "Consultations" :
                 activeTab === "factures" ? "Factures" : "Utilisateurs"}</h2>
          </div>
          <div className="header-right">
            <button className="icon-btn"><FaBell /></button>
            <button className="icon-btn" onClick={toggleTheme}>
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>
            <div className="user-profile">
              <img src="https://randomuser.me/api/portraits/men/1.jpg" alt="Admin" />
              <span>Admin</span>
            </div>
          </div>
        </header>

        <div className="content-wrapper">
          {activeTab === "dashboard" && (
            <div className="dashboard-view">
              {loading ? (
                <div className="loader">Chargement des données...</div>
              ) : (
                <>
                  {/* Cartes statistiques */}
                  <div className="stats-grid">
                    <div className="stat-card purple">
                      <div className="stat-icon"><FaUser /></div>
                      <div className="stat-info">
                        <h3>{stats.patients}</h3>
                        <p>Patients</p>
                      </div>
                    </div>
                    <div className="stat-card blue">
                      <div className="stat-icon"><FaCalendarAlt /></div>
                      <div className="stat-info">
                        <h3>{stats.rendezvous}</h3>
                        <p>Rendez-vous</p>
                      </div>
                    </div>
                    <div className="stat-card green">
                      <div className="stat-icon"><FaStethoscope /></div>
                      <div className="stat-info">
                        <h3>{stats.consultations}</h3>
                        <p>Consultations</p>
                      </div>
                    </div>
                    <div className="stat-card orange">
                      <div className="stat-icon"><FaFileInvoice /></div>
                      <div className="stat-info">
                        <h3>{stats.factures}</h3>
                        <p>Factures</p>
                      </div>
                    </div>
                    <div className="stat-card teal">
                      <div className="stat-icon"><FaHospitalUser /></div>
                      <div className="stat-info">
                        <h3>{stats.medecins}</h3>
                        <p>Médecins</p>
                      </div>
                    </div>
                  </div>

                  {/* Graphiques : BarChart + PieChart */}
                  <div className="charts-row">
                    <div className="chart-card">
                      <h3>📊 Rendez-vous par jour de la semaine</h3>
                      <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={weeklyData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="day" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="count" fill="#3b82f6" radius={[8,8,0,0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="chart-card">
                      <h3>🥧 Répartition par statut</h3>
                      <ResponsiveContainer width="100%" height={280}>
                        <PieChart>
                          <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={90} label>
                            {statusData.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* RadialBarChart seul (centré) */}
                  <div className="charts-row single-chart">
                    <div className="chart-card">
                      <h3>🎯 Taux d'accomplissement des rendez-vous</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <RadialBarChart innerRadius="30%" outerRadius="90%" data={completionData} startAngle={180} endAngle={0}>
                          <RadialBar minAngle={15} background clockWise dataKey="value" />
                          <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
                          <Tooltip />
                        </RadialBarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Derniers patients */}
                  <div className="recent-section">
                    <div className="section-header">
                      <h3>📋 Derniers patients inscrits</h3>
                      <button className="btn-link" onClick={() => setActiveTab("patients")}>Voir tous</button>
                    </div>
                    <div className="table-responsive">
                      <table className="data-table">
                        <thead>
                          <tr><th>ID</th><th>Prénom</th><th>Nom</th><th>Email</th><th>Téléphone</th></tr>
                        </thead>
                        <tbody>
                          {recentPatients.length > 0 ? recentPatients.map(p => (
                            <tr key={p.id}>
                              <td>{p.id}</td>
                              <td>{p.firstName}</td>
                              <td>{p.lastName}</td>
                              <td>{p.email}</td>
                              <td>{p.phone || "—"}</td>
                            </tr>
                          )) : (
                            <tr><td colSpan="5">Aucun patient trouvé</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === "patients" && <PatientsTab />}
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