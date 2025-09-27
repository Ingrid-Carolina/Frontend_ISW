import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Alert, TextField, Button, Modal } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import EditIcon from '@mui/icons-material/Edit';
import { api } from '../api/api';

import Img from '/Images/Categoria.png';
import LogoPilotos from '/Images/Logo-pilotos.png';

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const visibleCards = 3;
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [currentCat, setCurrentCat] = useState(null);
  const [formData, setFormData] = useState({ titletext: '', tipo: '', descripcion: '', image: null, imagePreview: '' });
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
  let mounted = true;
  (async () => {
    try {
      const response = await api.get('/auth/categorias');
      if (mounted && response.data?.categorias) {
        setCategorias(response.data.categorias);
      }

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

      await checkRole();
    } catch (err) {
      console.error('Error al cargar categorías:', err);
    }
  })();
  return () => { mounted = false; };
}, []);

  const handleNext = () => setStartIndex((prev) => (prev + 1) % categorias.length);
  const handlePrev = () => setStartIndex((prev) => (prev - 1 + categorias.length) % categorias.length);

  const getVisibleCards = () => {
    const cards = [];
    for (let i = 0; i < visibleCards; i++) {
      const index = (startIndex + i) % categorias.length;
      cards.push(categorias[index]);
    }
    return cards;
  };

  const scrollToCategory = (slug) => {
    const element = document.getElementById(`detalle-${slug}`);
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const openModal = (cat) => {
    setCurrentCat(cat);
    setFormData({
      titletext: cat.titletext,
      tipo: cat.tipo,
      descripcion: cat.descripcion,
      image: null,
      imagePreview: cat.image,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentCat(null);
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        image: files[0],
        imagePreview: URL.createObjectURL(files[0]),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleUpdate = async () => {
    if (!currentCat) return;
    try {
      let imageUrl = formData.imagePreview;

      if (formData.image) {
        const fd = new FormData();
        fd.append("file", formData.image);

        const uploadRes = await api.post("/auth/upload", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        imageUrl = uploadRes.data.url;
      }

      const payload = {
        titletext: formData.titletext,
        tipo: formData.tipo,
        descripcion: formData.descripcion,
        image: imageUrl,
      };

      const response = await api.put(`/auth/categorias/${currentCat.id}`, payload);

      setCategorias((prev) =>
        prev.map((cat) => (cat.id === currentCat.id ? response.data.categoria : cat))
      );

      closeModal();
    } catch (err) {
      console.error("Error al actualizar categoría:", err);
      setError("No se pudo actualizar la categoría.");
    }
  };

  if (!categorias.length) {
    return error ? <Alert severity="error">{error}</Alert> : <Typography>Cargando categorías...</Typography>;
  }

  return (
    <>
      {/* HEADER */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          minHeight: { xs: '75vh', md: '90vh' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundImage: `url(${Img})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          py: { xs: 6, md: 8 },
        }}
      >
        <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }} />
        <Box
          sx={{
            position: 'relative',
            zIndex: 2,
            textAlign: 'center',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography
            variant='h2'
            sx={{
              fontWeight: 'bold',
              fontSize: { xs: '4rem', md: '7rem' },
              fontFamily: '"Varsity", cursive',
              color: 'white',
              textAlign: 'center',
            }}
          >
            CATEGORIAS
          </Typography>
        </Box>
      </Box>

      {/* CARRUSEL */}
      <Box
        sx={{
          py: 6,
          px: { xs: 3, md: 10 },
          backgroundImage: `linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.1)), url('/Images/Fondo_Carrusel_Categorias.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <Box sx={{ textAlign: 'center', color: 'white', mb: 4 }}>
          <Typography
            variant='h3'
            sx={{
              fontFamily: '"Varsity", cursive',
              fontWeight: 'bold',
              fontSize: { xs: '3rem', md: '4rem' },
              color: '#e6691d',
            }}
          >
            LAS CATEGORÍAS
          </Typography>
          <Typography
            variant='body1'
            sx={{
              fontFamily: '"PeterMedium", sans-serif',
              color: '#e6691d',
              fontSize: '1.5rem',
              lineHeight: 4.0,
            }}
          >
            Explora cada categoría del béisbol juvenil y profesional. ¡Deslizá las tarjetas para conocerlas todas!
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
          <IconButton
            onClick={handlePrev}
            sx={{
              backgroundColor: 'rgba(230, 105, 29, 0.7)',
              borderRadius: '50%',
              p: 1.5,
              '&:hover': { backgroundColor: 'rgba(230, 105, 29, 0.9)' },
            }}
          >
            <ArrowBackIosIcon sx={{ color: 'white' }} />
          </IconButton>

          <Box sx={{ display: 'flex', gap: 3, overflow: 'hidden', width: '80%', justifyContent: 'center' }}>
            {getVisibleCards().map((categoria) => (
              <Box
                key={categoria.slugs}
                onClick={() => scrollToCategory(categoria.slugs)}
                sx={{
                  width: '250px',
                  transition: 'transform 0.5s ease',
                  borderRadius: 2,
                  boxShadow: 4,
                  bgcolor: '#fff',
                  cursor: 'pointer',
                  '&:hover': { transform: 'scale(1.05)' },
                }}
              >
                <img
                  src={categoria.image}
                  alt={categoria.titleText}
                  style={{ width: '100%', height: '250px', objectFit: 'cover', borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
                />
                <Typography
                  variant='h5'
                  sx={{
                    fontFamily: '"Varsity", cursive',
                    p: 2,
                    color: '#e6691d',
                    fontWeight: 'bold',
                  }}
                >
                  {categoria.titletext}
                </Typography>
              </Box>
            ))}
          </Box>

          <IconButton
            onClick={handleNext}
            sx={{
              backgroundColor: 'rgba(230, 105, 29, 0.7)',
              borderRadius: '50%',
              p: 1.5,
              '&:hover': { backgroundColor: 'rgba(230, 105, 29, 0.9)' },
            }}
          >
            <ArrowForwardIosIcon sx={{ color: 'white' }} />
          </IconButton>
        </Box>
      </Box>

      {/* DETALLE DE CATEGORÍAS */}
      <Box
        sx={{
          py: 6,
          px: { xs: 3, md: 10 },
          backgroundColor: '#f26c23',
        }}
      >
        <Typography
          variant='h3'
          sx={{
            fontFamily: '"Varsity", cursive',
            color: '#fff',
            fontWeight: 'bold',
            mb: 5,
            textAlign: 'center',
          }}
        >
          Conocé cada categoría en detalle
        </Typography>

        {categorias.map((cat) => (
          <Box
            key={cat.slugs}
            id={`detalle-${cat.slugs}`}
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              backgroundColor: '#fff',
              borderRadius: 4,
              boxShadow: 3,
              mb: 5,
              overflow: 'hidden',
              maxWidth: '950px',
              mx: 'auto',
            }}
          >
            <Box sx={{ width: { xs: '100%', md: '40%' } }}>
              <img
                src={cat.image}
                alt={cat.titleText}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </Box>

            <Box sx={{ p: 4, flex: 1, position: 'relative' }}>
              <Box sx={{ height: '4px', background: 'linear-gradient(to right, transparent, #f26c23)', borderRadius: 2, width: '100%', }} />
              {isAdmin && ( 
                <IconButton onClick={() => openModal(cat)} sx={{ position: 'absolute', top: 46, right: 30, color: '#e6691d' }}>
                  <EditIcon />
                </IconButton>
              )}

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box component='img' src={LogoPilotos} alt='Logo Pilotos' sx={{ width: 120, height: 60 }} />
                <Typography
                  variant='h5'
                  sx={{ fontFamily: '"Varsity", cursive', color: '#f26c23', fontWeight: 'bold', letterSpacing: 1 }}
                >
                  PILOTOS
                </Typography>
              </Box>

              <Typography variant='h4' sx={{ fontFamily: '"Varsity", cursive', fontWeight: 'bold', color: '#e6691d', mb: 1 }}>
                {cat.titletext}
              </Typography>

              <Typography variant='subtitle1' sx={{ fontFamily: '"PeterMedium", sans-serif', color: '#e6691d', fontWeight: 'bold', mb: 2 }}>
                Tipo de categoría: {cat.tipo}
              </Typography>

              <Typography variant='body1' sx={{ fontFamily: '"PeterMedium", sans-serif', fontSize: '1.1rem', lineHeight: 1.8, color: '#444', mb: 3 }}>
                {cat.descripcion}
              </Typography>
              <Box sx={{ height: '4px', background: 'linear-gradient(to right, transparent, #f26c23)', borderRadius: 2, width: '100%', }} />
            </Box>
          </Box>
        ))}
      </Box>

      {/* MODAL PARA EDITAR */}
      <Modal open={modalOpen} onClose={closeModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: 500 },
            bgcolor: 'background.paper',
            borderRadius: 3,
            boxShadow: 24,
            width: '30%',
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            border: '2px solid #e6691d',
            backgroundImage: 'linear-gradient(145deg, #fff5f0, #ffe6d6)',
          }}
        >
          {/* CABECERA */}
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#e6691d', letterSpacing: 1.5 }}>
              Editar Categoría
            </Typography>
            <Box sx={{ width: 60, height: 4, bgcolor: '#e6691d', mx: 'auto', mt: 1, borderRadius: 2 }} />
          </Box>

          {/* CAMPOS */}
          <TextField
            label="Título"
            name="titletext"
            value={formData.titletext}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            sx={{ bgcolor: '#fff', borderRadius: 2 }}
          />
          <TextField
            label="Tipo"
            name="tipo"
            value={formData.tipo}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            sx={{ bgcolor: '#fff', borderRadius: 2 }}
          />
          <TextField
            label="Descripción"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleInputChange}
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            sx={{ bgcolor: '#fff', borderRadius: 2 }}
          />

          {/* PREVIEW IMAGEN */}
          <Box sx={{ textAlign: 'center', mt: 1 }}>
            <img
              src={formData.imagePreview}
              alt="Preview"
              style={{
                width: '100%',
                maxHeight: '250px',
                objectFit: 'cover',
                borderRadius: 12,
                marginBottom: 10,
                boxShadow: '0px 4px 15px rgba(0,0,0,0.2)',
              }}
            />
            <Button
              variant="contained"
              component="label"
              sx={{
                bgcolor: '#e6691d',
                '&:hover': { bgcolor: '#f26c23' },
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 'bold',
              }}
            >
              Cambiar Imagen
              <input type="file" hidden name="image" onChange={handleInputChange} />
            </Button>
          </Box>

          {/* BOTONES */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
            <Button
              variant="outlined"
              onClick={closeModal}
              sx={{ borderColor: '#e6691d', color: '#e6691d', '&:hover': { borderColor: '#f26c23', color: '#f26c23' } }}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              onClick={handleUpdate}
              sx={{ bgcolor: '#e6691d', '&:hover': { bgcolor: '#f26c23' }, fontWeight: 'bold' }}
            >
              Guardar
            </Button>
          </Box>
        </Box>
      </Modal>


      {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}
    </>
  );
};

export default Categorias;
