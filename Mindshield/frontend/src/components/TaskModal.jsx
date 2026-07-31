import React, { useState, useEffect } from 'react';
import api from '../api';
import Comments from './Comments';
import './taskModal.css';
import ActivityLog from './ActivityLog';


const TaskModal = ({ task, projectId, members, onClose, onSave }) => {
    const [form, setForm] = useState({
        title: '',
        description: '',
        priority: 'medium',
        status: 'pending',
        due_date: undefined,
        assignee_id: undefined,
        tags: undefined
    });

    useEffect(() => {
        if (task) {
            setForm({
                title: task.title || '',
                description: task.description || '',
                priority: task.priority || 'medium',
                status: task.status || 'pending',
                due_date: task.due_date ? task.due_date.split('T')[0] : '',
                assignee_id: task.assignee_id || undefined,
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
        <div className="modal-backdrop">
            <div className="modal-panel">
                <div className="modal-header">
                    <h2>{task ? 'Editar Tarea' : 'Nueva Tarea'}</h2>
                    <button onClick={onClose} className="modal-close">×</button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label>Título *</label>
                        <input
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            required
                            className="input-field"
                        />
                    </div>

                    <div className="form-group">
                        <label>Descripción</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows={3}
                            className="textarea-field"
                        />
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label>Prioridad</label>
                            <select name="priority" value={form.priority} onChange={handleChange} className="select-field">
                                <option value="low">Baja</option>
                                <option value="medium">Media</option>
                                <option value="high">Alta</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Estado</label>
                            <select name="status" value={form.status} onChange={handleChange} className="select-field">
                                <option value="pending">Pendiente</option>
                                <option value="in_progress">En progreso</option>
                                <option value="done">Finalizado</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label>Fecha límite</label>
                            <input
                                type="date"
                                name="due_date"
                                value={form.due_date}
                                onChange={handleChange}
                                className="input-field"
                            />
                        </div>
                        <div className="form-group">
                            <label>Responsable</label>
                            <select name="assignee_id" value={form.assignee_id} onChange={handleChange} className="select-field">
                                <option value="">Sin asignar</option>
                                {members.map(m => (
                                    <option key={m.id} value={m.id}>{m.username}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Etiquetas (separadas por coma)</label>
                        <input
                            name="tags"
                            value={form.tags}
                            onChange={handleChange}
                            placeholder="bug, feature, urgent"
                            className="input-field"
                        />
                    </div>

                    <div className="modal-actions">
                        <button type="submit" className="button button-primary">Guardar</button>
                        {task && (
                            <button type="button" onClick={handleDelete} className="button button-danger">Eliminar</button>
                        )}
                    </div>
                </form>

                {task && (
                    <>
                        <hr className="divider" />
                        <Comments taskId={task.id} />
                        <hr className="divider" />
                        <ActivityLog taskId={task.id} />
                    </>
                )}
            </div>
        </div>
    );
};

export default TaskModal;