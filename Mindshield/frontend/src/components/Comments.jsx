import React, { useState, useEffect } from 'react';
import api from '../api';

const Comments = ({ taskId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        loadComments();
    }, [taskId]);

    const loadComments = async () => {
        const res = await api.get(`/api/comments/task/${taskId}`);
        setComments(res.data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        await api.post('/api/comments', { task_id: taskId, content: newComment });
        setNewComment('');
        loadComments();
    };

    return (
        <div>
            <h3 style={{ marginBottom: '1rem' }}>Comentarios</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <input
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Escribe un comentario..."
                    style={{ flex: 1, padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                />
                <button type="submit" style={{
                    padding: '0.5rem 1rem',
                    background: '#16213e',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}>
                    Enviar
                </button>
            </form>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {comments.map(comment => (
                    <div key={comment.id} style={{
                        background: '#f8f9fa',
                        padding: '0.75rem',
                        borderRadius: '6px'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                            <strong style={{ fontSize: '0.875rem', color: '#16213e' }}>
                                {comment.author?.username || 'Usuario'}
                            </strong>
                            <span style={{ fontSize: '0.75rem', color: '#999' }}>
                                {new Date(comment.created_at).toLocaleString()}
                            </span>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.875rem' }}>{comment.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Comments;