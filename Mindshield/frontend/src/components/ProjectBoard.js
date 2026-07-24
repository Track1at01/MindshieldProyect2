import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { DndContext, closestCorners, DragOverlay } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import api from '../api';
import { useWebSocket } from '../hooks/useWebSocket';
import Column from './Column';
import TaskCard from './TaskCard';
import TaskModal from './TaskModal';
import SearchFilter from './SearchFilter';

const COLUMNS = [
    { id: 'pending', title: 'Pendiente', color: '#f39c12' },
    { id: 'in_progress', title: 'En progreso', color: '#3498db' },
    { id: 'done', title: 'Finalizado', color: '#2ecc71' }
];

const ProjectBoard = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [activeTask, setActiveTask] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const loadTasks = useCallback(async () => {
        const res = await api.get(`/api/tasks?project_id=${id}`);
        setTasks(res.data);
        setFilteredTasks(res.data);
    }, [id]);

    const loadProject = useCallback(async () => {
        const res = await api.get(`/api/projects/${id}`);
        setProject(res.data);
    }, [id]);

    useEffect(() => {
        loadProject();
        loadTasks();
    }, [loadProject, loadTasks]);

    const handleWSMessage = useCallback((msg) => {
        if (msg.type === 'task_update') {
            loadTasks();
        }
    }, [loadTasks]);

    const { send } = useWebSocket(parseInt(id), handleWSMessage);

    const handleDragStart = (event) => {
        const task = tasks.find(t => t.id === event.active.id);
        setActiveTask(task);
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;
        setActiveTask(null);
        
        if (!over) return;
        
        const taskId = active.id;
        const newStatus = over.id;
        const task = tasks.find(t => t.id === taskId);
        
        if (!task || task.status === newStatus) return;
        
        // Optimistic update
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
        
        try {
            await api.put(`/api/tasks/${taskId}`, { status: newStatus });
            send('task_update', { taskId, status: newStatus });
        } catch {
            loadTasks(); // Rollback on error
        }
    };

    const handleFilter = (filters) => {
        let result = [...tasks];
        if (filters.search) {
            result = result.filter(t => t.title.toLowerCase().includes(filters.search.toLowerCase()));
        }
        if (filters.priority) {
            result = result.filter(t => t.priority === filters.priority);
        }
        if (filters.assignee) {
            result = result.filter(t => t.assignee_id === parseInt(filters.assignee));
        }
        setFilteredTasks(result);
    };

    const getTasksByStatus = (status) => 
        filteredTasks.filter(t => t.status === status).sort((a, b) => a.position - b.position);

    if (!project) return <div>Cargando...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h1>{project.name}</h1>
                <button onClick={() => { setSelectedTask(null); setShowModal(true); }} style={{
                    padding: '0.5rem 1rem',
                    background: '#16213e',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}>
                    + Nueva Tarea
                </button>
            </div>

            <SearchFilter onFilter={handleFilter} members={project.members || []} />

            <DndContext
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '1rem',
                    marginTop: '1rem'
                }}>
                    {COLUMNS.map(col => (
                        <Column
                            key={col.id}
                            id={col.id}
                            title={col.title}
                            color={col.color}
                            tasks={getTasksByStatus(col.id)}
                            onTaskClick={(task) => { setSelectedTask(task); setShowModal(true); }}
                        />
                    ))}
                </div>
                <DragOverlay>
                    {activeTask ? <TaskCard task={activeTask} /> : null}
                </DragOverlay>
            </DndContext>

            {showModal && (
                <TaskModal
                    task={selectedTask}
                    projectId={id}
                    members={project.members || []}
                    onClose={() => setShowModal(false)}
                    onSave={() => { loadTasks(); setShowModal(false); send('task_update', {}); }}
                />
            )}
        </div>
    );
};

export default ProjectBoard;