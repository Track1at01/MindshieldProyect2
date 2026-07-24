import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './components/Login';
import Register from './components/Register';
import ProjectList from './components/ProjectList';
import ProjectBoard from './components/ProjectBoard';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Navigate to="/projects" />} />
                        <Route path="projects" element={<ProjectList />} />
                        <Route path="projects/:id" element={<ProjectBoard />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;