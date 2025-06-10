import React from 'react';
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

const Contacto = () => {
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
				{/* Capa oscura encima del fondo */}
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

				{/* Texto sobre el overlay */}
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
								to='/testimonios'
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
						sx={{
							backgroundColor: '#fff',
							flex: 1,
							px: 3,
							py: 4,
						}}
					>
						<Grid container spacing={2}>
							<Grid item xs={12} md={6}>
								<TextField
									label='Nombre'
									fullWidth
									required
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
							<Grid item xs={12} md={6}>
								<TextField
									label='Apellido'
									fullWidth
									required
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
							<Grid item xs={12} md={6}>
								<TextField
									label='Teléfono'
									fullWidth
									required
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
							<Grid item xs={12} md={6}>
								<TextField
									label='Correo Electrónico'
									fullWidth
									required
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
								<TextField
									label='Dirección'
									fullWidth
									required
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
									¿Sobre qué pregunta?
								</Typography>
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
											control={<Checkbox />}
											label={label}
											sx={{
												'& .MuiFormControlLabel-label': {
													color: '#002c6c',
												},
											}}
										/>
									))}
								</FormGroup>
							</Grid>
						</Grid>

						{/* CAMPO MENSAJE*/}
						<Box sx={{ mt: 3 }}>
							<TextField
								label='Mensaje'
								multiline
								minRows={8}
								fullWidth
								required
								InputLabelProps={{
									sx: {
										color: '#002c6c',
										'& .MuiFormLabel-asterisk': {
											color: 'red',
										},
									},
								}}
								sx={{
									width: '100%',
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
		</>
	);
};

export default Contacto;
