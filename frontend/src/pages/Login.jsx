import React, { useState } from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Typography,
  IconButton,
  InputAdornment,
  Box,
  Alert,
  TextField,
  Button,
  Link
} from '@mui/material';
import logo from '/Images/Logo-pilotos.png';
import axios from 'axios';

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

  const [failedAttempts, setFailedAttempts] = useState(0);
  const MAX_ATTEMPTS = 6;

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Correo electrónico inválido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
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


  const realizarPeticion = async () => {
    const url = "http://localhost:3000/auth/signin"; 

    const body = {
        email: formData.email,
        password: formData.password,
    };

    try {
        const res = await axios.post(url, body, {
            headers: { "Content-Type": "application/json" }
        });

        console.log("response data: ", res.data.mensaje);
          window.alert((res.data.mensaje));
        return res.data;
    } catch (error) {
        console.log("Error:", error);

        if (error.response) {
            console.log("Error data:", error.response.data.mensaje);
            console.log("Error status:", error.response.status);

            window.alert((error.response.data.mensaje));
        } else if (error.request) {
            window.alert("Ninguna respuesta del servidor.Por favor verifique su red.");
        } else {
            window.alert("Error en la red.");
        }
    }
};



  const handleLogin = async () => {
    if (!validateForm()) return;

    realizarPeticion();


    /*if (failedAttempts >= MAX_ATTEMPTS) {
      setSubmitError('Has excedido el número máximo de intentos. Intenta más tarde.');
      return;
    }*/

    setIsSubmitting(true);
    /*try {

      const idToken = await userCredential.user.getIdToken();

      const response = await fetch('http://localhost:3000/api/logi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`
        },
        body: JSON.stringify({ otroDato: 'si necesitas' })
      });

      const result = await response.json();
      console.log('Respuesta del backend:', result);

      if (!response.ok) {
        setSubmitError(result.message || 'Error al iniciar sesión');
      } else {
        console.log('Inicio de sesión correcto');
        setFailedAttempts(0); // Reiniciar contador si fue exitoso
      }

    } catch (error) {
      const nuevoIntento = failedAttempts + 1;
      setFailedAttempts(nuevoIntento);

      const restante = MAX_ATTEMPTS - nuevoIntento;
      setSubmitError(
        restante ==0
          ? `Has excedido el número máximo de intentos. Intenta más tarde.`
          : 'Correo o contraseña incorrecta'
      );
    } finally {
      setIsSubmitting(false);
    }
  };*/

   setFormData({
      email: '',
      password: '',
    });
  }

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
        <img
          src={logo}
          alt="Logo"
          style={{ width: '300px', marginBottom: '1rem' }}
        />

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

        <Button
          variant="contained"
          fullWidth
          onClick={handleLogin}
          disabled={isSubmitting || failedAttempts >= MAX_ATTEMPTS}
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