import React, { useState, useEffect } from 'react';
import TestimonioCapsula from '../../components/TestimonioCapsula';
import axios from 'axios';

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

  const realizarPeticion = async () => {
    const url = "http://localhost:3000/auth/registrartestimonio"; 

    const body = {
        nombre: nombre,
        contenido: contenido,
        imagen: imagen,
    };

    try {
        const res = await axios.post(url, body, {
            headers: { "Content-Type": "application/json" }
        });

       
        window.alert(res.data.mensaje); //recibe el mensaje del res.send del endpoint
    } catch (error) {

        if (error.response) {
            console.log("Error data:", error.response.data.mensaje);
            window.alert((error.response.data.mensaje));
        } else if (error.request) {
            window.alert("Ninguna respuesta del servidor.Por favor verifique su red.");
        } else {
            window.alert("Error en la red.");
        }
    }
};

  // Cargar desde localStorage
   useEffect(() => {
    const fetchTestimonios = async () => {
      try {
        const res = await axios.get(
          'http://localhost:3000/auth/obtenertestimonios',
        );
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
			}, 100);
  };

  const handleEliminar = async (index) => {
  try {
   
    const id = testimonios[index].id;
  
    const url = `http://localhost:3000/auth/testimonio/${id}`;
    const res= await axios.delete(url);
    console.log(id);

    window.alert(res.data.mensaje);
    

    const nuevaLista = [...testimonios];
  nuevaLista.splice(index, 1);
  setTestimonios(nuevaLista);
  } catch (error) {
     window.alert(error.response.data.mensaje);
    console.error("Error eliminando testimonio:", error);
  }

};

const ActualizarContainer=(index)=>{
   const testimonio = testimonios[index];
    setNombre(testimonio.nombre);
    setContenido(testimonio.contenido);
   setImagen(testimonio.imagen);
   setModoEdicion(true);
   setSelectedIndex(index);
   console.log( "El index es"+" "+selectedIndex);
   
}



 const handleModificar = async (index) => {
  try {
   
    const id = testimonios[index].id;
  
    const url = `http://localhost:3000/auth/testimonio/${id}`;

    const updatedbody={
        nombre: nombre,
        contenido: contenido,
        imagen: imagen,

    };

    const res= await axios.put(url,updatedbody, {
       headers: { "Content-Type": "application/json" }
    })

    console.log(id);

    window.alert(res.data.mensaje);
    
  } catch (error) {
     console.log(error);
    console.error("Error modificando testimonio:", error);
  }
  setNombre('');
    setContenido('');
    setImagen('');

    setTimeout(() => {
				window.location.reload();
			}, 100);


  
};


  return (
    <Box sx={{ p: 4, backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <Typography
        variant="h3"
        sx={{
          fontFamily: 'GroteskBold',
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
              onClick={() => {ActualizarContainer(index)}}
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
