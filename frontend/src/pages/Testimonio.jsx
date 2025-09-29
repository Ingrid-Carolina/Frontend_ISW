import React, { useState, useRef, useEffect } from 'react';
import {
	Box,
	Typography,
	CircularProgress,
	Alert,
	useTheme,
	useMediaQuery,
	Snackbar,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	IconButton,
	Tooltip,
	LinearProgress,
	Button,
	TextField,
} from '@mui/material';
import TestimonioTrapezoide from '../components/TestimonioTrapezoide';
import VidCarousel from '../components/VideoCarousel';
import { api } from '../api/api';
import EditIcon from '@mui/icons-material/Edit';
import fondoDefault from '/Images/TestimonioFondo1.jpg';

const videos = [
	{ url: 'https://youtu.be/CSfEwT8x6B0?si=OJpKv5GCK71caBu6' },
	{ url: 'https://youtu.be/7AU0m2Du_VY?si=LTod5L0RJbvHzoPS' },
	{ url: 'https://youtu.be/bx242zV3_ME?si=9_1EAN8m6DVhIagp' },
];

const PaginaTestimonios = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // ======== ESTADOS PARA HEADER ========
  const [headerUrl, setHeaderUrl] = useState(null);
  const [headerTitle, setHeaderTitle] = useState('Historias que inspiran.');
  const [isAdmin, setIsAdmin] = useState(false);

  // ======== MODAL DE HEADER ========
  const [openHeaderEdit, setOpenHeaderEdit] = useState(false);
  const [headerTitleInput, setHeaderTitleInput] = useState('Historias que inspiran.');
  const [headerFile, setHeaderFile] = useState(null);
  const [headerUploading, setHeaderUploading] = useState(false);
  const [headerError, setHeaderError] = useState('');
  const [headerPreview, setHeaderPreview] = useState(null);

  // ======== SNACKBAR ========
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarType, setSnackbarType] = useState('success');
  const [snackbarMsg, setSnackbarMsg] = useState('');

  // ======== TESTIMONIOS ========
  const [testimonios, setTestimonios] = useState([]);
  const [testimoniosDestacados, setTestimoniosDestacados] = useState([]);
  const [testimoniosNormales, setTestimoniosNormales] = useState([]);
  const roles = [
    'Jugador Profesional – Categoría Infantil',
    'Jugador Profesional – Categoría Intermedia',
    'Jugador Profesional – Categoría Juvenil',
    'Madre de jugador – Categoría Juvenil',
  ];

  // Preview local del archivo seleccionado
  useEffect(() => {
    if (!headerFile) {
      setHeaderPreview(null);
      return;
    }
    const url = URL.createObjectURL(headerFile);
    setHeaderPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [headerFile]);

  // Comprobar rol (para mostrar botón "editar")
  useEffect(() => {
    const checkRole = async () => {
      try {
        const r = await api.get('/auth/obtenerperfil', {
          withCredentials: true,
          skipAuthRedirect: true,
        });
        const p = Array.isArray(r.data) ? r.data[0] : r.data;
        const role = String(p?.rol || '').toLowerCase();
        setIsAdmin(role === 'admin');
      } catch {
        setIsAdmin(false);
      }
    };
    checkRole();

    const onAuthRefresh = () => checkRole();
    window.addEventListener('auth:refresh', onAuthRefresh);
    return () => window.removeEventListener('auth:refresh', onAuthRefresh);
  }, []);

  // Cargar info de testimonios (header_title)
  useEffect(() => {
    const fetchTestimoniosSite = async () => {
      try {
        const res = await api.get('/auth/testimoniossite', { skipAuthRedirect: true });
        const payload = res?.data ?? null;
        if (payload?.header_title) setHeaderTitle(String(payload.header_title));
      } catch (e) {
        console.log('No se pudo cargar /testimoniossite:', e.message);
      }
    };
    fetchTestimoniosSite();
  }, []);

  // Cargar imagen del header
  useEffect(() => {
    const loadHeader = async () => {
      try {
        const res = await api.get('/auth/testimoniosimages');
        const rows = Array.isArray(res.data) ? res.data : [];
        const row = rows.find(
          r => String(r.type).toLowerCase() === 'testimonios_header',
        );
        setHeaderUrl(row?.url || null);
      } catch (err) {
        console.error('Error cargando testimonios_header:', err?.message || err);
      }
    };
    loadHeader();
  }, []);

  // Cargar testimonios y separar destacados de normales
  useEffect(() => {
    const fetchTestimonios = async () => {
      try {
        const res = await api.get('/auth/obtenertestimonios');
        const testimoniosData = res.data;
        
        const testimoniosLista = testimoniosData.map(testimonio => ({
          id: testimonio.id_testimonio,
          nombre: testimonio.nombre,
          cita: testimonio.contenido,
          imagen: testimonio.imagen,
          is_featured: testimonio.is_featured
        }));

        setTestimonios(testimoniosLista);
        
        // Separar testimonios destacados de normales
        const destacados = testimoniosLista.filter(t => t.is_featured);
        const normales = testimoniosLista.filter(t => !t.is_featured);
        
        setTestimoniosDestacados(destacados);
        setTestimoniosNormales(normales);
      } catch (err) {
        console.error('Error al obtener testimonios:', err);
      }
    };
    fetchTestimonios();
  }, []);

  // ... resto de funciones se mantienen igual (openHeaderEditor, saveHeader, etc.)

  return (
    <div style={{ overflowX: 'hidden' }}>
      {/* ENCABEZADO CON SISTEMA DE EDICIÓN COMPLETO */}
      {/* ... header se mantiene igual ... */}

      {/* SECCIÓN TESTIMONIOS DESTACADOS - Solo se muestra si hay destacados */}
      {testimoniosDestacados.length > 0 && (
        <Box sx={{ py: 6, backgroundColor: '#f1f5fb' }}>
          <Typography
            variant='h4'
            sx={{
              fontFamily: 'Varsity, sans-serif',
              fontWeight: 'bold',
              fontSize: isSmallScreen ? '1.8rem' : '4rem',	
              color: '#c65402',
              textAlign: 'center',
              mb: 4,
            }}
          >
            Testimonios Destacados
          </Typography>

          {/* Mostrar todos los testimonios destacados */}
          {testimoniosDestacados.map((testimonio, index) => {
            const invertir = index % 2 === 1;
            const superponer = index !== 0;
            const invertirDiagonal = index % 2 === 0;
            const zIndex = 9 - (index % 9);
            const rol = roles[Math.floor(Math.random() * roles.length)];

            return (
              <TestimonioTrapezoide
                key={`destacado-${testimonio.id}`}
                {...testimonio}
                rol={rol}
                invertir={invertir}
                superponer={superponer}
                invertirDiagonal={invertirDiagonal}
                colorFondo={index % 2 === 0 ? '#c65402' : '#044c94'}
                zIndex={zIndex}
                finalTest={index === testimoniosDestacados.length - 1}
                esDestacado={true}
              />
            );
          })}
        </Box>
      )}

      {/* TESTIMONIOS NORMALES */}
      {testimoniosNormales.map((testimonio, index) => {
        const invertir = index % 2 === 1;
        const superponer = index !== 0;
        const invertirDiagonal = index % 2 === 0;
        const zIndex = 9 - (index % 9);
        const rol = roles[Math.floor(Math.random() * roles.length)];

        return (
          <TestimonioTrapezoide
            key={testimonio.id}
            {...testimonio}
            rol={rol}
            invertir={invertir}
            superponer={superponer}
            invertirDiagonal={invertirDiagonal}
            colorFondo={index % 2 === 0 ? '#c65402' : '#044c94'}
            zIndex={zIndex}
            finalTest={index === testimoniosNormales.length - 1}
            esDestacado={false}
          />
        );
      })}

      {/* SECCIÓN VIDEOS */}
      <Box sx={{ py: 6, backgroundColor: '#f1f5fb' }}>
        <Typography
          variant='h4'
          sx={{
            fontFamily: 'Varsity, sans-serif',
            fontWeight: 'bold',
            fontSize: isSmallScreen ? '1.8rem' : '3rem',	
            color: '#002c6c',
            textAlign: 'center',
            mb: 4,
          }}
        >
          Testimonios en Video
        </Typography>
        <VidCarousel videos={videos} />
      </Box>

			{/* SNACKBAR FEEDBACK */}
			<Snackbar
				open={openSnackbar}
				autoHideDuration={4000}
				onClose={() => setOpenSnackbar(false)}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
			>
				<Alert
					onClose={() => setOpenSnackbar(false)}
					severity={snackbarType}
					variant='filled'
					sx={{ width: '100%' }}
				>
					{snackbarMsg}
				</Alert>
			</Snackbar>

			{/* MODAL EDITAR HEADER (título + imagen) */}
			<Dialog
				open={openHeaderEdit}
				onClose={() => !headerUploading && setOpenHeaderEdit(false)}
				maxWidth='sm'
				fullWidth
			>
				<DialogTitle>Editar encabezado de Testimonios</DialogTitle>
				<DialogContent
					dividers
					sx={{
						pt: 1.5,
						pb: 2,
						px: 2,
					}}
				>
					{headerUploading && <LinearProgress sx={{ mb: 2 }} />}
					
					<TextField
						label='Título del header'
						value={headerTitleInput}
						onChange={e => setHeaderTitleInput(e.target.value)}
						fullWidth
						size='small'
						margin='dense'
						InputLabelProps={{ shrink: true }}
						sx={{
							'& .MuiOutlinedInput-root': { borderRadius: 1.2 },
						}}
					/>

					<Button
						variant='contained'
						component='label'
						disabled={headerUploading}
						sx={{ mt: 2, fontWeight: 'bold', textTransform: 'none' }}
					>
						{headerFile ? 'Imagen seleccionada' : 'Seleccionar nueva imagen'}
						<input
							type='file'
							hidden
							accept='image/jpeg,image/png,image/webp,image/avif'
							onChange={e => {
								const f = e.target.files?.[0] || null;
								setHeaderFile(f);
							}}
						/>
					</Button>
					<Box sx={{ mt: 1, opacity: 0.8, fontSize: 12 }}>
						Formatos: JPG, PNG, WEBP, AVIF. Máx. 8 MB.
					</Box>

					{/* Vista previa */}
					<Box sx={{ mt: 2, textAlign: 'center' }}>
						<Typography sx={{ fontSize: 13, mb: 1, color: 'text.secondary' }}>
							Vista previa
						</Typography>

						<Box
							sx={{
								width: { xs: 'min(85vw, 150px)', sm: 300 },
								mx: 'auto',
								border: '1px solid',
								borderColor: 'divider',
								borderRadius: 1.5,
								overflow: 'hidden',
								position: 'relative',
								pt: '30%',
								bgcolor: '#f7f7f7',
								boxShadow: 1,
							}}
						>
							<Box
								component='img'
								src={headerPreview || headerUrl || fondoDefault}
								alt='Vista previa del encabezado'
								sx={{
									position: 'absolute',
									inset: 0,
									width: '100%',
									height: '100%',
									objectFit: 'cover',
								}}
							/>
						</Box>

						{headerFile && (
							<Box
								sx={{
									mt: 1,
									display: 'flex',
									gap: 1,
									justifyContent: 'center',
								}}
							>
								<Button
									size='small'
									onClick={() => {
										setHeaderFile(null);
										setHeaderPreview(null);
									}}
								>
									Quitar selección
								</Button>
							</Box>
						)}
					</Box>

					{headerError && (
						<Alert severity='error' sx={{ mt: 2 }}>
							{headerError}
						</Alert>
					)}
				</DialogContent>

				<DialogActions>
					<Button
						onClick={() => {
							setOpenHeaderEdit(false);
							setHeaderFile(null);
							setHeaderPreview(null);
						}}
						disabled={headerUploading}
					>
						Cancelar
					</Button>
					<Button
						onClick={saveHeader}
						variant='contained'
						disabled={headerUploading}
					>
						Guardar
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

export default PaginaTestimonios;