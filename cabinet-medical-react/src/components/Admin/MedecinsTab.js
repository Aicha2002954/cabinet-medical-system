import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaEye, FaTimes, FaUserMd, FaSpinner, FaSearch, FaUserPlus, FaPhone, FaEnvelope, FaMapMarkerAlt, FaIdCard, FaFileExcel, FaFilePdf, FaChartLine } from "react-icons/fa";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

const MedecinsTab = ({ onMedecinsUpdate }) => {
    const [medecins, setMedecins] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        userId: "", firstName: "", lastName: "", email: "", phone: "", cni: "", zone: "", address: "", password: "", confirmPassword: ""
    });
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const [stats, setStats] = useState({ total: 0, newThisMonth: 0 });

    const API_URL = "http://localhost:8087/api/profiles";
    const getAuthHeader = () => ({
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        'Content-Type': 'application/json'
    });

    const fetchMedecins = async () => {
        try {
            const res = await axios.get(API_URL, { headers: getAuthHeader() });
            const allUsers = res.data;
            const medecinsList = allUsers.filter(user => user.role === "MEDECIN");
            setMedecins(medecinsList);
            if (onMedecinsUpdate) onMedecinsUpdate(medecinsList.length);
            setStats({ total: medecinsList.length, newThisMonth: 0 });
        } catch (err) {
            console.error("Erreur chargement médecins :", err);
            alert("Impossible de charger les médecins.");
        }
    };

    useEffect(() => { fetchMedecins(); }, []);

    const filteredMedecins = medecins.filter(m =>
        m.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (m.cni || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (m.address || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredMedecins.length / itemsPerPage);
    const currentMedecins = filteredMedecins.slice((currentPage-1)*itemsPerPage, currentPage*itemsPerPage);

    const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const openModal = (medecin = null) => {
        if (medecin) {
            setIsEditing(true);
            setFormData({
                userId: medecin.userId,
                firstName: medecin.firstName || "",
                lastName: medecin.lastName || "",
                email: medecin.email || "",
                phone: medecin.phone || "",
                cni: medecin.cni || "",
                zone: medecin.zone || "",
                address: medecin.address || "",
                password: "",
                confirmPassword: ""
            });
        } else {
            setIsEditing(false);
            setFormData({ userId: "", firstName: "", lastName: "", email: "", phone: "", cni: "", zone: "", address: "", password: "", confirmPassword: "" });
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
                if (!formData.userId) {
                    alert("ID du médecin manquant");
                    return;
                }
                const { userId, password, confirmPassword, ...payload } = formData;
                Object.keys(payload).forEach(key => {
                    if (payload[key] === "") delete payload[key];
                });
                await axios.put(`${API_URL}/${userId}`, payload, { headers: getAuthHeader() });
                alert("Médecin modifié ✅");
            } else {
                const { userId, confirmPassword, ...payload } = formData;
                payload.role = "MEDECIN";
                Object.keys(payload).forEach(key => {
                    if (payload[key] === "") delete payload[key];
                });
                await axios.post(API_URL, payload, { headers: getAuthHeader() });
                alert("Médecin ajouté ✅");
            }
            closeModal();
            fetchMedecins();
        } catch (err) {
            console.error(err);
            alert("Erreur: " + (err.response?.data?.message || "Vérifiez les champs"));
        } finally {
            setLoading(false);
        }
    };
    const handleDelete = async (userId) => {
        if (!userId) {
            alert("ID invalide");
            return;
        }
        if (window.confirm("Supprimer ce médecin ?")) {
            try {
                await axios.delete(`${API_URL}/${userId}`, { headers: getAuthHeader() });
                fetchMedecins();
            } catch (err) {
                alert("Erreur lors de la suppression");
            }
        }
    };
    const showDetails = (m) => alert(`Détails:\nNom: ${m.firstName} ${m.lastName}\nEmail: ${m.email}\nTél: ${m.phone}\nCNI: ${m.cni || "—"}\nAdresse: ${m.address || "—"}\nZone: ${m.zone || "—"}`);

    const exportToExcel = () => {
        const data = filteredMedecins.map(m => ({
            "Nom complet": `${m.firstName} ${m.lastName}`,
            Email: m.email,
            Téléphone: m.phone,
            CNI: m.cni || "",
            Adresse: m.address || ""
        }));
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Medecins");
        XLSX.writeFile(wb, `medecins_${new Date().toISOString().slice(0,19)}.xlsx`);
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text("Liste des médecins", 14, 15);
        doc.setFontSize(10);
        doc.text(`Généré le ${new Date().toLocaleString()}`, 14, 22);
        const tableData = filteredMedecins.map(m => [
            `${m.firstName} ${m.lastName}`,
            m.email,
            m.phone,
            m.cni || "",
            m.address || ""
        ]);
        doc.autoTable({
            head: [["Nom complet", "Email", "Téléphone", "CNI", "Adresse"]],
            body: tableData, startY: 30, theme: "striped", styles: { fontSize: 8 }, headStyles: { fillColor: [44,125,160], textColor: 255 }
        });
        doc.save(`medecins_${new Date().toISOString().slice(0,19)}.pdf`);
    };

    return (
        <div className="premium-patients-container">
            <div className="stats-premium-row">
                <div className="stat-premium-card"><FaUserMd /> <span>{stats.total}</span> <label>Total médecins</label></div>
                <div className="stat-premium-card"><FaChartLine /> <span>{stats.newThisMonth}</span> <label>Nouveaux ce mois</label></div>
                <div className="stat-premium-card"><FaIdCard /> <span>CNI</span> <label>Identifiants</label></div>
            </div>
            <div className="toolbar-premium">
                <div className="search-premium"><FaSearch /><input type="text" placeholder="Rechercher..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /></div>
                <div className="actions-premium">
                    <button className="btn-excel" onClick={exportToExcel}><FaFileExcel /> Excel</button>
                    <button className="btn-pdf" onClick={exportToPDF}><FaFilePdf /> PDF</button>
                    <button className="btn-add-premium" onClick={() => openModal()}><FaUserPlus /> Nouveau médecin</button>
                </div>
            </div>
            <div className="luxury-table-wrapper">
                <table className="luxury-table">
                    <thead>
                        <tr>
                            <th>Médecin</th>
                            <th>Contact</th>
                            <th>CNI</th>
                            <th>Adresse</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentMedecins.map(m => (
                            <tr key={m.userId}>
                                <td className="patient-cell">
                                    <div className="avatar-small"><FaUserMd /></div>
                                    <div><strong>{m.firstName} {m.lastName}</strong></div>
                                </td>
                                <td>{m.phone}<br/><small>{m.email}</small></td>
                                <td>{m.cni || "—"}</td>
                                <td>{m.address || "—"}</td>
                                <td className="action-icons">
                                    <button className="icon-btn view" onClick={() => showDetails(m)}><FaEye /></button>
                                    <button className="icon-btn edit" onClick={() => openModal(m)}><FaEdit /></button>
                                    <button className="icon-btn delete" onClick={() => handleDelete(m.userId)}><FaTrash /></button>
                                </td>
                            </tr>
                        ))}
                        {currentMedecins.length === 0 && (
                            <tr key="empty-row">
                                <td colSpan="5" style={{textAlign:"center"}}>Aucun médecin trouvé</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {totalPages > 1 && (
                <div className="pagination-premium">
                    <button disabled={currentPage===1} onClick={()=>setCurrentPage(p=>p-1)}>◀ Précédent</button>
                    <span>Page {currentPage} / {totalPages}</span>
                    <button disabled={currentPage===totalPages} onClick={()=>setCurrentPage(p=>p+1)}>Suivant ▶</button>
                </div>
            )}
            {showModal && (
                <div className="modal-premium" onClick={closeModal}>
                    <div className="modal-premium-content" onClick={e=>e.stopPropagation()}>
                        <div className="modal-premium-header">
                            <h3>{isEditing ? "Modifier médecin" : "Ajouter médecin"}</h3>
                            <FaTimes className="close-premium" onClick={closeModal} />
                        </div>
                        <form onSubmit={handleSave}>
                            <div className="form-grid">
                                <input name="firstName" placeholder="Prénom" value={formData.firstName} onChange={handleInputChange} required />
                                <input name="lastName" placeholder="Nom" value={formData.lastName} onChange={handleInputChange} required />
                                <input name="phone" placeholder="Téléphone" value={formData.phone} onChange={handleInputChange} required />
                                <input name="cni" placeholder="CNI" value={formData.cni} onChange={handleInputChange} />
                                <input name="address" placeholder="Adresse" value={formData.address} onChange={handleInputChange} />
                                <input name="email" placeholder="Email" type="email" value={formData.email} onChange={handleInputChange} required disabled={isEditing} />
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

export default MedecinsTab;