import React, { useState, useEffect } from 'react';
import TestimonioCapsula from '../../components/TestimonioCapsula';
//import axios from 'axios';
import { api } from '../../api/api';
import { Grid } from '@mui/material';

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
  const [modoEdicion, setModoEdicion] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [bannerMsg, setBannerMsg] = useState('');
const [bannerType, setBannerType] = useState('success'); // or 'error'
const [showBanner, setShowBanner] = useState(false);


  const realizarPeticion = async () => {
    const url = `/auth/registrartestimonio`;

    const body = {
      nombre: nombre,
      contenido: contenido,
      imagen: imagen,
    };

    try {
      const res = await api.post(url, body, {
        headers: { "Content-Type": "application/json" }
      });
      setBannerMsg(res.data.mensaje)
            setBannerType('success');
            setShowBanner(true);

        
        setTimeout(() => setShowBanner(false), 4000); 

        return res.data;

    } catch (error) {
      // Compatible con interceptor (error.message) y con respuestas crudas (error.response)
     const msg =
    error?.data?.mensaje|| error?.message|| 'Error en la Red'; 
   
            setBannerMsg(msg);
            setBannerType('error');
            setShowBanner(true);
            setTimeout(() => setShowBanner(false), 4000);
            throw error;
            

    }
  };

  // Cargar desde localStorage
  useEffect(() => {
    const fetchTestimonios = async () => {
      try {
        const res = await api.get('/auth/obtenertestimonios');
        const testimonios = res.data; //estoy trasladando a testimonios el fetch de la tabla del formato JSON sended del res en Authcontroller



        const testimoniosLista = testimonios.map(testimonio => ({ //transformo my res.data en un array que el frontend pueda leer
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

  const handleAgregar = async () => {
    if (!nombre || !contenido) return
    else
      await realizarPeticion();

    setNombre('');
    setContenido('');
    setImagen('');

    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleEliminar = async (index) => {
    try {

      const id = testimonios[index].id;
      const url = `/auth/testimonio/${id}`;
      const res = await api.delete(url);
      console.log(id);

       setBannerMsg(res.data.mensaje)
            setBannerType('success');
            setShowBanner(true);
            setTimeout(() => setShowBanner(false), 4000);

            window.scrollTo(0,0);


      const nuevaLista = [...testimonios];
      nuevaLista.splice(index, 1);
      setTestimonios(nuevaLista);
    } catch (error) {
      const msg =
        error?.data?.mensaje|| error?.message|| 'Error en la Red'
    
                setBannerMsg(msg)
            setBannerType('error');
            setShowBanner(true);
setTimeout(() => setShowBanner(false), 4000);
      console.error("Error eliminando testimonio:", error);
    }

  };

  const ActualizarContainer = (index) => {
    const testimonio = testimonios[index];
    setNombre(testimonio.nombre);
    setContenido(testimonio.contenido);
    setImagen(testimonio.imagen);
    setModoEdicion(true);
    setSelectedIndex(index);
    console.log("El index es" + " " + selectedIndex);

  }



  const handleModificar = async (index) => {
    try {

      const id = testimonios[index].id;

      const url = `/auth/testimonio/${id}`;

      const updatedbody = {
        nombre: nombre,
        contenido: contenido,
        imagen: imagen,

      };

      const res = await api.put(url, updatedbody, {
        headers: { "Content-Type": "application/json" }
      });

      console.log(id);

    setBannerMsg(res.data.mensaje)
            setBannerType('success');
            setShowBanner(true);

        setTimeout(() => setShowBanner(false), 4000); 


    } catch (error) {

      const mensaje= error?.data?.mensaje|| error?.message|| 'Error en la Red'
      console.log(error);
      console.error("Error modificando testimonio:", error);
         setBannerMsg(mensaje)
            setBannerType('error');
            setShowBanner(true);
       setTimeout(() => setShowBanner(false), 4000); 
        throw error;

    }
    setNombre('');
    setContenido('');
    setImagen('');

    setTimeout(() => {
      window.location.reload();
    }, 1000);



  };


  return (
    <Box sx={{  p: { xs: 2, sm: 3, md: 4 }, backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <Typography
        variant="h3"
        sx={{
          fontFamily: 'GroteskBold',
          color: '#10045c',
          mb: 4,
          textAlign: 'center',
           fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
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
        {testimonios.length === 0 && ( //condicionalidad que no haya testimonios guardados
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
