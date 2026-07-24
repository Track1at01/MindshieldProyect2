import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

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
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            background: '#1a1a2e'
        }}>
            <form onSubmit={handleSubmit} style={{
                background: 'white',
                padding: '2rem',
                borderRadius: '8px',
                width: '100%',
                maxWidth: '400px'
            }}>
                <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Registro</h2>
                {error && <div style={{ color: '#e94560', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
                <div style={{ marginBottom: '1rem' }}>
                    <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required
                        style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }} />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <input name="username" placeholder="Usuario" value={form.username} onChange={handleChange} required
                        style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }} />
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                    <input name="password" type="password" placeholder="Contraseña" value={form.password} onChange={handleChange} required
                        style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }} />
                </div>
                <button type="submit" style={{
                    width: '100%', padding: '0.75rem', background: '#16213e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'
                }}>
                    Registrarse
                </button>
                <p style={{ textAlign: 'center', marginTop: '1rem' }}>
                    <Link to="/login" style={{ color: '#16213e' }}>¿Ya tienes cuenta? Inicia sesión</Link>
                </p>
            </form>
        </div>
    );
};

export default Register;