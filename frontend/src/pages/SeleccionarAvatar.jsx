// src/components/SeleccionarAvatar.jsx
import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Grid, Box, Typography
} from '@mui/material';

const THUMB = 50;

const FILES = [
  'guante.jpg','bate.jpg','pelota.jpg','casco.jpg','bate2.jpg','pelota2.jpg',
  'pelota3.png','silbato.jpg','avatar1.jpg','avatar2.jpg','avatar3.jpg',
  'avatar4.jpg','avatar5.jpg','avatar6.jpg','avatar7.jpg','avatar8.png',
  'avatar10.jpg','avatar11.jpg','avatar12.png','avatar13.png',
  'avatar14.png','avatar15.jpg','avatar16.jpg','avatar17.jpg','avatar18.jpg',
  'avatar19.jpg','avatar20.jpg','avatar21.jpg','Avatar22.png',
];

const AVATARES = FILES.map((f, i) => ({
  id: i + 1,
  imagen: `/Images/${f}`,
}));

// Normaliza cualquier variante previa (/public, /Images, etc.)
const normalize = (url) => {
  if (!url) return '';
  // quita 'public/' al inicio y fuerza 'images' en minúscula
  return url
    .replace(/^\.?\.?\/?public\//i, '/')
    .replace(/^\/images\//, '/Images/')
    .replace(/^images\//, '/images/')
    .replace(/^\/?\/?images\//, '/images/');
};

export default function SeleccionarAvatar({ open, current, onSelect, onClose }) {
  const [selected, setSelected] = React.useState(normalize(current));

  React.useEffect(() => {
    setSelected(normalize(current));
  }, [current, open]);

  const handleChoose = () => {
    if (selected && onSelect) onSelect(selected); // guarda siempre /images/xxx
    onClose?.();
  };

  return (
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
      <DialogTitle sx={{ py: 1.5 }}>Elige tu avatar</DialogTitle>

      <DialogContent dividers sx={{ p: 2, maxHeight: { xs: '60vh', sm: '68vh' }, overflowY: 'auto' }}>
        <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
          Selecciona una imagen de la galería.
        </Typography>

        <Grid container spacing={1.5} justifyContent="center">
          {AVATARES.map(({ id, imagen }) => (
            <Grid item key={id} xs={3} sm={2.4} md={2}>
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

      <DialogActions sx={{ px: 2, py: 1.25 }}>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleChoose} variant="contained" disabled={!selected}>
          ACEPTAR
        </Button>
      </DialogActions>
    </Dialog>
  );
}
