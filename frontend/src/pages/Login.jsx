import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
	Typography,
	IconButton,
	InputAdornment,
	Box,
	Alert,
	TextField,
	Button,
	Link,
} from '@mui/material';
import logo from '/Images/Logo-pilotos.png';

import ResetPasswordModal from './ResetPasswordModal';
import { api } from '../api/api';

const Login = ({ onRegistroClick }) => {
	const [formData, setFormData] = useState({ email: '', password: '' });
	const [openResetModal, setOpenResetModal] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [errors, setErrors] = useState({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState('');
	const [recoveryMessage, setRecoveryMessage] = useState('');
	const navigate = useNavigate();

	const [isDisabled, setIsDisabled] = useState(false);
	const [failedAttempts, setFailedAttempts] = useState(0);
	const [failedBlock, setFailedBlock] = useState(0);
	const [countdown, setCountdown] = useState(null);

	const [bannerMsg, setBannerMsg] = useState('');
	const [bannerType, setBannerType] = useState('success');
	const [showBanner, setShowBanner] = useState(false);

	const MAX_ATTEMPTS = 3;

	const resetDisable = time => {
		setTimeout(() => {
			setIsDisabled(false);
			setCountdown(null);
			setSubmitError('');
		}, time);
	};

	const countFailBlocks = () => {
		const durations = { 1: 30000, 2: 60000, 3: 180000, 4: 300000 };
		const fb = failedBlock + 1;
		setFailedAttempts(0);
		setFailedBlock(fb);
		const timeToWait = durations[fb] || 300000;
		setCountdown(timeToWait / 1000);
		setIsDisabled(true);
		resetDisable(timeToWait);
	};

	const handleFailedAttempt = () => {
		const nuevoIntento = failedAttempts + 1;
		setFailedAttempts(nuevoIntento);
		if (nuevoIntento === MAX_ATTEMPTS) {
			countFailBlocks();
			setSubmitError(
				'Has excedido el número máximo de intentos. Tienes que esperar un momento.',
			);
		}
	};

	const validateForm = () => {
		const newErrors = {};
		if (!formData.email.trim())
			newErrors.email = 'El correo electrónico es obligatorio';
		else if (!/\S+@\S+\.\S+/.test(formData.email))
			newErrors.email = 'Correo electrónico inválido';
		if (!formData.password) newErrors.password = 'La contraseña es obligatoria';
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleInputChange = e => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
		if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
		setSubmitError('');
		setRecoveryMessage('');
	};

	const handleLogin = async () => {
		if (!validateForm()) return;
		setIsSubmitting(true);
		try {
			// 1) Login: backend setea cookie HttpOnly
			await realizarPeticion();

			try {
				await api.get('/auth/obtenerperfil', { withCredentials: true });
			} catch {console.error();
			}

			// 3) Avisar a la Navbar que refresque el perfil
			window.dispatchEvent(new Event('auth:refresh'));

			// 4) Navegar/refresh ligero
			setTimeout(() => navigate('/'), 300);
			setTimeout(() => {
				if (window.location.pathname === '/') window.location.reload();
			}, 700);

			setSubmitError('');
			setFailedAttempts(0);
			setFailedBlock(0);
		} catch (error) {
			handleFailedAttempt();
		} finally {
			setIsSubmitting(false);
			setFormData({ email: '', password: '' });
		}
	};

	const realizarPeticion = async () => {
		try {
			const res = await api.post('/auth/signin', {
				email: formData.email,
				password: formData.password,
			});
			setBannerMsg(res.data?.mensaje || 'Inicio de sesión correcto');
			setBannerType('success');
			setShowBanner(true);
			setTimeout(() => setShowBanner(false), 3000);
			return res.data;
		} catch (error) {
			const mensaje =
				error.response?.data?.mensaje || 'Correo o Contraseña Incorrecta';
			setBannerMsg(mensaje);
			setBannerType('error');
			setShowBanner(true);
			setTimeout(() => setShowBanner(false), 3000);
			throw error;
		}
	};

	const handleForgotPassword = () => setOpenResetModal(true);

	const formatCountdown = seconds => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		if (minutes > 0)
			return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
		return `${remainingSeconds}`;
	};

	useEffect(() => {
		let interval;
		if (countdown > 0) {
			interval = setInterval(() => setCountdown(prev => prev - 1), 1000);
		} else if (countdown === 0) {
			setCountdown(null);
			setIsDisabled(false);
			setSubmitError('');
			setRecoveryMessage('Puedes intentar nuevamente.');
		}
		return () => clearInterval(interval);
	}, [countdown]);

	return (
		<Box
			sx={{
				display: 'flex',
				minHeight: '100vh',
				alignItems: 'center',
				justifyContent: 'center',
				backgroundColor: '#fdfdfd',
				px: 2,
			}}
		>
			<Box sx={{ width: '100%', maxWidth: 400, textAlign: 'center' }}>
				<img
					src={logo}
					alt='Logo'
					style={{ width: '300px', marginBottom: '1rem' }}
				/>

				<Typography
					variant='h5'
					sx={{
						fontFamily: '"Varsity", cursive',
						fontWeight: 'bold',
						textAlign: 'center',
						mb: { xs: 3, md: 4 },
						fontSize: { xs: '2.5rem', sm: '3rem', md: '4rem' },
						color: '#e06c14',
					}}
				>
					INICIAR SESIÓN
				</Typography>

				{showBanner && (
					<Box
						sx={{
							position: 'relative',
							width: '100%',
							mb: 2,
							animation: 'slideDown 0.3s ease-in-out',
							backgroundColor: bannerType === 'error' ? '#f44336' : '#4caf50',
							color: '#fff',
							borderRadius: 1,
							p: 1,
							boxShadow: 2,
						}}
					>
						<Typography sx={{ fontWeight: 'bold' }}>{bannerMsg}</Typography>
					</Box>
				)}

				{submitError && (
					<Alert
						severity='error'
						onClose={() => setSubmitError('')}
						sx={{ mb: 2 }}
					>
						{submitError}
						{countdown && (
							<Typography variant='body2' sx={{ mt: 1, fontWeight: 'bold' }}>
								Tiempo restante: {formatCountdown(countdown)}
							</Typography>
						)}
					</Alert>
				)}

				{recoveryMessage && (
					<Alert
						severity='info'
						onClose={() => setRecoveryMessage('')}
						sx={{ mb: 2 }}
					>
						{recoveryMessage}
					</Alert>
				)}

				<TextField
					name='email'
					label='Correo electrónico'
					value={formData.email}
					onChange={handleInputChange}
					error={!!errors.email}
					helperText={errors.email}
					fullWidth
					margin='normal'
					disabled={isDisabled}
				/>

				<TextField
					name='password'
					type={showPassword ? 'text' : 'password'}
					label='Contraseña'
					value={formData.password}
					onChange={handleInputChange}
					error={!!errors.password}
					helperText={errors.password}
					fullWidth
					margin='normal'
					InputProps={{
						endAdornment: (
							<InputAdornment position='end'>
								<IconButton
									onClick={() => setShowPassword(prev => !prev)}
									edge='end'
									disabled={isDisabled}
								>
									{showPassword ? <VisibilityOff /> : <Visibility />}
								</IconButton>
							</InputAdornment>
						),
					}}
					disabled={isDisabled}
				/>

				<Box sx={{ textAlign: 'right', mt: 1 }}>
					<Link
						component='button'
						onClick={handleForgotPassword}
						disabled={isDisabled}
						sx={{
							fontSize: '0.85rem',
							color: isDisabled ? '#ccc' : '#f06414',
							'&:hover': { textDecoration: 'underline' },
							cursor: isDisabled ? 'not-allowed' : 'pointer',
						}}
					>
						¿Olvidaste tu contraseña?
					</Link>
				</Box>

				<Button
					variant='contained'
					fullWidth
					onClick={handleLogin}
					disabled={isSubmitting || isDisabled}
					sx={{
						mt: 2,
						backgroundColor: '#fa7600',
						'&:hover': { backgroundColor: '#e56700' },
						'&:disabled': { backgroundColor: '#ccc' },
					}}
				>
					{isSubmitting
						? 'Iniciando...'
						: isDisabled
							? `Bloqueado ${countdown ? `(${formatCountdown(countdown)})` : ''}`
							: 'Iniciar sesión'}
				</Button>

				<Typography sx={{ mt: 2, fontSize: '0.9rem' }}>
					¿No tienes una cuenta?{' '}
					<Link
						component='button'
						onClick={onRegistroClick}
						disabled={isDisabled}
						sx={{
							fontWeight: 'bold',
							color: isDisabled ? '#ccc' : 'inherit',
							cursor: isDisabled ? 'not-allowed' : 'pointer',
						}}
					>
						Regístrate
					</Link>
				</Typography>
			</Box>

			<ResetPasswordModal
				open={openResetModal}
				onClose={() => setOpenResetModal(false)}
				emailValue={formData.email}
			/>
		</Box>
	);
};

export default Login;
