import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Alert, Link } from '@mui/material';
import logo from '/Images/Logo-pilotos.png';

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

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Correo electrónico inválido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Debe tener al menos 8 caracteres';
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

  const handleSubmit = () => {
    if (!validateForm()) return;

    // Simulación de envío
    console.log('Registrado:', formData);
    setSubmitMessage({ success: '¡Registro exitoso!', error: '' });

    setFormData({
      nombre: '',
      email: '',
      password: '',
      confirmarPassword: ''
    });
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
        style={{ width: '300px', marginBottom: '1rem'}}
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
            fontFamily: '"Jersey", cursive',
            fontWeight: 'bold',
            textAlign: 'center',
            mb: { xs: 3, md: 4 },
            fontSize: { xs: '2.5rem', sm: '3rem', md: '4rem' },
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
          helperText={errors.password}
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
