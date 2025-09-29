// Componente TextField.jsx es un componente de React que utiliza Material-UI para renderizar un campo de texto personalizable.
// Permite definir el tipo de campo (texto, email, contraseña), manejar cambios en el valor, mostrar errores y mensajes de ayuda, y aplicar estilos personalizados.

import React from 'react';
import { TextField as MuiTextField, FormHelperText } from '@mui/material';

// Componente TextField con props para personalización
const TextField = ({ 
  nombre, 
  rol, 
  value = '', 
  onChange, 
  error = false, 
  helperText = '', 
  placeholder = '',
  fullWidth = true,
  ...props 
}) => {
  
  // Maneja el cambio de valor y llama a la función onChange si está definida
  const handleChange = (event) => {
    const newValue = event.target.value;
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <>
      <MuiTextField
        name={nombre}
        type={rol === 'password' ? 'password' : rol === 'email' ? 'email' : 'text'}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        error={error}
        fullWidth={fullWidth}
        variant="outlined"
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            fontSize: { xs: '0.95rem', sm: '1rem' },
            '& fieldset': {
              borderColor: error ? '#f44336' : '#e0e0e0',
              borderWidth: '2px',
            },
            '&:hover fieldset': {
              borderColor: error ? '#f44336' : '#e06c14',
            },
            '&.Mui-focused fieldset': {
              borderColor: error ? '#f44336' : '#e06c14',
              borderWidth: '2px',
            },
          },
          '& .MuiInputBase-input': {
            fontFamily: 'inherit',
            py: { xs: 1.5, sm: 1.75 },
            px: 2,
          },
          '& .MuiInputBase-input::placeholder': {
            color: '#999999',
            opacity: 1,
          }
        }}
        {...props}
      />
      {helperText && (
        <FormHelperText 
          error={error}
          sx={{ 
            mt: 0.5, 
            mx: 0,
            fontSize: '0.875rem',
            fontFamily: 'inherit'
          }}
        >
          {helperText}
        </FormHelperText>
      )}
    </>
  );
};

export default TextField;