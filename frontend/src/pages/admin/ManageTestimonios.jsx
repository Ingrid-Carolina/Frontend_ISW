import React, { useState, useEffect } from 'react';
import TestimonioCapsula from '../../components/TestimonioCapsula';

import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Divider
} from '@mui/material';

const ManageTestimonios = () => {
  const [nombre, setNombre] = useState('');
  const [contenido, setContenido] = useState('');
  const [imagen, setImagen] = useState('');
  const [testimonios, setTestimonios] = useState([]);

  // Cargar desde localStorage
  useEffect(() => {
    const data = localStorage.getItem('testimonios');
    if (data) {
      setTestimonios(JSON.parse(data));
    }
  }, []);

  // Guardar en localStorage al actualizar lista
  useEffect(() => {
    localStorage.setItem('testimonios', JSON.stringify(testimonios));
  }, [testimonios]);

  const handleAgregar = () => {
    if (!nombre || !contenido) return;
    const nuevo = { nombre, contenido, imagen };
    setTestimonios([...testimonios, nuevo]);
    setNombre('');
    setContenido('');
    setImagen('');
  };

  const handleEliminar = (index) => {
    const nuevaLista = [...testimonios];
    nuevaLista.splice(index, 1);
    setTestimonios(nuevaLista);
  };

  return (
    <Box sx={{ p: 4, backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <Typography
        variant="h3"
        sx={{
          fontFamily: 'Varsity',
          color: '#10045c',
          mb: 4,
          textAlign: 'center'
        }}
      >
        Gestión de Testimonios
      </Typography>

      {/* Formulario */}
      <Stack spacing={2} sx={{ mb: 4 }}>
        <TextField
          label="Nombre del niño o niña"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          fullWidth
          InputLabelProps={{ style: { fontFamily: 'GroteskBold' } }}
          inputProps={{ style: { fontFamily: 'ManropeEB' } }}
        />
        <TextField
          label="Testimonio"
          multiline
          rows={4}
          value={contenido}
          onChange={(e) => setContenido(e.target.value)}
          fullWidth
          InputLabelProps={{ style: { fontFamily: 'GroteskBold' } }}
          inputProps={{ style: { fontFamily: 'ManropeEB' } }}
        />
        <TextField
          label="URL de Imagen (opcional)"
          value={imagen}
          onChange={(e) => setImagen(e.target.value)}
          fullWidth
          InputLabelProps={{ style: { fontFamily: 'GroteskBold' } }}
          inputProps={{ style: { fontFamily: 'ManropeEB' } }}
        />
        <Button
          variant="contained"
          onClick={handleAgregar}
          sx={{
            backgroundColor: '#10045c',
            fontFamily: 'GroteskBold',
            '&:hover': {
              backgroundColor: '#1a067a'
            },
            width: 'fit-content',
            alignSelf: 'flex-start'
          }}
        >
          Agregar Testimonio
        </Button>
      </Stack>

      <Divider sx={{ mb: 3 }} />

      {/* Vista previa del último testimonio */}
      {nombre || contenido || imagen ? (
        <>
          <Typography
            variant="h5"
            sx={{
              fontFamily: 'GroteskBold',
              color: '#10045c',
              mb: 2
            }}
          >
            Vista previa del testimonio:
          </Typography>
          <TestimonioCapsula
            nombre={nombre || 'Nombre'}
            contenido={contenido || 'Testimonio...'}
            imagen={imagen}
          />
          <Divider sx={{ my: 4 }} />
        </>
      ) : null}

      {/* Lista de testimonios actuales */}
      <Typography
        variant="h5"
        sx={{
          fontFamily: 'GroteskBold',
          color: '#10045c',
          mb: 2
        }}
      >
        Testimonios guardados:
      </Typography>

      <Stack spacing={3}>
        {testimonios.length === 0 && (
          <Typography
            variant="body1"
            sx={{ fontFamily: 'ManropeEB', color: '#555' }}
          >
            No hay testimonios guardados todavía.
          </Typography>
        )}
        {testimonios.map((t, index) => (
          <Box key={index}>
            <TestimonioCapsula
              nombre={t.nombre}
              contenido={t.contenido}
              imagen={t.imagen}
            />
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => handleEliminar(index)}
              sx={{ mt: 1, fontFamily: 'ManropeEB' }}
            >
              Eliminar
            </Button>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default ManageTestimonios;
