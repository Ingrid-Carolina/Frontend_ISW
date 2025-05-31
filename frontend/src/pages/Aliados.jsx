import React from 'react';
import Divider from '@mui/material/Divider';
import luz from '../Ima/LUFUS.jpg';
import mobile from '../Ima/Mob.jpg';
import dental from '../Ima/d.png';
import angelitos from '../Ima/fundacion.jpg';
import Faerea from '../Ima/fuerzaAerea.jpg';
import { Button } from '@mui/material';
const Aliados = () => {
	return (
		<div
			style={{
				padding: '4rem 2rem',
				backgroundColor: '#f9f9f9',
				fontFamily: 'Arial, sans-serif',
				textAlign: 'center',
				lineHeight: 1.6,
			}}
		>
			<h1
				style={{
					color: 'red',
					fontSize: '3.5rem',
					fontWeight: '500',
					marginBottom: '1.5rem',
				}}
			>
				Patrocinadores
			</h1>

			<p
				style={{
					maxWidth: '75vw',
					margin: '0 auto 5rem',
					fontSize: '1.30rem',
					textAlign: 'center',
				}}
			>
				La Asociación de Béisbol Menor Pilotos de Honduras (FAH) cuenta con más
				de 76 años de historia desde su formación en 1948. Nuestro principal
				objetivo es la formación integral de jovenes atletas, no solo en el
				juego del béisbol, sino también en la generación de líderes y ciudadanos
				de sus comunidades y país.
			</p>

			<section
				style={{
					maxWidth: '90vw',
					margin: '0 auto',
					marginBottom: '5rem',
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'flex-start',
					gap: '2rem',
				}}
			>
				{/* Columna derecha: imagen circular */}
				<div style={{ flexShrink: 0 }}>
					<img
						src={luz} // reemplaza con tu ruta real
						alt='si'
						style={{
							width: '30vw',
							height: '50vh',
							borderRadius: '50%',
							border: '6px solid red',
							objectFit: 'cover',
						}}
					/>
				</div>
				{/* Columna izquierda: texto */}
				<div style={{ flex: 1 }}>
					<h2
						style={{
							fontSize: '2.75rem',
							fontWeight: '800',
							marginBottom: '1rem',
							textAlign: 'left',
							color: 'darkblue',
							maxWidth: '38vw',
						}}
					>
						Luz y Fuerza de San Lorenzo S.A. (Lufussa)
					</h2>
					<Divider
						sx={{
							height: '0.35vh',
							width: '38vw',
							backgroundColor: 'red',
						}}
					/>
					<p
						style={{
							fontSize: '1.3rem',
							marginBottom: '1rem',
							textAlign: 'left',
							maxWidth: '50vw',
						}}
					>
						Gracias al apoyo de nuestros aliados estratégicos, hemos podido
						implementar proyectos sociales, apoyar comunidades vulnerables y
						promover la educación ambiental en distintas regiones del país.
					</p>
					<div style={{ marginTop: '2rem', textAlign: 'left' }}>
						<Button
							variant='outlined'
							href='https://lufussa.com/es/inicio/'
							target='_blank' // Abre en nueva pestaña
							rel='noopener noreferrer'
							sx={{
								mr: 2,
								border: '2px solid red', // borde más grueso y rojo
								color: 'red', // color del texto
								fontWeight: 'bold',
								'&:hover': {
									backgroundColor: 'white', // color de fondo al pasar el mouse
									color: 'darkblue', // color del texto al hacer hover
									borderColor: 'darkblue', // borde más oscuro en hover (opcional)
								},
							}}
						>
							Visitar Pagina
						</Button>
						<Button
							variant='outlined'
							href='https://www.facebook.com/LufussaHonduras/?locale=es_LA'
							target='_blank' // Abre en nueva pestaña
							rel='noopener noreferrer'
							sx={{
								border: '2px solid red', // borde más grueso y rojo
								color: 'red', // color del texto
								fontWeight: 'bold',
								'&:hover': {
									backgroundColor: 'white', // color de fondo al pasar el mouse
									color: 'darkblue', // color del texto al hacer hover
									borderColor: 'darkblue', // borde más oscuro en hover (opcional)
								},
							}}
						>
							Visita Facebook
						</Button>
					</div>
				</div>
			</section>

			<section
				style={{
					maxWidth: '90vw',
					margin: '0 auto',
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'flex-start',
					marginBottom: '5rem',
					gap: '2rem',
				}}
			>
				{/* Columna izquierda: texto */}
				<div style={{ flex: 1 }}>
					<h2
						style={{
							fontSize: '2.75rem',
							fontWeight: '800',
							marginBottom: '1rem',
							textAlign: 'left',
							color: 'darkblue',
							maxWidth: '38vw',
						}}
					>
						Mobile Spot Honduras
					</h2>
					<Divider
						sx={{
							height: '0.35vh',
							width: '38vw',
							backgroundColor: 'red',
						}}
					/>
					<p
						style={{
							fontSize: '1.3rem',
							marginBottom: '1rem',
							textAlign: 'left',
							maxWidth: '50vw',
						}}
					>
						Gracias al apoyo de nuestros aliados estratégicos, hemos podido
						implementar proyectos sociales, apoyar comunidades vulnerables y
						promover la educación ambiental en distintas regiones del país.
					</p>
					<div style={{ marginTop: '2rem', textAlign: 'left' }}>
						<Button
							variant='outlined'
							href='https://www.facebook.com/MobileSpothonduras'
							target='_blank' // Abre en nueva pestaña
							rel='noopener noreferrer'
							sx={{
								mr: 2,
								border: '2px solid red', // borde más grueso y rojo
								color: 'red', // color del texto
								fontWeight: 'bold',
								'&:hover': {
									backgroundColor: 'white', // color de fondo al pasar el mouse
									color: 'darkblue', // color del texto al hacer hover
									borderColor: 'darkblue', // borde más oscuro en hover (opcional)
								},
							}}
						>
							Visita Facebook
						</Button>
						<Button
							variant='outlined'
							href='https://www.instagram.com/mobilespothn/?hl=es-la'
							target='_blank' // Abre en nueva pestaña
							rel='noopener noreferrer'
							sx={{
								border: '2px solid red', // borde más grueso y rojo
								color: 'red', // color del texto
								fontWeight: 'bold',
								'&:hover': {
									backgroundColor: 'white', // color de fondo al pasar el mouse
									color: 'darkblue', // color del texto al hacer hover
									borderColor: 'darkblue', // borde más oscuro en hover (opcional)
								},
							}}
						>
							Visita Instagram
						</Button>
					</div>
				</div>

				{/* Columna derecha: imagen circular */}
				<div style={{ flexShrink: 0 }}>
					<img
						src={mobile} // reemplaza con tu ruta real
						alt='si'
						style={{
							width: '30vw',
							height: '50vh',
							borderRadius: '50%',
							border: '6px solid red',
							objectFit: 'cover',
						}}
					/>
				</div>
			</section>

			<section
				style={{
					maxWidth: '90vw',
					margin: '0 auto',
					marginBottom: '10rem',
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'flex-start',
					gap: '2rem',
				}}
			>
				{/* Columna derecha: imagen circular */}
				<div style={{ flexShrink: 0 }}>
					<img
						src={dental} // reemplaza con tu ruta real
						alt='si'
						style={{
							width: '30vw',
							height: '50vh',
							borderRadius: '50%',
							border: '6px solid red',
							objectFit: 'cover',
						}}
					/>
				</div>
				{/* Columna izquierda: texto */}
				<div style={{ flex: 1 }}>
					<h2
						style={{
							fontSize: '2.75rem',
							fontWeight: '800',
							marginBottom: '1rem',
							textAlign: 'left',
							color: 'darkblue',
							maxWidth: '38vw',
						}}
					>
						Dental D.
					</h2>
					<Divider
						sx={{
							height: '0.35vh',
							width: '38vw',
							backgroundColor: 'red',
						}}
					/>
					<p
						style={{
							fontSize: '1.3rem',
							marginBottom: '1rem',
							textAlign: 'left',
							maxWidth: '50vw',
						}}
					>
						Gracias al apoyo de nuestros aliados estratégicos, hemos podido
						implementar proyectos sociales, apoyar comunidades vulnerables y
						promover la educación ambiental en distintas regiones del país.
					</p>
					<div style={{ marginTop: '2rem', textAlign: 'left' }}>
						<Button
							variant='outlined'
							href='https://www.facebook.com/Dentaldhn'
							target='_blank' // Abre en nueva pestaña
							rel='noopener noreferrer'
							sx={{
								mr: 2,
								border: '2px solid red', // borde más grueso y rojo
								color: 'red', // color del texto
								fontWeight: 'bold',
								'&:hover': {
									backgroundColor: 'white', // color de fondo al pasar el mouse
									color: 'darkblue', // color del texto al hacer hover
									borderColor: 'darkblue', // borde más oscuro en hover (opcional)
								},
							}}
						>
							Visita Facebook
						</Button>
						<Button
							variant='outlined'
							href='https://www.instagram.com/dentaldhn/'
							target='_blank' // Abre en nueva pestaña
							rel='noopener noreferrer'
							sx={{
								border: '2px solid red', // borde más grueso y rojo
								color: 'red', // color del texto
								fontWeight: 'bold',
								'&:hover': {
									backgroundColor: 'white', // color de fondo al pasar el mouse
									color: 'darkblue', // color del texto al hacer hover
									borderColor: 'darkblue', // borde más oscuro en hover (opcional)
								},
							}}
						>
							Visita Instagram
						</Button>
					</div>
				</div>
			</section>

			<h1
				style={{
					color: 'red',
					fontSize: '3.5rem',
					fontWeight: '500',
					marginBottom: '10rem',
				}}
			>
				Alianzas Estrategicas
			</h1>
			<section
				style={{
					maxWidth: '90vw',
					margin: '0 auto',
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'flex-start',
					marginBottom: '5rem',
					gap: '2rem',
				}}
			>
				{/* Columna izquierda: texto */}
				<div style={{ flex: 1 }}>
					<h2
						style={{
							fontSize: '2.75rem',
							fontWeight: '800',
							marginBottom: '1rem',
							textAlign: 'left',
							color: 'darkblue',
							maxWidth: '38vw',
						}}
					>
						Fundacion Angelitos
					</h2>
					<Divider
						sx={{
							height: '0.35vh',
							width: '38vw',
							backgroundColor: 'red',
						}}
					/>
					<p
						style={{
							fontSize: '1.3rem',
							marginBottom: '1rem',
							textAlign: 'left',
							maxWidth: '50vw',
						}}
					>
						Gracias al apoyo de nuestros aliados estratégicos, hemos podido
						implementar proyectos sociales, apoyar comunidades vulnerables y
						promover la educación ambiental en distintas regiones del país.
					</p>
					<div style={{ marginTop: '2rem', textAlign: 'left' }}>
						<Button
							variant='outlined'
							href='http://www.fundacionangelitos.org'
							target='_blank' // Abre en nueva pestaña
							rel='noopener noreferrer'
							sx={{
								mr: 2,
								border: '2px solid red', // borde más grueso y rojo
								color: 'red', // color del texto
								fontWeight: 'bold',
								'&:hover': {
									backgroundColor: 'white', // color de fondo al pasar el mouse
									color: 'darkblue', // color del texto al hacer hover
									borderColor: 'darkblue', // borde más oscuro en hover (opcional)
								},
							}}
						>
							Visita Fundacion
						</Button>
						<Button
							variant='outlined'
							href='https://www.facebook.com/fundacionangelitoshn'
							target='_blank' // Abre en nueva pestaña
							rel='noopener noreferrer'
							sx={{
								mr: 2,
								border: '2px solid red', // borde más grueso y rojo
								color: 'red', // color del texto
								fontWeight: 'bold',
								'&:hover': {
									backgroundColor: 'white', // color de fondo al pasar el mouse
									color: 'darkblue', // color del texto al hacer hover
									borderColor: 'darkblue', // borde más oscuro en hover (opcional)
								},
							}}
						>
							Visita Facebook
						</Button>
						<Button
							variant='outlined'
							href='https://www.instagram.com/fundacionangelitoshn/'
							target='_blank' // Abre en nueva pestaña
							rel='noopener noreferrer'
							sx={{
								border: '2px solid red', // borde más grueso y rojo
								color: 'red', // color del texto
								fontWeight: 'bold',
								'&:hover': {
									backgroundColor: 'white', // color de fondo al pasar el mouse
									color: 'darkblue', // color del texto al hacer hover
									borderColor: 'darkblue', // borde más oscuro en hover (opcional)
								},
							}}
						>
							Visita Instagram
						</Button>
					</div>
				</div>

				{/* Columna derecha: imagen circular */}
				<div style={{ flexShrink: 0 }}>
					<img
						src={angelitos} // reemplaza con tu ruta real
						alt='si'
						style={{
							width: '30vw',
							height: '50vh',
							borderRadius: '50%',
							border: '6px solid red',
							objectFit: 'cover',
						}}
					/>
				</div>
			</section>

			<section
				style={{
					maxWidth: '90vw',
					margin: '0 auto',
					marginBottom: '5rem',
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'flex-start',
					gap: '2rem',
				}}
			>
				{/* Columna derecha: imagen circular */}
				<div style={{ flexShrink: 0 }}>
					<img
						src={Faerea} // reemplaza con tu ruta real
						alt='si'
						style={{
							width: '28vw',
							height: '50vh',
							borderRadius: '50%',
							border: '6px solid red',
							objectFit: 'cover',
						}}
					/>
				</div>
				{/* Columna izquierda: texto */}
				<div style={{ flex: 1 }}>
					<h2
						style={{
							fontSize: '2.75rem',
							fontWeight: '800',
							marginBottom: '1rem',
							textAlign: 'left',
							color: 'darkblue',
							maxWidth: '38vw',
						}}
					>
						Fuerza Aérea Hondureña
					</h2>
					<Divider
						sx={{
							height: '0.35vh',
							width: '38vw',
							backgroundColor: 'red',
						}}
					/>
					<p
						style={{
							fontSize: '1.3rem',
							marginBottom: '1rem',
							textAlign: 'left',
							maxWidth: '50vw',
						}}
					>
						Gracias al apoyo de nuestros aliados estratégicos, hemos podido
						implementar proyectos sociales, apoyar comunidades vulnerables y
						promover la educación ambiental en distintas regiones del país.
					</p>
					<div style={{ marginTop: '2rem', textAlign: 'left' }}>
						<Button
							variant='outlined'
							href='https://www.facebook.com/FuerzaAereaHN/?locale=es_LA'
							target='_blank' // Abre en nueva pestaña
							rel='noopener noreferrer'
							sx={{
								mr: 2,
								border: '2px solid red', // borde más grueso y rojo
								color: 'red', // color del texto
								fontWeight: 'bold',
								'&:hover': {
									backgroundColor: 'white', // color de fondo al pasar el mouse
									color: 'darkblue', // color del texto al hacer hover
									borderColor: 'darkblue', // borde más oscuro en hover (opcional)
								},
							}}
						>
							Visita Facebook
						</Button>
						<Button
							variant='outlined'
							href='https://www.instagram.com/fuerzaaereahn/?hl=es'
							target='_blank' // Abre en nueva pestaña
							rel='noopener noreferrer'
							sx={{
								border: '2px solid red', // borde más grueso y rojo
								color: 'red', // color del texto
								fontWeight: 'bold',
								'&:hover': {
									backgroundColor: 'white', // color de fondo al pasar el mouse
									color: 'darkblue', // color del texto al hacer hover
									borderColor: 'darkblue', // borde más oscuro en hover (opcional)
								},
							}}
						>
							Visita Instagram
						</Button>
					</div>
				</div>
			</section>
		</div>
	);
};

export default Aliados;
