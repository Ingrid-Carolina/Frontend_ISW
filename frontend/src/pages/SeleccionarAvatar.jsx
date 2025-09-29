// src/components/SeleccionarAvatar.jsx
import React from 'react';
// Importa componentes de Material UI para construir el diálogo y la galería de avatares
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Grid, Box, Typography
} from '@mui/material';

// Define el tamaño de cada avatar en la galería
const THUMB = 50;

// Lista de archivos de imagen disponibles como avatares
const FILES = [
  'guante.jpg','bate.jpg','pelota.jpg','casco.jpg','bate2.jpg','pelota2.jpg',
  'pelota3.png','silbato.jpg','avatar1.jpg','avatar2.jpg','avatar3.jpg',
  'avatar4.jpg','avatar5.jpg','avatar6.jpg','avatar7.jpg','avatar8.png',
  'avatar10.jpg','avatar11.jpg','avatar12.png','avatar13.png',
  'avatar14.png','avatar15.jpg','avatar16.jpg','avatar17.jpg','avatar18.jpg',
  'avatar19.jpg','avatar20.jpg','avatar21.jpg','Avatar22.png',
];

// Genera el arreglo de objetos de avatares con id e imagen
const AVATARES = FILES.map((f, i) => ({
  id: i + 1,
  imagen: `/Images/${f}`,
}));

// Función para normalizar la ruta de la imagen seleccionada
// Elimina prefijos innecesarios y asegura el formato correcto
const normalize = (url) => {
  if (!url) return '';
  // quita 'public/' al inicio y fuerza 'images' en minúscula
  return url
    .replace(/^\.?\.?\/?public\//i, '/')
    .replace(/^\/images\//, '/Images/')
    .replace(/^images\//, '/images/')
    .replace(/^\/?\/?images\//, '/images/');
};

// Componente principal para seleccionar un avatar desde la galería
export default function SeleccionarAvatar({ open, current, onSelect, onClose }) {
  // Estado para el avatar seleccionado actualmente
  const [selected, setSelected] = React.useState(normalize(current));

  // Actualiza el avatar seleccionado cuando cambia el valor actual o se abre el diálogo
  React.useEffect(() => {
    setSelected(normalize(current));
  }, [current, open]);

  // Maneja la confirmación de selección de avatar
  const handleChoose = () => {
    if (selected && onSelect) onSelect(selected); // guarda siempre /images/xxx
    onClose?.();
  };

  return (
    // Diálogo modal para mostrar la galería de avatares
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      keepMounted
      PaperProps={{
        sx: { borderRadius: 2, width: 'min(560px, 92vw)' },
      }}
    >
      {/* Título del diálogo */}
      <DialogTitle sx={{ py: 1.5 }}>Elige tu avatar</DialogTitle>

      {/* Contenido del diálogo: galería de avatares */}
      <DialogContent dividers sx={{ p: 2, maxHeight: { xs: '60vh', sm: '68vh' }, overflowY: 'auto' }}>
        {/* Texto descriptivo para el usuario */}
        <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
          Selecciona una imagen de la galería.
        </Typography>

        {/* Grid para mostrar todos los avatares disponibles */}
        <Grid container spacing={1.5} justifyContent="center">
          {AVATARES.map(({ id, imagen }) => (
            <Grid item key={id} xs={3} sm={2.4} md={2}>
              {/* Cada avatar se muestra en un Box circular, resaltado si está seleccionado */}
              <Box
                onClick={() => setSelected(imagen)}
                sx={{
                  width: THUMB + 8,
                  height: THUMB + 8,
                  m: '0 auto',
                  display: 'grid',
                  placeItems: 'center',
                  border: selected === imagen ? '3px solid #1976d2' : '2px solid #e0e0e0',
                  borderRadius: '9999px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'transform 0.12s, border-color 0.12s',
                  '&:hover': { transform: 'scale(1.04)' },
                }}
              >
                {/* Imagen del avatar */}
                <img
                  src={imagen}
                  alt={`Avatar ${id}`}
                  style={{ width: THUMB, height: THUMB, objectFit: 'cover', display: 'block' }}
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      </DialogContent>

      {/* Acciones del diálogo: cancelar o aceptar la selección */}
      <DialogActions sx={{ px: 2, py: 1.25 }}>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleChoose} variant="contained" disabled={!selected}>
          ACEPTAR
        </Button>
      </DialogActions>
    </Dialog>
  );
}
