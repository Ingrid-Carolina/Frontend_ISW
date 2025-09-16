import React, { useState, useRef, useEffect } from 'react';
import MapComponent from '../components/MapComponent';
import {
	Box,
	Typography,
	TextField,
	Grid,
	FormGroup,
	FormControlLabel,
	Checkbox,
	Button,
	Snackbar,
	Alert,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
} from '@mui/material';
import fond from '/Images/pilotos.c.jpg';
import { Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { api } from '../api/api';
import ReCAPTCHA from 'react-google-recaptcha';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton, Tooltip } from '@mui/material';
import fondDefault from '/Images/pilotos.c.jpg';
import EditableHeaderImage from '../components/EditableHeaderImage';

const Contacto = () => {
	// ======== FORM DE MENSAJE ========
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		control,
	} = useForm();

	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [snackbarType, setSnackbarType] = useState('success');
	const [snackbarMsg, setSnackbarMsg] = useState('');
	const captcha = useRef(null);

	const contieneScript = value =>
		!/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(value) ||
		'Contenido inválido';
	const noEspaciosEnBlanco = value =>
		value.trim() !== '' || 'No puede contener solo espacios';

	// ======== estado para info de contacto  ========
	const [contacto, setContacto] = useState(null);
	const [isAdmin, setIsAdmin] = useState(false);
	const [openEdit, setOpenEdit] = useState(false);
	const [formContacto, setFormContacto] = useState({
		org_nombre: '',
		telefono_lbl: '',
		telefono_val: '',
		email_lbl: '',
		email_val: '',
		texto_intro: '',
		texto_cta: '',
	});

	//const para lasa imagenes
	const [headerUrl, setHeaderUrl] = useState(null);
	const [imageError, setImageError] = useState(null);
	const [uploading, setUploading] = useState(false);
	const [justSaved, setJustSaved] = useState(false);

	// Cargar info de contacto (endpoint público)
	useEffect(() => {
		const fetchContacto = async () => {
			try {
				const res = await api.get('/auth/contacto', { skipAuthRedirect: true });
				const payload = res?.data?.contacto ?? res?.data ?? null;
				setContacto(payload);
			} catch (e) {
				console.log('No se pudo cargar /contacto:', e.message);
			}
		};
		fetchContacto();
	}, []);

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

	//cargar imagen
	useEffect(() => {
		const loadHeader = async () => {
			try {
				const res = await api.get('/auth/contactoimages');
				const rows = Array.isArray(res.data) ? res.data : [];
				const row = rows.find(
					r => String(r.type).toLowerCase() === 'contacto_header',
				);
				setHeaderUrl(row?.url || null);
			} catch (err) {
				console.error('Error cargando contacto_header:', err?.message || err);
			}
		};
		loadHeader();
	}, []);

	const handleHeaderChange = async file => {
		try {
			setImageError(null);

			// Validación simple
			const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
			if (!allowed.includes(file.type)) {
				setImageError('Formato no permitido. Usa JPG, PNG, WEBP o AVIF.');
				return;
			}
			if (file.size > 8 * 1024 * 1024) {
				setImageError('La imagen supera los 8 MB.');
				return;
			}

			setUploading(true);

			// 1) Subir archivo
			const formData = new FormData();
			formData.append('file', file);
			const uploadResponse = await api.post('/auth/upload', formData, {
				headers: { 'Content-Type': 'multipart/form-data' },
			});
			const finalUrl = uploadResponse?.data?.url;
			if (!finalUrl) throw new Error('No se recibió URL de subida');

			// 2) Guardar URL con type = 'contacto_header'
			await api.put('/auth/contactoimages', {
				type: 'contacto_header',
				url: finalUrl,
			});

			// 3) Refrescar UI
			setHeaderUrl(finalUrl);
			setJustSaved(true);
			setTimeout(() => setJustSaved(false), 1800);
		} catch (err) {
			const msg =
				err?.response?.data?.mensaje ||
				err?.response?.data?.error ||
				err?.message ||
				'Error al actualizar el header.';
			setImageError(msg);
			console.error('[handleHeaderChange]', err);
		} finally {
			setUploading(false);
		}
	};

	const openEditor = () => {
		// Permite abrir aunque no haya registro (usa defaults)
		const c = contacto ?? {};
		setFormContacto({
			org_nombre: c.org_nombre ?? 'Organización de Béisbol PILOTOS - FAH',
			telefono_lbl: c.telefono_lbl ?? 'NUESTRO NÚMERO',
			telefono_val: c.telefono_val ?? '+504 9918-2456',
			email_lbl: c.email_lbl ?? 'CORREO ELECTRÓNICO',
			email_val: c.email_val ?? 'pilotoshn@outlook.com',
			texto_intro: c.texto_intro ?? 'Comparta su experiencia con nosotros.',
			texto_cta: c.texto_cta ?? 'Envíe una historia o testimonio.',
		});
		setOpenEdit(true);
	};

	const saveContacto = async () => {
		try {
			const res = await api.put('/auth/contacto', formContacto);
			const updated = res?.data?.contacto ?? res?.data ?? null;
			setContacto(updated);
			setOpenEdit(false);
			setSnackbarType('success');
			setSnackbarMsg('Contacto actualizado');
			setOpenSnackbar(true);
		} catch (e) {
			setSnackbarType('error');
			setSnackbarMsg(e.message || 'No se pudo guardar');
			setOpenSnackbar(true);
		}
	};

	// ======== ENVIO DEL FORM DE MENSAJE ========
	const onSubmit = async data => {
		const token = await captcha.current.executeAsync();
		captcha.current.reset();
		if (!token) {
			window.alert('Por favor, valida el CAPTCHA.');
			return;
		}

		try {
			const res = await api.post('/auth/verificar', { token });
			if (!res.data.success) {
				setSnackbarType('error');
				setSnackbarMsg('Verificación del CAPTCHA fallida.');
				setOpenSnackbar(true);
				return;
			}

			const body = {
				email: data.correo,
				nombre: data.nombre,
				apellido: data.apellido,
				telefono: data.telefono,
				direccion: data.direccion,
				proposito: data.proposito,
				mensaje: data.mensaje,
			};

			const response = await api.post('/auth/registrarformulario', body);
			reset({
				nombre: '',
				apellido: '',
				telefono: '',
				correo: '',
				direccion: '',
				proposito: [],
				mensaje: '',
			});

			setSnackbarMsg(
				response.data?.mensaje || 'Formulario enviado exitosamente.',
			);
			setSnackbarType('success');
			setOpenSnackbar(true);
		} catch (error) {
			const mensaje =
				error.response?.data?.mensaje || 'Hubo un error en el servidor.';
			setSnackbarMsg(mensaje);
			setSnackbarType('error');
			setOpenSnackbar(true);
			console.error('Error:', mensaje);
		}
	};

	return (
		<>
			{/* ENCABEZADO */}
			<Box
				sx={{
					position: 'relative',
					width: '100%',
					minHeight: { xs: '75vh', md: '90vh' },
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					backgroundImage: `url(${headerUrl || fondDefault})`,
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
						backgroundColor: 'rgba(12, 0, 90, 0.8)',
						zIndex: 1,
					}}
				/>

				{/*editar (solo admin) */}
				{isAdmin && (
					<EditableHeaderImage
						onImageUpload={handleHeaderChange}
						uploading={uploading}
						saved={justSaved}
						sx={{ position: 'absolute', top: 16, right: 16, zIndex: 3 }}
						tooltip='Cambiar imagen de encabezado'
					/>
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
					}}
				>
					<Typography
						variant='h2'
						sx={{
							fontWeight: 'bold',
							fontSize: { xs: '3.5rem', md: '6rem' },
							fontFamily: 'Varsity, sans-serif',
							color: 'white',
							textAlign: 'center',
							textShadow: '2px 2px 6px rgba(0,0,0,0.7)',
						}}
					>
						Ponte en Contacto
					</Typography>
				</Box>
			</Box>

			{/* FORMULARIO + INFO */}
			<Box sx={{ backgroundColor: '#d6e6fc', py: 6 }}>
				<Box
					sx={{
						maxWidth: '1200px',
						margin: '0 auto',
						px: 2,
						display: 'flex',
						flexDirection: { xs: 'column', md: 'row' },
						gap: { xs: 3, md: 4 },
						alignItems: { xs: 'center', md: 'flex-start' },
					}}
				>
					{/* ======== PANEL DE INFORMACION EDITABLE ======== */}
					<Box
						sx={{
							width: { xs: 'min(560px, 92vw)', md: 320, lg: 360 },
							mx: { xs: 'auto', md: 0 },
							backgroundColor: '#fff',
							border: '1px solid #ccc',
							boxShadow: 2,
							borderRadius: 1.5,
							overflow: 'hidden',
							flexShrink: 0,
							alignSelf: { xs: 'center', md: 'flex-start' },
							position: { md: 'static' },
							top: { md: '96px' },
						}}
					>
						<Box
							sx={{
								backgroundColor: '#002c6c',
								color: 'white',
								fontFamily: 'Varsity, sans-serif',
								textAlign: 'center',
								py: { xs: 1.25, md: 1.5 },
								px: 2,
								fontSize: { xs: 'clamp(18px, 4.8vw, 22px)', md: '1.4rem' },
								lineHeight: 1.2,
								position: 'relative',
							}}
						>
							{contacto?.org_nombre || 'Organización de Béisbol PILOTOS - FAH'}

							{isAdmin && (
								<Tooltip title='Editar'>
									<IconButton
										size='small'
										onClick={openEditor}
										sx={{
											position: 'absolute',
											top: 4,
											right: 4,
											color: 'white',
											backgroundColor: 'transparent',
											'&:hover': {
												backgroundColor: 'rgba(255,255,255,0.3)',
											},
										}}
									>
										<EditIcon fontSize='small' />
									</IconButton>
								</Tooltip>
							)}
						</Box>

						<Box sx={{ px: 2, py: 2, position: 'relative' }}>
							<Typography sx={{ fontWeight: 'bold', color: '#c62828' }}>
								{contacto?.telefono_lbl || 'NUESTRO NÚMERO'}
							</Typography>
							<Typography sx={{ fontWeight: 'bold', color: '#002c6c', mb: 1 }}>
								{contacto?.telefono_val || '+504 9918-2456'}
							</Typography>

							<Typography sx={{ fontWeight: 'bold', color: '#c62828' }}>
								{contacto?.email_lbl || 'CORREO ELECTRÓNICO'}
							</Typography>
							<Typography
								component='a'
								href={`mailto:${contacto?.email_val || 'pilotoshn@outlook.com'}`}
								sx={{
									fontWeight: 'bold',
									color: '#002c6c',
									textDecoration: 'none',
									display: 'block',
									mb: 2,
								}}
							>
								{contacto?.email_val || 'pilotoshn@outlook.com'}
							</Typography>

							<Typography sx={{ fontSize: '0.95rem' }}>
								{contacto?.texto_intro ||
									'Comparta su experiencia con nosotros.'}
							</Typography>
							<Link
								to='/Testimonio'
								style={{
									fontWeight: 'bold',
									color: '#002c6c',
									fontSize: '0.95rem',
									textDecoration: 'none',
								}}
								onMouseEnter={e => (e.target.style.color = '#e06c14')}
								onMouseLeave={e => (e.target.style.color = '#002c6c')}
							>
								{contacto?.texto_cta || 'Envíe una historia o testimonio.'}
							</Link>
						</Box>
					</Box>

					{/* ======== FORMULARIO DE MENSAJE ======== */}
					<Box
						component='form'
						onSubmit={handleSubmit(onSubmit)}
						sx={{
							backgroundColor: '#fff',
							flex: 1,
							px: { xs: 2, md: 3 },
							py: { xs: 2.5, md: 4 },
							width: { xs: 'min(560px, 92vw)', md: 'auto' },
						}}
					>
						<Grid container spacing={2}>
							{[
								{
									label: 'Nombre',
									name: 'nombre',
									pattern: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{2,}$/,
									message: 'Solo letras (mínimo 2 caracteres, sin números)',
								},
								{
									label: 'Apellido',
									name: 'apellido',
									pattern: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{2,}$/,
									message: 'Solo letras (mínimo 2 caracteres, sin números)',
								},
								{
									label: 'Teléfono',
									name: 'telefono',
									pattern: /^[0-9]{8,15}$/,
									message: 'Solo números de 8 a 15 dígitos',
								},
								{
									label: 'Correo Electrónico',
									name: 'correo',
									pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
									message: 'Formato de correo no válido',
									customValidate: value =>
										/@(gmail\.com|outlook\.com|hotmail\.com)$/i.test(value) ||
										'Solo se permiten correos de Gmail, Outlook o Hotmail',
								},
							].map((field, index) => (
								<Grid item xs={12} md={index < 2 ? 6 : 6} key={field.name}>
									<TextField
										type={field.name === 'telefono' ? 'tel' : 'text'}
										label={field.label}
										fullWidth
										required
										{...register(field.name, {
											required: `El campo ${field.label} es obligatorio`,
											pattern: field.pattern
												? { value: field.pattern, message: field.message }
												: undefined,
											validate: value =>
												(field.customValidate
													? field.customValidate(value)
													: true) && noEspaciosEnBlanco(value),
										})}
										error={!!errors[field.name]}
										helperText={errors[field.name]?.message}
										InputLabelProps={{
											sx: {
												color: '#002c6c',
												'& .MuiFormLabel-asterisk': { color: 'red' },
											},
										}}
										onKeyPress={
											field.name === 'telefono'
												? e => {
														if (!/[0-9]/.test(e.key)) e.preventDefault();
													}
												: undefined
										}
									/>
								</Grid>
							))}

							<Grid item xs={12}>
								<TextField
									label='Dirección'
									fullWidth
									required
									{...register('direccion', {
										required: 'La dirección es obligatoria',
										minLength: { value: 5, message: 'Mínimo 5 caracteres' },
										validate: value => {
											const espacio = noEspaciosEnBlanco(value);
											if (espacio !== true) return espacio;
											const script = contieneScript(value);
											if (script !== true) return script;
											return true;
										},
									})}
									error={!!errors.direccion}
									helperText={errors.direccion?.message}
									InputLabelProps={{
										sx: {
											color: '#002c6c',
											'& .MuiFormLabel-asterisk': { color: 'red' },
										},
									}}
								/>
							</Grid>

							<Grid item xs={12}>
								<Typography
									sx={{
										fontWeight: 'bold',
										color: '#0c005a',
										fontSize: '1rem',
										mb: 1,
									}}
								>
									¿Sobre qué pregunta? <span style={{ color: 'red' }}>*</span>
								</Typography>
								<Controller
									name='proposito'
									control={control}
									defaultValue={[]}
									rules={{
										validate: value =>
											value.length > 0 || 'Selecciona al menos una opción',
									}}
									render={({ field }) => (
										<FormGroup row>
											{[
												'Donación',
												'Donación de Indumentaria/Equipo',
												'Patrocinio',
												'Asociación',
												'Voluntariado',
												'Otros',
											].map(label => (
												<FormControlLabel
													key={label}
													label={label}
													control={
														<Checkbox
															checked={field.value.includes(label)}
															onChange={e => {
																const newValue = e.target.checked
																	? [...field.value, label]
																	: field.value.filter(item => item !== label);
																field.onChange(newValue);
															}}
														/>
													}
													sx={{
														'& .MuiFormControlLabel-label': {
															color: '#002c6c',
														},
													}}
												/>
											))}
										</FormGroup>
									)}
								/>
							</Grid>
						</Grid>

						{/* CAMPO MENSAJE */}
						<Box sx={{ mt: 3 }}>
							<Controller
								name='mensaje'
								control={control}
								defaultValue=''
								rules={{
									required: 'El mensaje es obligatorio',
									minLength: {
										value: 10,
										message: 'Escribe al menos 10 caracteres',
									},
									maxLength: { value: 500, message: 'Máximo 500 caracteres' },
									validate: value => {
										const espacio = noEspaciosEnBlanco(value);
										if (espacio !== true) return espacio;
										const script = contieneScript(value);
										if (script !== true) return script;
										return true;
									},
								}}
								render={({ field }) => (
									<TextField
										{...field}
										label='Mensaje'
										multiline
										minRows={8}
										fullWidth
										error={!!errors.mensaje}
										helperText={
											errors.mensaje?.message ||
											`${field.value.length}/500 caracteres`
										}
										inputProps={{ maxLength: 500 }}
										InputLabelProps={{
											required: true,
											sx: {
												color: '#002c6c',
												'& .MuiFormLabel-asterisk': { color: 'red' },
											},
										}}
										sx={{
											'& .MuiInputBase-root': {
												padding: '12px',
												alignItems: 'flex-start',
											},
											'& .MuiInputBase-input': {
												fontSize: '1rem',
												fontFamily: 'Arial, sans-serif',
											},
										}}
									/>
								)}
							/>
						</Box>

						{/* BOTON ENVIAR MENSAJE */}
						<ReCAPTCHA
							ref={captcha}
							sitekey='6LeoJWErAAAAAL6RcLtqe59DOJyUGdkQO1gc3Nvm'
							size='invisible'
						/>
						<Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-start' }}>
							<Button
								type='submit'
								variant='contained'
								sx={{
									height: '40px',
									minWidth: '120px',
									px: 3,
									backgroundColor: '#0c005a',
									color: 'white',
									textTransform: 'none',
									fontWeight: 'bold',
									fontFamily: 'GroteskBold, sans-serif',
									fontSize: '1rem',
									borderRadius: '6px',
									boxShadow: '0px 3px 8px rgba(0,0,0,0.15)',
									'&:hover': { backgroundColor: '#e06c14' },
								}}
							>
								Enviar
							</Button>
						</Box>
					</Box>
				</Box>
			</Box>

			{/* MAPA */}
			<Box sx={{ py: 6, backgroundColor: '#f1f5fb' }}>
				<Box sx={{ maxWidth: '1200px', margin: '0 auto', px: 2 }}>
					<Typography
						variant='h4'
						sx={{
							fontWeight: 'bold',
							color: '#002c6c',
							textAlign: 'center',
							mb: 0.5,
							fontFamily: 'Varsity, sans-serif',
						}}
					>
						Nuestra Ubicación
					</Typography>
					<MapComponent isInteractive={false} />

					{/* FEEDBACK */}
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
				</Box>
			</Box>

			{/* MODAL DE EDICION DE CONTACTO (solo admin) */}
			<Dialog
				open={openEdit}
				onClose={() => setOpenEdit(false)}
				scroll='paper'
				sx={{
					zIndex: theme => theme.zIndex.modal,
				}}
				PaperProps={{
					sx: {
						mt: { xs: 8, md: 10 },
						mx: 2,
						width: '100%',
						maxWidth: 560,
						maxHeight: 'calc(100vh - 140px)',
						borderRadius: 2,
					},
				}}
				slotProps={{
					backdrop: {
						sx: {
							backgroundColor: 'rgba(0,0,0,0.35)',
							backdropFilter: 'blur(2px)',
						},
					},
				}}
			>
				<DialogTitle sx={{ pb: 1, fontWeight: 700 }}>
					Editar Información de Contacto
				</DialogTitle>

				<DialogContent dividers sx={{ display: 'grid', gap: 1.5, pt: 1 }}>
					<TextField
						label='Nombre de la organización'
						value={formContacto.org_nombre}
						onChange={e =>
							setFormContacto({ ...formContacto, org_nombre: e.target.value })
						}
						size='small'
					/>
					<TextField
						label='Etiqueta teléfono'
						value={formContacto.telefono_lbl}
						onChange={e =>
							setFormContacto({ ...formContacto, telefono_lbl: e.target.value })
						}
						size='small'
					/>
					<TextField
						label='Número de teléfono'
						value={formContacto.telefono_val}
						onChange={e =>
							setFormContacto({ ...formContacto, telefono_val: e.target.value })
						}
						size='small'
					/>
					<TextField
						label='Etiqueta email'
						value={formContacto.email_lbl}
						onChange={e =>
							setFormContacto({ ...formContacto, email_lbl: e.target.value })
						}
						size='small'
					/>
					<TextField
						label='Correo'
						value={formContacto.email_val}
						onChange={e =>
							setFormContacto({ ...formContacto, email_val: e.target.value })
						}
						size='small'
					/>
					<TextField
						label='Texto introductorio'
						value={formContacto.texto_intro}
						onChange={e =>
							setFormContacto({ ...formContacto, texto_intro: e.target.value })
						}
						size='small'
						multiline
					/>
					<TextField
						label='Texto de redireccion'
						value={formContacto.texto_cta}
						onChange={e =>
							setFormContacto({ ...formContacto, texto_cta: e.target.value })
						}
						size='small'
						multiline
					/>
				</DialogContent>

				<DialogActions sx={{ px: 2, py: 1.5 }}>
					<Button onClick={() => setOpenEdit(false)}>Cancelar</Button>
					<Button variant='contained' onClick={saveContacto}>
						Guardar
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default Contacto;
