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
            const res = await api.get('/api/patients');
            setPatients(res.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.reload();
    };

    if (loading) return <div>Chargement...</div>;

    return (
        <div>
            <button onClick={handleLogout}>Déconnexion</button>
            <h2>Patients</h2>
            <ul>
                {patients.map(p => <li key={p.id}>{p.firstName} {p.lastName}</li>)}
            </ul>
        </div>
    );
}

export default Dashboard;