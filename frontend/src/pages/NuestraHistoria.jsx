import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import equipoImg from '../ima/equipo.jpg';
import equipoImg2 from '../ima/equipo2.jpg';

const NuestraHistoria = () => {
	return (
		<>
			{/* HEADER SECTION */}
			<Box
				sx={{
					position: 'relative',
					width: '100%',
					minHeight: { xs: '75vh', md: '90vh' },
					display: 'flex',
					flexDirection: { xs: 'column', md: 'row' },
					alignItems: 'center',
					justifyContent: 'flex-start',
					backgroundImage: `url(${equipoImg})`,
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					px: { xs: 3, md: 10 },
					py: { xs: 6, md: 8 },
					gap: { md: 4 },
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

				{/* Texto */}
				<Box
					sx={{
						position: 'relative',
						zIndex: 2,
						maxWidth: { xs: '100%', md: '50%' },
					}}
				>
					<Typography
						variant='h2'
						sx={{
							fontWeight: 'bold',
							fontSize: { xs: '2.5rem', md: '4rem' },
							fontFamily: 'Aptos, Segoe UI, Arial, sans-serif',
							color: 'white',
						}}
					>
						<Box
							component='span'
							sx={{ fontFamily: 'Pacifico, cursive', color: 'white' }}
						>
							Nuestra Historia
						</Box>
					</Typography>
				</Box>

				{/*Imagen*/}
				<Box
					sx={{
						position: 'relative',
						zIndex: 2,
						borderRadius: 2,
						overflow: 'hidden',
						boxShadow: 6,
						width: { xs: '90%', md: '40%' },
						mt: { xs: 4, md: 0 },
					}}
				>
					<Box
						component='img'
						src={equipoImg2}
						alt='Foto del equipo'
						sx={{ width: '100%', display: 'block' }}
					/>
				</Box>
			</Box>

			{/* CONTENIDO */}
			<Container sx={{ py: 6 }}>
				<Typography
					variant='h5'
					sx={{
						fontWeight: 'bold',
						fontFamily: 'Aptos, Segoe UI, Arial, sans-serif',
						mb: 2,
						color: '#0c005a',
					}}
				>
					¿Quiénes somos?
				</Typography>

				<Typography
					variant='body1'
					sx={{
						fontSize: '1.1rem',
						lineHeight: 1.8,
						fontFamily: 'Aptos, Segoe UI, Arial, sans-serif',
					}}
				>
					La Asociación de Béisbol Menor Pilotos de Honduras (FAH) cuenta con
					más de 76 años de historia desde su formación en 1948. Nuestro
					principal objetivo es la formación integral de jovenes atletas, no
					solo en el juego del béisbol, sino también en la generación de líderes
					y ciudadanos de sus comunidades y país.
				</Typography>

				<Typography
					variant='body1'
					sx={{
						fontSize: '1.1rem',
						lineHeight: 1.8,
						mt: 3,
						fontFamily: 'Aptos, Segoe UI, Arial, sans-serif',
					}}
				>
					Nuestra historia está marcada por la solidaridad, el esfuerzo y los
					logros alcanzados gracias a voluntarios, donantes y aliados
					estratégicos. ¡Gracias por ser parte de este viaje!
				</Typography>
			</Container>
		</>
	);
};

export default NuestraHistoria;
