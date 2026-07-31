import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import './projectList.css';

const ProjectList = () => {
    const [projects, setProjects] = useState([]);
    const [newProject, setNewProject] = useState({ name: '', description: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        try {
            const res = await api.get('/api/projects');
            setProjects(res.data);
        } finally {
            setLoading(false);
        }
    };

    const createProject = async (e) => {
        e.preventDefault();
        if (!newProject.name.trim()) return;
        await api.post('/api/projects', newProject);
        setNewProject({ name: '', description: '' });
        loadProjects();
    };

    const deleteProject = async (id) => {
        if (!window.confirm('¿Eliminar este proyecto?')) return;
        await api.delete(`/api/projects/${id}`);
        loadProjects();
    };

    if (loading) return <div>Cargando...</div>;

    return (
        <div className="page-shell">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Mis Proyectos</h1>
                    <p className="subtitle">Administra tus tableros y crea nuevas iniciativas con estilo.</p>
                </div>
            </div>

            <form onSubmit={createProject} className="filter-panel project-form">
                <input
                    placeholder="Nombre del proyecto"
                    value={newProject.name}
                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                    required
                    className="input-field"
                />
                <input
                    placeholder="Descripción (opcional)"
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    className="input-field"
                />
                <button type="submit" className="button button-primary">
                    Crear
                </button>
            </form>

            <div className="cards-grid">
                {projects.map(project => (
                    <div key={project.id} className="card">
                        <div className="project-card-header">
                            <Link to={`/projects/${project.id}`} className="card-title project-card-title">
                                {project.name}
                            </Link>
                            <button onClick={() => deleteProject(project.id)} className="icon-button" aria-label="Eliminar proyecto">
                                ×
                            </button>
                        </div>
                        <p className="subtitle project-card-description">{project.description}</p>
                        <div className="meta-row project-meta-row">
                            Creado: {new Date(project.created_at).toLocaleDateString()}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProjectList;