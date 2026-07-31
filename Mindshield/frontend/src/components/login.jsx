import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(username, password);
            navigate('/projects');
        } catch (err) {
            setError(err.response?.data?.detail || 'Error al iniciar sesión');
        }
    };

    return (
        <div className="auth-page">
            <form onSubmit={handleSubmit} className="auth-card">
                <h2 className="page-title auth-card-title">Iniciar Sesión</h2>
                {error && <div className="alert alert-error">{error}</div>}
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Usuario"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="input-field"
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="input-field"
                    />
                </div>
                <button type="submit" className="button button-primary">Entrar</button>
                <p className="auth-footer">
                    <Link to="/register" className="button button-ghost auth-footer-link">¿No tienes cuenta? Regístrate</Link>
                </p>
            </form>
        </div>
    );
};

export default Login;