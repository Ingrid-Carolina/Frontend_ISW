import React, { useState, useEffect } from 'react';
import { 
	Box, 
	Typography, 
	CircularProgress, 
	Alert, 
	IconButton, 
	Tooltip,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Button,
	LinearProgress,
	Backdrop
} from '@mui/material';
import { motion } from 'framer-motion';
import Slider from 'react-slick';
import { api } from '../api/api';
import EditableImage from '../components/EditableImage';
import EditableText from '../components/EditableText';
import EditIcon from '@mui/icons-material/Edit';

// Imagen por defecto - definir como string
const DefaultHeaderImg = '/Images/FondoHistoria.png'; // Ajusta la ruta según tu estructura

// Variantes de animación
const fadeUp = {
	hidden: { opacity: 0, y: 30 },
	visible: { opacity: 1, y: 0, transition: { duration: 1 } },
};

function NuestraHistoria() {
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(true);
	const [isAdmin, setIsAdmin] = useState(false);

	// Estado para las imágenes de las secciones
	const [images, setImages] = useState({
		quienes_somos: '',
		nuestros_inicios: '',
		impacto_comunitario: '',
		nuestros_valores: '',
		historia_header: '',
	});

	// Estados para textos editables
	const [textos, setTextos] = useState({});
	const [bannerMsg, setBannerMsg] = useState('');
	const [bannerType, setBannerType] = useState('success');
	const [showBanner, setShowBanner] = useState(false);

	// NUEVO: Estados para el header editable (copiado de Aliados.jsx)
	const [headerUrl, setHeaderUrl] = useState(null);
	const [headerTitle, setHeaderTitle] = useState('NUESTRA HISTORIA');
	const [openHeaderEdit, setOpenHeaderEdit] = useState(false);
	const [headerTitleInput, setHeaderTitleInput] = useState('NUESTRA HISTORIA');
	const [headerFile, setHeaderFile] = useState(null);
	const [headerUploading, setHeaderUploading] = useState(false);
	const [headerError, setHeaderError] = useState('');
	const [headerPreview, setHeaderPreview] = useState(null);
	const [uploadingImage, setUploadingImage] = useState(false);

	// Galería (carrusel)
	const [galeriaImages, setGaleriaImages] = useState([]);

	// Effect para gestionar preview de imagen del header
	useEffect(() => {
		if (!headerFile) {
			setHeaderPreview(null);
			return;
		}
		const url = URL.createObjectURL(headerFile);
		setHeaderPreview(url);
		return () => URL.revokeObjectURL(url);
	}, [headerFile]);

	// Función para mostrar mensajes
	const showMessage = (message, type = 'success') => {
		setBannerMsg(message || 'Operación completada');
		setBannerType(type);
		setShowBanner(true);
		setTimeout(() => setShowBanner(false), 4000);
	};

	// Funciones para gestionar el header 
	const openHeaderEditor = () => {
		const currentTitle = textos.historia_titulo_principal || headerTitle || 'NUESTRA HISTORIA';
		setHeaderTitleInput(currentTitle);
		setHeaderFile(null);
		setHeaderError('');
		setOpenHeaderEdit(true);
	};

	const saveHeader = async () => {
		try {
			setHeaderError('');
			setHeaderUploading(true);

			const titleToSave = (headerTitleInput || '').trim() || 'NUESTRA HISTORIA';

			// 1) Actualizar títulos inmediatamente
			setTextos(prevTextos => ({
				...prevTextos,
				historia_titulo_principal: titleToSave
			}));
			setHeaderTitle(titleToSave);

			// 2) Subir imagen si se seleccionó
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
					withCredentials: true,
				});
				
				if (up.data && up.data.url) {
					newUrl = up.data.url;
					
					await api.put('/auth/images', {
						type: 'historia_header',
						url: newUrl,
					}, {
						withCredentials: true,
					});
					
					setHeaderUrl(newUrl);
					setImages(prev => ({ 
						...prev, 
						historia_header: newUrl 
					}));
				}
			}

			// 3) Guardar título 
			try {
				await handleTextSave('historia_titulo_principal', titleToSave);
			} catch (textError) {
				console.warn('Error al guardar título:', textError);
			}

			// 4) Limpiar y cerrar
			setHeaderFile(null);
			setHeaderPreview(null);
			setOpenHeaderEdit(false);
			showMessage('Encabezado actualizado correctamente', 'success');
			
		} catch (err) {
			console.error('Error en saveHeader:', err);
			// Revertir cambios
			const originalTitle = textos.historia_titulo_principal || 'NUESTRA HISTORIA';
			setTextos(prevTextos => ({
				...prevTextos,
				historia_titulo_principal: originalTitle
			}));
			setHeaderTitle(originalTitle);
			
			const msg = err?.response?.data?.mensaje || 
						err?.response?.data?.error || 
						err?.message || 
						'Error al actualizar el encabezado.';
			setHeaderError(msg);
		} finally {
			setHeaderUploading(false);
		}
	};

	// Función para cargar textos
	const fetchTextos = async () => {
		try {
			console.log('HISTORIA: Iniciando carga de textos...');
			
			const res = await api.get('/auth/historia/textos', {
				withCredentials: true,
				skipAuthRedirect: true,
			});
			
			console.log('HISTORIA: Response:', res);
			
			if (res.data.success) {
				console.log('HISTORIA: Textos cargados exitosamente:', res.data.data);
				setTextos(prevTextos => ({
					...prevTextos,
					...res.data.data
				}));
				
				// Sincronizar headerTitle si existe historia_titulo_principal
				if (res.data.data.historia_titulo_principal) {
					setHeaderTitle(res.data.data.historia_titulo_principal);
				}
			} else {
				console.error('HISTORIA: Success = false:', res.data);
			}
		} catch (error) {
			console.error('HISTORIA: Error al cargar textos:', error);
		}
	};

	// Función para guardar textos editables
	const handleTextSave = async (clave, nuevoTexto) => {
		if (!clave || !nuevoTexto) {
			showMessage('Datos inválidos para guardar texto', 'error');
			return;
		}

		try {
			console.log('HISTORIA: Guardando texto:', { clave, nuevoTexto });
			
			// Actualizar estado local inmediatamente
			setTextos(prevTextos => ({
				...prevTextos,
				[clave]: nuevoTexto
			}));

			// Sincronizar headerTitle si es el título principal
			if (clave === 'historia_titulo_principal') {
				setHeaderTitle(nuevoTexto);
			}
			
			const res = await api.put('/auth/historia/textos', {
				clave,
				valor: nuevoTexto
			}, {
				withCredentials: true
			});

			console.log('HISTORIA: Respuesta de guardado:', res);

			if (res.data.success) {
				showMessage('Texto actualizado correctamente', 'success');
			} else {
				throw new Error('Respuesta inválida del servidor');
			}
		} catch (error) {
			console.error('HISTORIA: Error al guardar:', error);
			// Revertir cambio local
			setTextos(prevTextos => ({
				...prevTextos,
				[clave]: textos[clave] || ''
			}));
			if (clave === 'historia_titulo_principal') {
				setHeaderTitle(textos.historia_titulo_principal || 'NUESTRA HISTORIA');
			}
			showMessage('Error al guardar el texto', 'error');
		}
	};

	// Obtener rol
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
		fetchTextos();

		const onAuthRefresh = () => {
			checkRole();
			fetchTextos();
		};
		window.addEventListener('auth:refresh', onAuthRefresh);
		return () => window.removeEventListener('auth:refresh', onAuthRefresh);
	}, []);

	// Cargar imágenes iniciales
	useEffect(() => {
		const fetchImages = async () => {
			try {
				setLoading(true);
				const response = await api.get('/auth/images');

				const imagesMap = response.data.reduce((acc, current) => {
					if (current.type && current.url) {
						acc[current.type] = current.url;
					}
					return acc;
				}, {});

				const headerImageUrl = imagesMap.historia_header || DefaultHeaderImg;
				setHeaderUrl(headerImageUrl);

				setImages(prev => ({
					...prev,
					quienes_somos: imagesMap.quienes_somos || '',
					nuestros_inicios: imagesMap.nuestros_inicios || '',
					impacto_comunitario: imagesMap.impacto_comunitario || '',
					nuestros_valores: imagesMap.nuestros_valores || '',
					historia_header: headerImageUrl,
				}));

				const galeriaFromApi = response.data
					.filter(img => img.type && img.type.startsWith('galeria_'))
					.sort((a, b) => {
						const numA = parseInt(a.type.split('_')[1], 10);
						const numB = parseInt(b.type.split('_')[1], 10);
						return numA - numB;
					})
					.map(img => img.url);

				setGaleriaImages(galeriaFromApi);
			} catch (e) {
				console.error('Error al cargar imágenes de historia:', e);
				setError(
					'No se pudieron cargar las imágenes. Inténtelo de nuevo más tarde.',
				);
			} finally {
				setLoading(false);
			}
		};
		fetchImages();
	}, []);

	// Subida/guardado genérico
	const handleImageChange = async (type, file) => {
		try {
			if (!(file instanceof File)) {
				setError('Error: No se seleccionó un archivo válido.');
				return;
			}

			setUploadingImage(true);
			showMessage('Subiendo imagen...', 'info');

			const formData = new FormData();
			formData.append('file', file);

			const uploadResponse = await api.post('/auth/upload', formData, {
				headers: { 'Content-Type': 'multipart/form-data' },
			});

			const finalUrl = uploadResponse.data.url;

			await api.put('/auth/images', {
				type,
				url: finalUrl,
			});

			if (type === 'historia_header') {
				setHeaderUrl(finalUrl);
			}

			if (type.startsWith('galeria_')) {
				const index = parseInt(type.split('_')[1], 10) - 1;
				setGaleriaImages(prevImages => {
					const updated = [...prevImages];
					updated[index] = finalUrl;
					return updated;
				});
			} else {
				setImages(prev => ({ ...prev, [type]: finalUrl }));
			}

			showMessage('Imagen actualizada correctamente', 'success');
		} catch (e) {
			console.error(`Error al actualizar la imagen de ${type}:`, e);
			setError(`Error al actualizar la imagen de ${type}.`);
			showMessage('Error al actualizar la imagen', 'error');
		} finally {
			setUploadingImage(false);
		}
	};

	// Handler helper para galería
	const handleGalleryImageUpload = index => async file => {
		const type = `galeria_${index + 1}`;
		await handleImageChange(type, file);
	};

	// Carrusel
	const sliderSettings = {
		dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: 1,
		slidesToScroll: 1,
		arrows: true,
		autoplay: true,
		autoplaySpeed: 5000,
	};

	if (loading) {
		return (
			<Box
				display='flex'
				justifyContent='center'
				alignItems='center'
				height='100vh'
			>
				<CircularProgress />
			</Box>
		);
	}

	if (error) {
		return (
			<Alert severity='error' sx={{ my: 2 }}>
				{error}
			</Alert>
		);
	}

	return (
		<>
			{/* Backdrop para mostrar carga de imagen */}
			<Backdrop open={uploadingImage} sx={{ zIndex: 1300 }}>
				<Box sx={{ textAlign: 'center', color: 'white' }}>
					<CircularProgress color="inherit" />
					<Typography sx={{ mt: 2 }}>Subiendo imagen...</Typography>
				</Box>
			</Backdrop>

			{/* ENCABEZADO CON IMAGEN MEJORADO CON FUNCIONALIDAD COMPLETA DE EDICIÓN */}
			<Box
				sx={{
					position: 'relative',
					width: '100%',
					minHeight: { xs: '75vh', md: '90vh' },
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					backgroundImage: `url(${headerUrl || DefaultHeaderImg})`,
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					py: { xs: 6, md: 8 },
				}}
			>
				{/* Overlay */}
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

				{/* Botón único para editar TÍTULO + IMAGEN (solo admin) */}
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

				{/* Texto */}
				<Box
					sx={{
						position: 'relative',
						zIndex: 2,
						textAlign: 'center',
					}}
				>
					<motion.div
						initial='hidden'
						whileInView='visible'
						viewport={{ once: true }}
						variants={fadeUp}
					>
						<Typography
							variant='h2'
							sx={{
								fontWeight: 'bold',
								fontSize: { xs: '4rem', md: '7rem' },
								fontFamily: '"Varsity", cursive',
								color: 'white',
								textAlign: 'center',
							}}
						>
							{headerTitle || 'NUESTRA HISTORIA'}
						</Typography>
					</motion.div>
				</Box>
			</Box>

			{/* RESTO DEL CONTENIDO (sin cambios) */}
			{/* QUIÉNES SOMOS */}
			<Box
				sx={{
					display: 'flex',
					flexDirection: { xs: 'column', md: 'row' },
					alignItems: 'center',
					gap: { xs: 4, md: 6 },
					px: { xs: 3, md: 12 },
					py: 8,
					bgcolor: '#e6691d',
				}}
			>
				<motion.div
					initial='hidden'
					whileInView='visible'
					viewport={{ once: true }}
					variants={fadeUp}
					style={{ flex: 1, position: 'relative' }}
				>
					{isAdmin ? (
						<EditableImage
							src={images.quienes_somos}
							alt='Equipo de béisbol'
							onImageUpload={file => handleImageChange('quienes_somos', file)}
							sx={{
								width: '100%',
								borderRadius: 2,
								boxShadow: 4,
								'& .edit-button': { bottom: 8, right: 8 },
							}}
						/>
					) : (
						<img
							src={images.quienes_somos}
							alt='Equipo de béisbol'
							style={{
								width: '100%',
								borderRadius: 8,
								boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
							}}
						/>
					)}
				</motion.div>

				<motion.div
					initial='hidden'
					whileInView='visible'
					viewport={{ once: true }}
					variants={fadeUp}
					style={{ flex: 1.3 }}
				>
					<Box sx={{ color: 'white' }}>
						<EditableText
							text={textos.historia_quienes_somos_titulo || "¿Quiénes somos?"}
							onTextSave={(newText) => handleTextSave("historia_quienes_somos_titulo", newText)}
							isAdmin={isAdmin}
							variant='h3'
							sx={{
								fontFamily: '"Varsity", cursive',
								fontWeight: 'bold',
								mb: 3,
								fontSize: { xs: '3rem', md: '4rem' },
								color: 'white',
							}}
						/>
						<EditableText
							text={textos.historia_quienes_somos_parrafo || "Desde 1948, la Asociación de Béisbol Menor Pilotos de Honduras (FAH) forma integralmente a jóvenes, impulsando habilidades deportivas, valores y liderazgo. Creamos espacios seguros con el apoyo de voluntarios, entrenadores, familias y aliados, para que cada atleta crezca en lo físico, emocional y social. Más que un equipo, somos una comunidad que comparte pasión, esfuerzo y sentido de pertenencia. ¡Gracias por ser parte de esta familia!"}
							onTextSave={(newText) => handleTextSave("historia_quienes_somos_parrafo", newText)}
							isAdmin={isAdmin}
							variant='body1'
							sx={{
								fontFamily: '"PeterMedium", sans-serif',
								fontSize: '1rem',
								lineHeight: 1.9,
								color: 'white',
							}}
							multiline={true}
						/>
					</Box>
				</motion.div>
			</Box>

			{/* NUESTROS INICIOS */}
			<Box
				sx={{
					display: 'flex',
					flexDirection: { xs: 'column', md: 'row' },
					alignItems: 'center',
					px: { xs: 4, md: 12 },
					py: 8,
					bgcolor: '#f7d7c4',
					gap: { xs: 4, md: 6 },
				}}
			>
				<motion.div
					initial='hidden'
					whileInView='visible'
					viewport={{ once: true }}
					variants={fadeUp}
					style={{ flex: 1.3 }}
				>
					<EditableText
						text={textos.historia_inicios_titulo || "Nuestros Inicios"}
						onTextSave={(newText) => handleTextSave("historia_inicios_titulo", newText)}
						isAdmin={isAdmin}
						variant='h4'
						sx={{
							fontFamily: '"Varsity", cursive',
							fontWeight: 'bold',
							color: '#e6691d',
							fontSize: { xs: '2.5rem', md: '3rem' },
							mb: 3,
						}}
					/>
					<EditableText
						text={textos.historia_inicios_parrafo || "Desde nuestros humildes comienzos en 1948, nuestro enfoque ha sido brindar oportunidades para jóvenes atletas en comunidades rurales. A través del béisbol, construimos disciplina, valores y comunidad."}
						onTextSave={(newText) => handleTextSave("historia_inicios_parrafo", newText)}
						isAdmin={isAdmin}
						variant='body1'
						sx={{
							fontSize: '1.3rem',
							lineHeight: 1.9,
							fontFamily: '"PeterMedium", sans-serif',
							color: '#333',
						}}
						multiline={true}
					/>
				</motion.div>

				<motion.div
					initial='hidden'
					whileInView='visible'
					viewport={{ once: true }}
					variants={fadeUp}
					style={{ flex: 1, position: 'relative' }}
				>
					{isAdmin ? (
						<EditableImage
							src={images.nuestros_inicios}
							alt='Nuestros inicios'
							onImageUpload={file =>
								handleImageChange('nuestros_inicios', file)
							}
							sx={{
								width: '100%',
								borderRadius: 2,
								boxShadow: 4,
								'& .edit-button': { bottom: 8, right: 8 },
							}}
						/>
					) : (
						<img
							src={images.nuestros_inicios}
							alt='Nuestros inicios'
							style={{
								width: '100%',
								borderRadius: 8,
								boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
							}}
						/>
					)}
				</motion.div>
			</Box>

			{/* IMPACTO COMUNITARIO */}
			<Box
				sx={{
					display: 'flex',
					flexDirection: { xs: 'column', md: 'row-reverse' },
					alignItems: 'center',
					px: { xs: 4, md: 12 },
					py: 8,
					bgcolor: '#ffe3dc',
					gap: { xs: 4, md: 6 },
				}}
			>
				<motion.div
					initial='hidden'
					whileInView='visible'
					viewport={{ once: true }}
					variants={fadeUp}
					style={{ flex: 1.3 }}
				>
					<EditableText
						text={textos.historia_impacto_titulo || "Impacto Comunitario"}
						onTextSave={(newText) => handleTextSave("historia_impacto_titulo", newText)}
						isAdmin={isAdmin}
						variant='h4'
						sx={{
							fontFamily: '"Varsity", cursive',
							fontWeight: 'bold',
							color: '#e6691d',
							fontSize: { xs: '2.5rem', md: '3rem' },
							mb: 3,
						}}
					/>
					<EditableText
						text={textos.historia_impacto_parrafo || "A lo largo de las décadas, hemos trabajado con más de 10,000 niños, formando no solo jugadores sino líderes. Nuestras iniciativas incluyen clínicas deportivas, programas de mentoría y eventos familiares."}
						onTextSave={(newText) => handleTextSave("historia_impacto_parrafo", newText)}
						isAdmin={isAdmin}
						variant='body1'
						sx={{
							fontSize: '1.3rem',
							lineHeight: 1.9,
							fontFamily: '"PeterMedium", sans-serif',
							color: '#333',
						}}
						multiline={true}
					/>
				</motion.div>

				<motion.div
					initial='hidden'
					whileInView='visible'
					viewport={{ once: true }}
					variants={fadeUp}
					style={{ flex: 1, position: 'relative' }}
				>
					{isAdmin ? (
						<EditableImage
							src={images.impacto_comunitario}
							alt='Impacto comunitario'
							onImageUpload={file =>
								handleImageChange('impacto_comunitario', file)
							}
							sx={{
								width: '100%',
								borderRadius: 2,
								boxShadow: 4,
								'& .edit-button': { bottom: 8, right: 8 },
							}}
						/>
					) : (
						<img
							src={images.impacto_comunitario}
							alt='Impacto comunitario'
							style={{
								width: '100%',
								borderRadius: 8,
								boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
							}}
						/>
					)}
				</motion.div>
			</Box>

			{/* NUESTROS VALORES */}
			<Box
				sx={{
					display: 'flex',
					flexDirection: { xs: 'column', md: 'row' },
					alignItems: 'center',
					px: { xs: 4, md: 12 },
					py: 8,
					bgcolor: '#e3f2fd',
					gap: { xs: 4, md: 6 },
				}}
			>
				<motion.div
					initial='hidden'
					whileInView='visible'
					viewport={{ once: true }}
					variants={fadeUp}
					style={{ flex: 1.3 }}
				>
					<EditableText
						text={textos.historia_valores_titulo || "Nuestros Valores"}
						onTextSave={(newText) => handleTextSave("historia_valores_titulo", newText)}
						isAdmin={isAdmin}
						variant='h4'
						sx={{
							fontFamily: '"Varsity", cursive',
							fontWeight: 'bold',
							color: '#e6691d',
							fontSize: { xs: '2.5rem', md: '3rem' },
							mb: 3,
						}}
					/>
					<EditableText
						text={textos.historia_valores_parrafo || "Solidaridad, compromiso, respeto y pasión por el deporte. Estos valores son la base de cada entrenamiento, partido y actividad que realizamos como asociación."}
						onTextSave={(newText) => handleTextSave("historia_valores_parrafo", newText)}
						isAdmin={isAdmin}
						variant='body1'
						sx={{
							fontSize: '1.3rem',
							lineHeight: 1.9,
							fontFamily: '"PeterMedium", sans-serif',
							color: '#333',
						}}
						multiline={true}
					/>
				</motion.div>

				<motion.div
					initial='hidden'
					whileInView='visible'
					viewport={{ once: true }}
					variants={fadeUp}
					style={{ flex: 1, position: 'relative' }}
				>
					{isAdmin ? (
						<EditableImage
							src={images.nuestros_valores}
							alt='Nuestros valores'
							onImageUpload={file =>
								handleImageChange('nuestros_valores', file)
							}
							sx={{
								width: '100%',
								borderRadius: 2,
								boxShadow: 4,
								'& .edit-button': { bottom: 8, right: 8 },
							}}
						/>
					) : (
						<img
							src={images.nuestros_valores}
							alt='Nuestros valores'
							style={{
								width: '100%',
								borderRadius: 8,
								boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
							}}
						/>
					)}
				</motion.div>
			</Box>

			{/* GALERÍA HISTÓRICA */}
			<Box
				sx={{
					py: 8,
					px: { xs: 4, md: 12 },
					bgcolor: '#fef6f2',
					textAlign: 'center',
				}}
			>
				<motion.div
					initial='hidden'
					whileInView='visible'
					viewport={{ once: true }}
					variants={fadeUp}
				>
					<EditableText
						text={textos.historia_galeria_titulo || "Galería Histórica"}
						onTextSave={(newText) => handleTextSave("historia_galeria_titulo", newText)}
						isAdmin={isAdmin}
						variant='h4'
						sx={{
							fontFamily: '"Varsity", cursive',
							fontWeight: 'bold',
							color: '#e6691d',
							fontSize: { xs: '2.5rem', md: '3rem' },
							mb: 4,
						}}
					/>
					<Slider {...sliderSettings}>
						{galeriaImages.map((src, index) => (
							<Box key={index} sx={{ px: 2, position: 'relative' }}>
								{isAdmin ? (
									<EditableImage
										src={src}
										alt={`Galería ${index + 1}`}
										onImageUpload={handleGalleryImageUpload(index)}
										sx={{
											maxWidth: '100%',
											width: { xs: '100%', md: '70%' },
											borderRadius: 3,
											boxShadow: 5,
											margin: '0 auto',
											'& .edit-button': {
												bottom: 8,
												right: 'calc(15% + 8px)',
												transform: 'translateX(50%)',
											},
										}}
									/>
								) : (
									<img
										src={src}
										alt={`Galería ${index + 1}`}
										style={{
											maxWidth: '100%',
											width: 'min(100%, 70%)',
											borderRadius: 12,
											boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
											display: 'block',
											margin: '0 auto',
										}}
									/>
								)}
							</Box>
						))}
					</Slider>
				</motion.div>
			</Box>

			{/* Banner Global para mensajes */}
			{showBanner && (
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

			{/* MODAL EDITAR HEADER (título + imagen) */}
			<Dialog
				open={openHeaderEdit}
				onClose={() => !headerUploading && setOpenHeaderEdit(false)}
				maxWidth='sm'
				fullWidth
			>
				<DialogTitle>Editar encabezado</DialogTitle>
				<DialogContent dividers sx={{ pt: 1.5, pb: 2, px: 2 }}>
					<TextField
						label='Título del header'
						value={headerTitleInput}
						onChange={e => setHeaderTitleInput(e.target.value)}
						fullWidth
						size='small'
						margin='dense'
						InputLabelProps={{ shrink: true }}
						sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.2 } }}
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
						Formatos: JPG, PNG, WEBP, AVIF.
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
								src={headerPreview || headerUrl || DefaultHeaderImg}
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
							<Button
								size='small'
								onClick={() => {
									setHeaderFile(null);
									setHeaderPreview(null);
								}}
								sx={{ mt: 1 }}
							>
								Quitar selección
							</Button>
						)}
					</Box>

					{headerError && (
						<Alert severity="error" sx={{ mt: 2 }}>
							{headerError}
						</Alert>
					)}

					{headerUploading && (
						<Box sx={{ mt: 2 }}>
							<Typography variant="body2" sx={{ mb: 1 }}>
								Guardando encabezado...
							</Typography>
							<LinearProgress />
						</Box>
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
		</>
	);
}

export default NuestraHistoria;