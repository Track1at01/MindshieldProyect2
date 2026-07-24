import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

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
            style={{
                ...style,
                background: 'white',
                padding: '1rem',
                borderRadius: '6px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                borderLeft: `4px solid ${PRIORITY_COLORS[task.priority] || '#999'}`,
                cursor: onClick ? 'pointer' : 'grab'
            }}
            {...attributes}
            {...listeners}
            onClick={onClick}
        >
            <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>{task.title}</div>
            {task.description && (
                <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem', lineHeight: '1.4' }}>
                    {task.description.substring(0, 100)}{task.description.length > 100 ? '...' : ''}
                </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span style={{
                        background: PRIORITY_COLORS[task.priority],
                        color: 'white',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        textTransform: 'uppercase',
                        fontSize: '0.7rem'
                    }}>
                        {task.priority}
                    </span>
                    {task.tags && task.tags.split(',').map(tag => (
                        <span key={tag} style={{
                            background: '#e0e0e0',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            color: '#555'
                        }}>
                            {tag.trim()}
                        </span>
                    ))}
                </div>
                {task.due_date && (
                    <span style={{ color: isOverdue ? '#e74c3c' : '#999' }}>
                        {format(new Date(task.due_date), 'dd MMM', { locale: es })}
                    </span>
                )}
            </div>
            {task.assignee && (
                <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#3498db' }}>
                    👤 {task.assignee.username}
                </div>
            )}
        </div>
    );
};

export default TaskCard;