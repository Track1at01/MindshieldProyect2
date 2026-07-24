import React, { useState } from 'react';

const SearchFilter = ({ onFilter, members }) => {
    const [filters, setFilters] = useState({ search: '', priority: '', assignee: '' });

    const handleChange = (e) => {
        const newFilters = { ...filters, [e.target.name]: e.target.value };
        setFilters(newFilters);
        onFilter(newFilters);
    };

    return (
        <div style={{
            display: 'flex',
            gap: '0.5rem',
            background: 'white',
            padding: '0.75rem',
            borderRadius: '8px',
            marginBottom: '1rem'
        }}>
            <input
                name="search"
                placeholder="Buscar tareas..."
                value={filters.search}
                onChange={handleChange}
                style={{ flex: 2, padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
            />
            <select
                name="priority"
                value={filters.priority}
                onChange={handleChange}
                style={{ flex: 1, padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
            >
                <option value="">Todas las prioridades</option>
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
            </select>
            <select
                name="assignee"
                value={filters.assignee}
                onChange={handleChange}
                style={{ flex: 1, padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
            >
                <option value="">Todos los responsables</option>
                {members.map(m => (
                    <option key={m.id} value={m.id}>{m.username}</option>
                ))}
            </select>
        </div>
    );
};

export default SearchFilter;