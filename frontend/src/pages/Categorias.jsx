import React from 'react';
import { Box, Typography } from '@mui/material';
import Img from '/Images/Categoria.png';
//import equipoImg2 from '../Ima/equipo2.jpg';

const Categorias = () => {
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
					backgroundImage: `url(${Img})`,
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
						CATEGORIAS
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
					/*component='img'
					src={equipoImg2}
					alt='Equipo de béisbol'
					sx={{
						width: { xs: '100%', md: '45%' },
						borderRadius: 2,
						boxShadow: 4,
					}}*/
				/>

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
						LAS CATEGORIAS 
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
		</>
	);
};

export default Categorias;
