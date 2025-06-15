import React, { useState } from 'react';
import MapComponent from '../components/MapComponent'; // adjust path if needed

import {
	Box,
	Typography,
	TextField,
	Grid,
	FormGroup,
	FormControlLabel,
	Checkbox,
	Button,
} from '@mui/material';
import fond from '/Images/pilotos.c.jpg';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { Snackbar, Alert } from '@mui/material';
import axios from 'axios';

const Contacto = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		control,
	} = useForm();

	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [snackbarType, setSnackbarType] = useState('success'); // 'success' | 'error'
	const [snackbarMsg, setSnackbarMsg] = useState('');

	const contieneScript = value =>
		!/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(value) ||
		'Contenido inválido';

	const noEspaciosEnBlanco = value =>
		// Valida que el input no esté vacío ni contenga solo espacios. Se aplica a varios campos del formulario.
		value.trim() !== '' || 'No puede contener solo espacios';

	const onSubmit = async data => {
		const url = 'http://localhost:3000/auth/registrarformulario';

		const body = {
			email: data.correo,
			nombre: data.nombre,
			apellido: data.apellido,
			telefono: data.telefono,
			direccion: data.direccion,
			proposito: data.proposito,
			mensaje: data.mensaje,
		};

		try {
			const res = await axios.post(url, body, {
				headers: { 'Content-Type': 'application/json' },
			});

			reset({
				nombre: '',
				apellido: '',
				telefono: '',
				correo: '',
				direccion: '',
				proposito: [],
				mensaje: '',
			});

			// Mensaje de éxito
			setSnackbarMsg('Formulario enviado exitosamente.');
			setSnackbarType('success');
			setOpenSnackbar(true);

			console.log('response data: ', res.data.mensaje);
			return res.data;
		} catch (error) {
			let mensaje = 'Error en la red.';
			if (error.response) {
				mensaje = error.response.data.mensaje || 'Error en el servidor';
			} else if (error.request) {
				mensaje = 'Ninguna respuesta del servidor. Por favor verifique su red.';
			}

			// Mensaje de error
			setSnackbarMsg(mensaje);
			setSnackbarType('error');
			setOpenSnackbar(true);
		}

		/*window.alert((data.proposito));
        window.alert((data.mensaje));
        window.alert((data.nombre));
        window.alert((data.apellido));
        window.alert((data.telefono));
        window.alert((data.correo));
        window.alert((data.direccion));*/
		console.log('Formulario enviado:', data);
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
					backgroundImage: `url(${fond})`,
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
						gap: 4,
					}}
				>
					{/* INFO DE CONTACTO */}
					<Box
						sx={{
							width: 280,
							backgroundColor: '#fff',
							border: '1px solid #ccc',
							boxShadow: 2,
							flexShrink: 0,
							alignSelf: 'flex-start',
						}}
					>
						<Box
							sx={{
								backgroundColor: '#002c6c',
								color: 'white',
								fontFamily: 'Varsity, sans-serif',
								fontSize: '1.5rem',
								textAlign: 'center',
								py: 1,
							}}
						>
							Organización de Béisbol PILOTOS - FAH
						</Box>

						<Box sx={{ px: 2, py: 2 }}>
							<Typography sx={{ fontWeight: 'bold', color: '#c62828' }}>
								NUESTRO NÚMERO
							</Typography>
							<Typography sx={{ fontWeight: 'bold', color: '#002c6c', mb: 1 }}>
								+504 9918-2456
							</Typography>

							<Typography sx={{ fontWeight: 'bold', color: '#c62828' }}>
								CORREO ELECTRÓNICO
							</Typography>
							<Typography
								component='a'
								href='mailto:pilotoshn@outlook.com'
								sx={{
									fontWeight: 'bold',
									color: '#002c6c',
									textDecoration: 'none',
									display: 'block',
									mb: 2,
								}}
							>
								pilotoshn@outlook.com
							</Typography>

							<Typography sx={{ fontSize: '0.95rem' }}>
								Comparta su experiencia con nosotros.
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
								Envíe una historia o testimonio.
							</Link>
						</Box>
					</Box>

					{/* FORMULARIO */}
					<Box
						component='form'
						onSubmit={handleSubmit(onSubmit)}
						sx={{
							backgroundColor: '#fff',
							flex: 1,
							px: 3,
							py: 4,
						}}
					>
						<Grid container spacing={2}>
							{[
								{
									label: 'Nombre',
									name: 'nombre',
									pattern: /^[A-Za-zÀ-ÿ\s]{2,}$/,
									message: 'Solo letras y mínimo 2 caracteres',
								},
								{
									label: 'Apellido',
									name: 'apellido',
									pattern: /^[A-Za-zÀ-ÿ\s]{2,}$/,
									message: 'Solo letras y mínimo 2 caracteres',
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
												? {
														value: field.pattern,
														message: field.message,
													}
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
												'& .MuiFormLabel-asterisk': {
													color: 'red',
												},
											},
										}}
										onKeyPress={
											field.name === 'telefono'
												? e => {
														if (!/[0-9]/.test(e.key)) {
															e.preventDefault();
														}
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
											'& .MuiFormLabel-asterisk': {
												color: 'red',
											},
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

						{/* CAMPO MENSAJE*/}
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
										inputProps={{
											maxLength: 500, // Limita la escritura a 500 caracteres
										}}
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

						{/* BOTÓN ENVIAR MENSAJE*/}
						<Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-start' }}>
							<Button
								type='submit'
								variant='contained'
								sx={{
									height: '40px',
									minWidth: '120px', // ancho mínimo
									px: 3, // padding horizontal interno
									backgroundColor: '#0c005a',
									color: 'white',
									textTransform: 'none',
									fontWeight: 'bold',
									fontFamily: 'GroteskBold, sans-serif',
									fontSize: '1rem',
									borderRadius: '6px',
									boxShadow: '0px 3px 8px rgba(0,0,0,0.15)',
									'&:hover': {
										backgroundColor: '#e06c14',
									},
								}}
							>
								Enviar
							</Button>
						</Box>
					</Box>
				</Box>
			</Box>
			{/* MAPA DE UBICACIÓN */}
			<Box sx={{ py: 6, backgroundColor: '#f1f5fb' }}>
				<Box
					sx={{
						maxWidth: '1200px',
						margin: '0 auto',
						px: 2,
					}}
				>
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

					{/* FEEDBACK flotante sobre Formulario Exitoso o Algun Error */}
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
		</>
	);
};

export default Contacto;
