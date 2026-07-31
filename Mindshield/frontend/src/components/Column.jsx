import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskCard from './TaskCard';
import './column.css';

const Column = ({ id, title, color, tasks, onTaskClick }) => {
    const { setNodeRef } = useDroppable({ id });

    return (
        <div
            ref={setNodeRef}
            className="column-panel"
            style={{ borderTop: `4px solid ${color}` }}
        >
            <h3 className="column-title">
                {title} <span>({tasks.length})</span>
            </h3>
            <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                <div className="tasks-grid">
                    {tasks.map(task => (
                        <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task)} />
                    ))}
                </div>
            </SortableContext>
        </div>
    );
};

export default Column;