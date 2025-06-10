import React, { useState } from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Typography,
  IconButton,
  InputAdornment,
  Stack,
  Box,
  Alert,
  TextField,
  Button,
  Link
} from '@mui/material';
import logo from '/Images/Logo-pilotos.png';

const Login = ({ onRegistroClick }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);


  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [recoveryMessage, setRecoveryMessage] = useState('');

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Correo electrónico inválido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    setSubmitError('');
    setRecoveryMessage('');
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Login exitoso');
    } catch (error) {
      setSubmitError('Credenciales incorrectas.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = () => {
    if (!formData.email.trim()) {
      setErrors({ email: 'Ingresa tu correo para recuperar la contraseña' });
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setErrors({ email: 'Correo electrónico inválido' });
      return;
    }

    setRecoveryMessage(
      'Se ha enviado un enlace para restablecer la contraseña a tu correo.'
    );
  };

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fdfdfd',
        px: 2
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 400, textAlign: 'center' }}>
        {/* Logo */}
        <img
          src={logo}
          alt="Logo"
          style={{ width: '300px', marginBottom: '1rem' }}
        />

        {/* Título */}
        <Typography
          variant="h5"
          sx={{
            fontFamily: '"Varsity", cursive',
            fontWeight: 'bold',
            textAlign: 'center',
            mb: { xs: 3, md: 4 },
            fontSize: { xs: '2.5rem', sm: '3rem', md: '4rem' },
            color: '#e06c14'
          }}
        >
          INICIAR SESIÓN
        </Typography>

        {/* Mensajes */}
        {submitError && (
          <Alert
            severity="error"
            onClose={() => setSubmitError('')}
            sx={{ mb: 2 }}
          >
            {submitError}
          </Alert>
        )}
        {recoveryMessage && (
          <Alert
            severity="info"
            onClose={() => setRecoveryMessage('')}
            sx={{ mb: 2 }}
          >
            {recoveryMessage}
          </Alert>
        )}

        {/* Campo Email */}
        <TextField
          name="email"
          label="Correo electrónico"
          value={formData.email}
          onChange={handleInputChange}
          error={!!errors.email}
          helperText={errors.email}
          fullWidth
          margin="normal"
        />

        {/* Campo Contraseña */}
        <TextField
  name="password"
  type={showPassword ? 'text' : 'password'}
  label="Contraseña"
  value={formData.password}
  onChange={handleInputChange}
  error={!!errors.password}
  helperText={errors.password}
  fullWidth
  margin="normal"
  InputProps={{
    endAdornment: (
      <InputAdornment position="end">
        <IconButton
          onClick={() => setShowPassword((prev) => !prev)}
          edge="end"
        >
          {showPassword ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      </InputAdornment>
    )
  }}
/>


        {/* Enlace recuperar */}
        <Box sx={{ textAlign: 'right', mt: 1 }}>
          <Link
            component="button"
            onClick={handleForgotPassword}
            sx={{
              fontSize: '0.85rem',
              color: '#f06414',
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </Box>

        {/* Botón */}
        <Button
          variant="contained"
          fullWidth
          onClick={handleLogin}
          disabled={isSubmitting}
          sx={{
            mt: 2,
            backgroundColor: '#fa7600',
            '&:hover': {
              backgroundColor: '#e56700'
            }
          }}
        >
          {isSubmitting ? 'Iniciando...' : 'Iniciar sesión'}
        </Button>

        {/* Registro */}
        <Typography sx={{ mt: 2, fontSize: '0.9rem' }}>
          ¿No tienes una cuenta?{' '}
          <Link
            component="button"
            onClick={onRegistroClick}
            sx={{ fontWeight: 'bold' }}
          >
            Regístrate
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;
