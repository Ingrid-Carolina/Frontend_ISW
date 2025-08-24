// src/components/SeleccionarAvatar.jsx
import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Grid, Box, Typography
} from '@mui/material';

const THUMB = 50;

const AVATARES = [
  { id: 1, imagen: '../public/images/guante.jpg' },
  { id: 2, imagen: '../public/images/bate.jpg' },
  { id: 3, imagen: '../public/images/pelota.jpg' },
  { id: 4, imagen: '../public/images/casco.jpg' },
  { id: 5, imagen: '../public/images/bate2.jpg' },
  { id: 6, imagen: '../public/images/pelota2.jpg' },
  { id: 7, imagen: '../public/images/pelota3.png' },
  { id: 8, imagen: '../public/images/silbato.jpg' },
  { id: 9, imagen: '../public/images/avatar1.jpg' },
  { id: 10, imagen: '../public/images/avatar2.jpg' },
  { id: 11, imagen: '../public/images/avatar3.jpg' },
  { id: 12, imagen: '../public/images/avatar4.jpg' },
  { id: 13, imagen: '../public/images/avatar5.jpg' },
  { id: 14, imagen: '../public/images/avatar6.jpg' },
  { id: 15, imagen: '../public/images/avatar7.jpg' },
  { id: 16, imagen: '../public/images/avatar8.png' },
  { id: 17, imagen: '../public/images/avatar9.jpg' },
  { id: 18, imagen: '../public/images/avatar10.jpg' },
  { id: 19, imagen: '../public/images/avatar11.jpg' },
  { id: 20, imagen: '../public/images/avatar12.png' },
  { id: 21, imagen: '../public/images/avatar13.png' },
  { id: 22, imagen: '../public/images/avatar14.png' },
  { id: 23, imagen: '../public/images/avatar15.jpg' },
  { id: 24, imagen: '../public/images/avatar16.jpg' },
  { id: 25, imagen: '../public/images/avatar17.jpg' },
  { id: 26, imagen: '../public/images/avatar18.jpg' },
  { id: 27, imagen: '../public/images/avatar19.jpg' },
  { id: 28, imagen: '../public/images/avatar20.jpg' },
  { id: 29, imagen: '../public/images/avatar21.jpg' },
  { id: 30, imagen: '../public/images/avatar22.png' },
];

export default function SeleccionarAvatar({ open, current, onSelect, onClose }) {
  const [selected, setSelected] = React.useState(current || '');

  React.useEffect(() => {
    setSelected(current || '');
  }, [current, open]);

  const handleChoose = () => {
    if (selected && onSelect) onSelect(selected);
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
        sx: {
          borderRadius: 2,
          width: 'min(560px, 92vw)',   // controla ancho máximo
        },
      }}
    >
      <DialogTitle sx={{ py: 1.5 }}>Elige tu avatar</DialogTitle>

      <DialogContent
        dividers
        sx={{
          p: 2,
          maxHeight: { xs: '60vh', sm: '68vh' }, // altura máx + scroll interno
          overflowY: 'auto',
        }}
      >
        <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
          Selecciona una imagen de la galería.
        </Typography>

        <Grid container spacing={1.5} justifyContent="center">
          {AVATARES.map(({ id, imagen }) => (
            <Grid
              item
              key={id}
              xs={3}    // 4 por fila en móviles
              sm={2.4}  // 5 por fila (MUI acepta decimales)
              md={2}    // 6 por fila en desktop
            >
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
                  style={{
                    width: THUMB,
                    height: THUMB,
                    objectFit: 'cover',
                    display: 'block',
                  }}
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