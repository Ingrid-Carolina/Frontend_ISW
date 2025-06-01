import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import equipoImg from '../Ima/equipo.jpg';
import equipoImg2 from '../Ima/equipo2.jpg';

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
					alignItems: 'center',
					justifyContent: 'center',
					backgroundImage: `url(${equipoImg})`,
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

				{/* Texto centrado */}
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
							fontSize: { xs: '4rem', md: '7rem' },
							fontFamily: '"Jersey", cursive',
							color: 'white',
							textAlign: 'center',
						}}
					>
						NUESTRA HISTORIA
					</Typography>
				</Box>
			</Box>

			<Box
				sx={{
					display: 'flex',
					flexDirection: { xs: 'column', md: 'row' },
					alignItems: 'center',
					gap: 4,
					px: { xs: 3, md: 10 },
					py: 6,
					bgcolor: '#e6691d',
				}}
			>
				<Box
					component='img'
					src={equipoImg2}
					alt='Equipo de béisbol'
					sx={{
						width: { xs: '100%', md: '45%' },
						borderRadius: 2,
						boxShadow: 4,
					}}
				/>

				<Box sx={{ flex: 1, color: 'white' }}>
					<Typography
						variant='h3'
						sx={{
							fontFamily: '"Jersey", cursive',
							fontWeight: 'bold',
							mb: 2,
							fontSize: { xs: '3rem', md: '4rem' },
						}}
					>
						Quienes somos?
					</Typography>

					<Typography
						variant='body1'
						sx={{
							fontFamily: '"PeterMedium", sans-serif',
							fontSize: '1.5rem',
							lineHeight: 1.8,
						}}
					>
						La Asociación de Béisbol Menor Pilotos de Honduras (FAH) cuenta con
						más de 76 años de historia desde su formación en 1948. Nuestro
						principal objetivo es la formación integral de jóvenes atletas, no
						solo en el juego del béisbol, sino también en la generación de
						líderes y ciudadanos de sus comunidades y país. Nuestra historia
						está marcada por la solidaridad, el esfuerzo y los logros alcanzados
						gracias a voluntarios, donantes y aliados estratégicos. ¡Gracias por
						ser parte de este viaje!
					</Typography>
				</Box>
			</Box>
		</>
	);
};

export default NuestraHistoria;
