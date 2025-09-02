import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import Slider from 'react-slick';
import equipoImg from '/Images/equipo.jpg';
import equipoImg2 from '/Images/equipo2.jpg';

// Variantes de animación
const fadeUp = {
	hidden: { opacity: 0, y: 30 },
	visible: { opacity: 1, y: 0, transition: { duration: 1 } },
};

// Imágenes de la galería (reemplaza con tus rutas reales)
const galeriaImgs = [
	'/Images/foto2.jpg',
	'/Images/foto4.jpg',
	'/Images/foto3.jpg',
	'/Images/foto4.jpg',
];

const NuestraHistoria = () => {
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
	return (
		<>
			{/* ENCABEZADO CON IMAGEN */}
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
							NUESTRA HISTORIA
						</Typography>
					</motion.div>
				</Box>
			</Box>

			{/* SECCIÓN QUIÉNES SOMOS MEJORADA */}
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
					style={{ flex: 1 }}
				>
					<Box
						component='img'
						src={equipoImg2}
						alt='Equipo de béisbol'
						sx={{
							width: '100%',
							borderRadius: 2,
							boxShadow: 4,
						}}
					/>
				</motion.div>

				<motion.div
					initial='hidden'
					whileInView='visible'
					viewport={{ once: true }}
					variants={fadeUp}
					style={{ flex: 1.3 }}
				>
					<Box sx={{ color: 'white' }}>
						<Typography
							variant='h3'
							sx={{
								fontFamily: '"Varsity", cursive',
								fontWeight: 'bold',
								mb: 3,
								fontSize: { xs: '3rem', md: '4rem' },
							}}
						>
							¿Quiénes somos?
						</Typography>
						<Typography
							variant='body1'
							sx={{
								fontFamily: '"PeterMedium", sans-serif',
								fontSize: '1rem',
								lineHeight: 1.9,
							}}
						>
							Desde 1948, la Asociación de Béisbol Menor Pilotos de Honduras
							(FAH) forma integralmente a jóvenes, impulsando habilidades
							deportivas, valores y liderazgo. Creamos espacios seguros con el
							apoyo de voluntarios, entrenadores, familias y aliados, para que
							cada atleta crezca en lo físico, emocional y social. Más que un
							equipo, somos una comunidad que comparte pasión, esfuerzo y
							sentido de pertenencia. ¡Gracias por ser parte de esta familia!
						</Typography>
					</Box>
				</motion.div>
			</Box>

			{/* SECCIÓN: NUESTROS INICIOS */}
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
				{/* Texto a la izquierda, imagen a la derecha */}
				<motion.div
					initial='hidden'
					whileInView='visible'
					viewport={{ once: true }}
					variants={fadeUp}
					style={{ flex: 1.3 }}
				>
					<Typography
						variant='h4'
						sx={{
							fontFamily: '"Varsity", cursive',
							fontWeight: 'bold',
							color: '#e6691d',
							fontSize: { xs: '2.5rem', md: '3rem' },
							mb: 3,
						}}
					>
						Nuestros Inicios
					</Typography>
					<Typography
						variant='body1'
						sx={{
							fontSize: '1.3rem',
							lineHeight: 1.9,
							fontFamily: '"PeterMedium", sans-serif',
							color: '#333',
						}}
					>
						Desde nuestros humildes comienzos en 1948,
						nuestro enfoque ha sido brindar oportunidades para jóvenes atletas
						en comunidades rurales. A través del béisbol, construimos
						disciplina, valores y comunidad.
					</Typography>
				</motion.div>

				<motion.div
					initial='hidden'
					whileInView='visible'
					viewport={{ once: true }}
					variants={fadeUp}
					style={{ flex: 1 }}
				>
					<Box
						component='img'
						src='/Images/foto4.jpg' // <- Cambia por la imagen real
						alt='Nuestros inicios'
						sx={{
							width: '100%',
							borderRadius: 2,
							boxShadow: 4,
						}}
					/>
				</motion.div>
			</Box>

			{/* SECCIÓN: IMPACTO COMUNITARIO */}
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
				{/* Texto a la derecha, imagen a la izquierda */}
				<motion.div
					initial='hidden'
					whileInView='visible'
					viewport={{ once: true }}
					variants={fadeUp}
					style={{ flex: 1.3 }}
				>
					<Typography
						variant='h4'
						sx={{
							fontFamily: '"Varsity", cursive',
							fontWeight: 'bold',
							color: '#e6691d',
							fontSize: { xs: '2.5rem', md: '3rem' },
							mb: 3,
						}}
					>
						Impacto Comunitario
					</Typography>
					<Typography
						variant='body1'
						sx={{
							fontSize: '1.3rem',
							lineHeight: 1.9,
							fontFamily: '"PeterMedium", sans-serif',
							color: '#333',
						}}
					>
						A lo largo de las décadas, hemos trabajado con
						más de 10,000 niños, formando no solo jugadores sino líderes.
						Nuestras iniciativas incluyen clínicas deportivas, programas de
						mentoría y eventos familiares.
					</Typography>
				</motion.div>

				<motion.div
					initial='hidden'
					whileInView='visible'
					viewport={{ once: true }}
					variants={fadeUp}
					style={{ flex: 1 }}
				>
					<Box
						component='img'
						src='/Images/foto4.jpg' // <- Cambia por la imagen real
						alt='Impacto comunitario'
						sx={{
							width: '100%',
							borderRadius: 2,
							boxShadow: 4,
						}}
					/>
				</motion.div>
			</Box>

			{/* SECCIÓN: NUESTROS VALORES */}
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
				{/* Texto a la izquierda, imagen a la derecha */}
				<motion.div
					initial='hidden'
					whileInView='visible'
					viewport={{ once: true }}
					variants={fadeUp}
					style={{ flex: 1.3 }}
				>
					<Typography
						variant='h4'
						sx={{
							fontFamily: '"Varsity", cursive',
							fontWeight: 'bold',
							color: '#e6691d',
							fontSize: { xs: '2.5rem', md: '3rem' },
							mb: 3,
						}}
					>
						Nuestros Valores
					</Typography>
					<Typography
						variant='body1'
						sx={{
							fontSize: '1.3rem',
							lineHeight: 1.9,
							fontFamily: '"PeterMedium", sans-serif',
							color: '#333',
						}}
					>
						Solidaridad, compromiso, respeto y pasión por el
						deporte. Estos valores son la base de cada entrenamiento, partido y
						actividad que realizamos como asociación.
					</Typography>
				</motion.div>

				<motion.div
					initial='hidden'
					whileInView='visible'
					viewport={{ once: true }}
					variants={fadeUp}
					style={{ flex: 1 }}
				>
					<Box
						component='img'
						src='/Images/foto4.jpg' // <- Cambia por la imagen real
						alt='Nuestros valores'
						sx={{
							width: '100%',
							borderRadius: 2,
							boxShadow: 4,
						}}
					/>
				</motion.div>
			</Box>

			{/* SECCIÓN DE GALERÍA HISTÓRICA CON CARRUSEL */}
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
					<Typography
						variant='h4'
						sx={{
							fontFamily: '"Varsity", cursive',
							fontWeight: 'bold',
							color: '#e6691d',
							fontSize: { xs: '2.5rem', md: '3rem' },
							mb: 4,
						}}
					>
						Galería Histórica
					</Typography>

					<Slider {...sliderSettings}>
						{galeriaImgs.map((src, index) => (
							<Box key={index} sx={{ px: 2 }}>
								<Box
									component='img'
									src={src}
									alt={`Galería ${index + 1}`}
									sx={{
										maxWidth: '100%',
										width: { xs: '100%', md: '70%' },
										borderRadius: 3,
										boxShadow: 5,
										margin: '0 auto',
									}}
								/>
							</Box>
						))}
					</Slider>
				</motion.div>
			</Box>
		</>
	);
};

export default NuestraHistoria;
