import React, { useState, useEffect } from 'react';
import TestimonioCapsula from '../../components/TestimonioCapsula';
import { api } from '../../api/api';
import { Grid } from '@mui/material';
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Divider,
  FormControlLabel,
  Checkbox,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const ManageTestimonios = () => {
  const [nombre, setNombre] = useState('');
  const [contenido, setContenido] = useState('');
  const [imagen, setImagen] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [testimonios, setTestimonios] = useState([]);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [bannerMsg, setBannerMsg] = useState('');
  const [bannerType, setBannerType] = useState('success');
  const [showBanner, setShowBanner] = useState(false);

  // Estados para videos
  const [videos, setVideos] = useState([]);
  const [openVideoDialog, setOpenVideoDialog] = useState(false);
  const [videoNombre, setVideoNombre] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [editandoVideo, setEditandoVideo] = useState(false);
  const [videoEditId, setVideoEditId] = useState(null);

  // Cargar testimonios
  useEffect(() => {
    const fetchTestimonios = async () => {
      try {
        const res = await api.get('/auth/obtenertestimonios');
        const testimonios = res.data;

        const testimoniosLista = testimonios.map(testimonio => ({
          id: testimonio.id_testimonio,
          nombre: testimonio.nombre,
          contenido: testimonio.contenido,
          imagen: testimonio.imagen,
          is_featured: testimonio.is_featured
        }));

        setTestimonios(testimoniosLista);

      } catch (err) {
        console.error('Error al obtener testimonios:', err);
      }
    };

    fetchTestimonios();
  }, []);

  // Cargar videos
  const fetchVideos = async () => {
    try {
      const res = await api.get('/auth/obtenervideotestimonio');
      setVideos(res.data);
    } catch (err) {
      console.error('Error al obtener videos:', err);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  // Funciones para testimonios (tu código existente)
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
      
      if (isFeatured) {
        await destacarTestimonioRecienCreado();
      }
      
      setBannerMsg(res.data.mensaje)
      setBannerType('success');
      setShowBanner(true);
      setTimeout(() => setShowBanner(false), 4000);

      return res.data;

    } catch (error) {
      const msg = error?.data?.mensaje || error?.message || 'Error en la Red';
      setBannerMsg(msg);
      setBannerType('error');
      setShowBanner(true);
      setTimeout(() => setShowBanner(false), 4000);
      throw error;
    }
  };

  const destacarTestimonioRecienCreado = async () => {
    try {
      const res = await api.get('/auth/obtenertestimonios');
      const testimonios = res.data;
      if (testimonios.length > 0) {
        const ultimoTestimonio = testimonios[0];
        await api.put('/auth/testimonios/destacado', { 
          id: ultimoTestimonio.id_testimonio 
        });
      }
    } catch (error) {
      console.error('Error al destacar testimonio:', error);
    }
  };

  const handleAgregar = async () => {
    if (!nombre || !contenido) return;
    
    await realizarPeticion();
    resetForm();
    
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleEliminar = async (index) => {
    try {
      const id = testimonios[index].id;
      const url = `/auth/testimonio/${id}`;
      const res = await api.delete(url);

      setBannerMsg(res.data.mensaje)
      setBannerType('success');
      setShowBanner(true);
      setTimeout(() => setShowBanner(false), 4000);

      window.scrollTo(0, 0);

      const nuevaLista = [...testimonios];
      nuevaLista.splice(index, 1);
      setTestimonios(nuevaLista);
    } catch (error) {
      const msg = error?.data?.mensaje || error?.message || 'Error en la Red'
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
    setIsFeatured(testimonio.is_featured || false);
    setModoEdicion(true);
    setSelectedIndex(index);
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

      if (isFeatured) {
        await api.put('/auth/testimonios/destacado', { id: id });
      } else {
        const testimonioActual = testimonios[index];
        if (testimonioActual.is_featured && !isFeatured) {
          await api.put('/auth/testimonios/destacado', { id: null });
        }
      }

      setBannerMsg(res.data.mensaje)
      setBannerType('success');
      setShowBanner(true);
      setTimeout(() => setShowBanner(false), 4000);

    } catch (error) {
      const mensaje = error?.data?.mensaje || error?.message || 'Error en la Red'
      console.log(error);
      console.error("Error modificando testimonio:", error);
      setBannerMsg(mensaje)
      setBannerType('error');
      setShowBanner(true);
      setTimeout(() => setShowBanner(false), 4000);
      throw error;
    }
    
    resetForm();
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const resetForm = () => {
    setNombre('');
    setContenido('');
    setImagen('');
    setIsFeatured(false);
    setModoEdicion(false);
    setSelectedIndex(null);
  };

  const handleDestacar = async (id) => {
    try {
      await api.put('/auth/testimonios/destacado', { id: id });
      setBannerMsg('Testimonio destacado correctamente');
      setBannerType('success');
      setShowBanner(true);
      setTimeout(() => setShowBanner(false), 4000);
      
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      const msg = error?.data?.mensaje || error?.message || 'Error en la Red';
      setBannerMsg(msg);
      setBannerType('error');
      setShowBanner(true);
      setTimeout(() => setShowBanner(false), 4000);
    }
  };

  const handleQuitarDestacado = async () => {
    try {
      await api.put('/auth/testimonios/destacado', { id: null });
      setBannerMsg('Se quitó el testimonio destacado');
      setBannerType('success');
      setShowBanner(true);
      setTimeout(() => setShowBanner(false), 4000);
      
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      const msg = error?.data?.mensaje || error?.message || 'Error en la Red';
      setBannerMsg(msg);
      setBannerType('error');
      setShowBanner(true);
      setTimeout(() => setShowBanner(false), 4000);
    }
  };

  // Funciones para videos
  const abrirDialogVideo = () => {
    setOpenVideoDialog(true);
    setEditandoVideo(false);
    setVideoNombre('');
    setVideoUrl('');
    setVideoEditId(null);
  };

  const cerrarDialogVideo = () => {
    setOpenVideoDialog(false);
    setEditandoVideo(false);
    setVideoNombre('');
    setVideoUrl('');
    setVideoEditId(null);
  };

  const agregarVideo = async () => {
    if (!videoNombre || !videoUrl) {
      setBannerMsg('Nombre y URL son requeridos');
      setBannerType('error');
      setShowBanner(true);
      setTimeout(() => setShowBanner(false), 4000);
      return;
    }

    try {
      const body = {
        nombre_video: videoNombre,
        url: videoUrl
      };

      await api.post('/auth/registrarvideotestimonio', body, {
        headers: { "Content-Type": "application/json" }
      });

      setBannerMsg('Video agregado correctamente');
      setBannerType('success');
      setShowBanner(true);
      setTimeout(() => setShowBanner(false), 4000);

      cerrarDialogVideo();
      fetchVideos();
    } catch (error) {
      const msg = error?.data?.mensaje || error?.message || 'Error en la Red';
      setBannerMsg(msg);
      setBannerType('error');
      setShowBanner(true);
      setTimeout(() => setShowBanner(false), 4000);
    }
  };

  const editarVideo = (video) => {
    setEditandoVideo(true);
    setVideoNombre(video.nombre_video);
    setVideoUrl(video.url);
    setVideoEditId(video.id_video);
    setOpenVideoDialog(true);
  };

  const actualizarVideo = async () => {
    if (!videoNombre || !videoUrl) {
      setBannerMsg('Nombre y URL son requeridos');
      setBannerType('error');
      setShowBanner(true);
      setTimeout(() => setShowBanner(false), 4000);
      return;
    }

    try {
      const body = {
        nombre_video: videoNombre,
        url: videoUrl
      };

      await api.put(`/auth/videotestimonio/${videoEditId}`, body, {
        headers: { "Content-Type": "application/json" }
      });

      setBannerMsg('Video actualizado correctamente');
      setBannerType('success');
      setShowBanner(true);
      setTimeout(() => setShowBanner(false), 4000);

      cerrarDialogVideo();
      fetchVideos();
    } catch (error) {
      const msg = error?.data?.mensaje || error?.message || 'Error en la Red';
      setBannerMsg(msg);
      setBannerType('error');
      setShowBanner(true);
      setTimeout(() => setShowBanner(false), 4000);
    }
  };

  const eliminarVideo = async (id) => {
    try {
      await api.delete(`/auth/videotestimonio/${id}`);
      
      setBannerMsg('Video eliminado correctamente');
      setBannerType('success');
      setShowBanner(true);
      setTimeout(() => setShowBanner(false), 4000);

      fetchVideos();
    } catch (error) {
      const msg = error?.data?.mensaje || error?.message || 'Error en la Red';
      setBannerMsg(msg);
      setBannerType('error');
      setShowBanner(true);
      setTimeout(() => setShowBanner(false), 4000);
    }
  };

  const testimonioDestacado = testimonios.find(t => t.is_featured);

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
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

     

      {/* Formulario de testimonios (tu código existente) */}
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

        <FormControlLabel
          control={
            <Checkbox
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              disabled={modoEdicion && testimonioDestacado && testimonios[selectedIndex]?.id !== testimonioDestacado.id}
            />
          }
          label="Destacar este testimonio"
          sx={{ fontFamily: 'ManropeEB' }}
        />
        
        {modoEdicion && testimonioDestacado && testimonios[selectedIndex]?.id !== testimonioDestacado.id && (
          <Typography variant="body2" color="warning.main" sx={{ fontFamily: 'ManropeEB' }}>
            Ya hay un testimonio destacado. Para destacar este, primero quite el destacado actual.
          </Typography>
        )}
 <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
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
        
        <Button
          variant="contained"
          onClick={abrirDialogVideo}
          sx={{
            backgroundColor: '#c65402',
            fontFamily: 'GroteskBold',
            '&:hover': {
              backgroundColor: '#e56502'
            },
            flex: { xs: '1 1 100%', sm: '0 1 auto' }
          }}
        >
          Agregar Testimonio en Video
        </Button>
      </Box>
        
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

      {/* Gestión de testimonio destacado (tu código existente) */}
      <Box sx={{ mb: 4, p: 2, backgroundColor: '#fff', borderRadius: 2, boxShadow: 1 }}>
        <Typography
          variant="h5"
          sx={{
            fontFamily: 'GroteskBold',
            color: '#10045c',
            mb: 2
          }}
        >
          Testimonio Destacado Actual
        </Typography>
        
        {testimonioDestacado ? (
          <Box>
            <TestimonioCapsula
              nombre={testimonioDestacado.nombre}
              contenido={testimonioDestacado.contenido}
              imagen={testimonioDestacado.imagen}
            />
            <Button
              variant="outlined"
              color="warning"
              size="small"
              onClick={handleQuitarDestacado}
              sx={{ mt: 1, fontFamily: 'ManropeEB' }}
            >
              Quitar como Destacado
            </Button>
          </Box>
        ) : (
          <Typography sx={{ fontFamily: 'ManropeEB', color: '#666' }}>
            No hay testimonio destacado actualmente.
          </Typography>
        )}
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Vista previa del último testimonio (tu código existente) */}
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

      {/* Lista de testimonios actuales (tu código existente) */}
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
          <Box key={index} sx={{ position: 'relative' }}>
            {t.is_featured && (
              <Chip 
                label="Destacado" 
                color="primary" 
                size="small"
                sx={{ 
                  position: 'absolute', 
                  top: 8, 
                  right: 8, 
                  zIndex: 10,
                  fontFamily: 'ManropeEB'
                }}
              />
            )}
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
              sx={{ mt: 1, mr: 1, fontFamily: 'ManropeEB' }}
            >
              Eliminar
            </Button>
            <Button
              variant="outlined"
              color="primary"
              size="small"
              onClick={() => ActualizarContainer(index)}
              sx={{ mt: 1, mr: 1, fontFamily: 'ManropeEB' }}
            >
              Modificar
            </Button>
            {!t.is_featured && (
              <Button
                variant="outlined"
                color="warning"
                size="small"
                onClick={() => handleDestacar(t.id)}
                sx={{ mt: 1, fontFamily: 'ManropeEB' }}
              >
                Destacar
              </Button>
            )}
          </Box>
        ))}
      </Stack>

      {/* Dialog para gestionar videos */}
      <Dialog 
        open={openVideoDialog} 
        onClose={cerrarDialogVideo}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontFamily: 'GroteskBold', color: '#10045c' }}>
          {editandoVideo ? 'Editar Video Testimonio' : 'Agregar Video Testimonio'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              label="Nombre del video"
              value={videoNombre}
              onChange={(e) => setVideoNombre(e.target.value)}
              fullWidth
              InputLabelProps={{ style: { fontFamily: 'GroteskBold' } }}
              inputProps={{ style: { fontFamily: 'ManropeEB' } }}
            />
            
            <Box>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'error.main', 
                  fontFamily: 'ManropeEB',
                  mb: 1
                }}
              >
                * El video debe estar en formato de Youtube Shorts
              </Typography>
              <TextField
                label="URL de Youtube Shorts"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                fullWidth
                InputLabelProps={{ style: { fontFamily: 'GroteskBold' } }}
                inputProps={{ style: { fontFamily: 'ManropeEB' } }}
                placeholder="https://www.youtube.com/shorts/..."
              />
            </Box>

            {/* Lista de videos existentes */}
            {videos.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontFamily: 'GroteskBold', 
                    color: '#10045c',
                    mb: 2
                  }}
                >
                  Videos existentes:
                </Typography>
                <Stack spacing={1}>
                  {videos.map((video) => (
                    <Box 
                      key={video.id_video}
                      sx={{ 
                        p: 2, 
                        border: '1px solid #ddd', 
                        borderRadius: 1,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <Box>
                        <Typography sx={{ fontFamily: 'ManropeEB', fontWeight: 'bold' }}>
                          {video.nombre_video}
                        </Typography>
                        <Typography 
                          sx={{ 
                            fontFamily: 'ManropeEB', 
                            fontSize: '0.8rem',
                            color: '#666'
                          }}
                        >
                          {video.url}
                        </Typography>
                      </Box>
                      <Box>
                        <IconButton 
                          onClick={() => editarVideo(video)}
                          sx={{ color: '#10045c' }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          onClick={() => eliminarVideo(video.id_video)}
                          sx={{ color: 'error.main' }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </Box>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={cerrarDialogVideo}
            sx={{ fontFamily: 'ManropeEB' }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={editandoVideo ? actualizarVideo : agregarVideo}
            variant="contained"
            sx={{ 
              backgroundColor: '#c65402',
              fontFamily: 'GroteskBold',
              '&:hover': {
                backgroundColor: '#e56502'
              }
            }}
          >
            {editandoVideo ? 'Actualizar Video' : 'Agregar Video'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageTestimonios;