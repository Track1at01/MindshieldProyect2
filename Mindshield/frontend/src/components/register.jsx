import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './register.css';

const Register = () => {
    const [form, setForm] = useState({ email: '', username: '', password: '' });
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (form.password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }
        try {
            await register(form);
            navigate('/projects');
        } catch (err) {
            setError(err.response?.data?.detail || 'Error al registrarse');
        }
    };

    return (
        <div className="auth-page">
            <form onSubmit={handleSubmit} className="auth-card">
                <h2 className="page-title auth-card-title">Registro</h2>
                {error && <div className="alert alert-error">{error}</div>}
                <div className="form-group">
                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="input-field"
                    />
                </div>
                <div className="form-group">
                    <input
                        name="username"
                        placeholder="Usuario"
                        value={form.username}
                        onChange={handleChange}
                        required
                        className="input-field"
                    />
                </div>
                <div className="form-group">
                    <input
                        name="password"
                        type="password"
                        placeholder="Contraseña"
                        value={form.password}
                        onChange={handleChange}
                        required
                        className="input-field"
                    />
                </div>
                <button type="submit" className="button button-primary">Registrarse</button>
                <p className="auth-footer">
                    <Link to="/login" className="button button-ghost auth-footer-link">¿Ya tienes cuenta? Inicia sesión</Link>
                </p>
            </form>
        </div>
    );
};

export default Register;