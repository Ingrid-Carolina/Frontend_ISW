import React, { useState } from 'react';
// Importa componentes de Material UI para estructura y estilos visuales
import { Box, Typography, TextField, Button, Alert, Link } from '@mui/material';
// Importa el logo del club para mostrar en el formulario
import logo from '/Images/Logo-pilotos.png';
// Importa el cliente API para realizar peticiones al backend
import { api } from '../api/api';

// Componente funcional para el registro de nuevos usuarios
const Registro = ({ onLoginClick }) => {
  // Estado para almacenar los datos del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmarPassword: ''
  });

  // Estado para almacenar errores de validación por campo
  const [errors, setErrors] = useState({});
  // Estado para mostrar mensajes de éxito o error tras el envío
  const [submitMessage, setSubmitMessage] = useState({ success: '', error: '' });

  // Función para validar los datos del formulario antes de enviar
  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Valida que el nombre no comience con espacio
    if (formData.nombre.startsWith(' ')) {
      newErrors.nombre = 'Formato de nombre Invalido';
    }
    // Valida que el nombre no esté vacío
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    }
    // Valida el correo electrónico
    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Correo electrónico inválido';
    } else if (!/@(gmail\.com|outlook\.com|hotmail\.com|yahoo\.com)$/i.test(formData.email)) {
      newErrors.email =
        'Solo se permiten correos de Gmail, Outlook o Hotmail';
    }

    // Validaciones de la contraseña: mínimo 8 caracteres, al menos una mayúscula, una minúscula y un número
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

    // Valida la confirmación de la contraseña
    if (!formData.confirmarPassword) {
      newErrors.confirmarPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmarPassword) {
      newErrors.confirmarPassword = 'Las contraseñas no coinciden';
    }

    // Actualiza el estado de errores y retorna si el formulario es válido
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Maneja el cambio de los campos del formulario y limpia mensajes previos
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

  // Realiza la petición de registro al backend usando la API
  const realizarPeticion = async () => {
    try {
      const res = await api.post('/auth/signup', {
        nombre: formData.nombre,
        email: formData.email,
        password: formData.password
      });
      return res; // Retorna la respuesta para manejar en handleSubmit
    } catch (error) {
      // Muestra mensaje de error si la petición falla
      const mensaje = error?.data?.mensaje || error?.message || 'Error en la Red';
      setSubmitMessage({ success: '', error: mensaje });
    }
  };

  // Maneja el envío del formulario: valida, envía y muestra mensajes
  const handleSubmit = async () => {
    if (!validateForm()) return;

    const respuesta = await realizarPeticion();
    console.log("Respuesta:", respuesta);

    // Si la respuesta es exitosa, muestra mensaje y limpia el formulario
    if (respuesta.status) {
      setSubmitMessage({ success: respuesta.data?.mensaje, error: '' });
      setFormData({
        nombre: '',
        email: '',
        password: '',
        confirmarPassword: ''
      });
      // Redirige al login después de 2 segundos
      setTimeout(() => {
        onLoginClick();
      }, 2000);
    }
  };

  // Renderiza el formulario de registro con validaciones y mensajes
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
      {/* Logo del club en la parte superior */}
      <img
        src={logo}
        alt="Logo Pilotos"
        style={{ width: '300px', marginBottom: '1rem' }}
      />

      {/* Contenedor del formulario con estilos de tarjeta */}
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
        {/* Título del formulario */}
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

        {/* Mensaje de error o éxito tras el envío */}
        {submitMessage.error && <Alert severity="error" sx={{ mb: 2 }}>{submitMessage.error}</Alert>}
        {submitMessage.success && <Alert severity="success" sx={{ mb: 2 }}>{submitMessage.success}</Alert>}

        {/* Campo de nombre */}
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

        {/* Campo de correo electrónico */}
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

        {/* Campo de contraseña */}
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

        {/* Campo para confirmar la contraseña */}
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

        {/* Botón para enviar el formulario de registro */}
        <Button
          fullWidth
          variant="contained"
          onClick={handleSubmit}
          sx={{ mt: 2, bgcolor: '#f06414', '&:hover': { bgcolor: '#d95811' } }}
        >
          REGISTRARSE
        </Button>

        {/* Enlace para ir al login si ya tiene cuenta */}
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

// Exporta el componente para su uso en el sistema de rutas
export default Registro;
