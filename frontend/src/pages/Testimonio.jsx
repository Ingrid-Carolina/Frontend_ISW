import React, { useState, useRef, useEffect } from 'react';
import {
	Box,
	Typography,
	CircularProgress,
	Alert,
	useTheme,
	useMediaQuery,
	Snackbar,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	IconButton,
	Tooltip,
	LinearProgress,
	Button,
	TextField,
} from '@mui/material';
import TestimonioTrapezoide from '../components/TestimonioTrapezoide';
import VidCarousel from '../components/VideoCarousel';
import { api } from '../api/api';
import EditIcon from '@mui/icons-material/Edit';
import fondoDefault from '/Images/TestimonioFondo1.jpg';

const PaginaTestimonios = () => {
	const theme = useTheme();
	const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

	// ======== ESTADOS PARA HEADER ========
	const [headerUrl, setHeaderUrl] = useState(null);
	const [headerTitle, setHeaderTitle] = useState('Historias que inspiran.');
	const [isAdmin, setIsAdmin] = useState(false);

	// ======== MODAL DE HEADER ========
	const [openHeaderEdit, setOpenHeaderEdit] = useState(false);
	const [headerTitleInput, setHeaderTitleInput] = useState('Historias que inspiran.');
	const [headerFile, setHeaderFile] = useState(null);
	const [headerUploading, setHeaderUploading] = useState(false);
	const [headerError, setHeaderError] = useState('');
	const [headerPreview, setHeaderPreview] = useState(null);

	// ======== SNACKBAR ========
	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [snackbarType, setSnackbarType] = useState('success');
	const [snackbarMsg, setSnackbarMsg] = useState('');

	// ======== TESTIMONIOS ========
	const [testimonios, setTestimonios] = useState([]);
	const [testimoniosDestacados, setTestimoniosDestacados] = useState([]);
	const [testimoniosNormales, setTestimoniosNormales] = useState([]);
	
	// ======== VIDEOS ========
	const [videos, setVideos] = useState([]);
	const [cargandoVideos, setCargandoVideos] = useState(true);

	const roles = [
		'Jugador Profesional – Categoría Infantil',
		'Jugador Profesional – Categoría Intermedia',
		'Jugador Profesional – Categoría Juvenil',
		'Madre de jugador – Categoría Juvenil',
	];

	// Cargar videos desde la base de datos
	useEffect(() => {
		const fetchVideos = async () => {
			try {
				setCargandoVideos(true);
				const res = await api.get('/auth/obtenervideotestimonio', { skipAuthRedirect: true });
				const videosData = res.data;
				
				// Formatear los videos para el carousel
				const videosFormateados = videosData.map(video => ({
					url: video.url,
					nombre: video.nombre_video
				}));
				
				setVideos(videosFormateados);
			} catch (error) {
				console.error('Error al cargar videos:', error);
				// En caso de error, usar videos por defecto
				setVideos([
					{ url: 'https://www.youtube.com/shorts/-J3Fy6iyMgY' },
					{ url: 'https://www.youtube.com/shorts/1IzwLvkmtu0' },
					{ url: 'https://www.youtube.com/shorts/aDV-PF32GXQ' },
					{ url: 'https://www.youtube.com/shorts/a0S_W989rHE' },
					{ url: 'https://www.youtube.com/shorts/Pu3UF_mdrt0' },
					{ url: 'https://www.youtube.com/shorts/3ZSh5IuaCxA' },
					{ url: 'https://www.youtube.com/shorts/tDngfZRNfsA' },
				]);
			} finally {
				setCargandoVideos(false);
			}
		};

		fetchVideos();
	}, []);

	// Resto de tu código existente (useEffects, funciones, etc.)...
	// Preview local del archivo seleccionado
	useEffect(() => {
		if (!headerFile) {
			setHeaderPreview(null);
			return;
		}
		const url = URL.createObjectURL(headerFile);
		setHeaderPreview(url);
		return () => URL.revokeObjectURL(url);
	}, [headerFile]);

	// Comprobar rol (para mostrar botón "editar")
	useEffect(() => {
		const checkRole = async () => {
			try {
				const r = await api.get('/auth/obtenerperfil', {
					withCredentials: true,
					skipAuthRedirect: true,
				});
				const p = Array.isArray(r.data) ? r.data[0] : r.data;
				const role = String(p?.rol || '').toLowerCase();
				setIsAdmin(role === 'admin');
			} catch {
				setIsAdmin(false);
			}
		};
		checkRole();

		const onAuthRefresh = () => checkRole();
		window.addEventListener('auth:refresh', onAuthRefresh);
		return () => window.removeEventListener('auth:refresh', onAuthRefresh);
	}, []);

	// Cargar info de testimonios (header_title)
	useEffect(() => {
		const fetchTestimoniosSite = async () => {
			try {
				const res = await api.get('/auth/testimoniossite', { skipAuthRedirect: true });
				const payload = res?.data ?? null;
				if (payload?.header_title) setHeaderTitle(String(payload.header_title));
			} catch (e) {
				console.log('No se pudo cargar /testimoniossite:', e.message);
			}
		};
		fetchTestimoniosSite();
	}, []);

	// Cargar imagen del header
	useEffect(() => {
		const loadHeader = async () => {
			try {
				const res = await api.get('/auth/testimoniosimages');
				const rows = Array.isArray(res.data) ? res.data : [];
				const row = rows.find(
					r => String(r.type).toLowerCase() === 'testimonios_header',
				);
				setHeaderUrl(row?.url || null);
			} catch (err) {
				console.error('Error cargando testimonios_header:', err?.message || err);
			}
		};
		loadHeader();
	}, []);

	// Cargar testimonios y separarlos en destacados y normales
	useEffect(() => {
		const fetchTestimonios = async () => {
			try {
				const res = await api.get('/auth/obtenertestimonios');
				const testimoniosData = res.data;
				
				const testimoniosLista = testimoniosData.map(testimonio => ({
					id: testimonio.id_testimonio,
					nombre: testimonio.nombre,
					cita: testimonio.contenido,
					imagen: testimonio.imagen,
					is_featured: testimonio.is_featured
				}));

				setTestimonios(testimoniosLista);
				
				// Separar testimonios destacados de normales
				const destacados = testimoniosLista.filter(t => t.is_featured);
				const normales = testimoniosLista.filter(t => !t.is_featured);
				
				setTestimoniosDestacados(destacados);
				setTestimoniosNormales(normales);
			} catch (err) {
				console.error('Error al obtener testimonios:', err);
			}
		};
		fetchTestimonios();
	}, []);

	// Abre modal de header con datos actuales
	const openHeaderEditor = () => {
		setHeaderTitleInput(headerTitle || 'Historias que inspiran.');
		setHeaderFile(null);
		setHeaderError('');
		setOpenHeaderEdit(true);
	};

	// Guardar título/imagen del header
	const saveHeader = async () => {
		try {
			setHeaderError('');
			setHeaderUploading(true);

			// 1) Subir imagen si se seleccionó
			let newUrl = headerUrl;
			if (headerFile) {
				const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
				if (!allowed.includes(headerFile.type)) {
					throw new Error('Formato no permitido. Usa JPG, PNG, WEBP o AVIF.');
				}
				if (headerFile.size > 8 * 1024 * 1024) {
					throw new Error('La imagen supera los 8 MB.');
				}
	
				const fd = new FormData();
				fd.append('file', headerFile);
				const up = await api.post('/auth/upload', fd, {
					headers: { 'Content-Type': 'multipart/form-data' },
				});
				newUrl = up?.data?.url;
				if (!newUrl) throw new Error('No se recibió URL de subida');

				await api.put('/auth/testimonioimages', {
					type: 'testimonio_header',
					url: newUrl,
				});
			}

			// 2) Actualizar título en testimonios_site
			const payload = {
				header_title: headerTitleInput?.trim() || 'Historias que inspiran.',
			};
			await api.put('/auth/testimoniossite', payload);

			// 3) Refrescar UI
			setHeaderUrl(newUrl);
			setHeaderTitle((headerTitleInput || 'Historias que inspiran.').trim());

			// limpia selección y preview
			setHeaderFile(null);
			setHeaderPreview(null);

			setOpenHeaderEdit(false);
			setSnackbarType('success');
			setSnackbarMsg('Encabezado actualizado');
			setOpenSnackbar(true);
		} catch (err) {
			const msg =
				err?.response?.data?.mensaje ||
				err?.response?.data?.error ||
				err?.message ||
				'Error al actualizar el encabezado.';
			setHeaderError(msg);
		} finally {
			setHeaderUploading(false);
		}
	};

	return (
		<div style={{ overflowX: 'hidden' }}>
			{/* ENCABEZADO CON SISTEMA DE EDICIÓN COMPLETO */}
			<Box
				sx={{
					position: 'relative',
					width: '100%',
					minHeight: { xs: '75vh', md: '90vh' },
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					backgroundImage: `url(${headerUrl || fondoDefault})`,
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					py: { xs: 6, md: 8 },
				}}
			>
				<Box
					sx={{
						position: 'absolute',
						top: 0,
						left: 0,
						width: '100%',
						height: '100%',
						backgroundColor: 'rgba(0, 0, 80, 0.75)',
						zIndex: 1,
					}}
				/>

				{/* Botón para editar TÍTULO + IMAGEN (solo admin) */}
				{isAdmin && (
					<Tooltip title='Editar título/imagen'>
						<IconButton
							onClick={openHeaderEditor}
							sx={{
								position: 'absolute',
								bottom: 16,
								right: 16,
								color: 'white',
								backgroundColor: 'rgba(0,0,0,0.4)',
								'&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' },
								zIndex: 3,
							}}
						>
							<EditIcon />
						</IconButton>
					</Tooltip>
				)}

				<Box
					sx={{
						position: 'relative',
						zIndex: 2,
						textAlign: 'center',
						height: '100%',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						p: { xs: 2, sm: 4 },
						width: '100%',
						maxWidth: '1200px',
					}}
				>
					<Box>
						<Typography
							variant='h1'
							sx={{
								fontFamily: 'Bulletto, cursive',
								mb: 2,
								fontSize: {
									xs: '3.5rem',
									sm: '5rem',
									md: '6rem',
									lg: '7rem',
								},
								color: 'white',
								textShadow: '2px 2px 6px rgba(0,0,0,0.7)',
							}}
						>
							{headerTitle}
						</Typography>

						<Typography
							variant='h4'
							sx={{
								fontFamily: 'ManropeEB, sans-serif',
								fontSize: {
									xs: '1.2rem',
									sm: '1.5rem',
									md: '2rem',
								},
								color: 'white',
								textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
							}}
						>
							Nuestros pilotos de béisbol comparten sus experiencias y logros a lo
							largo de su trayectoria.
						</Typography>
					</Box>
				</Box>
			</Box>

			{/* SECCIÓN TESTIMONIOS DESTACADOS - Solo se muestra si hay destacados */}
			{testimoniosDestacados.length > 0 && (
				<Box sx={{ py: 6, backgroundColor: '#10045c' }}>
					<Typography
						variant='h4'
						sx={{
							fontFamily: 'Varsity, sans-serif',
							fontWeight: 'bold',
							fontSize: isSmallScreen ? '1.8rem' : '4rem',	
							color: 'white',
							textAlign: 'center',
							mb: 4,
						}}
					>
						Testimonio Destacado
					</Typography>

					{/* Mostrar todos los testimonios destacados */}
					{testimoniosDestacados.map((testimonio, index) => {
						const invertir = index % 2 === 1;
						const superponer = index !== 0;
						const invertirDiagonal = index % 2 === 0;
						const zIndex = 9 - (index % 9);
						const rol = roles[Math.floor(Math.random() * roles.length)];

						return (
							<TestimonioTrapezoide
								key={`destacado-${testimonio.id}`}
								{...testimonio}
								rol={rol}
								invertir={invertir}
								superponer={superponer}
								invertirDiagonal={invertirDiagonal}
								colorFondo={index % 2 === 0 ? '#c65402' : '#044c94'}
								zIndex={zIndex}
								finalTest={index === testimoniosDestacados.length - 1}
								esDestacado={true}
							/>
						);
					})}
				</Box>
			)}

			{/* SECCIÓN TESTIMONIOS NORMALES - Solo se muestra si hay testimonios normales */}
			{testimoniosNormales.length > 0 && (
				<Box sx={{ py: testimoniosDestacados.length > 0 ? 0 : 6 }}>
					{/* Título solo se muestra si hay testimonios destacados antes */}
					{testimoniosDestacados.length > 0 && (
						<Box sx={{ py: 6, backgroundColor: '#10045c' }}>
							<Typography
								variant='h4'
								sx={{
									fontFamily: 'Varsity, sans-serif',
									fontWeight: 'bold',
									fontSize: isSmallScreen ? '1.8rem' : '4rem',	
									color: 'White',
									textAlign: 'center',
									mb: 4,
								}}
							>
								Más Testimonios
							</Typography>
						</Box>
					)}
					
					{/* Mostrar testimonios normales */}
					{testimoniosNormales.map((testimonio, index) => {
						const invertir = index % 2 === 1;
						const superponer = index !== 0;
						const invertirDiagonal = index % 2 === 0;
						const zIndex = 9 - (index % 9);
						const rol = roles[Math.floor(Math.random() * roles.length)];

						return (
							<TestimonioTrapezoide
								key={testimonio.id}
								{...testimonio}
								rol={rol}
								invertir={invertir}
								superponer={superponer}
								invertirDiagonal={invertirDiagonal}
								colorFondo={index % 2 === 0 ? '#c65402' : '#044c94'}
								zIndex={zIndex}
								finalTest={index === testimoniosNormales.length - 1}
								esDestacado={false}
							/>
						);
					})}
				</Box>
			)}

			{/* Mensaje cuando no hay testimonios */}
			{testimonios.length === 0 && (
				<Box sx={{ py: 10, textAlign: 'center', backgroundColor: '#f1f5fb' }}>
					<Typography
						variant='h5'
						sx={{
							fontFamily: 'ManropeEB, sans-serif',
							color: '#666',
						}}
					>
						No hay testimonios disponibles en este momento.
					</Typography>
				</Box>
			)}

			{/* SECCIÓN VIDEOS */}
			<Box sx={{ py: 6, backgroundColor: '#f1f5fb' }}>
				<Typography
					variant='h4'
					sx={{
						fontFamily: 'Varsity, sans-serif',
						fontWeight: 'bold',
						fontSize: isSmallScreen ? '1.8rem' : '3rem',	
						color: '#002c6c',
						textAlign: 'center',
						mb: 4,
					}}
				>
					Testimonios en Video
				</Typography>
				
				{cargandoVideos ? (
					<Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
						<CircularProgress />
					</Box>
				) : videos.length > 0 ? (
					<VidCarousel videos={videos} />
				) : (
					<Typography
						variant='h6'
						sx={{
							fontFamily: 'ManropeEB, sans-serif',
							color: '#666',
							textAlign: 'center',
							py: 4,
						}}
					>
						No hay videos disponibles en este momento.
					</Typography>
				)}
			</Box>

			{/* SNACKBAR FEEDBACK */}
			<Snackbar
				open={openSnackbar}
				autoHideDuration={4000}
				onClose={() => setOpenSnackbar(false)}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
			>
				<Alert
					onClose={() => setOpenSnackbar(false)}
					severity={snackbarType}
					variant='filled'
					sx={{ width: '100%' }}
				>
					{snackbarMsg}
				</Alert>
			</Snackbar>

			{/* MODAL EDITAR HEADER (título + imagen) */}
			<Dialog
				open={openHeaderEdit}
				onClose={() => !headerUploading && setOpenHeaderEdit(false)}
				maxWidth='sm'
				fullWidth
			>
				<DialogTitle>Editar encabezado de Testimonios</DialogTitle>
				<DialogContent
					dividers
					sx={{
						pt: 1.5,
						pb: 2,
						px: 2,
					}}
				>
					{headerUploading && <LinearProgress sx={{ mb: 2 }} />}
					
					<TextField
						label='Título del header'
						value={headerTitleInput}
						onChange={e => setHeaderTitleInput(e.target.value)}
						fullWidth
						size='small'
						margin='dense'
						InputLabelProps={{ shrink: true }}
						sx={{
							'& .MuiOutlinedInput-root': { borderRadius: 1.2 },
						}}
					/>

					<Button
						variant='contained'
						component='label'
						disabled={headerUploading}
						sx={{ mt: 2, fontWeight: 'bold', textTransform: 'none' }}
					>
						{headerFile ? 'Imagen seleccionada' : 'Seleccionar nueva imagen'}
						<input
							type='file'
							hidden
							accept='image/jpeg,image/png,image/webp,image/avif'
							onChange={e => {
								const f = e.target.files?.[0] || null;
								setHeaderFile(f);
							}}
						/>
					</Button>
					<Box sx={{ mt: 1, opacity: 0.8, fontSize: 12 }}>
						Formatos: JPG, PNG, WEBP, AVIF. Máx. 8 MB.
					</Box>

					{/* Vista previa */}
					<Box sx={{ mt: 2, textAlign: 'center' }}>
						<Typography sx={{ fontSize: 13, mb: 1, color: 'text.secondary' }}>
							Vista previa
						</Typography>

						<Box
							sx={{
								width: { xs: 'min(85vw, 150px)', sm: 300 },
								mx: 'auto',
								border: '1px solid',
								borderColor: 'divider',
								borderRadius: 1.5,
								overflow: 'hidden',
								position: 'relative',
								pt: '30%',
								bgcolor: '#f7f7f7',
								boxShadow: 1,
							}}
						>
							<Box
								component='img'
								src={headerPreview || headerUrl || fondoDefault}
								alt='Vista previa del encabezado'
								sx={{
									position: 'absolute',
									inset: 0,
									width: '100%',
									height: '100%',
									objectFit: 'cover',
								}}
							/>
						</Box>

						{headerFile && (
							<Box
								sx={{
									mt: 1,
									display: 'flex',
									gap: 1,
									justifyContent: 'center',
								}}
							>
								<Button
									size='small'
									onClick={() => {
										setHeaderFile(null);
										setHeaderPreview(null);
									}}
								>
									Quitar selección
								</Button>
							</Box>
						)}
					</Box>

					{headerError && (
						<Alert severity='error' sx={{ mt: 2 }}>
							{headerError}
						</Alert>
					)}
				</DialogContent>

				<DialogActions>
					<Button
						onClick={() => {
							setOpenHeaderEdit(false);
							setHeaderFile(null);
							setHeaderPreview(null);
						}}
						disabled={headerUploading}
					>
						Cancelar
					</Button>
					<Button
						onClick={saveHeader}
						variant='contained'
						disabled={headerUploading}
					>
						Guardar
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

export default PaginaTestimonios;