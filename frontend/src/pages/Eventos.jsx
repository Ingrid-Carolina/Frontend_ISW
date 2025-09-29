import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Divider,
  Container,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Typography,
  CardMedia,
  Button,
  IconButton,
  DialogTitle
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import './Eventos.css';
import FeaturedPost from '../components/FeaturedPost';
import { obtenerEventosProximos } from '../pages/eventService';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import fond from '/Images/pilotos.c.jpg';
import { Link } from "react-router-dom";
//import axios from 'axios';
import { api } from '../api/api';

// Función utilitaria para dividir un array en chunks (paginación)
const chunk = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );

// --- Lista de próximos eventos (carousel y grid) ---
const ListaEventos = () => {
  // Estado para eventos, carga, error y página actual
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);

  // Carga los eventos al montar el componente
  useEffect(() => {
    const cargarEventos = async () => {
      try {
        const data = await obtenerEventosProximos();
        setEventos(data);
      } catch (err) {
        setError('Error al cargar los eventos');
      } finally {
        setLoading(false);
      }
    };
    cargarEventos();
  }, []);

  // Muestra spinner mientras carga
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  // Muestra error si falla la carga
  if (error) {
    return (
      <Box mt={4}>
        <Alert severity='error'>{error}</Alert>
      </Box>
    );
  }

  // Configuración de paginación para el carousel
  const pageSize = 4; // cuántas cards por página
  const pages = chunk(eventos, pageSize);
  const total = pages.length || 1;
  const prev = () => setPage(p => Math.max(0, p - 1));
  const next = () => setPage(p => Math.min(total - 1, p + 1));

  // Renderiza grid en móvil/tablet y carousel en desktop
  return (
    <div className="w-full bg-background py-8">
      <div className="container mx-auto px-4">
        <Container sx={{ py: 2, position: 'relative' }}>
          {/* 📱 Móvil/Tablet: grid normal */}
          <Box sx={{ display: { xs: 'block', md: 'none' } }}>
            <Grid container spacing={3}>
              {eventos.map((e) => (
                <Grid item key={e.id} xs={12} sm={6}>
                  <Card
                    sx={{
                      borderRadius: 3,
                      width: 340,
                      minHeight: 450,
                      boxShadow: 3,
                      transition: '0.3s',
                      '&:hover': { boxShadow: 6 },
                    }}
                  >
                    {/* Imagen del evento o inicial si no hay imagen */}
                    {e.img_url ? (
                      <CardMedia
                        component="img"
                        height="160"
                        image={e.img_url}
                        alt={e.titulo}
                        sx={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <Box
                        height={160}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        bgcolor="primary.main"
                        color="white"
                      >
                        <Typography variant="h5">
                          {e.titulo ? e.titulo.charAt(0) : 'E'}
                        </Typography>
                      </Box>
                    )}

                    {/* Contenido de la card */}
                    <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: .5 }}>
                        {e.titulo}
                      </Typography>
                      <Typography variant="subtitle2" color="text.secondary">
                        {new Date(e.fecha).toLocaleDateString('es-ES', {
                          day: 'numeric', month: 'long', year: 'numeric',
                        })}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          mt: 1,
                        }}
                      >
                        📍 {e.lugar}
                      </Typography>

                      <Divider sx={{ my: 2 }} />

                      <Button
                        fullWidth
                        variant="contained"
                        sx={{
                          backgroundColor: '#0c005a',
                          color: 'white',
                          '&:hover': { backgroundColor: '#0a0047' },
                        }}
                      >
                        Ver más
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* 💻 Desktop: carousel de eventos */}
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            {/* Controles de navegación */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <IconButton onClick={prev} disabled={page === 0}>
                <ChevronLeftIcon />
              </IconButton>
              <IconButton onClick={next} disabled={page === total - 1 || total === 0}>
                <ChevronRightIcon />
              </IconButton>
            </Box>

            {/* Viewport del carousel */}
            <Box sx={{ overflow: 'hidden', borderRadius: 2 }}>
              {/* Track de páginas */}
              <Box
                sx={{
                  display: 'flex',
                  width: `${total * 100}%`,
                  transform: `translateX(-${page * (100 / total)}%)`,
                  transition: 'transform .4s ease',
                }}
              >
                {pages.map((group, idx) => (
                  <Box key={idx} sx={{ minWidth: '100%' }}>
                    {/* Cada página en grid 4-columnas */}
                    <Grid container spacing={3}>
                      {group.map((e) => (
                        <Grid item key={e.id} md={3}>
                          <Card
                            sx={{
                              width: 350,
                              height: 380,
                              display: 'flex',
                              flexDirection: 'column',
                              borderRadius: 3,
                              boxShadow: 3,
                              transition: '0.3s',
                              '&:hover': { boxShadow: 6 },
                            }}
                          >
                            {/* Imagen del evento o inicial si no hay imagen */}
                            {e.img_url ? (
                              <CardMedia
                                component="img"
                                height="160"
                                image={e.img_url}
                                alt={e.titulo}
                                sx={{ objectFit: 'cover' }}
                              />
                            ) : (
                              <Box
                                height={160}
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                bgcolor="primary.main"
                                color="white"
                              >
                                <Typography variant="h5">
                                  {e.titulo ? e.titulo.charAt(0) : 'E'}
                                </Typography>
                              </Box>
                            )}

                            {/* Contenido de la card */}
                            <CardContent sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: .5, textAlign: 'center' }}>
                                {e.titulo}
                              </Typography>
                              <Typography variant="subtitle2" color="text.secondary" sx={{ textAlign: 'center' }}>
                                {new Date(e.fecha).toLocaleDateString('es-ES', {
                                  day: 'numeric', month: 'long', year: 'numeric',
                                })}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                  mt: 1,
                                  textAlign: 'center',
                                }}
                              >
                                📍 {e.lugar}
                              </Typography>

                              <Box sx={{ mt: 'auto' }} />
                              <Divider sx={{ my: 2 }} />

                              <Button
                                fullWidth
                                variant="contained"
                                sx={{
                                  backgroundColor: '#0c005a',
                                  color: 'white',
                                  '&:hover': { backgroundColor: '#0a0047' },
                                }}
                              >
                                Ver más
                              </Button>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Dots de paginación */}
            {total > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 2 }}>
                {pages.map((_, i) => (
                  <Box
                    key={i}
                    onClick={() => setPage(i)}
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      cursor: 'pointer',
                      bgcolor: i === page ? '#0c005a' : 'grey.300',
                    }}
                  />
                ))}
              </Box>
            )}
          </Box>
        </Container>
      </div>
    </div>
  );
};

// Componente destacado (no usado en el render principal)
const Featured = () => (
  <FeaturedPost
    title="Inicia la Temporada 2025 con Nuevas Metas y Más Pasión por el Béisbol"
    highlight="la Temporada 2025"
    date="Octubre 3 del 2024"
    style={{ textAlign: 'left', paddingTop: '40px' }}
  />
);

// Componente principal de la página de eventos y noticias
const Eventos = () => {
  // Estado para el filtro de búsqueda
  const [query, setQuery] = useState('');

  // Estados para noticias (tabla noticia)
  const [noticias, setNoticias] = useState([]);
  const [loadingNoticias, setLoadingNoticias] = useState(false);
  const [errorNoticias, setErrorNoticias] = useState(null);

  // Carga las noticias al montar el componente
  useEffect(() => {
    let cancelled = false;

    async function loadNoticias() {
      try {
        setLoadingNoticias(true);
        setErrorNoticias(null);

        const { data } = await api.get('/auth/noticias');

        const lista = Array.isArray(data?.noticias) ? data.noticias : [];

        // Mapea los datos relevantes de cada noticia
        const mapeadas = lista.map((n) => ({
          id: n.id,
          titulo: n.titulo,
          contenido: n.contenido,
          imagen_url: n.imagen_url,
          fecha_publicacion: n.fecha_publicacion,
          autor_id: n.autor_id,
        }));

        if (!cancelled) setNoticias(mapeadas);
      } catch (err) {
        if (!cancelled) {
          setErrorNoticias(
            err?.response?.data?.message || err.message || 'Error cargando noticias'
          );
        }
      } finally {
        if (!cancelled) setLoadingNoticias(false);
      }
    }
    loadNoticias();
    return () => {
      cancelled = true;
    };
  }, []);

  // 🔎 Filtro por título y contenido
  const filteredNews = noticias.filter((n) => {
    const q = query.toLowerCase();
    return (
      (n.titulo || '').toLowerCase().includes(q) ||
      (n.contenido || '').toLowerCase().includes(q)
    );
  });

  // Formatea la fecha de publicación
  const formatFechaPub = (iso) =>
    iso
      ? new Date(iso).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
      : '';

  // Render principal de la página
  return (
    <div style={{ paddingTop: '90px' }}>
      {/* Encabezado con fondo e información */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          minHeight: { xs: '65vh', md: '80vh' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundImage: 'url(https://scontent.ftgu2-3.fna.fbcdn.net/v/t39.30808-6/473273115_1067940641803858_2235185049279648708_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=cc71e4&_nc_eui2=AeFHW3J5TNPCrkMQgDaCzelGvlJfLYtzJu2-Ul8ti3Mm7UBiBwdgHcZMeHZi6fdkWpscjAWuMGwt-vJNq6S0swHG&_nc_ohc=BtV5Z3-M1FAQ7kNvwHxvQj_&_nc_oc=AdlvyixySDeERA22IKz7T1uS-svzMDXGb0u__JKr3bWR3E-lTaLpHqgTRwc2cIEI2ec&_nc_zt=23&_nc_ht=scontent.ftgu2-3.fna&_nc_gid=mdAwa0H1shhD2vRKbrSTBQ&oh=00_AfUQjjZw6obYLb1qRQRl1qJh3jTX6MZbx6pkFmaCoIjcfA&oe=68B01B02)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          py: { xs: 6, md: 8 },
        }}
      >
        {/* Overlay para oscurecer el fondo */}
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to bottom right, rgba(12,0,90,0.85), rgba(0,0,0,0.7))',
          }}
        />

        {/* Contenido del encabezado */}
        <Box
          sx={{
            position: 'relative',
            zIndex: 2,
            textAlign: 'center',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            px: 2,
          }}
        >
          <Typography
            variant='h2'
            sx={{
              fontWeight: 'bold',
              fontSize: { xs: '2.8rem', md: '5rem' },
              fontFamily: 'Varsity, sans-serif',
              textShadow: '2px 2px 6px rgba(0,0,0,0.7)',
              mb: 2,
            }}
          >
            Noticias y Eventos
          </Typography>

          <Typography
            variant='h6'
            sx={{
              maxWidth: 800,
              fontSize: { xs: '1rem', md: '1.3rem' },
              color: 'rgba(255,255,255,0.9)',
              textShadow: '1px 1px 4px rgba(0,0,0,0.6)',
              fontWeight: 300,
            }}
          >
            Mantente al día con las últimas noticias, logros y actividades de la Asociación de Béisbol Menor Pilotos.
          </Typography>
        </Box>
      </Box>

      <Container maxWidth="xl">
        {/* Buscador de noticias */}
        <Box paddingTop="70px" display="flex" alignItems="center" mb={3}>
          <SearchIcon style={{ marginRight: '8px' }} />
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            label="Buscar noticias por título o contenido"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </Box>

        {/*<Featured />*/}
        <Divider style={{ margin: '2rem 0' }} />

        {/* Estado de carga / error / vacío */}
        {loadingNoticias && (
          <div className="loading-wrap">
            <CircularProgress size={24} />
            <span>Cargando noticias…</span>
          </div>
        )}

        {errorNoticias && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorNoticias}
          </Alert>
        )}

        {!loadingNoticias && !errorNoticias && filteredNews.length === 0 && (
          <div className="sin-noticias">No hay noticias por mostrar.</div>
        )}

        {/* Grid de noticias */}
        <Grid container spacing={3} justifyContent="center">
          {[...filteredNews]
            .sort((a, b) => new Date(b.fecha_publicacion) - new Date(a.fecha_publicacion))
            .map((n) => (
              <Grid item xs={12} sm={6} md={4} key={n.id}>
                <Card
                  sx={{
                    width: 350,
                    minHeight: 450,
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 3,
                    boxShadow: 3,
                    transition: "0.3s",
                    "&:hover": { boxShadow: 6 },
                    mb: { xs: 2, md: 0 },
                  }}
                >
                  {/* Imagen de la noticia */}
                  <CardMedia
                    component="img"
                    height="160"
                    image={n.imagen_url || "/placeholder.jpg"}
                    alt={n.titulo}
                  />

                  {/* Contenido flexible */}
                  <CardContent sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
                    <Box display="flex" flexDirection="column" flex={1}>
                      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                        {n.titulo}
                      </Typography>
                      <Typography variant="subtitle2" color="text.secondary">
                        {formatFechaPub(n.fecha_publicacion)}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          mt: 1,
                        }}
                      >
                        {n.contenido}
                      </Typography>

                      {/* Empuja el botón hacia abajo */}
                      <Box sx={{ flexGrow: 1 }} />

                      <Divider sx={{ my: 2 }} />

                      <Button
                        fullWidth
                        variant="contained"
                        component={Link}
                        to={`/noticia/${n.id}`}   // 🔹 Enlaza al detalle dinámico
                        sx={{
                          backgroundColor: "#0c005a",
                          color: "white",
                          "&:hover": { backgroundColor: "#0a0047" },
                        }}
                      >
                        Ver más
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
        </Grid>

        {/* Lista de próximos eventos */}
        <div className="eventos-container" style={{ paddingTop: '2rem' }}>
          <h1 className="eventos-titulo" style={{ fontFamily: 'GroteskBold' }}>
            Próximos Eventos
          </h1>
          <ListaEventos />
        </div>
      </Container>
    </div>
  );
};

export default Eventos;
