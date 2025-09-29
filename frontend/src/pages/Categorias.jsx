import React, { useState, useEffect } from 'react';
// Importa componentes de Material UI para la interfaz y utilidades
import { Box, Typography, IconButton, Alert, TextField, Button, Modal, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import EditIcon from '@mui/icons-material/Edit';
// Importa el cliente API personalizado
import { api } from '../api/api';

// Imágenes usadas en la página
import Img from '/Images/Categoria.png';
import LogoPilotos from '/Images/Logo-pilotos.png';

// Componente principal de la página de categorías
const Categorias = () => {
  // Estado para la lista de categorías obtenidas del backend
  const [categorias, setCategorias] = useState([]);
  // Estado para el índice inicial del carrusel
  const [startIndex, setStartIndex] = useState(0);
  // Número de tarjetas visibles en el carrusel
  const visibleCards = 3;
  // Estado para errores generales
  const [error, setError] = useState('');
  // Estado para el modal de edición de categoría
  const [modalOpen, setModalOpen] = useState(false);
  // Categoría actualmente seleccionada para editar
  const [currentCat, setCurrentCat] = useState(null);
  // Estado para los datos del formulario de edición de categoría
  const [formData, setFormData] = useState({ titletext: '', tipo: '', descripcion: '', image: null, imagePreview: '' });
  // Estado para saber si el usuario es admin
  const [isAdmin, setIsAdmin] = useState(false);
  // Estado para la vista previa de la imagen del header
  const [headerPreview, setHeaderPreview] = useState(null);
  // Estado para los datos del header (título, imagen, carrusel)
  const [headerData, setHeaderData] = useState({});
  // Estado para el input de título del header
  const [headerTitleInput, setHeaderTitleInput] = useState('');
  // Estado para el modal de edición del header
  const [openHeaderEdit, setOpenHeaderEdit] = useState(false);
  // Estado para el archivo de imagen del header
  const [headerFile, setHeaderFile] = useState(null);
  // Estado para mostrar carga al guardar el header
  const [headerUploading, setHeaderUploading] = useState(false);
  // Estado para el modal de edición del carrusel
  const [openCarruselEdit, setOpenCarruselEdit] = useState(false);
  // Estado para el archivo de imagen del carrusel
  const [carruselFile, setCarruselFile] = useState(null);
  // Estado para la vista previa de la imagen del carrusel
  const [carruselPreview, setCarruselPreview] = useState(null);
  // Estado para los datos del carrusel
  const [carruselData, setCarruselData] = useState({ carrusel_title: '', carrusel_subtitle: '', carrusel_image: '' });
  // Estado para el input de título del carrusel
  const [carruselTitleInput, setCarruselTitleInput] = useState('');
  // Estado para el input de subtítulo del carrusel
  const [carruselSubtitleInput, setCarruselSubtitleInput] = useState('');
  // Estado para mostrar carga al guardar el carrusel
  const [carruselUploading, setCarruselUploading] = useState(false);


  // useEffect para cargar categorías, header y verificar rol admin al montar el componente
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        // 1️⃣ Traer datos del header (título, imagen, carrusel)
        const response2 = await api.get('/auth/categorias/site/all');
        if (!mounted) return;
        const data2 = response2.data;

        // 2️⃣ Traer categorías
        const response = await api.get('/auth/categorias');
        if (!mounted) return;
        const data = response.data;

        // Actualiza estado de categorías
        if (data?.categorias) setCategorias(data.categorias);

        // Actualiza estado del header y carrusel
        if (data2?.header_title || data2?.header_img) {
          setHeaderData({
            header_title: data2.header_title || '',
            header_img: data2.header_img || '',
            carrusel_title: data2.carrusel_title || '',
            carrusel_subtitle: data2.carrusel_subtitle || '',
            carrusel_img: data2.carrusel_image || '',
          });
          setHeaderTitleInput(data2.header_title || '');
          setCarruselTitleInput(data2.carrusel_title || '');
          setCarruselSubtitleInput(data2.carrusel_subtitle || '');
          setCarruselPreview(data2.carrusel_image || null);
        }

        // 3️⃣ Chequear si el usuario es admin
        try {
          const r = await api.get('/auth/obtenerperfil', {
            withCredentials: true,
            skipAuthRedirect: true,
          });
          const p = Array.isArray(r.data) ? r.data[0] : r.data;
          const role = String(p?.rol || '').toLowerCase();
          if (mounted) setIsAdmin(role === 'admin');
        } catch {
          if (mounted) setIsAdmin(false);
        }

      } catch (err) {
        console.error('Error al cargar datos de categorías y header:', err);
        if (mounted) setError('No se pudieron cargar las categorías ni el header.');
      }
    })();

    return () => { mounted = false; };
  }, []);

  // Navega al siguiente grupo de tarjetas en el carrusel
  const handleNext = () => setStartIndex((prev) => (prev + 1) % categorias.length);
  // Navega al grupo anterior de tarjetas en el carrusel
  const handlePrev = () => setStartIndex((prev) => (prev - 1 + categorias.length) % categorias.length);

  // Guarda los cambios del carrusel (título, subtítulo, imagen)
  const saveCarrusel = async () => {
    try {
      // Si no hay nueva imagen y ya existe en DB, usar la existente
      let imageUrl = carruselFile ? '' : (carruselData.carrusel_image || '');

      if (carruselFile) {
        setCarruselUploading(true);

        const fd = new FormData();
        fd.append("file", carruselFile);

        const uploadRes = await api.post("/auth/upload", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        imageUrl = uploadRes.data.url;
        setCarruselUploading(false);
      }

      const payload = {
        carrusel_title: carruselTitleInput || carruselData.carrusel_title,
        carrusel_subtitle: carruselSubtitleInput || carruselData.carrusel_subtitle,
        carrusel_image: imageUrl || carruselData.carrusel_image,
      };

      const res = await api.put('/auth/categorias/site/carrusel', payload);

      setCarruselData(res.data);
      setHeaderData(prev => ({
        ...prev,
        carrusel_title: res.data.carrusel_title,
        carrusel_subtitle: res.data.carrusel_subtitle,
        carrusel_img: res.data.carrusel_image,
      }));

      setOpenCarruselEdit(false);
      setCarruselFile(null);
      setCarruselPreview(null);
    } catch (err) {
      console.error("Error al guardar carrusel:", err);
      setError("Error al actualizar carrusel.");
      setCarruselUploading(false);
    }
  };

  // Devuelve las tarjetas visibles en el carrusel según el índice actual
  const getVisibleCards = () => {
    const cards = [];
    for (let i = 0; i < visibleCards; i++) {
      const index = (startIndex + i) % categorias.length;
      cards.push(categorias[index]);
    }
    return cards;
  };

  // Guarda los cambios del header (título, imagen)
  const saveHeader = async () => {
    try {
      let headerUrl = headerData.header_img || '';

      if (headerFile) {
        setHeaderUploading(true);

        const fd = new FormData();
        fd.append("file", headerFile);

        const uploadRes = await api.post("/auth/upload", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        headerUrl = uploadRes.data.url;
        setHeaderUploading(false);
      }

      const payload = {
        header_title: headerTitleInput || headerData.header_title || '',
        header_img: headerUrl,
      };

      const res = await api.put('/auth/categorias/site/header', payload);

      setHeaderData(prev => ({
        ...prev,
        header_title: res.data.header_title,
        header_img: res.data.header_img
      }));

      setOpenHeaderEdit(false);
      setHeaderFile(null);
      setHeaderPreview(null);

    } catch (error) {
      console.error("Error al guardar header:", error);
      setError("Error al actualizar header.");
      setHeaderUploading(false);
    }
  };

  // Hace scroll a la sección de detalle de la categoría seleccionada
  const scrollToCategory = (slug) => {
    const element = document.getElementById(`detalle-${slug}`);
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Abre el modal de edición de categoría y carga los datos actuales
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

  // Cierra el modal de edición de categoría
  const closeModal = () => {
    setModalOpen(false);
    setCurrentCat(null);
  };

  // Maneja los cambios en los inputs del formulario de edición
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

  // Guarda los cambios de la categoría editada
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

  // Si no hay categorías, muestra mensaje de carga o error
  if (!categorias.length) {
    return error ? <Alert severity="error">{error}</Alert> : <Typography>Cargando categorías...</Typography>;
  }

  // Renderizado principal del componente
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
          backgroundImage: `url(${headerPreview || headerData?.header_img || '/Images/Categoria.png'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          py: { xs: 6, md: 8 },
        }}
      >
        <Box
          sx={{
            position: 'relative',
            zIndex: 2,
            textAlign: 'center',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
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
            {headerData?.header_title || 'Cargando...'}
          </Typography>
          {/* Capa oscura */}
          <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }} />
        </Box>
        {/* Botón editar header (solo admin) */}
        {isAdmin && (
          <IconButton
            onClick={() => setOpenHeaderEdit(true)}
            sx={{
              position: 'absolute',
              bottom: 16,
              right: 16,
              bgcolor: 'rgba(230,105,29,0.8)',
              '&:hover': { bgcolor: 'rgba(230,105,29,1)' },
              color: '#fff',
            }}
          >
            <EditIcon />
          </IconButton>
        )}
      </Box>

      {/* CARRUSEL */}
      <Box
        sx={{
          py: 6,
          px: { xs: 3, md: 10 },
          backgroundImage: `linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.1)), url(${headerData?.carrusel_img || '/Images/Fondo_Carrusel_Categorias.png'})`,
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
            {headerData?.carrusel_title}
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
            {headerData?.carrusel_subtitle}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
          {/* Botón anterior del carrusel */}
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

          {/* Tarjetas del carrusel */}
          <Box sx={{ display: 'flex', gap: 3, overflow: 'hidden', width: '80%', justifyContent: 'center' }}>
            {/* Botón editar carrusel (solo admin) */}
            {isAdmin && (
              <IconButton
                onClick={() => setOpenCarruselEdit(true)}
                sx={{
                  position: 'absolute',
                  bottom: 16,
                  right: 16,
                  bgcolor: 'rgba(230,105,29,0.8)',
                  '&:hover': { bgcolor: 'rgba(230,105,29,1)' },
                  color: '#fff',
                }}
              >
                <EditIcon />
              </IconButton>
            )}
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

          {/* Botón siguiente del carrusel */}
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

      {/* Modal para editar carrusel */}
      <Dialog open={openCarruselEdit} onClose={() => !carruselUploading && setOpenCarruselEdit(false)} maxWidth='sm' fullWidth>
        <DialogTitle>Editar Carrusel</DialogTitle>
        <DialogContent dividers sx={{ pt: 1.5, pb: 2, px: 2 }}>
          <TextField
            label='Título del carrusel'
            value={carruselTitleInput}
            onChange={e => setCarruselTitleInput(e.target.value)}
            fullWidth size='small' margin='dense'
          />
          <TextField
            label='Subtítulo del carrusel'
            value={carruselSubtitleInput}
            onChange={e => setCarruselSubtitleInput(e.target.value)}
            fullWidth size='small' margin='dense'
          />
          <Button
            variant='contained' component='label' disabled={carruselUploading} sx={{ mt: 2, fontWeight: 'bold', textTransform: 'none' }}
          >
            {carruselFile ? 'Imagen seleccionada' : 'Seleccionar nueva imagen'}
            <input
              type='file'
              hidden
              accept='image/jpeg,image/png,image/webp,image/avif'
              onChange={e => {
                const f = e.target.files?.[0] || null;
                setCarruselFile(f);
                if (f) setCarruselPreview(URL.createObjectURL(f));
              }}
            />
          </Button>

          {/* Vista previa de la imagen seleccionada */}
          {carruselPreview && (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography sx={{ fontSize: 13, mb: 1, color: 'text.secondary' }}>Vista previa</Typography>
              <Box
                component='img'
                src={carruselPreview}
                alt='Vista previa'
                sx={{ width: '100%', maxHeight: 250, objectFit: 'cover', borderRadius: 1.5 }}
              />
              <Button size='small' onClick={() => { setCarruselFile(null); setCarruselPreview(null); }} sx={{ mt: 1 }}>
                Quitar selección
              </Button>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setOpenCarruselEdit(false); setCarruselFile(null); setCarruselPreview(null); }} disabled={carruselUploading}>Cancelar</Button>
          <Button onClick={saveCarrusel} variant='contained' disabled={carruselUploading}>Guardar</Button>
        </DialogActions>
      </Dialog>

      {/* Modal para editar header */}
      <Dialog
        open={openHeaderEdit}
        onClose={() => !headerUploading && setOpenHeaderEdit(false)}
        maxWidth='sm'
        fullWidth
      >
        <DialogTitle>Editar encabezado</DialogTitle>
        <DialogContent dividers sx={{ pt: 1.5, pb: 2, px: 2 }}>
          <TextField
            label='Título del header'
            value={headerTitleInput}
            onChange={e => setHeaderTitleInput(e.target.value)}
            fullWidth
            size='small'
            margin='dense'
            InputLabelProps={{ shrink: true }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.2 } }}
          />

          <Button
            variant='contained'
            component='label'
            disabled={headerUploading}
            sx={{ mt: 2, fontWeight: 'bold', textTransform: 'none' }}
          >
            {headerFile ? 'Imagen seleccionada' : 'Seleccionar nueva imagen'}
            <input
              type='file'
              hidden
              accept='image/jpeg,image/png,image/webp,image/avif'
              onChange={e => {
                const f = e.target.files?.[0] || null;
                setHeaderFile(f);
                if (f) setHeaderPreview(URL.createObjectURL(f));
              }}
            />
          </Button>
          <Box sx={{ mt: 1, opacity: 0.8, fontSize: 12 }}>
            Formatos: JPG, PNG, WEBP, AVIF.
          </Box>

          {/* Vista previa de la imagen seleccionada */}
          {headerPreview && (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography sx={{ fontSize: 13, mb: 1, color: 'text.secondary' }}>Vista previa</Typography>
              <Box
                sx={{
                  width: '100%',
                  maxWidth: 400,
                  mx: 'auto',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1.5,
                  overflow: 'hidden',
                  pt: '30%',
                  bgcolor: '#f7f7f7',
                  boxShadow: 1,
                  position: 'relative',
                }}
              >
                <Box
                  component='img'
                  src={headerPreview}
                  alt='Vista previa'
                  sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </Box>
              <Button size='small' onClick={() => { setHeaderFile(null); setHeaderPreview(null); }} sx={{ mt: 1 }}>
                Quitar selección
              </Button>
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => { setOpenHeaderEdit(false); setHeaderFile(null); setHeaderPreview(null); }} disabled={headerUploading}>
            Cancelar
          </Button>
          <Button onClick={saveHeader} variant='contained' disabled={headerUploading}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

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
        </Typography>

        {/* Muestra cada categoría en su sección de detalle */}
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
            {/* Imagen de la categoría */}
            <Box sx={{ width: { xs: '100%', md: '40%' } }}>
              <img
                src={cat.image}
                alt={cat.titleText}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </Box>

            {/* Información de la categoría */}
            <Box sx={{ p: 4, flex: 1, position: 'relative' }}>
              <Box sx={{ height: '4px', background: 'linear-gradient(to right, transparent, #f26c23)', borderRadius: 2, width: '100%', }} />
              {/* Botón editar categoría (solo admin) */}
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

      {/* MODAL PARA EDITAR CATEGORÍA */}
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
          {/* CABECERA del modal */}
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#e6691d', letterSpacing: 1.5 }}>
              Editar Categoría
            </Typography>
            <Box sx={{ width: 60, height: 4, bgcolor: '#e6691d', mx: 'auto', mt: 1, borderRadius: 2 }} />
          </Box>

          {/* CAMPOS del formulario */}
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

          {/* BOTONES del modal */}
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

      {/* Mensaje de error global */}
      {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}
    </>
  );
};

export default Categorias;