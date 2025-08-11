import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Divider,
  Container,
  Alert,
  CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import './Eventos.css';
import FeaturedPost from '../components/FeaturedPost';
import { obtenerEventosProximos } from '../pages/eventService';
import axios from 'axios';

// ❗ Evita doble slash al construir URLs
const baseUrl = 'http://localhost:3000';

// --- Lista de próximos eventos (como lo tenías) ---
const ListaEventos = () => {
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    const cargarEventos = async () => {
      const proximos = await obtenerEventosProximos(3);
      setEventos(proximos);
    };
    cargarEventos();
  }, []);

  if (eventos.length === 0) {
    return (
      <div className="sin-eventos">No hay eventos actuales</div>
    );
  }

  const formatFecha = (fecha) =>
    new Date(fecha).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

  return (
    <ul className="lista-eventos">
      {eventos.map((evento, index) => (
        <li key={evento.id || index} className="evento-item">
          <div className="evento-titulo">{evento.titulo}</div>
          <div className="evento-fecha">{formatFecha(evento.fecha)}</div>
          {evento.lugar && <div className="evento-lugar">{evento.lugar}</div>}
        </li>
      ))}
    </ul>
  );
};

const Featured = () => (
  <FeaturedPost
    title="Inicia la Temporada 2025 con Nuevas Metas y Más Pasión por el Béisbol"
    highlight="la Temporada 2025"
    date="Octubre 3 del 2024"
    style={{ textAlign: 'left', paddingTop: '40px' }}
  />
);

const Eventos = () => {
  const [query, setQuery] = useState('');

  // Estados reales para NOTICIAS (tabla noticia)
  const [noticias, setNoticias] = useState([]);
  const [loadingNoticias, setLoadingNoticias] = useState(false);
  const [errorNoticias, setErrorNoticias] = useState(null);

  useEffect(() => {
    let cancel;
    async function loadNoticias() {
      try {
        setLoadingNoticias(true);
        setErrorNoticias(null);

        // Devuelve { noticias: [...] }
        const { data } = await axios.get(`${baseUrl}/auth/noticias`, {
          cancelToken: new axios.CancelToken((c) => (cancel = c)),
        });

        const lista = Array.isArray(data?.noticias) ? data.noticias : [];

        // Normaliza a tus props
        const mapeadas = lista.map((n) => ({
          id: n.id,
          titulo: n.titulo,
          contenido: n.contenido,
          imagen_url: n.imagen_url,
          fecha_publicacion: n.fecha_publicacion,
          autor_id: n.autor_id,
        }));

        setNoticias(mapeadas);
      } catch (err) {
        if (axios.isCancel(err)) return;
        setErrorNoticias(err?.response?.data?.message || err.message || 'Error cargando noticias');
      } finally {
        setLoadingNoticias(false);
      }
    }
    loadNoticias();
    return () => cancel && cancel();
  }, []);

  // 🔎 Filtro por título y contenido
  const filteredNews = noticias.filter((n) => {
    const q = query.toLowerCase();
    return (
      (n.titulo || '').toLowerCase().includes(q) ||
      (n.contenido || '').toLowerCase().includes(q)
    );
  });

  const formatFechaPub = (iso) =>
    iso
      ? new Date(iso).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
      : '';

  return (
    <div style={{ paddingTop: '90px' }}>
      <div className="event-header">
        <div className="event-header-title">
          <p>NOTICIAS Y EVENTOS</p>
        </div>
      </div>

      <Container maxWidth="md">
        {/* Buscador */}
        <Box paddingTop="90px" display="flex" alignItems="center" mb={3}>
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

        <Featured />
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

        {/* Grid de noticias  */}
        <div className="noticia-grid">
          {([...filteredNews]
            .sort((a, b) => new Date(b.fecha_publicacion) - new Date(a.fecha_publicacion))
            .slice(0, 3)
          ).map((n) => (
            <article key={n.id} className="noticia-card-horizontal">
              {n.imagen_url && (
                <div className="noticia-img-wrap-horizontal">
                  <img src={n.imagen_url} alt={n.titulo} className="noticia-img-horizontal" />
                </div>
              )}

              <div className="noticia-body-horizontal">
                <h3 className="noticia-title-horizontal">{n.titulo}</h3>
                <div className="noticia-meta-horizontal">
                  <span className="noticia-fecha-horizontal">
                    {formatFechaPub(n.fecha_publicacion)}
                  </span>
                </div>
                <p className="noticia-contenido-horizontal">{n.contenido}</p>
              </div>
            </article>
          ))}
        </div>

      </Container>

      {/* Lista de próximos eventos */}
      <div className="eventos-container" style={{ paddingTop: '2rem' }}>
        <h1 className="eventos-titulo" style={{ fontFamily: 'GroteskBold' }}>
          Próximos Eventos
        </h1>
        <ListaEventos />
      </div>
    </div>
  );
};

export default Eventos;
