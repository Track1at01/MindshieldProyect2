import React, { useState, useEffect } from 'react';
import api from '../api';
import Comments from './Comments';
import ActivityLog from './ActivityLog';

const TaskModal = ({ task, projectId, members, onClose, onSave }) => {
    const [form, setForm] = useState({
        title: '',
        description: '',
        priority: 'medium',
        status: 'pending',
        due_date: '',
        assignee_id: '',
        tags: ''
    });

    useEffect(() => {
        if (task) {
            setForm({
                title: task.title || '',
                description: task.description || '',
                priority: task.priority || 'medium',
                status: task.status || 'pending',
                due_date: task.due_date ? task.due_date.split('T')[0] : '',
                assignee_id: task.assignee_id || '',
                tags: task.tags || ''
            });
        }
    }, [task]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.title.trim()) return;
        
        try {
            if (task) {
                await api.put(`/api/tasks/${task.id}`, form);
            } else {
                await api.post('/api/tasks', { ...form, project_id: parseInt(projectId) });
            }
            onSave();
        } catch (err) {
            alert(err.response?.data?.detail || 'Error al guardar');
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('¿Eliminar esta tarea?')) return;
        await api.delete(`/api/tasks/${task.id}`);
        onSave();
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            padding: '1rem'
        }}>
            <div style={{
                background: 'white',
                borderRadius: '8px',
                width: '100%',
                maxWidth: '700px',
                maxHeight: '90vh',
                overflow: 'auto',
                padding: '2rem'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <h2>{task ? 'Editar Tarea' : 'Nueva Tarea'}</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '600' }}>Título *</label>
                        <input
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '600' }}>Descripción</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows={3}
                            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', resize: 'vertical' }}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '600' }}>Prioridad</label>
                            <select name="priority" value={form.priority} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}>
                                <option value="low">Baja</option>
                                <option value="medium">Media</option>
                                <option value="high">Alta</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '600' }}>Estado</label>
                            <select name="status" value={form.status} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}>
                                <option value="pending">Pendiente</option>
                                <option value="in_progress">En progreso</option>
                                <option value="done">Finalizado</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '600' }}>Fecha límite</label>
                            <input
                                type="date"
                                name="due_date"
                                value={form.due_date}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '600' }}>Responsable</label>
                            <select name="assignee_id" value={form.assignee_id} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}>
                                <option value="">Sin asignar</option>
                                {members.map(m => (
                                    <option key={m.id} value={m.id}>{m.username}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '600' }}>Etiquetas (separadas por coma)</label>
                        <input
                            name="tags"
                            value={form.tags}
                            onChange={handleChange}
                            placeholder="bug, feature, urgent"
                            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                        <button type="submit" style={{
                            padding: '0.5rem 1.5rem',
                            background: '#16213e',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}>
                            Guardar
                        </button>
                        {task && (
                            <button type="button" onClick={handleDelete} style={{
                                padding: '0.5rem 1.5rem',
                                background: '#e94560',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}>
                                Eliminar
                            </button>
                        )}
                    </div>
                </form>

                {task && (
                    <>
                        <hr style={{ margin: '1.5rem 0', border: 'none', borderTop: '1px solid #eee' }} />
                        <Comments taskId={task.id} />
                        <hr style={{ margin: '1.5rem 0', border: 'none', borderTop: '1px solid #eee' }} />
                        <ActivityLog taskId={task.id} />
                    </>
                )}
            </div>
        </div>
    );
};

export default TaskModal;