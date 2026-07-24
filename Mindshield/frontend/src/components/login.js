import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

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
                <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Iniciar Sesión</h2>
                {error && <div style={{ color: '#e94560', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
                <div style={{ marginBottom: '1rem' }}>
                    <input
                        type="text"
                        placeholder="Usuario"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                </div>
                <button type="submit" style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: '#16213e',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '1rem'
                }}>
                    Entrar
                </button>
                <p style={{ textAlign: 'center', marginTop: '1rem' }}>
                    <Link to="/register" style={{ color: '#16213e' }}>¿No tienes cuenta? Regístrate</Link>
                </p>
            </form>
        </div>
    );
};

export default Login;