import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaSearch, FaFilter, FaTimes, FaUserTag, FaSave } from "react-icons/fa";
import "./UsersTab.css";

const UsersTab = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editRole, setEditRole] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const API_BASE = "http://localhost:8087";
  const getAuthHeader = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/profiles`, { headers: getAuthHeader() });
      setUsers(res.data);
      setFilteredUsers(res.data);
    } catch (err) {
      console.error("Erreur chargement utilisateurs:", err);
      alert("Impossible de charger les utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  useEffect(() => {
    let filtered = [...users];
    if (searchTerm) {
      filtered = filtered.filter(u =>
        u.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (roleFilter !== "all") {
      filtered = filtered.filter(u => u.role === roleFilter);
    }
    setFilteredUsers(filtered);
  }, [searchTerm, roleFilter, users]);

  const updateUserRole = async () => {
    if (!selectedUser) return;
    setActionLoading(true);
    try {
      await axios.patch(`${API_BASE}/api/profiles/${selectedUser.userId}/role`, null, {
        params: { role: editRole },
        headers: getAuthHeader()
      });
      alert(`Rôle mis à jour : ${editRole} ✅`);
      loadUsers();
      setShowEditModal(false);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la mise à jour du rôle");
    } finally {
      setActionLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm("Supprimer définitivement cet utilisateur ?")) {
      setActionLoading(true);
      try {
        await axios.delete(`${API_BASE}/api/profiles/${userId}`, { headers: getAuthHeader() });
        alert("Utilisateur supprimé ✅");
        loadUsers();
      } catch (err) {
        alert("Erreur lors de la suppression");
      } finally {
        setActionLoading(false);
      }
    }
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setEditRole(user.role);
    setShowEditModal(true);
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case "ADMIN": return "Administrateur";
      case "MEDECIN": return "Médecin";
      case "SECRETAIRE": return "Secrétaire";
      case "PATIENT": return "Patient";
      default: return role;
    }
  };

  if (loading) return <div className="loader">Chargement des utilisateurs...</div>;

  return (
    <div className="premium-patients-container">
      <div className="toolbar-premium">
        <div className="search-premium">
          <FaSearch />
          <input
            type="text"
            placeholder="Rechercher par nom, prénom, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <FaFilter />
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            <option value="all">Tous les rôles</option>
            <option value="ADMIN">Administrateur</option>
            <option value="MEDECIN">Médecin</option>
            <option value="SECRETAIRE">Secrétaire</option>
            <option value="PATIENT">Patient</option>
          </select>
        </div>
      </div>

      <div className="luxury-table-wrapper">
        <table className="luxury-table">
          <thead>
            <tr>
              <th>Nom complet</th>
              <th>Email</th>
              <th>Téléphone</th>
              <th>Rôle</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.userId}>
                <td><strong>{user.firstName} {user.lastName}</strong></td>
                <td>{user.email}</td>
                <td>{user.phone || "—"}</td>
                <td>{getRoleLabel(user.role)}</td>
                <td className="action-icons">
                  <button className="icon-btn edit" onClick={() => openEditModal(user)} title="Modifier le rôle">
                    <FaUserTag />
                  </button>
                  <button className="icon-btn delete" onClick={() => deleteUser(user.userId)} title="Supprimer">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>Aucun utilisateur trouvé</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal d'édition du rôle */}
      {showEditModal && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Modifier le rôle de {selectedUser.firstName} {selectedUser.lastName}</h3>
              <button onClick={() => setShowEditModal(false)}><FaTimes /></button>
            </div>
            <div className="form-grid">
              <label>Nouveau rôle</label>
              <select value={editRole} onChange={(e) => setEditRole(e.target.value)}>
                <option value="ADMIN">Administrateur</option>
                <option value="MEDECIN">Médecin</option>
                <option value="SECRETAIRE">Secrétaire</option>
                <option value="PATIENT">Patient</option>
              </select>
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowEditModal(false)}>Annuler</button>
              <button className="btn-confirm" onClick={updateUserRole} disabled={actionLoading}>
                {actionLoading ? "Enregistrement..." : <><FaSave /> Enregistrer</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersTab;