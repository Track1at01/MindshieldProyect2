import React, { useState } from 'react';
import './searchFilter.css';

const SearchFilter = ({ onFilter, members }) => {
    const [filters, setFilters] = useState({ search: '', priority: '', assignee: '' });

    const handleChange = (e) => {
        const newFilters = { ...filters, [e.target.name]: e.target.value };
        setFilters(newFilters);
        onFilter(newFilters);
    };

    return (
        <div className="filter-panel">
            <input
                name="search"
                placeholder="Buscar tareas..."
                value={filters.search}
                onChange={handleChange}
                className="input-field flex-2"
            />
            <select
                name="priority"
                value={filters.priority}
                onChange={handleChange}
                className="select-field flex-1"
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
                className="select-field flex-1"
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