import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Alert, Link } from '@mui/material';
import logo from '/Images/Logo-pilotos.png';
//import axios from 'axios';
import { api } from '../api/api';

const Registro = ({ onLoginClick }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmarPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [submitMessage, setSubmitMessage] = useState({ success: '', error: '' });

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.nombre.startsWith(' ')) {
      newErrors.nombre = 'Formato de nombre Invalido';
    }

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Correo electrónico inválido';
    } else if (!/@(gmail\.com|outlook\.com|hotmail\.com|yahoo\.com)$/i.test(formData.email)) {
      newErrors.email =
        'Solo se permiten correos de Gmail, Outlook o Hotmail';
    }


    let num = false;
    let May = false;
    let Min = false;

    for (let i = 0; i < formData.password.length; i++) {
      let carac = formData.password.charCodeAt(i);
      if (carac >= 97 && carac <= 122) {
        Min = true;
      }
      else if (carac >= 65 && carac <= 90) {
        May = true;
      }
      else if (carac >= 48 && carac <= 57) {
        num = true;
      }
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Debe tener al menos 8 caracteres';
    } else if (!Min && !May && !num) {
      newErrors.password = 'Debe tener al menos 1 número\nDebe tener al menos 1 letra mayúscula\nDebe tener al menos 1 minúscula';
    } else if (!num && !May) {
      newErrors.password = 'Debe tener al menos 1 número\nDebe tener al menos 1 letra mayúscula';
    } else if (!num && !Min) {
      newErrors.password = 'Debe tener al menos 1 número\nDebe tener al menos 1 letra minúscula';
    } else if (!Min && !May) {
      newErrors.password = 'Debe tener al menos 1 letra mayúscula\nDebe tener al menos 1 letra minúscula';
    } else if (!Min) {
      newErrors.password = 'Debe tener al menos 1 letra minúscula';
    } else if (!May) {
      newErrors.password = 'Debe tener al menos 1 letra mayúscula';
    } else if (!num) {
      newErrors.password = 'Debe tener al menos 1 número';
    }


    if (!formData.confirmarPassword) {
      newErrors.confirmarPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmarPassword) {
      newErrors.confirmarPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setSubmitMessage({ success: '', error: '' });
    setErrors(prev => ({
      ...prev,
      [e.target.name]: ''
    }));
  };

  // Repeticion de logica aqui.
  const realizarPeticion = async () => {
    try {
      const res = await api.post('/auth/signup', {
        nombre: formData.nombre,
        email: formData.email,
        password: formData.password
      });
      return res.data;
    } catch (error) {
      if (error.response) {
        window.alert(error.response.data.mensaje);
      } else if (error.request) {
        window.alert('Ninguna respuesta del servidor. Por favor verifique su red.');
      } else {
        window.alert('Error en la red.');
      }
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const respuesta = await realizarPeticion(); // Espera la respuesta
    if (respuesta && respuesta.mensaje) {
      setSubmitMessage({ success: '¡Registro exitoso!', error: '' });
      setFormData({
        nombre: '',
        email: '',
        password: '',
        confirmarPassword: ''
      });
      setTimeout(() => {
        onLoginClick();
      }, 2000);

    } else {
      setSubmitMessage({ success: '', error: 'Registro fallido. Vuelva a intentarlo' });
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh',
        justifyContent: 'center',
        bgcolor: '#f9f9f9',
        px: 2
      }}
    >
      <img
        src={logo}
        alt="Logo Pilotos"
        style={{ width: '300px', marginBottom: '1rem' }}
      />

      <Box
        sx={{
          bgcolor: '#fff',
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
          width: '100%',
          maxWidth: 400
        }}
      >
        <Typography variant="h5" sx={{
          fontFamily: '"Varsity", cursive',
          fontWeight: 'bold',
          textAlign: 'center',
          mb: { xs: 3, md: 4 },
          fontSize: { xs: '2.3rem', sm: '2.8rem', md: '3.7rem' },
          color: '#e06c14'
        }}>
          Regístrate
        </Typography>

        {submitMessage.error && <Alert severity="error" sx={{ mb: 2 }}>{submitMessage.error}</Alert>}
        {submitMessage.success && <Alert severity="success" sx={{ mb: 2 }}>{submitMessage.success}</Alert>}

        <TextField
          label="Nombre"
          name="nombre"
          fullWidth
          margin="normal"
          value={formData.nombre}
          onChange={handleChange}
          error={!!errors.nombre}
          helperText={errors.nombre}
        />

        <TextField
          label="Correo electrónico"
          name="email"
          fullWidth
          margin="normal"
          value={formData.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
        />

        <TextField
          label="Contraseña"
          type="password"
          name="password"
          fullWidth
          margin="normal"
          value={formData.password}
          onChange={handleChange}
          error={!!errors.password}
          helperText={
            errors.password
              ? errors.password.split('\n').map((line, i) => (
                <span key={i} style={{ display: 'block' }}>{line}</span>
              ))
              : ''
          }
        />

        <TextField
          label="Confirmar contraseña"
          type="password"
          name="confirmarPassword"
          fullWidth
          margin="normal"
          value={formData.confirmarPassword}
          onChange={handleChange}
          error={!!errors.confirmarPassword}
          helperText={errors.confirmarPassword}
        />

        <Button
          fullWidth
          variant="contained"
          onClick={handleSubmit}
          sx={{ mt: 2, bgcolor: '#f06414', '&:hover': { bgcolor: '#d95811' } }}
        >
          REGISTRARSE
        </Button>

        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          ¿Ya tienes una cuenta?{' '}
          <Link
            component="button"
            onClick={onLoginClick}
            sx={{ color: '#f06414', textDecoration: 'none' }}
          >
            Inicia sesión
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Registro;
