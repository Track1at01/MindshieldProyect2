import React, { useState } from 'react';
import api from '../api';
import './inviteMember.css';

const InviteMember = ({ projectId, onInvite }) => {
	const [username, setUsername] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!username.trim()) return;

		setLoading(true);
		setError('');
		setSuccess('');

		try {
			const res = await api.get(`/api/auth/search?username=${username}`);
			const user = res.data;

			if (!user) {
				setError('Usuario no encontrado');
				setLoading(false);
				return;
			}

			await api.post(`/api/projects/${projectId}/members/${user.id}`);
			setSuccess(`ยก${user.username} agregado al proyecto!`);
			setUsername('');
			onInvite();
		} catch (err) {
			setError(err.response?.data?.detail || 'Error al invitar usuario');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="card invite-card">
			<h4 className="subtitle">Invitar colaborador</h4>
			<form onSubmit={handleSubmit} className="invite-form">
				<input
					type="text"
					placeholder="Nombre de usuario"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					required
					className="input-field"
				/>
				<button
					type="submit"
					disabled={loading}
					className={loading ? 'button button-secondary' : 'button button-primary'}
				>
					{loading ? '...' : 'Invitar'}
				</button>
			</form>
			{error && <div className="alert alert-error">{error}</div>}
			{success && <div className="alert alert-success">{success}</div>}
		</div>
	);
};

export default InviteMember;