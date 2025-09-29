import React, { useState, useEffect } from 'react';
// Importa el componente para mostrar testimonios individuales
import TestimonioCapsula from '../../components/TestimonioCapsula';
// Importa el cliente API personalizado
import { api } from '../../api/api';
// Importa componentes de Material UI para la interfaz
import { Grid, Box, Typography, TextField, Button, Stack, Divider } from '@mui/material';

// Componente principal para gestionar testimonios
const ManageTestimonios = () => {
  // Estados para los campos del formulario
  const [nombre, setNombre] = useState('');
  const [contenido, setContenido] = useState('');
  const [imagen, setImagen] = useState('');
  // Estado para la lista de testimonios
  const [testimonios, setTestimonios] = useState([]);
  // Estado para modo edición y el índice seleccionado
  const [modoEdicion, setModoEdicion] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  // Estados para el banner de mensajes (éxito/error)
  const [bannerMsg, setBannerMsg] = useState('');
  const [bannerType, setBannerType] = useState('success'); // 'success' o 'error'
  const [showBanner, setShowBanner] = useState(false);

  // Función para registrar un nuevo testimonio en el backend
  const realizarPeticion = async () => {
    const url = `/auth/registrartestimonio`;
    const body = {
      nombre: nombre,
      contenido: contenido,
      imagen: imagen,
    };

    try {
      // Envía el testimonio al backend
      const res = await api.post(url, body, {
        headers: { "Content-Type": "application/json" }
      });
      // Muestra mensaje de éxito en el banner
      setBannerMsg(res.data.mensaje)
      setBannerType('success');
      setShowBanner(true);
      setTimeout(() => setShowBanner(false), 4000);
      return res.data;
    } catch (error) {
      // Muestra mensaje de error en el banner
      const msg =
        error?.data?.mensaje || error?.message || 'Error en la Red';
      setBannerMsg(msg);
      setBannerType('error');
      setShowBanner(true);
      setTimeout(() => setShowBanner(false), 4000);
      throw error;
    }
  };

  // useEffect para cargar los testimonios al montar el componente
  useEffect(() => {
    const fetchTestimonios = async () => {
      try {
        // Obtiene los testimonios del backend
        const res = await api.get('/auth/obtenertestimonios');
        const testimonios = res.data;
        // Formatea los testimonios para el frontend
        const testimoniosLista = testimonios.map(testimonio => ({
          id: testimonio.id_testimonio,
          nombre: testimonio.nombre,
          contenido: testimonio.contenido,
          imagen: testimonio.imagen,
        }));
        setTestimonios(testimoniosLista);
        console.log(testimonios);
      } catch (err) {
        console.error('Error al obtener testimonios:', err);
      }
    };
    fetchTestimonios();
  }, []);

  // Función para agregar un nuevo testimonio
  const handleAgregar = async () => {
    if (!nombre || !contenido) return
    else
      await realizarPeticion();

    // Limpia los campos del formulario
    setNombre('');
    setContenido('');
    setImagen('');
    // Recarga la página para actualizar la lista
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  // Función para eliminar un testimonio
  const handleEliminar = async (index) => {
    try {
      const id = testimonios[index].id;
      const url = `/auth/testimonio/${id}`;
      const res = await api.delete(url);
      console.log(id);

      // Muestra mensaje de éxito en el banner
      setBannerMsg(res.data.mensaje)
      setBannerType('success');
      setShowBanner(true);
      setTimeout(() => setShowBanner(false), 4000);

      window.scrollTo(0, 0);

      // Elimina el testimonio de la lista local
      const nuevaLista = [...testimonios];
      nuevaLista.splice(index, 1);
      setTestimonios(nuevaLista);
    } catch (error) {
      // Muestra mensaje de error en el banner
      const msg =
        error?.data?.mensaje || error?.message || 'Error en la Red'
      setBannerMsg(msg)
      setBannerType('error');
      setShowBanner(true);
      setTimeout(() => setShowBanner(false), 4000);
      console.error("Error eliminando testimonio:", error);
    }
  };

  // Prepara el formulario para editar un testimonio existente
  const ActualizarContainer = (index) => {
    const testimonio = testimonios[index];
    setNombre(testimonio.nombre);
    setContenido(testimonio.contenido);
    setImagen(testimonio.imagen);
    setModoEdicion(true);
    setSelectedIndex(index);
    console.log("El index es" + " " + selectedIndex);
  }

  // Función para modificar un testimonio existente
  const handleModificar = async (index) => {
    try {
      const id = testimonios[index].id;
      const url = `/auth/testimonio/${id}`;
      const updatedbody = {
        nombre: nombre,
        contenido: contenido,
        imagen: imagen,
      };
      // Envía la actualización al backend
      const res = await api.put(url, updatedbody, {
        headers: { "Content-Type": "application/json" }
      });
      console.log(id);

      // Muestra mensaje de éxito en el banner
      setBannerMsg(res.data.mensaje)
      setBannerType('success');
      setShowBanner(true);
      setTimeout(() => setShowBanner(false), 4000);
    } catch (error) {
      // Muestra mensaje de error en el banner
      const mensaje = error?.data?.mensaje || error?.message || 'Error en la Red'
      console.log(error);
      console.error("Error modificando testimonio:", error);
      setBannerMsg(mensaje)
      setBannerType('error');
      setShowBanner(true);
      setTimeout(() => setShowBanner(false), 4000);
      throw error;
    }
    // Limpia los campos del formulario
    setNombre('');
    setContenido('');
    setImagen('');
    // Recarga la página para actualizar la lista
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  // Renderizado del componente
  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      {/* Título principal */}
      <Typography
        variant="h3"
        sx={{
          fontFamily: 'GroteskBold',
          color: '#10045c',
          marginTop: '50px',
          mb: 4,
          textAlign: 'center',
          fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
        }}
      >
        Gestión de Testimonios
      </Typography>

      {/* Formulario para agregar o modificar testimonios */}
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
          onClick={modoEdicion ? () => handleModificar(selectedIndex) : handleAgregar}
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
          {modoEdicion ? 'Modificar Testimonio' : 'Agregar Testimonio'}
        </Button>
      </Stack>

      {/* Banner para mostrar mensajes de éxito o error */}
      {showBanner && (
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            mb: 2,
            animation: 'slideDown 0.3s ease-in-out',
            backgroundColor: bannerType === 'error' ? '#f44336' : '#4caf50',
            color: '#fff',
            borderRadius: 1,
            p: 1,
            boxShadow: 2,
          }}
        >
          <Typography sx={{ fontWeight: 'bold' }}>{bannerMsg}</Typography>
        </Box>
      )}

      <Divider sx={{ mb: 3 }} />

      {/* Vista previa del testimonio que se está editando/agregando */}
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
        {/* Mensaje si no hay testimonios guardados */}
        {testimonios.length === 0 && (
          <Typography
            variant="body1"
            sx={{ fontFamily: 'ManropeEB', color: '#555' }}
          >
            No hay testimonios guardados todavía.
          </Typography>
        )}

        {/* Renderiza cada testimonio guardado con botones para eliminar o modificar */}
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
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => { ActualizarContainer(index) }}
              sx={{ mt: 1, fontFamily: 'ManropeEB' }}
            >
              Modificar
            </Button>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default ManageTestimonios;
