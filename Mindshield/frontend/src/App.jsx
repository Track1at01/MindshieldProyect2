import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/Authcontext.jsx';
import Layout from './components/layout.jsx';
import Login from './components/login.jsx';
import Register from './components/register.jsx';
import ProjectList from './components/projectList.jsx';
import ProjectBoard from './components/ProjectBoard.jsx';

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