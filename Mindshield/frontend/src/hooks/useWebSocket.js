import { useEffect, useRef, useCallback } from 'react';

const WS_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:8000';

export const useWebSocket = (projectId, onMessage) => {
    const ws = useRef(null);

    useEffect(() => {
        if (!projectId) return;

        const token = localStorage.getItem('token');
        ws.current = new WebSocket(`${WS_URL}/ws/${projectId}?token=${token}`);

        ws.current.onopen = () => console.log('WS connected');
        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            onMessage(data);
        };
        ws.current.onclose = () => console.log('WS disconnected');
        ws.current.onerror = (err) => console.error('WS error:', err);

        return () => {
            ws.current?.close();
        };
    }, [projectId, onMessage]);

    const send = useCallback((type, data) => {
        if (ws.current?.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify({ type, data }));
        }
    }, []);

    return { send };
};