import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
  Switch,
  FormControlLabel,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import { api } from '../api/api';
import HeaderBesibol from '/Logo-pilotosA.png';

// Íconos SVG (mantengo tus SVGs personalizados)
const X = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const Edit = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
  </svg>
);

const EnVivo = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [videos, setVideos] = useState([]);
  const [urlData, setUrlData] = useState({ videoUrl: '', channelUrl: '' });
  const [formData, setFormData] = useState({
    id: null,
    videoUrl: '',
    channelUrl: '',
    descripcion: '',
    tipoTransmision: 'en_directo',
    activo: true, // boolean para simplificar
  });
  const [bannerMsg, setBannerMsg] = useState('');
  const [bannerType, setBannerType] = useState('success');
  const [showBanner, setShowBanner] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Obtener lista de videos (y seleccionar el primero activo para reproducir)
  const fetchUrls = async () => {
    setLoading(true);
    try {
      const res = await api.get('/auth/obtenerenvivo', { skipAuthRedirect: true });
      const hola = res.data;
      const videosActualizados = (hola?.videos || []).map(video => ({
        id: video.id_envivo ?? null,
        video_url: video.video_url,
        channel_url: video.channel_url,
        descripcion: video.descripcion,
        tipo_transmision: video.tipo_transmision || 'en_directo',
        activo: video.activo, // puede venir 'S'/'N' o true/false
      }));
      setVideos(videosActualizados);

      // Filtrar los videos activos (aceptamos 'S' o true)
      const activos = videosActualizados.filter(v => v.activo === 'S' || v.activo === true);
      if (activos.length > 0) {
        setUrlData({
          videoUrl: convertToEmbedUrl(activos[0].video_url, activos[0].tipo_transmision),
          channelUrl: activos[0].channel_url,
        });
      } else {
        setUrlData({ videoUrl: '', channelUrl: '' });
      }
    } catch (error) {
      console.warn('Error al recargar videos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Verificar rol / sesión (no bloqueante)
  useEffect(() => {
    const fetchRole = async () => {
      try {
        const res = await api.get('/auth/obtenerperfil', {
          withCredentials: true,
          skipAuthRedirect: true,
        });
        const perfil = Array.isArray(res.data) ? res.data[0] : res.data;
        const role = String(perfil?.rol || '').toLowerCase().trim();
        setIsLoggedIn(!!perfil);
        setIsAdmin(role === 'admin');
      } catch (error) {
        setIsLoggedIn(false);
        setIsAdmin(false);
      } finally {
        setCheckingAuth(false);
      }
    };

    fetchRole();
    const onAuthRefresh = () => {
      setCheckingAuth(true);
      fetchRole();
    };
    window.addEventListener('auth:refresh', onAuthRefresh);
    return () => window.removeEventListener('auth:refresh', onAuthRefresh);
  }, []);

  useEffect(() => {
    fetchUrls();
  }, []);

  // Convertir una URL de YouTube a su embed y añadir autoplay si corresponde
  const convertToEmbedUrl = (url, tipoTransmision = 'en_directo') => {
    if (!url) return '';
    if (url.includes('youtube.com/embed/') || url.includes('youtube-nocookie.com/embed/')) return url;
    let videoId = '';
    try {
      if (url.includes('youtube.com/watch?v=')) {
        const urlObj = new URL(url);
        videoId = urlObj.searchParams.get('v');
      } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1].split('?')[0].split('&')[0];
      } else if (url.includes('youtube.com/v/')) {
        videoId = url.split('youtube.com/v/')[1].split('?')[0].split('&')[0];
      }
      if (videoId) {
        const autoplayParam = tipoTransmision === 'en_directo' ? '&autoplay=1&mute=1' : '';
        // Si autoplayParam vacío, evitamos el '?' final sobrante
        return `https://www.youtube.com/embed/${videoId}${autoplayParam ? `?${autoplayParam.substring(1)}` : ''}`;
      }
    } catch (error) {
      console.error('Error procesando URL:', error);
    }
    return url;
  };

  // Abrir modal para agregar o editar
  // mode: 'add' | 'edit'
  const openModal = (mode = 'add', video = null) => {
    if (!isLoggedIn) {
      showMessage('Debes iniciar sesión para modificar las URLs', 'error');
      return;
    }
    if (!isAdmin) {
      showMessage('Solo el administrador puede modificar las URLs', 'error');
      return;
    }

    if (mode === 'edit' && video) {
      setFormData({
        id: video.id ?? null,
        videoUrl: video.video_url ?? '',
        channelUrl: video.channel_url ?? '',
        descripcion: video.descripcion ?? '',
        tipoTransmision: video.tipo_transmision ?? 'en_directo',
        // normalizamos activo a boolean
        activo: video.activo === 'S' || video.activo === true,
      });
    } else {
      // add new -> limpiar formulario
      setFormData({
        id: null,
        videoUrl: '',
        channelUrl: '',
        descripcion: '',
        tipoTransmision: 'en_directo',
        activo: true,
      });
    }

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    // reset form
    setFormData({
      id: null,
      videoUrl: '',
      channelUrl: '',
      descripcion: '',
      tipoTransmision: 'en_directo',
      activo: true,
    });
    setShowBanner(false);
  };

  const showMessage = (message, type = 'success') => {
    setBannerMsg(message);
    setBannerType(type);
    setShowBanner(true);
    setTimeout(() => setShowBanner(false), 4000);
  };

  const validateUrls = () => {
    if (!formData.videoUrl.trim()) {
      showMessage('La URL del video es requerida', 'error');
      return false;
    }
    if (!formData.channelUrl.trim()) {
      showMessage('La URL del canal es requerida', 'error');
      return false;
    }
    const isYouTubeVideoUrl = formData.videoUrl.includes('youtube.com') || formData.videoUrl.includes('youtu.be');
    if (!isYouTubeVideoUrl) {
      showMessage('La URL del video debe ser un enlace de YouTube válido', 'error');
      return false;
    }
    const isYouTubeChannelUrl = formData.channelUrl.includes('youtube.com/');
    if (!isYouTubeChannelUrl) {
      showMessage('La URL del canal debe ser un enlace de YouTube válido', 'error');
      return false;
    }
    return true;
  };

  // Guardar (crear/actualizar) video
  const saveUrls = async () => {
    if (!validateUrls()) return;

    try {
      setLoading(true);

      // Construimos el cuerpo según lo que espera tu backend.
      // Incluimos id si estamos editando (algunas APIs esperan id para update).
      const requestBody = {
        video_url: formData.videoUrl.trim(),
        channel_url: formData.channelUrl.trim(),
        descripcion: formData.descripcion.trim() || 'Video en vivo',
        tipo_transmision: formData.tipoTransmision,
        activo: formData.activo, // boolean (backend acepta 'S'/'N' o true/false según tu implementación)
      };
      if (formData.id) {
        requestBody.id_envivo = formData.id; // si tu backend espera otro nombre, ajusta aquí
      }

      // Llamada al endpoint - POST para crear/actualizar según backend
      const res = await api.post('/auth/registrarenvivo', requestBody, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });

      // Actualizamos la vista: convertimos a embed para reproducir
      setUrlData({
        videoUrl: convertToEmbedUrl(formData.videoUrl.trim(), formData.tipoTransmision),
        channelUrl: formData.channelUrl.trim(),
      });

      // Refrescar lista
      await fetchUrls();

      const mensaje = res.data?.mensaje || 'URLs actualizadas correctamente';
      showMessage(mensaje, 'success');

      // Cerramos modal después de un pequeño delay
      setTimeout(() => closeModal(), 1200);
    } catch (error) {
      console.error('Error guardando URLs:', error);
      let mensaje = 'Error al actualizar URLs';
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        if (status === 404) mensaje = 'Endpoint no encontrado. Verifica la ruta del backend';
        else if (status === 401 || status === 403) mensaje = 'No tienes permisos para realizar esta acción';
        else if (status === 400) mensaje = data?.mensaje || 'Datos inválidos enviados al servidor';
        else if (status === 500) mensaje = 'Error interno del servidor. Revisa los logs del backend';
        else mensaje = data?.mensaje || `Error ${status}: ${error.response.statusText}`;
      } else if (error.request) {
        mensaje = 'No se pudo conectar con el servidor. Verifica que el backend esté disponible';
      } else {
        mensaje = `Error en la petición: ${error.message}`;
      }
      showMessage(mensaje, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Render
  if (loading && checkingAuth) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#10045c' }}>
        <Typography variant="h6" sx={{ color: 'white' }}>Cargando...</Typography>
      </Box>
    );
  }

  const showEditButton = isLoggedIn && isAdmin;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        backgroundImage: `linear-gradient(rgba(16, 4, 92, 0.95), rgba(16, 4, 92, 0.95)), url(${HeaderBesibol})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '40px 20px',
        position: 'relative',
      }}
    >
      {/* Botón flotante para admin: abrir modal (agregar) */}
      {showEditButton && (
        <Button
          onClick={() => openModal('add', null)}
          disabled={loading}
          sx={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            minWidth: 'auto',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.9)',
            color: '#3b82f6',
            '&:hover': { backgroundColor: 'rgba(255,255,255,1)' },
            '&:disabled': { backgroundColor: 'rgba(255,255,255,0.5)' },
            zIndex: 10,
          }}
        >
          <Edit />
        </Button>
      )}

      <Typography
        variant="h4"
        sx={{
          fontFamily: 'Groteskbold',
          color: 'white',
          marginBottom: '2rem',
          marginTop: '80px',
          textAlign: 'center',
        }}
      >
        Bienvenido! Esperamos disfrutes de nuestros partidos en vivo!!!
      </Typography>

      <Box sx={{ width: '95%', maxWidth: '1200px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', flex: 1 }}>
        {/* Contenedor Video o Mensaje */}
        <Box
          sx={{
            width: '100%',
            flex: 1,
            marginBottom: '2rem',
            aspectRatio: '16/9',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 8px 25px rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
			backgroundColor: urlData.videoUrl ? 'transparent' : 'rgba(255,255,255,0.03)',
            padding: urlData.videoUrl ? 0 : 2, // 👈 quitar padding si hay video
          }}
        >
          {urlData.videoUrl && urlData.videoUrl.trim() !== '' ? (
            <iframe
              src={urlData.videoUrl}
              title="En Vivo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ width: '100%', height: '100%', border: 'none' }}
            />
          ) : (
            <Box sx={{ px: 3 }}>
              <Typography
  sx={{
    fontFamily: 'Groteskbold',
    color: '#e06c14',
    fontWeight: 'bold',
    fontSize: { xs: '1rem', sm: '1.5rem', md: '2.5rem' }, // 👈 responsivo
    textAlign: 'center',
    lineHeight: 1.4,
  }}
>
  Actualmente no hay ningún evento pasando en vivo, pero si quieres puedes visitar nuestro canal presionando el botón de abajo. ¡Muchas gracias!
</Typography>
            </Box>
          )}
        </Box>

        <Box
  sx={{
    display: 'flex',
    gap: 2,
    marginTop: '20px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  }}
>
  <Button
    variant="contained"
    sx={{
      fontFamily: 'Petermedium',
      backgroundColor: '#fff',
      color: '#e06c14',
      borderRadius: '20px',
      '&:hover': { color: '#10045c', backgroundColor: '#c1c8cdf2' },
    }}
    onClick={() => {
      if (urlData.channelUrl) window.open(urlData.channelUrl, '_blank');
      else showMessage('No hay canal configurado', 'error');
    }}
  >
    Ir al Canal
  </Button>

  {isAdmin && (
    <Button
      variant="outlined"
      sx={{
        fontFamily: 'Petermedium',
        color: '#fff',
        borderColor: '#fff',
        borderRadius: '20px',
        '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
      }}
      onClick={() => openModal('add')}
    >
      <Edit />
      &nbsp; 
    </Button>
  )}
</Box>

      </Box>

      {/* Banner */}
      {showBanner && !showModal && (
        <Box sx={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1001,
          minWidth: '300px',
          maxWidth: '500px',
          p: 2,
          borderRadius: 2,
          backgroundColor: bannerType === 'error' ? '#f44336' : '#4caf50',
          color: 'white',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        }}>
          <Typography sx={{ fontWeight: 'bold', fontSize: '14px', textAlign: 'center' }}>{bannerMsg}</Typography>
        </Box>
      )}

      {/* Modal (Agregar / Editar URLs) */}
      {showModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1200,
          padding: 16,
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: 12,
            padding: 20,
            width: '100%',
            maxWidth: 720,
            maxHeight: '88vh',
            overflow: 'auto',
            boxSizing: 'border-box',
          }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Configurar URLs de En Vivo</h3>
              <button onClick={closeModal} disabled={loading} style={{
                background: 'none',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                padding: 6,
                borderRadius: 6,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <X />
              </button>
            </div>

            {/* Lista rápida de videos guardados (opcional, para edición) */}
            <div style={{ marginBottom: 16 }}>
              <Typography sx={{ fontSize: 14, color: '#374151', marginBottom: 8 }}>Videos guardados</Typography>
              {videos.length === 0 ? (
                <Typography sx={{ fontSize: 13, color: '#6b7280' }}>No hay videos guardados.</Typography>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {videos.map((v) => (
                    <div key={v.id ?? v.video_url} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      borderRadius: 8,
                      background: '#f8fafc',
                    }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 440 }}>
                        <strong style={{ fontSize: 13 }}>{v.descripcion || 'Video'}</strong>
                        <div style={{ fontSize: 12, color: '#6b7280' }}>{v.video_url}</div>
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <Button size="small" variant="contained" onClick={() => openModal('edit', v)}>
                          Editar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Formulario */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <TextField
                label="URL del video (YouTube)"
                value={formData.videoUrl}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                fullWidth
                variant="outlined"
                size="small"
              />
              <TextField
                label="URL del canal (YouTube)"
                value={formData.channelUrl}
                onChange={(e) => setFormData({ ...formData, channelUrl: e.target.value })}
                fullWidth
                variant="outlined"
                size="small"
              />
              <TextField
                label="Descripción (opcional)"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                fullWidth
                variant="outlined"
                size="small"
              />

              <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                <FormControl size="small" sx={{ minWidth: 180 }}>
                  <InputLabel id="tipo-label">Tipo de transmisión</InputLabel>
                  <Select
                    labelId="tipo-label"
                    label="Tipo de transmisión"
                    value={formData.tipoTransmision}
                    onChange={(e) => setFormData({ ...formData, tipoTransmision: e.target.value })}
                    size="small"
                  >
                    <MenuItem value="en_directo">En directo</MenuItem>
                    <MenuItem value="grabado">Grabado</MenuItem>
                  </Select>
                </FormControl>

                <FormControlLabel
                  control={
                    <Switch
                      checked={!!formData.activo}
                      onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                    />
                  }
                  label={formData.activo ? 'Activo' : 'Inactivo'}
                />
              </div>
            </div>

            {/* Botones */}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 18 }}>
              <button onClick={closeModal} disabled={loading} style={{
                padding: '10px 18px',
                backgroundColor: '#f3f4f6',
                color: '#374151',
                border: '2px solid #e5e7eb',
                borderRadius: 8,
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: 14,
                fontWeight: 500,
              }}>
                Cancelar
              </button>

              <button onClick={saveUrls} disabled={loading} style={{
                padding: '10px 18px',
                backgroundColor: loading ? '#93c5fd' : '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: 14,
                fontWeight: 500,
              }}>
                {loading ? 'Guardando...' : (formData.id ? 'Guardar cambios' : 'Agregar video')}
              </button>
            </div>
          </div>
        </div>
      )}

    </Box>
  );
};

export default EnVivo;
