import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            api.get('/api/auth/me').then(res => {
                setUser(res.data);
            }).catch(() => {
                localStorage.removeItem('token');
            }).finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (username, password) => {
        const res = await api.post('/api/auth/login', { username, password });
        localStorage.setItem('token', res.data.access_token);
        const userRes = await api.get('/api/auth/me');
        setUser(userRes.data);
        return userRes.data;
    };

    const register = async (data) => {
        await api.post('/api/auth/register', data);
        return login(data.username, data.password);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);