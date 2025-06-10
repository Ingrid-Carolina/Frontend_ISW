import React from 'react';
import { Box, Typography } from '@mui/material';
import Imgjud from '/Images/Fondojugadores.png';
import TarjetaTecnico from '../components/TarjetaTecnico.jsx';


const cuerpoTecnico = [
	{
		nombre: 'Enzo Maresca',
		rol: 'Manager General',
		descripcion: 'Responsable de la estrategia general y toma de decisiones del equipo.',
		imagen: '/Images/EnzoMaresca.jpeg',
		
	},
	{
		nombre: 'Luis Enrique',
		rol: 'Entrenador Físico',
		descripcion: 'Encargado del acondicionamiento físico y prevención de lesiones.',
		imagen: '/Images/LuisEnrique2.jpg',
	},
	{
		nombre: 'Pep Guardiola',
		rol: 'Coach de Lanzadores',
		descripcion: 'Trabaja con los lanzadores para mejorar su técnica y rendimiento.',
		imagen: '/Images/PepGuardiola.jpg',
	},
];

const Jugadores = () => {
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
					backgroundImage: `url(${Imgjud})`,
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
						//backgroundColor: 'rgba(0, 0, 80, 0.75)',
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
							fontFamily: '"Varsity", cursive',
							color: 'white',
							textAlign: 'center',
						}}
					>
						NUESTRO EQUIPO
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

				<Box sx={{ flex: 1, color: 'white' }}>
					<Typography
						variant='h3'
						sx={{
							fontFamily: '"Varsity", cursive',
							fontWeight: 'bold',
							mb: 2,
							fontSize: { xs: '3rem', md: '4rem' },
						}}
					>
						LOS JUGADORES
					</Typography>

					<Typography
						variant='body1'
						sx={{
							fontFamily: '"PeterMedium", sans-serif',
							fontSize: '1.5rem',
							lineHeight: 1.8,
						}}
					>
					</Typography>
				</Box>
			</Box>
			<Box sx={{ px: { xs: 3, md: 10 }, py: 6, bgcolor: '#f1f1f1' }}>
				<Typography
					variant="h3"
					sx={{
						fontFamily: '"Varsity", cursive',
						fontWeight: 'bold',
						textAlign: 'center',
						mb: 4,
						fontSize: { xs: '3rem', md: '4rem' },
						color: '#10045c'
					}}
				>
					CUERPO TECNICO
				</Typography>

				<Box
					sx={{
						display: 'flex',
						flexWrap: 'wrap',
						gap: 4,
						justifyContent: 'center',
					}}
				>
					{cuerpoTecnico.map((persona, index) => (
						<TarjetaTecnico
							key={index}
							nombre={persona.nombre}
							rol={persona.rol}
							descripcion={persona.descripcion}
							imagen={persona.imagen}
						/>
					))}
				</Box>
			</Box>

		</>
	);
};

export default Jugadores;
