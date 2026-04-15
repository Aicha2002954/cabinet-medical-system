import React, { useState } from 'react';
import api from '../services/api';

function Login({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.post('/v1/users/login', { email, password });
            localStorage.setItem('token', response.data.accessToken);
            onLogin();
        } catch (err) {
            setError('Email ou mot de passe incorrect');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-4">
                    <div className="card shadow">
                        <div className="card-header bg-primary text-white text-center">
                            <h4>🏥 Cabinet Médical</h4>
                            <h6>Connexion</h6>
                        </div>
                        <div className="card-body">
                            {error && <div className="alert alert-danger">{error}</div>}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Mot de passe</label>
                                    <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                </div>
                                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                                    {loading ? 'Connexion...' : 'Se connecter'}
                                </button>
                            </form>
                            <div className="text-center mt-3 small text-muted">
                                admin@cabinet.com / admin123
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;