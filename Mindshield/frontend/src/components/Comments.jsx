import React, { useState, useEffect } from 'react';
import api from '../api';
import './comments.css';

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
            <h3>Comentarios</h3>
            <form onSubmit={handleSubmit} className="comment-form">
                <input
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Escribe un comentario..."
                    className="input-field"
                />
                <button type="submit" className="button button-primary">Enviar</button>
            </form>
            <div className="comment-list">
                {comments.map(comment => (
                    <div key={comment.id} className="comment-card">
                        <div className="comment-header">
                            <strong>{comment.author?.username || 'Usuario'}</strong>
                            <span className="comment-date">
                                {new Date(comment.created_at).toLocaleString()}
                            </span>
                        </div>
                        <p>{comment.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Comments;