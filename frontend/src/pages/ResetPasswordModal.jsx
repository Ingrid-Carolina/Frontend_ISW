import React, { useState } from 'react';
import {
	Modal,
	Box,
	Typography,
	TextField,
	Button,
	IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

const ResetPasswordModal = ({ open, onClose, emailValue }) => {
	const [email, setEmail] = useState(emailValue || '');
	const [message, setMessage] = useState('');
	const [error, setError] = useState('');

	const handleSubmit = async e => {
		e.preventDefault();
		try {
			const response = await axios.post(
				'http://localhost:3000/auth/restablecer',
				{
					email: email,
				},
			);

			setMessage(response.data.mensaje || 'Correo enviado exitosamente.');
			setError('');
			setEmail('');

			setTimeout(() => {
				setMessage('');
			}, 5000);
		} catch (err) {
			console.error('Error desde backend:', err);

			if (err.response && err.response.data && err.response.data.mensaje) {
				setError(err.response.data.mensaje);
			} else {
				setError('Hubo un error al enviar el correo. Intenta de nuevo.');
			}
			setMessage('');
			setTimeout(() => {
				setError('');
			}, 5000);
		}
	};

	return (
		<Modal open={open} onClose={onClose}>
			<Box
				sx={{
					position: 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					bgcolor: 'white',
					borderRadius: 2,
					boxShadow: 24,
					p: 4,
					width: '90%',
					maxWidth: 400,
				}}
			>
				<IconButton
					onClick={onClose}
					sx={{ position: 'absolute', top: 8, right: 8 }}
				>
					<CloseIcon />
				</IconButton>

				<Typography variant='h6' sx={{ mb: 2 }}>
					Recuperar contraseña
				</Typography>

				<Typography variant='body2' sx={{ mb: 2 }}>
					Ingresa tu correo para recibir un enlace de recuperación.
				</Typography>

				<form onSubmit={handleSubmit}>
					<TextField
						fullWidth
						label='Correo electrónico'
						type='email'
						value={email}
						onChange={e => setEmail(e.target.value)}
						sx={{ mb: 2 }}
					/>

					<Button
						type='submit'
						fullWidth
						variant='contained'
						sx={{
							backgroundColor: '#e06c14',
							'&:hover': { backgroundColor: '#c05d11' },
						}}
					>
						Enviar enlace
					</Button>
				</form>

				{message && (
					<Typography color='success.main' sx={{ mt: 2 }}>
						{message}
					</Typography>
				)}

				{error && (
					<Typography color='error.main' sx={{ mt: 2 }}>
						{error}
					</Typography>
				)}
			</Box>
		</Modal>
	);
};

export default ResetPasswordModal;
