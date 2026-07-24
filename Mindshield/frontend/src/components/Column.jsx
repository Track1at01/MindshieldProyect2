import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskCard from './TaskCard';

const Column = ({ id, title, color, tasks, onTaskClick }) => {
    const { setNodeRef } = useDroppable({ id });

    return (
        <div
            ref={setNodeRef}
            style={{
                background: '#f8f9fa',
                borderRadius: '8px',
                padding: '1rem',
                minHeight: '200px',
                borderTop: `4px solid ${color}`
            }}
        >
            <h3 style={{ marginBottom: '1rem', color: '#333' }}>
                {title} <span style={{ color: '#999', fontSize: '0.875rem' }}>({tasks.length})</span>
            </h3>
            <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {tasks.map(task => (
                        <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task)} />
                    ))}
                </div>
            </SortableContext>
        </div>
    );
};

export default Column;