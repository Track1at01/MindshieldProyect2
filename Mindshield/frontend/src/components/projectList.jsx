import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

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
        <div>
            <h1 style={{ marginBottom: '1.5rem' }}>Mis Proyectos</h1>
            
            <form onSubmit={createProject} style={{
                display: 'flex',
                gap: '0.5rem',
                marginBottom: '2rem',
                background: 'white',
                padding: '1rem',
                borderRadius: '8px'
            }}>
                <input
                    placeholder="Nombre del proyecto"
                    value={newProject.name}
                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                    required
                    style={{ flex: 1, padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                />
                <input
                    placeholder="Descripción (opcional)"
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    style={{ flex: 2, padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                />
                <button type="submit" style={{
                    padding: '0.5rem 1rem',
                    background: '#16213e',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}>
                    Crear
                </button>
            </form>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                {projects.map(project => (
                    <div key={project.id} style={{
                        background: 'white',
                        padding: '1.5rem',
                        borderRadius: '8px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <Link to={`/projects/${project.id}`} style={{
                                fontSize: '1.25rem',
                                fontWeight: 'bold',
                                color: '#16213e',
                                textDecoration: 'none'
                            }}>
                                {project.name}
                            </Link>
                            <button onClick={() => deleteProject(project.id)} style={{
                                background: 'none',
                                border: 'none',
                                color: '#e94560',
                                cursor: 'pointer',
                                fontSize: '1.2rem'
                            }}>
                                ×
                            </button>
                        </div>
                        <p style={{ color: '#666', marginTop: '0.5rem' }}>{project.description}</p>
                        <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#999' }}>
                            Creado: {new Date(project.created_at).toLocaleDateString()}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProjectList;