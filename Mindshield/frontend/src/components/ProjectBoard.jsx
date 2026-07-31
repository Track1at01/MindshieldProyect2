import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { DndContext, closestCorners, DragOverlay } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import api from '../api.jsx';
import { useWebSocket } from '../hooks/useWebSocket';
import Column from './Column.jsx';
import TaskCard from './TaskCard.jsx';
import TaskModal from './TaskModal.jsx';
import SearchFilter from './SearchFilter.jsx';
import InviteMember from './InviteMember.jsx';
import './ProjectBoard.css';

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
    const [showInvite, setShowInvite] = useState(false);

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

        const statusName = typeof over.id == "string" ? over.id : ["pending", "in_progress", "done"][over.id - 1]

        const taskId = active.id;
        const newStatus = statusName;
        const task = tasks.find(t => t.id === taskId);

        if (Math.sqrt(event.delta.x * event.delta.x + event.delta.y * event.delta.y) < 10) {
            setSelectedTask(task);
            setShowModal(true);
        }

        if (!task || task.status === newStatus) return;

        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));

        try {
            await api.put(`/api/tasks/${taskId}`, { status: newStatus });
            send('task_update', { taskId, status: newStatus });
        } catch {
            loadTasks();
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
        <div className="page-shell">
            <div className="page-header">
                <div>
                    <h1 className="page-title">{project.name}</h1>
                    <p className="subtitle">
                        👤 {project.owner?.username} (creador)
                        {project.members?.length > 0 && ` • ${project.members.length} colaborador(es)`}
                    </p>
                </div>
                <div className="topbar-actions">
                    <button
                        onClick={() => setShowInvite(!showInvite)}
                        className={showInvite ? 'button button-secondary' : 'button button-primary'}
                    >
                        {showInvite ? 'Cancelar' : 'Invitar colaborador'}
                    </button>
                    <button
                        onClick={() => { setSelectedTask(null); setShowModal(true); }}
                        className="button button-secondary"
                    >
                        Añadir nueva tarea
                    </button>
                </div>
            </div>

            {showInvite && (
                <InviteMember
                    projectId={id}
                    onInvite={() => { loadProject(); setShowInvite(false); }}
                />
            )}

            <SearchFilter onFilter={handleFilter} members={project.members || []} />

            <DndContext
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className="cards-grid">
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