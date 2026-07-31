import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './layout.css';

const Layout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="page-shell">
            <nav className="topbar">
                <Link to="/projects" className="brand">
                    Kanban
                </Link>
                <div className="topbar-actions">
                    <span className="subtitle">{user?.username} ({user?.role})</span>
                    <button onClick={handleLogout} className="button button-danger">
                        Cerrar sesión
                    </button>
                </div>
            </nav>
            <main className="content-panel">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;