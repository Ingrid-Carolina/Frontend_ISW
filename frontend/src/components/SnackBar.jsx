import React from 'react';
import Snackbar from '@mui/material/Snackbar';

export default function CustomSnackbar({
  open,
  message,
  onClose,
  vertical = 'bottom',
  horizontal = 'center',
  duration = 3000, // duración opcional por defecto
}) {
  return (
    <Snackbar
      style={{font:'Petermedium'}}
      anchorOrigin={{ vertical, horizontal }}
      open={open}
      onClose={onClose}
      message={message}
      autoHideDuration={duration}
      key={vertical + horizontal}
    />
  );
}
