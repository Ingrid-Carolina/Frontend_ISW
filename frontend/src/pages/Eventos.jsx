import React from 'react';
import { useState } from 'react';
import {
	Box,
	Typography,
	TextField,
	Button,
	Grid,
	Paper,
	Divider,
	Container,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import './Eventos.css'
import FeaturedPost from '../components/FeaturedPost';
import Post from '../components/Post';

//array de events, aqui se haran store desde el backend en el futuro

const eventos = [
	{
		fecha: '2025-07-10',
		titulo: 'Clínica de Béisbol Infantil en San Pedro Sula',
		lugar: 'Estadio Chochi Sosa, San Pedro Sula, Honduras',
		hora: 'Julio 10 @ 9:00 am - 1:00 pm',
		image: '/src/Ima/clinicaSps.jpg',
	},
	{
		fecha: '2025-05-30',
		titulo: '2025 Central Region Tournament Preparation Umpire Clinic',
		lugar: '7185 S. Indianapolis Road, Whitestown, IN',
		hora: 'May 30 @ 1:00 pm - June 1 @ 12:00 pm',
		image: '/src/Ima/equipo.jpg'
	},
	{
		fecha: '2025-08-05',
		titulo: 'Capacitación para Entrenadores y Voluntarios de Little League®',
		lugar: 'Centro Deportivo FAH, Tegucigalpa, Honduras',
		hora: 'Agosto 5 @ 2:00 pm - 6:00 pm',
		image: '/src/Ima/capcitacion.jpg',
	},
	{
		fecha: '2025-06-15',
		titulo: 'Entrenamiento Regional de Verano',
		lugar: 'Tegucigalpa, Honduras',
		hora: 'June 15 @ 10:00 am - 4:00 pm',
		image: '/src/Ima/equipo2.jpg'
	},
];

const Featured = () => (
	<FeaturedPost
		title='Inicia la Temporada 2025 con Nuevas Metas y Más Pasión por el Béisbol'
		highlight='la Temporada 2025'
		date='Octubre 3 del 2024'
		style={{ textAlign: 'left', paddingTop: '40px' }}
	/>

);



const Eventos = () => {
	//para filtrar
	const [query, setQuery] = useState('');

	// filtra por lo que se busq
	const filteredEvents = eventos.filter(e =>
		e.titulo.toLowerCase().includes(query.toLowerCase()),
	);

	return (
		<div style={{ paddingTop: '90px' }}>
			<div className='header'>
				<div className='header-title'>
					<p>NOTICIAS Y EVENTOS</p>
				</div>
			</div>
			<Container maxWidth="md">

				{/* Buscador */}
				<Box paddingTop='90px' display="flex" alignItems="center" mb={3}>
					<SearchIcon style={{ marginRight: '8px' }} />
					<TextField
						fullWidth
						variant="outlined"
						size="small"
						label="Buscar eventos y/o noticias"
						value={query}
						onChange={e => setQuery(e.target.value)}
					/>
				</Box>
				<Featured />
				<Divider style={{ margin: '2rem 0' }} />
				{/* Lista de eventos */}
				{filteredEvents.map((evento, index) => (
					<div>
						<Post
							key={index}
							title={evento.titulo}
							date={evento.fecha}
							image={evento.image}
							location={evento.lugar}
							time={evento.hora}
						/>
						<Divider style={{ margin: '2rem 0' }} />
					</div>

				))}
			</Container>


		</div>


	);
};

export default Eventos;
