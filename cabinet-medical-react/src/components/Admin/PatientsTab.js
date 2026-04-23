import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaEye, FaTimes, FaUser, FaSpinner, FaSearch, FaUserPlus, FaPhone, FaEnvelope, FaMapMarkerAlt, FaCity, FaFileExcel, FaFilePdf, FaChartLine } from "react-icons/fa";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import './PatientsTab.css';

const PatientsTab = ({ onPatientsUpdate }) => {
    const [patients, setPatients] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentPatient, setCurrentPatient] = useState(null);
    const [formData, setFormData] = useState({
        userId: "", firstName: "", lastName: "", email: "", phone: "", cni: "", zone: "", address: "", password: "", confirmPassword: ""
    });
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const [stats, setStats] = useState({ total: 0, newThisMonth: 0 });

    // Utiliser l'endpoint des profils (users) au lieu de /patients
    const API_URL = "http://localhost:8087/api/profiles";
    const getAuthHeader = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });

    const fetchPatients = async () => {
        try {
            const res = await axios.get(API_URL, { headers: getAuthHeader() });
            const allUsers = res.data;
            const patientsList = allUsers.filter(user => user.role === "PATIENT");
            setPatients(patientsList);
            if (onPatientsUpdate) onPatientsUpdate(patientsList.length);
            // Statistiques simplifiées (pas de createdAt dans ce service)
            setStats({ total: patientsList.length, newThisMonth: 0 });
        } catch (err) {
            console.error("Erreur chargement patients:", err);
            alert("Impossible de charger les patients.");
        }
    };

    useEffect(() => { fetchPatients(); }, []);

    const filteredPatients = patients.filter(p =>
        p.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
    const currentPatients = filteredPatients.slice((currentPage-1)*itemsPerPage, currentPage*itemsPerPage);

    const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const openModal = (patient = null) => {
        if (patient) {
            setIsEditing(true);
            setCurrentPatient(patient);
            setFormData({
                userId: patient.userId,
                firstName: patient.firstName || "",
                lastName: patient.lastName || "",
                email: patient.email || "",
                phone: patient.phone || "",
               
                address: patient.address || "",
                password: "",
                confirmPassword: ""
            });
        } else {
            setIsEditing(false);
            setFormData({ userId: "", firstName: "", lastName: "", email: "", phone: "",address: "", password: "", confirmPassword: "" });
        }
        setShowModal(true);
    };
    const closeModal = () => setShowModal(false);
    const handleSave = async (e) => {
        e.preventDefault();
        if (!isEditing && formData.password !== formData.confirmPassword) {
            alert("Mots de passe différents");
            return;
        }
        setLoading(true);
        try {
            if (isEditing) {
                const { userId, password, confirmPassword, ...payload } = formData;
                await axios.put(`${API_URL}/${userId}`, payload, { headers: getAuthHeader() });
                alert("Patient modifié ✅");
            } else {
                const { userId, confirmPassword, ...payload } = formData;
                payload.role = "PATIENT";
                await axios.post(API_URL, payload, { headers: getAuthHeader() });
                alert("Patient ajouté ✅");
            }
            closeModal();
            fetchPatients();
        } catch (err) {
            alert("Erreur: " + (err.response?.data?.message || "Vérifiez les champs"));
        } finally {
            setLoading(false);
        }
    };
    const handleDelete = async (userId) => {
        if (window.confirm("Supprimer ce patient ?")) {
            try {
                await axios.delete(`${API_URL}/${userId}`, { headers: getAuthHeader() });
                fetchPatients();
            } catch (err) {
                alert("Erreur lors de la suppression");
            }
        }
    };
    const showDetails = (p) => alert(`Détails:\nNom: ${p.firstName} ${p.lastName}\nEmail: ${p.email}\nTél: ${p.phone}\nCNI: ${p.cni || "—"}\nZone: ${p.zone || "—"}\nAdresse: ${p.address || "—"}`);

    // Export Excel
    const exportToExcel = () => {
        const exportData = filteredPatients.map(p => ({
            ID: p.userId,
            "Nom complet": `${p.firstName} ${p.lastName}`,
            Email: p.email,
            Téléphone: p.phone,
            
            Adresse: p.address || ""
        }));
        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Patients");
        XLSX.writeFile(wb, `patients_${new Date().toISOString().slice(0,19)}.xlsx`);
    };

    // Export PDF
    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text("Liste des patients", 14, 15);
        doc.setFontSize(10);
        doc.text(`Généré le ${new Date().toLocaleString()}`, 14, 22);
        const tableData = filteredPatients.map(p => [
            p.userId,
            `${p.firstName} ${p.lastName}`,
            p.email,
            p.phone,
         
            p.address || ""
        ]);
        doc.autoTable({
            head: [["ID", "Nom complet", "Email", "Téléphone", "CNI", "Zone", "Adresse"]],
            body: tableData,
            startY: 30,
            theme: "striped",
            styles: { fontSize: 8, cellPadding: 2 },
            headStyles: { fillColor: [44, 125, 160], textColor: 255 }
        });
        doc.save(`patients_${new Date().toISOString().slice(0,19)}.pdf`);
    };

    return (
        <div className="premium-patients-container">
            <div className="stats-premium-row">
                <div className="stat-premium-card"><FaUser /> <span>{stats.total}</span> <label>Total patients</label></div>
                <div className="stat-premium-card"><FaChartLine /> <span>{stats.newThisMonth}</span> <label>Nouveaux ce mois</label></div>
                <div className="stat-premium-card"><FaUserPlus /> <span>+12%</span> <label>Croissance</label></div>
            </div>

            <div className="toolbar-premium">
                <div className="search-premium">
                    <FaSearch />
                    <input type="text" placeholder="Rechercher par nom, email..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                </div>
                <div className="actions-premium">
                    <button className="btn-excel" onClick={exportToExcel}><FaFileExcel /> Excel</button>
                    <button className="btn-pdf" onClick={exportToPDF}><FaFilePdf /> PDF</button>
                    <button className="btn-add-premium" onClick={() => openModal()}><FaUserPlus /> Nouveau patient</button>
                </div>
            </div>

            <div className="luxury-table-wrapper">
                <table className="luxury-table">
                    <thead>
                        <tr>
                            <th>Patient</th>
                            <th>Contact</th>
                            <th>Localisation</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentPatients.map(p => (
                            <tr key={p.userId}>
                                <td className="patient-cell">
                                    <div className="avatar-small"><FaUser /></div>
                                    <div><strong>{p.firstName} {p.lastName}</strong><br/><small>ID: {p.userId}</small></div>
                                </td>
                                <td>{p.phone}<br/><small>{p.email}</small></td>
                                <td><small>{p.address || ""}</small></td>
                                <td className="action-icons">
                                    <button className="icon-btn view" onClick={() => showDetails(p)}><FaEye /></button>
                                    <button className="icon-btn edit" onClick={() => openModal(p)}><FaEdit /></button>
                                    <button className="icon-btn delete" onClick={() => handleDelete(p.userId)}><FaTrash /></button>
                                </td>
                            </tr>
                        ))}
                        {currentPatients.length === 0 && <tr><td colSpan="4" className="empty-row">Aucun patient trouvé</td></tr>}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="pagination-premium">
                    <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p-1)}>◀ Précédent</button>
                    <span>Page {currentPage} / {totalPages}</span>
                    <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p+1)}>Suivant ▶</button>
                </div>
            )}

            {showModal && (
                <div className="modal-premium" onClick={closeModal}>
                    <div className="modal-premium-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-premium-header">
                            <h3>{isEditing ? "Modifier patient" : "Ajouter patient"}</h3>
                            <FaTimes className="close-premium" onClick={closeModal} />
                        </div>
                        <form onSubmit={handleSave}>
                            <div className="form-grid">
                                <input name="firstName" placeholder="Prénom" value={formData.firstName} onChange={handleInputChange} required />
                                <input name="lastName" placeholder="Nom" value={formData.lastName} onChange={handleInputChange} required />
                                <input name="phone" placeholder="Téléphone" value={formData.phone} onChange={handleInputChange} required />
                                <input name="cni" placeholder="CNI" value={formData.cni} onChange={handleInputChange} />
                                <input name="zone" placeholder="Zone" value={formData.zone} onChange={handleInputChange} />
                                <input name="email" placeholder="Email" type="email" value={formData.email} onChange={handleInputChange} required disabled={isEditing} />
                                <input name="address" placeholder="Adresse" value={formData.address} onChange={handleInputChange} />
                                {!isEditing && (
                                    <>
                                        <input name="password" type="password" placeholder="Mot de passe" onChange={handleInputChange} required />
                                        <input name="confirmPassword" type="password" placeholder="Confirmer" onChange={handleInputChange} required />
                                    </>
                                )}
                            </div>
                            <button type="submit" className="save-premium" disabled={loading}>
                                {loading ? <FaSpinner className="spin" /> : "Enregistrer"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PatientsTab;