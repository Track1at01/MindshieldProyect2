import React, { useState, useEffect } from 'react';
import api from '../api.jsx';
import './ActivityLog.css'
const ActivityLog = ({ taskId }) => {
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        loadActivities();
    }, [taskId]);

    const loadActivities = async () => {
        const res = await api.get(`/api/activities/task/${taskId}`);
        setActivities(res.data);
    };
    const replacements = {
        "TaskStatus.PENDING": "Pending",
        "TaskStatus.IN_PROGRESS": "In Progress",
        "TaskStatus.DONE": "Done",
    };

    const regex = new RegExp(
        Object.keys(replacements)
            .map(key => key.replace(".", "\\."))
            .join("|"),
        "g"
    );


    return (
        <div>
            <h3 style={{ marginBottom: '1rem' }}>Historial de Actividad</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {activities.map(activity => {
                    const detalles = (activity.details || "").replace(regex, match => replacements[match]);

                    return <div key={activity.id} className='tareita'>
                        <div>
                            <strong style={{ color: '#940a0a' }}>{activity.user?.username}</strong>
                            {' '}{activity.action}
                            {activity.details && <span style={{ color: '#ac1a1a' }}> - {detalles}</span>}
                        </div>
                        <span style={{ color: '#999', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                            {new Date(activity.created_at).toLocaleString()}
                        </span>
                    </div>
                })}
            </div>
        </div>
    );
};

export default ActivityLog;