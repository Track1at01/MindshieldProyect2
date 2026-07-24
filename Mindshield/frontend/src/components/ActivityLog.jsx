import React, { useState, useEffect } from 'react';
import api from '../api';

const ActivityLog = ({ taskId }) => {
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        loadActivities();
    }, [taskId]);

    const loadActivities = async () => {
        const res = await api.get(`/api/activities/task/${taskId}`);
        setActivities(res.data);
    };

    return (
        <div>
            <h3 style={{ marginBottom: '1rem' }}>Historial de Actividad</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {activities.map(activity => (
                    <div key={activity.id} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0.5rem 0',
                        borderBottom: '1px solid #eee',
                        fontSize: '0.875rem'
                    }}>
                        <div>
                            <strong style={{ color: '#16213e' }}>{activity.user?.username}</strong>
                            {' '}{activity.action}
                            {activity.details && <span style={{ color: '#666' }}> - {activity.details}</span>}
                        </div>
                        <span style={{ color: '#999', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                            {new Date(activity.created_at).toLocaleString()}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ActivityLog;