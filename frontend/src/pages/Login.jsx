// Importación de React y hooks para manejo de estado y efectos
import React, { useState, useEffect } from 'react';
// Hook para navegación programática entre rutas
import { useNavigate } from 'react-router-dom';
// Iconos para mostrar/ocultar contraseña
import { Visibility, VisibilityOff } from '@mui/icons-material';
// Componentes de Material UI para la interfaz
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
// Logo de la aplicación
import logo from '/Images/Logo-pilotos.png';

// Modal para recuperación de contraseña
import ResetPasswordModal from './ResetPasswordModal';
// Instancia de la API para peticiones al backend
import { api } from '../api/api';

// Componente principal de Login
const Login = ({ onRegistroClick }) => {
	// Estado para los datos del formulario
	const [formData, setFormData] = useState({ email: '', password: '' });
	// Estado para mostrar el modal de recuperación de contraseña
	const [openResetModal, setOpenResetModal] = useState(false);
	// Estado para mostrar/ocultar la contraseña
	const [showPassword, setShowPassword] = useState(false);
	// Estado para errores de validación de formulario
	const [errors, setErrors] = useState({});
	// Estado para indicar si se está enviando el formulario
	const [isSubmitting, setIsSubmitting] = useState(false);
	// Estado para mostrar errores de envío
	const [submitError, setSubmitError] = useState('');
	// Estado para mostrar mensajes de recuperación
	const [recoveryMessage, setRecoveryMessage] = useState('');
	// Hook para navegar entre rutas
	const navigate = useNavigate();

	// Estado para deshabilitar el formulario tras intentos fallidos
	const [isDisabled, setIsDisabled] = useState(false);
	// Estado para contar intentos fallidos
	const [failedAttempts, setFailedAttempts] = useState(0);
	// Estado para contar bloqueos por intentos fallidos
	const [failedBlock, setFailedBlock] = useState(0);
	// Estado para el temporizador de bloqueo
	const [countdown, setCountdown] = useState(null);

	// Estado para mostrar banners de éxito/error
	const [bannerMsg, setBannerMsg] = useState('');
	const [bannerType, setBannerType] = useState('success');
	const [showBanner, setShowBanner] = useState(false);

	// Número máximo de intentos permitidos antes de bloquear
	const MAX_ATTEMPTS = 3;

	// Función para reactivar el formulario tras el tiempo de bloqueo
	const resetDisable = time => {
		setTimeout(() => {
			setIsDisabled(false);
			setCountdown(null);
			setSubmitError('');
		}, time);
	};

	// Función para manejar el bloqueo progresivo tras varios intentos fallidos
	const countFailBlocks = () => {
		// Duraciones de bloqueo en milisegundos según el número de bloqueos
		const durations = { 1: 30000, 2: 60000, 3: 180000, 4: 300000 };
		const fb = failedBlock + 1;
		setFailedAttempts(0);
		setFailedBlock(fb);
		const timeToWait = durations[fb] || 300000;
		setCountdown(timeToWait / 1000);
		setIsDisabled(true);
		resetDisable(timeToWait);
	};

	// Función para manejar cada intento fallido de login
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

	// Validación de los campos del formulario
	const validateForm = () => {
		const newErrors = {};
		// Validar email
		if (!formData.email.trim())
			newErrors.email = 'El correo electrónico es obligatorio';
		else if (!/\S+@\S+\.\S+/.test(formData.email))
			newErrors.email = 'Correo electrónico inválido';
		// Validar contraseña
		if (!formData.password) newErrors.password = 'La contraseña es obligatoria';
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	// Maneja el cambio de los inputs del formulario
	const handleInputChange = e => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
		// Limpia errores específicos al modificar el campo
		if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
		setSubmitError('');
		setRecoveryMessage('');
	};

	// Maneja el proceso de login al hacer clic en el botón
	const handleLogin = async () => {
		if (!validateForm()) return;
		setIsSubmitting(true);
		try {
			// 1) Login: el backend setea cookie HttpOnly
			await realizarPeticion();

			// 2) Intentar obtener perfil SIN redirigir si llegara a dar 401
			try {
				await api.get('/auth/obtenerperfil', {
					withCredentials: true,
					skipAuthRedirect: true, // 👈 evita que el interceptor te saque al /login
				});
			} catch (e) {
				console.warn('No se pudo cargar perfil tras login:', e?.message || e);
			}

			// 3) Avisar a la Navbar que refresque el perfil
			window.dispatchEvent(new Event('auth:refresh'));

			// 4) Navegar a home (sin recargar doble; con una basta)
			navigate('/');
			// Si necesitas forzar un refresh visual:
			// setTimeout(() => window.location.reload(), 250);

			// 5) Limpiar errores y contadores
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

	// Realiza la petición de login al backend
	const realizarPeticion = async () => {
		try {
			// Petición POST al endpoint de login
			const res = await api.post('/auth/signin', {
				email: formData.email,
				password: formData.password,
			});
			// Si es exitoso, muestra banner de éxito
			setBannerMsg(res.data?.mensaje || 'Inicio de sesión correcto');
			setBannerType('success');
			setShowBanner(true);
			setTimeout(() => setShowBanner(false), 3000);
			return res.data;
		} catch (error) {
			// Si falla, muestra banner de error
			const mensaje =
				error.response?.data?.mensaje || 'Correo o Contraseña Incorrecta';
			setBannerMsg(mensaje);
			setBannerType('error');
			setShowBanner(true);
			setTimeout(() => setShowBanner(false), 3000);
			throw error;
		}
	};

	// Abre el modal de recuperación de contraseña
	const handleForgotPassword = () => setOpenResetModal(true);

	// Formatea el temporizador de bloqueo en minutos y segundos
	const formatCountdown = seconds => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		if (minutes > 0)
			return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
		return `${remainingSeconds}`;
	};

	// Efecto para manejar el temporizador de bloqueo
	useEffect(() => {
		let interval;
		if (countdown > 0) {
			// Disminuye el contador cada segundo
			interval = setInterval(() => setCountdown(prev => prev - 1), 1000);
		} else if (countdown === 0) {
			// Cuando termina el tiempo, reactiva el formulario
			setCountdown(null);
			setIsDisabled(false);
			setSubmitError('');
			setRecoveryMessage('Puedes intentar nuevamente.');
		}
		return () => clearInterval(interval);
	}, [countdown]);

	// Renderizado del componente Login
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
			{/* Contenedor principal del formulario */}
			<Box sx={{ width: '100%', maxWidth: 400, textAlign: 'center' }}>
				{/* Logo superior */}
				<img
					src={logo}
					alt='Logo'
					style={{ width: '300px', marginBottom: '1rem' }}
				/>

				{/* Título */}
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

				{/* Banner de éxito o error tras login */}
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

				{/* Mensaje de error por intentos fallidos y temporizador */}
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

				{/* Mensaje informativo tras desbloqueo */}
				{recoveryMessage && (
					<Alert
						severity='info'
						onClose={() => setRecoveryMessage('')}
						sx={{ mb: 2 }}
					>
						{recoveryMessage}
					</Alert>
				)}

				{/* Campo de correo electrónico */}
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

				{/* Campo de contraseña con opción de mostrar/ocultar */}
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

				{/* Link para recuperar contraseña */}
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

				{/* Botón principal de login */}
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

				{/* Link para ir a registro de usuario */}
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

			{/* Modal para recuperación de contraseña */}
			<ResetPasswordModal
				open={openResetModal}
				onClose={() => setOpenResetModal(false)}
				emailValue={formData.email}
			/>
		</Box>
	);
};

// Exporta el componente Login
export default Login;
