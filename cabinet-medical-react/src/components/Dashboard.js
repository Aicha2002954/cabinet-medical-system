import React, { useState, useEffect } from 'react';
import api from '../services/api';

function Dashboard() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPatients();
    }, []);

    const loadPatients = async () => {
        try {
            const response = await api.get('/api/patients');
            setPatients(response.data || []);
        } catch (error) {
            console.error("Erreur:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.reload();
    };

    if (loading) {
        return <div className="text-center mt-5"><div className="spinner-border"></div><p>Chargement...</p></div>;
    }

    return (
        <div className="container-fluid">
            <nav className="navbar navbar-dark bg-dark mb-4">
                <div className="container-fluid">
                    <span className="navbar-brand h1">🏥 Cabinet Médical</span>
                    <button onClick={handleLogout} className="btn btn-outline-light">Déconnexion</button>
                </div>
            </nav>

            <div className="card">
                <div className="card-header bg-primary text-white">
                    <h5 className="mb-0">Liste des Patients</h5>
                </div>
                <div className="card-body">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Prénom</th>
                                <th>Nom</th>
                                <th>Email</th>
                                <th>Téléphone</th>
                            </tr>
                        </thead>
                        <tbody>
                            {patients.map(p => (
                                <tr key={p.id}>
                                    <td>{p.id}</td>
                                    <td>{p.firstName}</td>
                                    <td>{p.lastName}</td>
                                    <td>{p.email}</td>
                                    <td>{p.phone || '-'}</td>
                                </tr>
                            ))}
                            {patients.length === 0 && (
                                <tr><td colSpan="5" className="text-center">Aucun patient</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;