import React from 'react';
import { Button, CircularProgress } from '@mui/material';

const Boton = ({ 
  mensaje, 
  referencia, 
  onClick, 
  disabled = false,
  loading = false,
  variant = 'contained',
  fullWidth = false,
  ...props 
}) => {
  
  const handleClick = () => {
    console.log('Botón clickeado:', mensaje);
    if (onClick && !disabled && !loading) {
      onClick();
    }
  };

  return (
    <Button 
      variant={variant}
      onClick={handleClick}
      disabled={disabled || loading}
      fullWidth={fullWidth}
      sx={{
        backgroundColor: variant === 'contained' ? '#e06c14' : 'transparent',
        color: variant === 'contained' ? 'white' : '#e06c14',
        borderColor: variant === 'outlined' ? '#e06c14' : 'transparent',
        '&:hover': {
          backgroundColor: '#c55a11',
          color: 'white',
          borderColor: '#c55a11',
        },
        '&:disabled': {
          backgroundColor: variant === 'contained' ? '#cccccc' : 'transparent',
          color: '#666666',
          borderColor: variant === 'outlined' ? '#cccccc' : 'transparent',
        },
        fontFamily: 'Groteskbold',
        fontWeight: 'bold',
        py: { xs: 1.5, sm: 1.75 },
        px: { xs: 2, sm: 3 },
        fontSize: { xs: '0.9rem', sm: '1rem' },
        borderRadius: 2,
        textTransform: 'none',
        minHeight: { xs: '44px', sm: '48px' }, // Mejor accesibilidad táctil
        position: 'relative',
        ...props.sx
      }}
      {...props}
    >
      {loading && (
        <CircularProgress
          size={20}
          sx={{
            color: 'inherit',
            position: 'absolute',
            left: '50%',
            top: '50%',
            marginLeft: '-10px',
            marginTop: '-10px',
          }}
        />
      )}
      <span style={{ opacity: loading ? 0 : 1 }}>
        {mensaje}
      </span>
    </Button>
  );
};

export default Boton;