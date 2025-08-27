import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { api } from '../../api/api';
import {
	RadarChart,
	Radar,
	PolarGrid,
	PolarAngleAxis,
	PolarRadiusAxis,
	ResponsiveContainer,
	Tooltip,
	Legend,
} from 'recharts';
import {
	Box,
	Typography,
	Card,
	CardContent,
	CardMedia,
	Button,
	Grid,
	Dialog,
	DialogContent,
	IconButton,
	Menu,
	MenuItem,
	Checkbox,
	FormControlLabel,
	Tabs,
	Tab,
	Select,
	FormControl,
	InputLabel,
	Chip,
	CircularProgress,
	Alert,
	Snackbar,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import BarChartIcon from '@mui/icons-material/BarChart';
import RadarIcon from '@mui/icons-material/Radar';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';

// --- Estadísticas ordenadas ---
const orderStats = [
	'ID',
	'name',
	'G',
	'PA',
	'AB',
	'R',
	'H',
	'B',
	'1B',
	'2B',
	'3B',
	'HR',
	'XBH',
	'TB',
	'OB',
	'RC',
	'RBI',
	'AVG',
	'BB',
	'BBi',
	'Xc',
	'Ks',
	'SO',
	'BB/K',
	'BB/PA',
	'HBP',
	'SB',
	'CS',
	'PK',
	'SCB',
	'SF',
	'SAC',
	'RPA',
	'OBP',
	'OBPE',
	'SLG',
	'OPS',
	'GPA',
	'LOBi',
	'LOB',
	'ROE',
	'FC',
	'CH',
	'IMG',
];

// --- Estadísticas resumidas ---
const resumenStats = {
	G: 'Juegos',
	PA: 'Apariciones al bate',
	AB: 'Turnos al bate',
	H: 'Hits',
	HR: 'Home Runs',
	RBI: 'Carreras Impulsadas',
	AVG: 'Promedio de bateo',
	OBP: 'Porcentaje de embasado',
	SLG: 'Slugging',
	OPS: 'On-base Plus Slugging',
};

// --- Configuraciones para gráficos radar ---
const radarConfigs = {
	ofensivo: {
		title: 'Rendimiento Ofensivo',
		stats: ['AVG', 'HR', 'RBI', 'SLG', 'OPS', 'OBP'],
		maxValues: { AVG: 0.4, HR: 50, RBI: 150, SLG: 0.7, OPS: 1.2, OBP: 0.5 },
	},
	defensivo: {
		title: 'Estadísticas de Contacto',
		stats: ['H', '2B', '3B', 'BB', 'SO', 'SB'],
		maxValues: { H: 200, '2B': 50, '3B': 15, BB: 100, SO: 200, SB: 50 },
	},
	avanzado: {
		title: 'Métricas Avanzadas',
		stats: ['GPA', 'RC', 'TB', 'XBH', 'BB/K', 'OBP'],
		maxValues: { GPA: 0.35, RC: 120, TB: 350, XBH: 80, 'BB/K': 2.0, OBP: 0.5 },
	},
};

// --- Mapeo columnas BD -> frontend ---
const mappingBDtoFront = {
	juegos_jugados: 'G',
	apar_Plato: 'PA',
	turnos_Bate: 'AB',
	carreras_Anotadas: 'R',
	hits: 'H',
	bases_Alcanzadas: 'B',
	sencillos: '1B',
	dobles: '2B',
	triples: '3B',
	jonron: 'HR',
	extrabases: 'XBH',
	total_Bases: 'TB',
	veces_base: 'OB',
	carreras_creadas: 'RC',
	carreras_impulsadas: 'RBI',
	promedio_bateo: 'AVG',
	bases_bola: 'BB',
	bases_bola_int: 'BBi',
	extra_contados: 'Xc',
	ponches_tirandole: 'Ks',
	ponches_totales: 'SO',
	boletos_ponche: 'BB/K',
	porcentaje_boletos_apa: 'BB/PA',
	golpeado_lanzamiento: 'HBP',
	bases_robadas: 'SB',
	atrapado_robando: 'CS',
	pickoffs: 'PK',
	sacrificio_bateo: 'SCB',
	flies_sacrificio: 'SF',
	toques_sacrificio: 'SAC',
	carrera_apari_plato: 'RPA',
	porcentaje_embasado: 'OBP',
	obp_estimado: 'OBPE',
	slugging: 'SLG',
	obp_mas_slug: 'OPS',
	promedio_poder: 'GPA',
	corredores_dejados_base_ind: 'LOBi',
	corredores_dejados_base_equi: 'LOB',
	llegadas_por_error: 'ROE',
	jugada_de_seleccion: 'FC',
	opor_fildeo: 'CH',
	img: 'IMG',
};

export default function StatsJugadores() {
	const [jugadores, setJugadores] = useState([]);
	const [open, setOpen] = useState(false);
	const [jugadorSeleccionado, setJugadorSeleccionado] = useState(null);
	const [modoDetalle, setModoDetalle] = useState('detallado');
	const [busqueda, setBusqueda] = useState('');
	const [tabValue, setTabValue] = useState(0);
	const [radarConfig, setRadarConfig] = useState('ofensivo');
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const [anchorEl, setAnchorEl] = useState(null);
	const [jugadorMenu, setJugadorMenu] = useState(null);

	const [openComparar, setOpenComparar] = useState(false);
	const [jugadorBase, setJugadorBase] = useState(null);
	const [jugadorComparado, setJugadorComparado] = useState(null);

	const [jugadorEnConflicto, setJugadorEnConflicto] = useState([]);
	const [openConflicto, setOpenConflicto] = useState(false);
	const [seleccionConflictos, setSeleccionConflictos] = useState({});

	const [openConfirmarSinSeleccion, setOpenConfirmarSinSeleccion] =
		useState(false);
	const [jugadoresSinSeleccion, setJugadoresSinSeleccion] = useState([]);

	const [snack, setSnack] = useState({
		open: false,
		severity: 'success', // 'success' | 'error' | 'info' | 'warning'
		text: '',
	});
	const openSnack = (severity, text) =>
		setSnack({ open: true, severity, text });

	// --- Cargar jugadores desde API al montar componente ---
	useEffect(() => {
		fetchJugadores();
	}, []);

	// --- Función para obtener jugadores desde la API ---
	const fetchJugadores = async () => {
		try {
			setLoading(true);
			setError(null);

			const res = await api.get('/auth/jugadores');
			const data = res.data?.jugadores || [];

			const jugadoresConvertidos = data.map(row => {
				const jugador = {
					ID: row.id,
					name: row.nombre || row.name,
					foto: row.foto || '/Images/jugador.jpg',
				};

				// Mapear todas las estadísticas desde la BD al formato frontend
				for (const [colBD, colFront] of Object.entries(mappingBDtoFront)) {
					jugador[colFront] = row[colBD] !== undefined ? row[colBD] : null;
				}

				return jugador;
			});

			setJugadores(jugadoresConvertidos);
			return true;
		} catch (err) {
			console.error('Error al obtener jugadores:', err);
			return false;
			// setError("Error al cargar los jugadores. Por favor, intenta nuevamente.");
		} finally {
			setLoading(false);
		}
	};

	// --- Función para actualizar jugador en la API ---
	const actualizarJugadorAPI = async jugador => {
		try {
			// Convertir de formato frontend a BD
			const jugadorBD = {
				id: jugador.ID,
				nombre: jugador.name,
				foto: jugador.foto,
			};

			// Mapear estadísticas de vuelta al formato BD
			for (const [colBD, colFront] of Object.entries(mappingBDtoFront)) {
				if (jugador[colFront] !== undefined) {
					jugadorBD[colBD] = jugador[colFront];
				}
			}

			await api.put(`/auth/jugadores/${jugador.ID}`, jugadorBD);
			return true;
		} catch (err) {
			console.error('Error al actualizar jugador:', err);
			return false;
		}
	};

	// --- Función para crear jugador en la API ---
	const crearJugadorAPI = async jugador => {
		try {
			const jugadorBD = {
				nombre: jugador.name,
				foto: jugador.foto || '/Images/jugador.jpg',
			};

			for (const [colBD, colFront] of Object.entries(mappingBDtoFront)) {
				if (jugador[colFront] !== undefined) {
					jugadorBD[colBD] = jugador[colFront];
				}
			}

			const res = await api.post('/auth/jugadores', jugadorBD);
			return res.data?.jugador || null;
		} catch (err) {
			console.error('Error al crear jugador:', err);
			return null;
		}
	};

	// --- Preparar datos para gráfico radar individual ---
	const prepararDatosRadar = (jugador, configKey) => {
		const config = radarConfigs[configKey];
		return config.stats.map(stat => ({
			stat,
			value: parseFloat(jugador[stat]) || 0,
			fullMark: config.maxValues[stat] || 100,
		}));
	};

	// --- Preparar datos para comparación de jugadores ---
	const prepararDatosComparacion = (jugador1, jugador2, configKey) => {
		const config = radarConfigs[configKey];
		return config.stats.map(stat => ({
			stat,
			[jugador1.name]: parseFloat(jugador1[stat]) || 0,
			[jugador2.name]: parseFloat(jugador2[stat]) || 0,
			fullMark: config.maxValues[stat] || 100,
		}));
	};

	// --- Obtener siguiente ID disponible ---
	const obtenerSiguienteID = listaJugadores => {
		return listaJugadores.length
			? Math.max(...listaJugadores.map(j => j.ID)) + 1
			: 1;
	};

	// --- Manejar importación de Excel ---
	const handleImportExcel = async e => {
		const file = e.target.files[0];
		if (!file) {
			openSnack('info', 'No seleccionaste ningún archivo.');
			return;
		}

		const reader = new FileReader();
		reader.onload = async evt => {
			try {
				const bstr = evt.target.result;
				const workbook = XLSX.read(bstr, { type: 'binary' });
				const sheetName = workbook.SheetNames[0];
				const worksheet = workbook.Sheets[sheetName];
				const data = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

				let jugadoresTemp = [...jugadores];
				const conflictos = [];

				data.forEach(row => {
					const nuevoJugador = {
						...row,
						ID: row.ID || obtenerSiguienteID(jugadoresTemp),
						name: row.Name || row.name,
						foto: row.foto || '/Images/jugador.jpg',
					};

					const conflictosNombre = jugadoresTemp.filter(
						j => j.name.toLowerCase() === nuevoJugador.name.toLowerCase(),
					);

					if (conflictosNombre.length > 0) {
						conflictos.push({
							nuevoJugador,
							conflictosExistentes: conflictosNombre,
						});
					} else if (jugadoresTemp.find(j => j.ID === nuevoJugador.ID)) {
						nuevoJugador.ID = obtenerSiguienteID(jugadoresTemp);
						jugadoresTemp.push(nuevoJugador);
					} else {
						jugadoresTemp.push(nuevoJugador);
					}
				});

				setJugadores(jugadoresTemp);

				if (conflictos.length > 0) {
					setJugadorEnConflicto(conflictos);
					setOpenConflicto(true);
					openSnack(
						'warning',
						`Importado con observaciones: ${conflictos.length} conflicto(s) por nombre.`,
					);
				} else {
					openSnack(
						'success',
						'¡Importación exitosa! Los jugadores se cargaron correctamente.',
					);
				}
			} catch (error) {
				console.error('Error al procesar Excel:', error);
				setError('Error al procesar el archivo Excel. Verifica el formato.');
				openSnack(
					'error',
					'No se pudo procesar el Excel. Revisa el formato e inténtalo nuevamente.',
				);
			}
		};

		reader.readAsBinaryString(file);
	};

	// --- Aplicar cambios de conflictos con API ---
	const aplicarCambios = async () => {
		try {
			setLoading(true);
			let jugadoresTemp = [...jugadores];
			let nextID = obtenerSiguienteID(jugadoresTemp);

			for (const conflicto of jugadorEnConflicto) {
				const sel = seleccionConflictos[conflicto.nuevoJugador.ID] || {};

				if (sel.actualizar) {
					// Actualizar jugador existente en API
					const jugadorActualizado = {
						...conflicto.nuevoJugador,
						ID: conflicto.conflictosExistentes[0].ID,
					};

					const exito = await actualizarJugadorAPI(jugadorActualizado);
					if (exito) {
						jugadoresTemp = jugadoresTemp.map(j =>
							j.ID === conflicto.conflictosExistentes[0].ID
								? jugadorActualizado
								: j,
						);
					}
				} else if (sel.agregar) {
					// Crear nuevo jugador en API
					const nuevoJugador = { ...conflicto.nuevoJugador, ID: nextID };
					const jugadorCreado = await crearJugadorAPI(nuevoJugador);

					if (jugadorCreado) {
						jugadoresTemp.push({ ...nuevoJugador, ID: jugadorCreado.id });
						nextID++;
					}
				}
			}

			setJugadores(jugadoresTemp);
			setOpenConflicto(false);
			setJugadorEnConflicto([]);
			setSeleccionConflictos({});
			setOpenConfirmarSinSeleccion(false);
			setJugadoresSinSeleccion([]);

			// Refrescar datos desde la API
			await fetchJugadores();
		} catch (error) {
			console.error('Error al aplicar cambios:', error);
			setError('Error al guardar los cambios. Intenta nuevamente.');
		} finally {
			setLoading(false);
		}
	};

	const handleAplicarConflictos = () => {
		const sinSeleccion = jugadorEnConflicto.filter(conflicto => {
			const sel = seleccionConflictos[conflicto.nuevoJugador.ID];
			return !sel?.actualizar && !sel?.agregar;
		});

		if (sinSeleccion.length > 0) {
			setJugadoresSinSeleccion(sinSeleccion);
			setOpenConfirmarSinSeleccion(true);
			return;
		}

		aplicarCambios();
	};

	const jugadoresFiltrados = jugadores.filter(j =>
		j.name?.toLowerCase().includes(busqueda.toLowerCase()),
	);

	// --- Mostrar loading mientras carga ---
	if (loading && jugadores.length === 0) {
		return (
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					height: '50vh',
				}}
			>
				<CircularProgress size={60} sx={{ color: '#10045c' }} />
				<Typography sx={{ ml: 2, color: '#10045c' }}>
					Cargando estadísticas...
				</Typography>
			</Box>
		);
	}

	return (
		<Box sx={{ width: '100%', pt: 2 }}>
			<Typography
				variant='h2'
				sx={{
					fontFamily: 'GroteskBold',
					color: '#10045c',
					mb: 4,
					textAlign: 'center',
				}}
			>
				Estadísticas de Jugadores
			</Typography>

			{error && (
				<Alert severity='error' sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}>
					{error}
					<Button onClick={fetchJugadores} sx={{ ml: 2 }}>
						Reintentar
					</Button>
				</Alert>
			)}

			<Box sx={{ textAlign: 'center', mb: 3 }}>
				<Button
					variant='contained'
					component='label'
					sx={{ backgroundColor: '#10045c', mr: 2 }}
				>
					Importar Excel con Estadísticas
					<input
						type='file'
						accept='.xlsx, .xls'
						hidden
						onChange={handleImportExcel}
					/>
				</Button>
				<Button
					variant='outlined'
					onClick={async () => {
						const ok = await fetchJugadores();
						openSnack(
							ok ? 'success' : 'error',
							ok
								? 'Datos actualizados correctamente.'
								: 'No se pudo actualizar los datos.',
						);
					}}
					disabled={loading}
				>
					{loading ? <CircularProgress size={20} /> : 'Actualizar Datos'}
				</Button>
			</Box>

			<Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
				<input
					type='text'
					placeholder='Buscar jugador...'
					value={busqueda}
					onChange={e => setBusqueda(e.target.value)}
					style={{
						width: '100%',
						maxWidth: '960px',
						padding: '12px',
						borderRadius: '20px',
						border: '1px solid #ccc',
						fontSize: '16px',
					}}
				/>
			</Box>

			<Grid container spacing={2} justifyContent='center'>
				{jugadoresFiltrados.map(jugador => (
					<Grid item xs={12} sm={6} md={4} key={jugador.ID}>
						<Card
							sx={{
								borderRadius: 3,
								boxShadow: 3,
								textAlign: 'center',
								p: 2,
								position: 'relative',
							}}
						>
							<IconButton
								sx={{ position: 'absolute', top: 8, right: 8 }}
								onClick={e => {
									setAnchorEl(e.currentTarget);
									setJugadorMenu(jugador);
								}}
							>
								<MoreVertIcon />
							</IconButton>
							<CardMedia
								component='img'
								image={jugador.foto}
								alt={jugador.name}
								sx={{
									objectFit: 'cover',
									borderRadius: 3,
									maxWidth: '300px',
									mx: 'auto',
									mb: 2,
								}}
							/>
							<CardContent>
								<Typography
									variant='h6'
									sx={{ fontFamily: 'GroteskBold', mb: 1 }}
								>
									{jugador.name}
								</Typography>
								<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
									<Button
										variant='contained'
										sx={{ backgroundColor: '#10045c' }}
										startIcon={<BarChartIcon />}
										onClick={() => {
											setJugadorSeleccionado(jugador);
											setModoDetalle('detallado');
											setOpen(true);
										}}
									>
										Ver Estadísticas Detalladas
									</Button>
									<Button
										variant='outlined'
										startIcon={<RadarIcon />}
										onClick={() => {
											setJugadorSeleccionado(jugador);
											setModoDetalle('graficos');
											setOpen(true);
										}}
									>
										Ver Gráficos
									</Button>
									<Button
										variant='text'
										size='small'
										onClick={() => {
											setJugadorSeleccionado(jugador);
											setModoDetalle('resumido');
											setOpen(true);
										}}
									>
										Vista Resumida
									</Button>
								</Box>
							</CardContent>
						</Card>
					</Grid>
				))}
			</Grid>

			{/* --- Menú acciones jugador --- */}
			<Menu
				anchorEl={anchorEl}
				open={Boolean(anchorEl)}
				onClose={() => {
					setAnchorEl(null);
					setJugadorMenu(null);
				}}
			>
				<MenuItem
					onClick={() => {
						if (jugadorMenu) {
							setJugadorBase(jugadorMenu);
							setOpenComparar(true);
							setAnchorEl(null);
							setJugadorMenu(null);
						}
					}}
				>
					<CompareArrowsIcon sx={{ mr: 1 }} />
					Comparar jugador
				</MenuItem>
			</Menu>

			{/* --- Popup conflictos --- */}
			<Dialog
				open={openConflicto}
				onClose={() => setOpenConflicto(false)}
				maxWidth='sm'
				fullWidth
			>
				<DialogContent sx={{ textAlign: 'center', p: 3 }}>
					<Typography variant='h6' sx={{ mb: 2 }}>
						¡Conflictos de jugadores!
					</Typography>
					<Typography sx={{ mb: 3 }}>
						Selecciona qué acción tomar para cada jugador:
					</Typography>

					{jugadorEnConflicto.map((conflicto, index) => (
						<Box
							key={index}
							sx={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'space-between',
								mb: 2,
								p: 1,
								border: '1px solid #ccc',
								borderRadius: 2,
							}}
						>
							<Box>
								<Typography>
									<b>{conflicto.nuevoJugador.name}</b> (ID:{' '}
									{conflicto.nuevoJugador.ID})
								</Typography>
								<Typography variant='body2' color='textSecondary'>
									Conflicta con:{' '}
									{conflicto.conflictosExistentes
										.map(j => `${j.name} (ID: ${j.ID})`)
										.join(', ')}
								</Typography>
							</Box>

							<Box>
								<FormControlLabel
									control={
										<Checkbox
											checked={
												seleccionConflictos[conflicto.nuevoJugador.ID]
													?.actualizar || false
											}
											onChange={() =>
												setSeleccionConflictos(prev => ({
													...prev,
													[conflicto.nuevoJugador.ID]: {
														actualizar: true,
														agregar: false,
													},
												}))
											}
										/>
									}
									label='Actualizar'
								/>
								<FormControlLabel
									control={
										<Checkbox
											checked={
												seleccionConflictos[conflicto.nuevoJugador.ID]
													?.agregar || false
											}
											onChange={() =>
												setSeleccionConflictos(prev => ({
													...prev,
													[conflicto.nuevoJugador.ID]: {
														actualizar: false,
														agregar: true,
													},
												}))
											}
										/>
									}
									label='Agregar Igualmente'
								/>
							</Box>
						</Box>
					))}

					<Box
						sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}
					>
						<Button
							variant='contained'
							onClick={handleAplicarConflictos}
							disabled={loading}
						>
							{loading ? <CircularProgress size={20} /> : 'Aplicar Selección'}
						</Button>
					</Box>
				</DialogContent>
			</Dialog>

			{/* --- Popup confirmación sin selección --- */}
			<Dialog
				open={openConfirmarSinSeleccion}
				onClose={() => setOpenConfirmarSinSeleccion(false)}
				maxWidth='sm'
				fullWidth
			>
				<DialogContent sx={{ textAlign: 'center', p: 3 }}>
					<Typography variant='h6' sx={{ mb: 2 }}>
						Algunos jugadores no tienen acción seleccionada
					</Typography>
					<Typography sx={{ mb: 3 }}>
						{jugadoresSinSeleccion.map(j => j.nuevoJugador.name).join(', ')}
						<br />
						Se dejarán igual que antes. ¿Deseas continuar?
					</Typography>
					<Box
						sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}
					>
						<Button
							variant='outlined'
							onClick={() => setOpenConfirmarSinSeleccion(false)}
						>
							Volver
						</Button>
						<Button
							variant='contained'
							onClick={aplicarCambios}
							disabled={loading}
						>
							{loading ? (
								<CircularProgress size={20} />
							) : (
								'Continuar de todos modos'
							)}
						</Button>
					</Box>
				</DialogContent>
			</Dialog>

			{/* --- Dialog detalle jugador --- */}
			<Dialog
				open={open}
				onClose={() => {
					setOpen(false);
					setJugadorSeleccionado(null);
				}}
				maxWidth='lg'
				fullWidth
				sx={{ '& .MuiDialog-paper': { mt: 5 } }}
			>
				<DialogContent>
					{jugadorSeleccionado && (
						<Box sx={{ textAlign: 'center', p: 2 }}>
							<CardMedia
								component='img'
								height='200'
								image={jugadorSeleccionado.foto}
								alt={jugadorSeleccionado.name}
								sx={{
									objectFit: 'cover',
									borderRadius: 3,
									maxWidth: '300px',
									mx: 'auto',
									mb: 2,
								}}
							/>
							<Typography
								variant='h5'
								sx={{ fontFamily: 'GroteskBold', mb: 2 }}
							>
								{jugadorSeleccionado.name}
							</Typography>

							{modoDetalle === 'graficos' && (
								<Box sx={{ mb: 3 }}>
									<FormControl sx={{ minWidth: 200, mb: 3 }}>
										<InputLabel>Tipo de Gráfico</InputLabel>
										<Select
											value={radarConfig}
											label='Tipo de Gráfico'
											onChange={e => setRadarConfig(e.target.value)}
										>
											<MenuItem value='ofensivo'>Rendimiento Ofensivo</MenuItem>
											<MenuItem value='defensivo'>
												Estadísticas de Contacto
											</MenuItem>
											<MenuItem value='avanzado'>Métricas Avanzadas</MenuItem>
										</Select>
									</FormControl>

									<Card
										sx={{
											borderRadius: 4,
											boxShadow: 6,
											p: 3,
											background:
												'linear-gradient(135deg, #667eea 0%, #10045c 100%)',
											mb: 3,
										}}
									>
										<Typography variant='h6' sx={{ color: 'white', mb: 2 }}>
											{radarConfigs[radarConfig].title}
										</Typography>
										<Box
											sx={{
												display: 'flex',
												flexWrap: 'wrap',
												gap: 1,
												justifyContent: 'center',
												mb: 2,
											}}
										>
											{radarConfigs[radarConfig].stats.map(stat => (
												<Chip
													key={stat}
													label={`${stat}: ${jugadorSeleccionado[stat] || 0}`}
													sx={{
														backgroundColor: 'rgba(255,255,255,0.2)',
														color: 'white',
													}}
												/>
											))}
										</Box>
										<ResponsiveContainer width='100%' height={400}>
											<RadarChart
												data={prepararDatosRadar(
													jugadorSeleccionado,
													radarConfig,
												)}
											>
												<PolarGrid gridType='polygon' />
												<PolarAngleAxis
													dataKey='stat'
													tick={{ fontSize: 12, fill: 'white' }}
												/>
												<PolarRadiusAxis
													angle={90}
													domain={[0, 'dataMax']}
													tick={{ fontSize: 10, fill: 'white' }}
												/>
												<Radar
													name={jugadorSeleccionado.name}
													dataKey='value'
													stroke='#ff6b6b'
													fill='#ff6b6b'
													fillOpacity={0.3}
													strokeWidth={2}
												/>
												<Tooltip
													contentStyle={{
														backgroundColor: 'rgba(0,0,0,0.8)',
														border: 'none',
														borderRadius: '8px',
														color: 'white',
													}}
												/>
											</RadarChart>
										</ResponsiveContainer>
									</Card>
								</Box>
							)}

							{modoDetalle === 'detallado' && (
								<Card
									sx={{
										borderRadius: 4,
										boxShadow: 6,
										p: 3,
										background: '#10045c',
										maxWidth: '700px',
										mx: 'auto',
										mb: 2,
									}}
								>
									<Box sx={{ columnCount: 3, columnGap: '20px', px: 3 }}>
										{orderStats
											.filter(statKey => !['name', 'IMG'].includes(statKey))
											.map(
												statKey =>
													jugadorSeleccionado[statKey] !== undefined &&
													jugadorSeleccionado[statKey] !== null && (
														<Typography
															key={statKey}
															sx={{ breakInside: 'avoid', color: '#ffffffff' }}
														>
															<b>{statKey}:</b> {jugadorSeleccionado[statKey]}
														</Typography>
													),
											)}
									</Box>
								</Card>
							)}

							{modoDetalle === 'resumido' && (
								<Card
									sx={{
										borderRadius: 4,
										boxShadow: 6,
										p: 3,
										background: '#10045c',
										maxWidth: '700px',
										mx: 'auto',
										mb: 2,
									}}
								>
									{Object.entries(resumenStats).map(
										([key, label]) =>
											jugadorSeleccionado[key] !== undefined &&
											jugadorSeleccionado[key] !== null && (
												<Typography
													key={key}
													sx={{ mb: 1, fontSize: '16px', color: '#ffffffff' }}
												>
													<b>
														{label} ({key}):
													</b>{' '}
													{jugadorSeleccionado[key]}
												</Typography>
											),
									)}
								</Card>
							)}

							<Button
								onClick={() => {
									setOpen(false);
									setJugadorSeleccionado(null);
								}}
								variant='contained'
								sx={{ mt: 2, backgroundColor: '#10045c' }}
							>
								Cerrar
							</Button>
						</Box>
					)}
				</DialogContent>
			</Dialog>

			{/* --- Dialog comparar jugadores --- */}
			<Dialog
				open={openComparar}
				onClose={() => {
					setOpenComparar(false);
					setJugadorBase(null);
					setJugadorComparado(null);
				}}
				maxWidth='lg'
				fullWidth
				sx={{
					'& .MuiDialog-paper': {
						borderRadius: 4,
						boxShadow: 8,
						background: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)',
						mt: 5,
					},
				}}
			>
				<DialogContent>
					{!jugadorComparado ? (
						<Box sx={{ textAlign: 'center', p: 2 }}>
							<Typography
								variant='h6'
								sx={{ mb: 4, fontFamily: 'GroteskBold', color: '#10045c' }}
							>
								Selecciona un Jugador Para Comparar con {jugadorBase?.name}
							</Typography>

							<Grid
								container
								spacing={3}
								justifyContent='center'
								alignItems='center'
							>
								{jugadores
									.filter(j => j.ID !== jugadorBase?.ID)
									.map((j, i) => (
										<Grid
											item
											xs={12}
											sm={6}
											md={4}
											key={i}
											sx={{ display: 'flex', justifyContent: 'center' }}
										>
											<Card
												sx={{
													borderRadius: 4,
													boxShadow: 6,
													textAlign: 'center',
													p: 2,
													cursor: 'pointer',
													maxWidth: '220px',
													transition: 'all 0.3s ease',
													background:
														'linear-gradient(135deg, #ffffff 0%, #f0f4ff 100%)',
													'&:hover': {
														transform: 'scale(1.05)',
														boxShadow: 10,
													},
												}}
												onClick={() => setJugadorComparado(j)}
											>
												<CardMedia
													component='img'
													image={j.foto}
													alt={j.name}
													sx={{
														objectFit: 'cover',
														borderRadius: 3,
														height: 180,
														mb: 2,
													}}
												/>
												<Typography
													variant='h6'
													sx={{ fontFamily: 'GroteskBold', color: '#10045c' }}
												>
													{j.name}
												</Typography>
											</Card>
										</Grid>
									))}
							</Grid>
						</Box>
					) : (
						<Box sx={{ textAlign: 'center' }}>
							<Typography
								variant='h5'
								sx={{ mb: 3, fontFamily: 'GroteskBold', color: '#10045c' }}
							>
								Comparando a {jugadorBase.name} vs {jugadorComparado.name}
							</Typography>

							<Tabs
								value={tabValue}
								onChange={(e, newValue) => setTabValue(newValue)}
								centered
								sx={{ mb: 3 }}
							>
								<Tab label='Gráfico Radar' />
								<Tab label='Tabla Comparativa' />
							</Tabs>

							{tabValue === 0 && (
								<Box>
									<FormControl sx={{ minWidth: 200, mb: 3 }}>
										<InputLabel>Tipo de Comparación</InputLabel>
										<Select
											value={radarConfig}
											label='Tipo de Comparación'
											onChange={e => setRadarConfig(e.target.value)}
										>
											<MenuItem value='ofensivo'>Rendimiento Ofensivo</MenuItem>
											<MenuItem value='defensivo'>
												Estadísticas de Contacto
											</MenuItem>
											<MenuItem value='avanzado'>Métricas Avanzadas</MenuItem>
										</Select>
									</FormControl>

									<Card
										sx={{
											borderRadius: 4,
											boxShadow: 6,
											p: 3,
											background:
												'linear-gradient(135deg, #667eea 0%, #10045c 100%)',
											mb: 3,
										}}
									>
										<Typography variant='h6' sx={{ color: 'white', mb: 2 }}>
											{radarConfigs[radarConfig].title} - Comparación
										</Typography>

										<Box
											sx={{
												display: 'flex',
												justifyContent: 'center',
												gap: 4,
												mb: 2,
											}}
										>
											<Box
												sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
											>
												<Box
													sx={{
														width: 20,
														height: 20,
														backgroundColor: '#ff6b6b',
														borderRadius: 1,
													}}
												/>
												<Typography sx={{ color: 'white', fontSize: '14px' }}>
													{jugadorBase.name}
												</Typography>
											</Box>
											<Box
												sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
											>
												<Box
													sx={{
														width: 20,
														height: 20,
														backgroundColor: '#4ecdc4',
														borderRadius: 1,
													}}
												/>
												<Typography sx={{ color: 'white', fontSize: '14px' }}>
													{jugadorComparado.name}
												</Typography>
											</Box>
										</Box>

										<ResponsiveContainer width='100%' height={400}>
											<RadarChart
												data={prepararDatosComparacion(
													jugadorBase,
													jugadorComparado,
													radarConfig,
												)}
											>
												<PolarGrid gridType='polygon' />
												<PolarAngleAxis
													dataKey='stat'
													tick={{ fontSize: 12, fill: 'white' }}
												/>
												<PolarRadiusAxis
													angle={90}
													domain={[0, 'dataMax']}
													tick={{ fontSize: 10, fill: 'white' }}
												/>
												<Radar
													name={jugadorBase.name}
													dataKey={jugadorBase.name}
													stroke='#ff6b6b'
													fill='#ff6b6b'
													fillOpacity={0.3}
													strokeWidth={2}
												/>
												<Radar
													name={jugadorComparado.name}
													dataKey={jugadorComparado.name}
													stroke='#4ecdc4'
													fill='#4ecdc4'
													fillOpacity={0.3}
													strokeWidth={2}
												/>
												<Tooltip
													contentStyle={{
														backgroundColor: 'rgba(0,0,0,0.8)',
														border: 'none',
														borderRadius: '8px',
														color: 'white',
													}}
												/>
												<Legend />
											</RadarChart>
										</ResponsiveContainer>
									</Card>
								</Box>
							)}

							{tabValue === 1 && (
								<Box
									sx={{
										display: 'grid',
										gridTemplateColumns: '1fr 1fr 1fr',
										textAlign: 'center',
										maxHeight: '400px',
										overflowY: 'auto',
										borderRadius: 3,
										boxShadow: 4,
										background: '#10045c',
									}}
								>
									{/* Cabecera */}
									<Box
										sx={{
											gridColumn: 'span 3',
											display: 'grid',
											gridTemplateColumns: '1fr 1fr 1fr',
											background: '#10045c',
											color: 'white',
											py: 1.5,
											borderTopLeftRadius: 12,
											borderTopRightRadius: 12,
											fontWeight: 'bold',
										}}
									>
										<Typography>{jugadorBase.name}</Typography>
										<Typography>Estadística</Typography>
										<Typography>{jugadorComparado.name}</Typography>
									</Box>

									{/* Estadísticas comparadas */}
									{orderStats.map((statKey, index) =>
										jugadorBase[statKey] !== undefined &&
										jugadorBase[statKey] !== null &&
										jugadorComparado[statKey] !== undefined &&
										jugadorComparado[statKey] !== null ? (
											<React.Fragment key={statKey}>
												<Typography
													sx={{
														py: 1,
														background: index % 2 === 0 ? '#f9f9f9' : 'white',
														fontWeight:
															parseFloat(jugadorBase[statKey]) >
															parseFloat(jugadorComparado[statKey])
																? 'bold'
																: 'normal',
														color:
															parseFloat(jugadorBase[statKey]) >
															parseFloat(jugadorComparado[statKey])
																? '#10045c'
																: 'inherit',
													}}
												>
													{jugadorBase[statKey]}
												</Typography>
												<Typography
													sx={{
														py: 1,
														fontWeight: 'bold',
														background: index % 2 === 0 ? '#f1f4ff' : '#e9ecf5',
														color: '#10045c',
													}}
												>
													{statKey}
												</Typography>
												<Typography
													sx={{
														py: 1,
														background: index % 2 === 0 ? '#f9f9f9' : 'white',
														fontWeight:
															parseFloat(jugadorComparado[statKey]) >
															parseFloat(jugadorBase[statKey])
																? 'bold'
																: 'normal',
														color:
															parseFloat(jugadorComparado[statKey]) >
															parseFloat(jugadorBase[statKey])
																? '#10045c'
																: 'inherit',
													}}
												>
													{jugadorComparado[statKey]}
												</Typography>
											</React.Fragment>
										) : null,
									)}
								</Box>
							)}

							<Button
								onClick={() => {
									setOpenComparar(false);
									setJugadorBase(null);
									setJugadorComparado(null);
								}}
								variant='contained'
								sx={{
									mt: 3,
									px: 4,
									borderRadius: 3,
									backgroundColor: '#10045c',
									'&:hover': { backgroundColor: '#2b1e80' },
								}}
							>
								Cerrar
							</Button>
						</Box>
					)}
				</DialogContent>
			</Dialog>
			<Snackbar
				open={snack.open}
				autoHideDuration={4000}
				onClose={() => setSnack(s => ({ ...s, open: false }))}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
			>
				<Alert
					onClose={() => setSnack(s => ({ ...s, open: false }))}
					severity={snack.severity}
					variant='filled'
					sx={{ width: '100%' }}
				>
					{snack.text}
				</Alert>
			</Snackbar>
		</Box>
	);
}
