import React from 'react';
import { Box, Typography } from '@mui/material';
import fond from '/Images/fondoC.png';


const Contacto = () => {
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
					backgroundImage: `url(${fond})`,
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
						Ponte en Contacto
					</Typography>
				</Box>
			</Box>

			
		</>
	);
};

export default Contacto;
