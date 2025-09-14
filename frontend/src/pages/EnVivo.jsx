import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { api } from '../api/api';
import HeaderBesibol from '/Logo-pilotosA.png';

// SVG Icons
const X = () => (
	<svg
		width='20'
		height='20'
		viewBox='0 0 24 24'
		fill='none'
		stroke='currentColor'
		strokeWidth='2'
	>
		<line x1='18' y1='6' x2='6' y2='18'></line>
		<line x1='6' y1='6' x2='18' y2='18'></line>
	</svg>
);

const Edit = () => (
	<svg
		width='18'
		height='18'
		viewBox='0 0 24 24'
		fill='none'
		stroke='currentColor'
		strokeWidth='2'
	>
		<path d='M12 20h9' />
		<path d='M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z' />
	</svg>
);

const EnVivo = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [isAdmin, setIsAdmin] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [videos, setVideos] = useState([]);
	const [activo, setactivo]= useState(false);
	const [selectedIndex, setSelectedIndex] = useState(null);
	const [urlData, setUrlData] = useState({
		videoUrl: '',
		channelUrl: '',
	});
	const [formData, setFormData] = useState({
		videoUrl: '',
		channelUrl: '',
		descripcion: '',
		tipoTransmision: 'en_directo', // Nuevo campo para tipo de transmisión
		activo: 'S',
	});
	const [bannerMsg, setBannerMsg] = useState('');
	const [bannerType, setBannerType] = useState('success');
	const [showBanner, setShowBanner] = useState(false);
	const [loading, setLoading] = useState(false);
	const [checkingAuth, setCheckingAuth] = useState(true); // Estado para verificación de autenticación
	
	const fetchUrls = async () => {
		setLoading(true);
		try {
			const res = await api.get('/auth/obtenerenvivo', { //hacemos fetch de los videos
				skipAuthRedirect: true,
			});

			const hola= res.data; //encapsulamos el resultado para luego iterar sobre el
			
				const videosActualizados = hola.videos.map(video => ({
  					id: video.id_envivo,
  					video_url: video.video_url,
  					channel_url: video.channel_url,
  					descripcion: video.descripcion,
					tipo_transmision: video.tipo_transmision || 'en_directo', // Agregar campo tipo_transmision
 					 activo: video.activo,
					}));
				setVideos(videosActualizados);
				console.log(videosActualizados[0]); 
				
				// CORRECCIÓN: Usar setUrlData y verificar que existe el primer elemento

				if(videosActualizados.length>0){
					setUrlData({
						videoUrl: convertToEmbedUrl(videosActualizados[0].video_url),
						channelUrl: videosActualizados[0].channel_url,
					});
				}
			
		} catch (fetchError) {
			console.warn('Error al recargar videos:', fetchError);
		} finally {
			setLoading(false);
			
		}
	};
	// Check if user is admin - No bloquea el acceso si falla
	useEffect(() => {
		const fetchRole = async () => {
			try {
				const res = await api.get('/auth/obtenerperfil', {
					withCredentials: true,
					skipAuthRedirect: true,
				});
				const perfil = Array.isArray(res.data) ? res.data[0] : res.data;

				const role = String(perfil?.rol || '')
					.toLowerCase()
					.trim();
				const isAdminUser = role === 'admin';

				setIsLoggedIn(!!perfil); // Usuario logueado si existe perfil
				setIsAdmin(isAdminUser); // Usuario admin solo si tiene rol admin

				console.log(
					'🔍 User role:',
					role,
					'isAdmin:',
					isAdminUser,
					'isLoggedIn:',
					!!perfil,
				);
			} catch (error) {
				console.log('Usuario no logueado o sin permisos:', error.message);
				// No mostrar error, simplemente establecer como no logueado
				setIsLoggedIn(false);
				setIsAdmin(false);
			} finally {
				setCheckingAuth(false); // Terminar verificación de autenticación
			}

			
		};

		fetchRole();


		// Listen for auth refresh events
		const onAuthRefresh = () => {
			setCheckingAuth(true);
			fetchRole();
		};
		window.addEventListener('auth:refresh', onAuthRefresh);
		return () => window.removeEventListener('auth:refresh', onAuthRefresh);

		

		
	}, []);

	//Useffect sin autenticacion

	useEffect(() => {
		
		fetchUrls();

		
	}, []);


	const openModal = () => {
		// Verificar si está logueado Y es admin
		if (!isLoggedIn) {
			showMessage('Debes iniciar sesión para modificar las URLs', 'error');
			return;
		}

		if (!isAdmin) {
			showMessage('Solo el administrador puede modificar las URLs', 'error');
			return;
		}

		setFormData({
			videoUrl: urlData.videoUrl,
			channelUrl: urlData.channelUrl,
			descripcion: '',
			tipoTransmision: 'en_directo', // Valor por defecto
			activo: 'S',
		});
		setShowModal(true);
	};

	const closeModal = () => {
		setShowModal(false);
		setFormData({
			videoUrl: '',
			channelUrl: '',
			descripcion: '',
			tipoTransmision: 'en_directo', // Resetear al valor por defecto
			activo: 'S',
		});
		setShowBanner(false);
	};

	const showMessage = (message, type = 'success') => {
		setBannerMsg(message);
		setBannerType(type);
		setShowBanner(true);
		setTimeout(() => setShowBanner(false), 4000);
	};

	const convertToEmbedUrl = url => {
		if (!url) return '';

		// Si ya es una URL embed, devolverla tal como está
		if (
			url.includes('youtube.com/embed/') ||
			url.includes('youtube-nocookie.com/embed/')
		) {
			return url;
		}

		let videoId = '';

		try {
			// Extraer video ID de diferentes formatos de URL de YouTube
			if (url.includes('youtube.com/watch?v=')) {
				const urlObj = new URL(url);
				videoId = urlObj.searchParams.get('v');
			} else if (url.includes('youtu.be/')) {
				videoId = url.split('youtu.be/')[1].split('?')[0].split('&')[0];
			} else if (url.includes('youtube.com/v/')) {
				videoId = url.split('youtube.com/v/')[1].split('?')[0].split('&')[0];
			}

			// Si encontramos un video ID, crear la URL embed
			if (videoId) {
				// Agregar autoplay solo si es "en_directo"
				const autoplayParam = formData.tipoTransmision === 'en_directo' ? '&autoplay=1&mute=1' : '';
				return `https://www.youtube.com/embed/${videoId}?${autoplayParam.substring(1)}`;
			}
		} catch (error) {
			console.error('Error procesando URL:', error);
		}

		return url; // Devolver la URL original si no se puede convertir
	};

	const validateUrls = () => {
		if (!formData.videoUrl.trim()) {
			showMessage('La URL del video es requerida', 'error');
			return false;
		}

		if (!formData.channelUrl.trim()) {
			showMessage('La URL del canal es requerida', 'error');
			return false;
		}

		// Verificar si es una URL de YouTube válida
		const isYouTubeVideoUrl =
			formData.videoUrl.includes('youtube.com') ||
			formData.videoUrl.includes('youtu.be');
		if (!isYouTubeVideoUrl) {
			showMessage(
				'La URL del video debe ser un enlace de YouTube válido',
				'error',
			);
			return false;
		}

		// Validación básica de URL de canal YouTube
		const isYouTubeChannelUrl = formData.channelUrl.includes('youtube.com/');
		if (!isYouTubeChannelUrl) {
			showMessage(
				'La URL del canal debe ser un enlace de YouTube válido',
				'error',
			);
			return false;
		}

		return true;
	};

	const saveUrls = async () => {
		if (!isLoggedIn || !isAdmin || !validateUrls()) {
			return;
		}

		try {
			setLoading(true);

			// Convertir la URL a formato embed antes de enviar
			const embedUrl = convertToEmbedUrl(formData.videoUrl.trim());

			const isActivo = formData.tipoTransmision === 'en_directo';

			const requestBody = {
				video_url: formData.videoUrl.trim(),
				channel_url: formData.channelUrl.trim(),
				descripcion: formData.descripcion.trim() || 'Video en vivo',
				activo: isActivo,
			};

			console.log('Enviando datos:', requestBody);

			// Usar PUT para actualizar/registrar
			const res = await api.post('/auth/registrarenvivo', requestBody, {
				headers: {
					'Content-Type': 'application/json',
				},
				withCredentials: true,
			});

			console.log('Respuesta del servidor:', res.data);

			// Actualizar el estado local inmediatamente
			setUrlData({
				videoUrl: embedUrl,
				channelUrl: formData.channelUrl.trim(),
			});

			const mensaje = res.data?.mensaje || 'URLs actualizadas correctamente';
			showMessage(mensaje, 'success');

			// Cerrar modal después de un delay
			setTimeout(() => {
				closeModal();
			}, 1500);
		} catch (error) {
			console.error('Error completo:', error);

			let mensaje = 'Error al actualizar URLs';

			if (error.response) {
				// El servidor respondió con un código de error
				const status = error.response.status;
				const data = error.response.data;

				console.error('Error response:', {
					status,
					data,
					headers: error.response.headers,
				});

				if (status === 404) {
					mensaje = 'Endpoint no encontrado. Verifica la ruta del backend';
				} else if (status === 401 || status === 403) {
					mensaje = 'No tienes permisos para realizar esta acción';
				} else if (status === 400) {
					mensaje = data?.mensaje || 'Datos inválidos enviados al servidor';
				} else if (status === 500) {
					mensaje = 'Error interno del servidor. Revisa los logs del backend';
				} else {
					mensaje =
						data?.mensaje || `Error ${status}: ${error.response.statusText}`;
				}
			} else if (error.request) {
				// La petición se hizo pero no hubo respuesta
				console.error('No response received:', error.request);
				mensaje =
					'No se pudo conectar con el servidor. Verifica que el backend esté funcionando';
			} else {
				// Error en la configuración de la petición
				console.error('Request setup error:', error.message);
				mensaje = `Error en la petición: ${error.message}`;
			}

			showMessage(mensaje, 'error');
		} finally {
			setLoading(false);
		}
	};

	// Solo mostrar loading si estamos cargando videos Y aún estamos verificando autenticación
	if (loading && checkingAuth) {
		return (
			<Box
				sx={{
					minHeight: '100vh',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					backgroundColor: '#10045c',
				}}
			>
				<Typography variant='h6' sx={{ color: 'white' }}>
					Cargando...
				</Typography>
			</Box>
		);
	}

	// Determinar si mostrar el botón de edición
	const showEditButton = isLoggedIn && isAdmin;

	return (
		<Box
			sx={{
				minHeight: '100vh',
				width: '100%',
				backgroundImage: `linear-gradient(rgba(16, 4, 92, 0.95), rgba(16, 4, 92, 0.95)), url(${HeaderBesibol})`,
				backgroundSize: 'cover',
				backgroundRepeat: 'no-repeat',
				backgroundPosition: 'center',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'flex-start',
				padding: '40px 20px',
				position: 'relative',
			}}
		>
			{/* Admin Edit Button - Solo se muestra si está logueado Y es admin */}
			{showEditButton && (
				<Button
					onClick={openModal}
					disabled={loading}
					sx={{
						position: 'absolute',
						top: '20px',
						right: '20px',
						minWidth: 'auto',
						width: '48px',
						height: '48px',
						borderRadius: '50%',
						backgroundColor: 'rgba(255,255,255,0.9)',
						color: '#3b82f6',
						'&:hover': {
							backgroundColor: 'rgba(255,255,255,1)',
						},
						'&:disabled': {
							backgroundColor: 'rgba(255,255,255,0.5)',
						},
						zIndex: 10,
					}}
				>
					<Edit />
				</Button>
			)}

			{/* Título */}
			<Typography
				variant='h4'
				sx={{
					fontFamily: 'Groteskbold',
					color: 'white',
					marginBottom: '2rem',
					marginTop: '80px',
					textAlign: 'center',
				}}
			>
				Bienvenido! Esperamos disfrutes de nuestros partidos en vivo!!!
			</Typography>

			{/* Contenedor Video + Botón */}
			<Box
				sx={{
					width: '95%',
					maxWidth: '1200px',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'flex-end',
					flex: 1,
				}}
			>
				{/* Video */}
				<Box
					sx={{
						width: '100%',
						flex: 1,
						marginBottom: '2rem',
						aspectRatio: '16/9',
						borderRadius: '20px',
						overflow: 'hidden',
						boxShadow: '0 8px 25px rgba(0,0,0,0.7)',
					}}
				>
					<iframe
						src={urlData.videoUrl}
						title='En Vivo'
						allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
						allowFullScreen
						style={{ width: '100%', height: '100%', border: 'none' }}
					></iframe>
				</Box>

				{/* Botones */}
				<Box
					sx={{
						display: 'flex',
						gap: '20px',
						marginTop: '20px',
						alignItems: 'center',
					}}
				>
					<Button
						variant='contained'
						sx={{
							fontFamily: 'Petermedium',
							backgroundColor: '#fff',
							color: '#e06c14',
							borderRadius: '20px',
							'&:hover': {
								borderColor: '#e06c14',
								backgroundColor: '#c8c6c5ff',
							},
						}}
						onClick={() => window.open(urlData.channelUrl, '_blank')}
					>
						Ir al Canal
					</Button>

					{/* Admin Edit Button - Solo se muestra si está logueado Y es admin */}
					{showEditButton && (
						<Button
							onClick={openModal}
							disabled={loading}
							sx={{
								minWidth: 'auto',
								width: '48px',
								height: '48px',
								borderRadius: '50%',
								backgroundColor: 'rgba(255,255,255,0.9)',
								color: '#3b82f6',
								'&:hover': {
									backgroundColor: 'rgba(255,255,255,1)',
								},
								'&:disabled': {
									backgroundColor: 'rgba(255,255,255,0.5)',
								},
							}}
						>
							<Edit />
						</Button>
					)}
				</Box>
			</Box>

			{/* Banner Global */}
			{showBanner && !showModal && (
				<Box
					sx={{
						position: 'fixed',
						top: '20px',
						left: '50%',
						transform: 'translateX(-50%)',
						zIndex: 1001,
						minWidth: '300px',
						maxWidth: '500px',
						p: 2,
						borderRadius: 2,
						backgroundColor: bannerType === 'error' ? '#f44336' : '#4caf50',
						color: 'white',
						boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
						animation: 'slideDown 0.3s ease-in-out',
					}}
				>
					<Typography
						sx={{ fontWeight: 'bold', fontSize: '14px', textAlign: 'center' }}
					>
						{bannerMsg}
					</Typography>
				</Box>
			)}

			{/* Modal for URL editing */}
			{showModal && (
				<div
					style={{
						position: 'fixed',
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						backgroundColor: 'rgba(0,0,0,0.5)',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						zIndex: 1000,
					}}
				>
					<div
						style={{
							backgroundColor: 'white',
							borderRadius: '12px',
							padding: '24px',
							width: '90%',
							maxWidth: '600px',
							maxHeight: '80vh',
							overflow: 'auto',
						}}
					>
						{/* Modal Header */}
						<div
							style={{
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
								marginBottom: '20px',
							}}
						>
							<h3 style={{ margin: 0, fontSize: '1.5rem', color: '#333' }}>
								Configurar URLs de En Vivo
							</h3>
							<button
								onClick={closeModal}
								disabled={loading}
								style={{
									background: 'none',
									border: 'none',
									cursor: loading ? 'not-allowed' : 'pointer',
									padding: '4px',
									borderRadius: '4px',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									opacity: loading ? 0.5 : 1,
								}}
							>
								<X />
							</button>
						</div>

						{/* Form */}
						<div
							style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
						>
							<div>
								<label
									style={{
										display: 'block',
										marginBottom: '8px',
										fontWeight: '600',
										color: '#374151',
										fontSize: '14px',
									}}
								>
									URL del Video (YouTube) *
								</label>
								<input
									type='text'
									value={formData.videoUrl}
									onChange={e =>
										setFormData({
											...formData,
											videoUrl: e.target.value,
										})
									}
									placeholder='https://www.youtube.com/watch?v=VIDEO_ID o https://youtu.be/VIDEO_ID'
									disabled={loading}
									style={{
										width: '100%',
										padding: '12px',
										border: '2px solid #e5e7eb',
										borderRadius: '8px',
										fontSize: '14px',
										boxSizing: 'border-box',
										outline: 'none',
										transition: 'border-color 0.2s',
										opacity: loading ? 0.7 : 1,
									}}
									onFocus={e => (e.target.style.borderColor = '#3b82f6')}
									onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
								/>
								<small
									style={{
										color: '#6b7280',
										fontSize: '12px',
										display: 'block',
										marginTop: '4px',
									}}
								>
									Puedes usar cualquier formato de URL de YouTube. Se convertirá
									automáticamente.
								</small>
							</div>

							<div>
								<label
									style={{
										display: 'block',
										marginBottom: '8px',
										fontWeight: '600',
										color: '#374151',
										fontSize: '14px',
									}}
								>
									URL del Canal *
								</label>
								<input
									type='text'
									value={formData.channelUrl}
									onChange={e =>
										setFormData({
											...formData,
											channelUrl: e.target.value,
										})
									}
									placeholder='https://www.youtube.com/@nombredelcanal'
									disabled={loading}
									style={{
										width: '100%',
										padding: '12px',
										border: '2px solid #e5e7eb',
										borderRadius: '8px',
										fontSize: '14px',
										boxSizing: 'border-box',
										outline: 'none',
										transition: 'border-color 0.2s',
										opacity: loading ? 0.7 : 1,
									}}
									onFocus={e => (e.target.style.borderColor = '#3b82f6')}
									onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
								/>
							</div>

							<div>
								<label
									style={{
										display: 'block',
										marginBottom: '8px',
										fontWeight: '600',
										color: '#374151',
										fontSize: '14px',
									}}
								>
									Descripción (Opcional)
								</label>
								<input
									type='text'
									value={formData.descripcion}
									onChange={e =>
										setFormData({
											...formData,
											descripcion: e.target.value,
										})
									}
									placeholder='Descripción del video en vivo'
									disabled={loading}
									style={{
										width: '100%',
										padding: '12px',
										border: '2px solid #e5e7eb',
										borderRadius: '8px',
										fontSize: '14px',
										boxSizing: 'border-box',
										outline: 'none',
										transition: 'border-color 0.2s',
										opacity: loading ? 0.7 : 1,
									}}
									onFocus={e => (e.target.style.borderColor = '#3b82f6')}
									onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
								/>
							</div>

							{/* Nuevo campo: Tipo de Transmisión */}
							<div>
								<label
									style={{
										display: 'block',
										marginBottom: '8px',
										fontWeight: '600',
										color: '#374151',
										fontSize: '14px',
									}}
								>
									Tipo de Transmisión *
								</label>
								<select
									value={formData.tipoTransmision}
									onChange={e =>
										setFormData({
											...formData,
											tipoTransmision: e.target.value,
										})
									}
									disabled={loading}
									style={{
										width: '100%',
										padding: '12px',
										border: '2px solid #e5e7eb',
										borderRadius: '8px',
										fontSize: '14px',
										boxSizing: 'border-box',
										outline: 'none',
										transition: 'border-color 0.2s',
										opacity: loading ? 0.7 : 1,
										backgroundColor: 'white',
										cursor: loading ? 'not-allowed' : 'pointer',
									}}
									onFocus={e => (e.target.style.borderColor = '#3b82f6')}
									onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
								>
									<option value='en_directo'>En Directo</option>
									<option value='video'>Video</option>
								</select>
								<small
									style={{
										color: '#6b7280',
										fontSize: '12px',
										display: 'block',
										marginTop: '4px',
									}}
								>
									{formData.tipoTransmision === 'en_directo' 
										? 'Se reproducirá automáticamente con audio silenciado'
										: 'Video pregrabado - el usuario debe hacer clic para reproducir'
									}
								</small>
							</div>
						</div>

						{/* Banner dentro del modal */}
						{showBanner && (
							<Box
								sx={{
									mt: 3,
									p: 2,
									borderRadius: 2,
									backgroundColor:
										bannerType === 'error' ? '#f44336' : '#4caf50',
									color: 'white',
									animation: 'slideDown 0.3s ease-in-out',
								}}
							>
								<Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>
									{bannerMsg}
								</Typography>
							</Box>
						)}

						{/* Buttons */}
						<div
							style={{
								display: 'flex',
								gap: '12px',
								justifyContent: 'flex-end',
								marginTop: '24px',
							}}
						>
							<button
								onClick={closeModal}
								disabled={loading}
								style={{
									padding: '12px 24px',
									backgroundColor: '#f3f4f6',
									color: '#374151',
									border: '2px solid #e5e7eb',
									borderRadius: '8px',
									cursor: loading ? 'not-allowed' : 'pointer',
									fontSize: '14px',
									fontWeight: '500',
									opacity: loading ? 0.7 : 1,
									transition: 'all 0.2s',
								}}
							>
								Cancelar
							</button>
							<button
								onClick={saveUrls}
								disabled={loading}
								style={{
									padding: '12px 24px',
									backgroundColor: loading ? '#93c5fd' : '#3b82f6',
									color: 'white',
									border: 'none',
									borderRadius: '8px',
									cursor: loading ? 'not-allowed' : 'pointer',
									fontSize: '14px',
									fontWeight: '500',
									transition: 'all 0.2s',
								}}
							>
								{loading ? 'Guardando...' : 'Guardar Cambios'}
							</button>
						</div>
					</div>
				</div>
			)}
		</Box>
	);
};

export default EnVivo;