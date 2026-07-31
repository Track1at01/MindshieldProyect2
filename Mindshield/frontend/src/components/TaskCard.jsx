import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import './taskCard.css';

const PRIORITY_COLORS = {
    low: '#2ecc71',
    medium: '#f39c12',
    high: '#e74c3c'
};

const TaskCard = ({ task, onClick }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: task.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        cursor: 'grab'
    };

    const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'done';

    return (
        <div
            ref={setNodeRef}
            className="task-card"
            data-priority={task.priority}
            style={{
                ...style,
                cursor: onClick ? 'pointer' : 'grab'
            }}
            {...attributes}
            {...listeners}
            onClick={onClick}
        >
            <div className="task-card-title">{task.title}</div>
            {task.description && (
                <div className="task-card-description">
                    {task.description.substring(0, 100)}{task.description.length > 100 ? '...' : ''}
                </div>
            )}
            <div className="meta-row">
                <span className="task-badge">{task.priority}</span>
                {task.tags && task.tags.split(',').map(tag => (
                    <span key={tag} className="tag-chip">{tag.trim()}</span>
                ))}
                {task.due_date && (
                    <span className="task-meta" style={{ color: isOverdue ? '#ff6b7f' : '#9fa4b6' }}>
                        {format(new Date(task.due_date), 'dd MMM', { locale: es })}
                    </span>
                )}
            </div>
            {task.assignee && (
                <div className="task-meta" style={{ marginTop: '0.5rem' }}>
                    👤 {task.assignee.username}
                </div>
            )}
        </div>
    );
};

export default TaskCard;