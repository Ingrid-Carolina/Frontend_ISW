import React, { useState, useEffect } from 'react';
import MediaCard from '../components/Card';
import {
  Box,
  TextField,
  Divider,
  Container,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import './Eventos.css';
import FeaturedPost from '../components/FeaturedPost';
import Post from '../components/Post';
import { obtenerEventosProximos } from '../pages/eventService';

// Lista de eventos estáticos (solo para noticias/noticias filtradas)
const eventosNoticias = [
  {
    fecha: '2025-07-10',
    titulo: 'Clínica de Béisbol Infantil en San Pedro Sula',
    lugar: 'Estadio Chochi Sosa, San Pedro Sula, Honduras',
    hora: 'Julio 10 @ 9:00 am - 1:00 pm',
    image: '/Images/clinicaSps.jpg',
  },
  {
    fecha: '2025-05-30',
    titulo: '2025 Central Region Tournament Preparation Umpire Clinic',
    lugar: '7185 S. Indianapolis Road, Whitestown, IN',
    hora: 'May 30 @ 1:00 pm - June 1 @ 12:00 pm',
    image: '/Images/equipo.jpg',
  },
  {
    fecha: '2025-08-05',
    titulo: 'Capacitación para Entrenadores y Voluntarios de Little League®',
    lugar: 'Centro Deportivo FAH, Tegucigalpa, Honduras',
    hora: 'Agosto 5 @ 2:00 pm - 6:00 pm',
    image: '/Images/capcitacion.jpg',
  },
  {
    fecha: '2025-06-15',
    titulo: 'Entrenamiento Regional de Verano',
    lugar: 'Tegucigalpa, Honduras',
    hora: 'June 15 @ 10:00 am - 4:00 pm',
    image: '/Images/equipo2.jpg',
  },
];

//  Componente para mostrar la lista de próximos eventos desde el backend
const ListaEventos = () => {
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    const cargarEventos = async () => {
      const proximos = await obtenerEventosProximos(3); // 3 más cercanos
      setEventos(proximos);
    };
    cargarEventos();
  }, []);

  if (eventos.length === 0) {
    return (
      <div
        style={{
          color: '#e06c14',
          textAlign: 'center',
          fontFamily: 'GroteskBold',
          padding: '2rem',
          fontSize: '1.2rem',
        }}
      >
        No hay eventos actuales
      </div>
    );
  }

  // Formateador de fecha estilo calendario
  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
      {eventos.map((evento, index) => (
        <li
          key={evento.id || index}
          style={{
            backgroundColor: '#fff',
            color: '#000',
            border: '1px solid #ddd',
            borderRadius: '6px',
            padding: '10px',
            marginBottom: '8px',
            boxShadow: '0px 2px 5px rgba(0,0,0,0.1)',
          }}
        >
          <div
            style={{
              fontFamily: 'GroteskBold',
              fontSize: '1.1rem',
              marginBottom: '4px',
            }}
          >
            {evento.titulo}
          </div>
          <div style={{ fontSize: '0.9rem', color: '#555' }}>
            {formatFecha(evento.fecha)}
          </div>
          {evento.lugar && (
            <div style={{ fontSize: '0.9rem', color: '#333' }}>
              {evento.lugar}
            </div>
          )}
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

  const filteredEvents = eventosNoticias.filter((e) =>
    e.titulo.toLowerCase().includes(query.toLowerCase())
  );

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
            label="Buscar eventos y/o noticias"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </Box>

        <Featured />
        <Divider style={{ margin: '2rem 0' }} />

        {/* Lista de noticias */}
        {filteredEvents.map((evento, index) => (
          <div key={index}>
            <Post
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

      {/*Lista de próximos eventos */}
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
