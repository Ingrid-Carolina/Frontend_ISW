import React from 'react';
import { useState } from 'react';
import { Box, Typography, TextField, Button, Grid, Paper, Divider } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search'


//array de events, aqui se haran store desde el backend en el futuro

const eventos = [
	{
		fecha: '2025-05-30',
		titulo: '2025 Central Region Tournament Preparation Umpire Clinic',
		lugar: '7185 S. Indianapolis Road, Whitestown, IN',
		hora: 'May 30 @ 1:00 pm - June 1 @ 12:00 pm',
	},
	{
		fecha: '2025-06-15',
		titulo: 'Entrenamiento Regional de Verano',
		lugar: 'Tegucigalpa, Honduras',
		hora: 'June 15 @ 10:00 am - 4:00 pm',
	},
]

const Eventos = () => {

	//para filtrar
	const [query, setQuery] = useState('');

	// filtra por lo que se busq
	const filteredEvents = eventos.filter(e => e.titulo.toLowerCase().includes(query.toLowerCase()));

	return (
		<div style={{ padding: '2rem', color: 'black' }}>
			<Box sx={{ p: 4 }}>
				<Typography variant='h3' fontWeight='bold' textAlign='center' mb={4}>
					CALENDARIO DE EVENTOS
				</Typography>


			</Box>
		</div>
	);
};

export default Eventos;
