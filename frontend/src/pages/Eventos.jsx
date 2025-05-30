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

		<Box sx={{ p: '2rem', color: 'black' }}>
			<Typography variant='h3' fontWeight='bold' textAlign='center' mb={4}>
				CALENDARIO DE EVENTOS
			</Typography>

			<Box sx={{
				display: 'flex',
				gap: 2,
				flexDirection: { xs: 'column', sm: 'row' },
				justifyContent: 'center',
				mb: 4,
			}}>
				<TextField variant='outlined'
					placeholder='Buscar eventos'
					value={query}
					onChange={e => setQuery(e.target.value)}
					InputProps={{
						startAdornment: <SearchIcon sx={{ mr: 1 }} />,
					}}
					sx={{ flex: 1, minWidth: 300 }} />
				<Button
					variant='contained'
					color='error'
					onClick={() => { }}
					sx={{ fontWeight: 'bold' }}
				>
					Buscar
				</Button>
			</Box>
			{/* Lista de eventos */}
			<Grid container spacing={3}>
				{eventos.map((evento, index) => (
					<Grid item xs={12} key={index}>
						<Paper elevation={3} sx={{ p: 3 }}>
							<Typography
								variant='overline'
								color='text.secondary'
								fontWeight='bold'
							>
								{new Date(evento.fecha).toLocaleDateString('en-US', {
									weekday: 'short',
									month: 'short',
									day: 'numeric',
									year: 'numeric',
								})}
							</Typography>
							<Typography variant='h6' fontWeight='bold' mt={1}>
								{evento.titulo}
							</Typography>
							<Typography variant='body2' color='text.secondary'>
								{evento.hora}
							</Typography>
							<Typography variant='body2' color='text.secondary'>
								<strong>Ubicación:</strong> {evento.lugar}
							</Typography>
						</Paper>
					</Grid>
				))}
			</Grid>

		</Box>

	);
};

export default Eventos;
