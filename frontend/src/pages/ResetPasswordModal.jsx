import React, { useState } from 'react';
// Importa componentes de Material UI para estructura y estilos visuales del modal
import {
    Modal,
    Box,
    Typography,
    TextField,
    Button,
    IconButton,
} from '@mui/material';
// Importa el ícono de cerrar para el modal
import CloseIcon from '@mui/icons-material/Close';
// Importa el cliente API para realizar la petición al backend
import { api } from '../api/api';

// Componente modal para recuperación de contraseña
const ResetPasswordModal = ({ open, onClose, emailValue }) => {
    // Estado para el correo electrónico ingresado
    const [email, setEmail] = useState(emailValue || '');
    // Estado para mostrar mensajes de éxito
    const [message, setMessage] = useState('');
    // Estado para mostrar mensajes de error
    const [error, setError] = useState('');

    // Maneja el envío del formulario de recuperación
    const handleSubmit = async e => {
        e.preventDefault();
        try {
            // Realiza la petición al backend para enviar el correo de recuperación
            const response = await api.post('/auth/restablecer', { email });

            // Muestra mensaje de éxito y limpia el campo de correo
            setMessage(response.data.mensaje || 'Correo enviado exitosamente.');
            setError('');
            setEmail('');

            // Limpia el mensaje después de 5 segundos
            setTimeout(() => {
                setMessage('');
            }, 5000);
        } catch (err) {
            // Muestra mensaje de error si la petición falla
            console.error('Error desde backend:', err);
            const msg =
                err?.response?.data?.mensaje ||
                err?.message ||
                'Hubo un error al enviar el correo. Intenta de nuevo.';
            setError(msg);
            setMessage('');
            // Limpia el error después de 5 segundos
            setTimeout(() => setError(''), 5000);
        }
    };

    return (
        // Modal de Material UI, se muestra si open es true
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'white',
                    borderRadius: 2,
                    boxShadow: 24,
                    p: 4,
                    width: '90%',
                    maxWidth: 400,
                }}
            >
                {/* Botón para cerrar el modal */}
                <IconButton
                    onClick={onClose}
                    sx={{ position: 'absolute', top: 8, right: 8 }}
                >
                    <CloseIcon />
                </IconButton>

                {/* Título del modal */}
                <Typography variant='h6' sx={{ mb: 2 }}>
                    Recuperar contraseña
                </Typography>

                {/* Descripción breve para el usuario */}
                <Typography variant='body2' sx={{ mb: 2 }}>
                    Ingresa tu correo para recibir un enlace de recuperación.
                </Typography>

                {/* Formulario para ingresar el correo electrónico */}
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label='Correo electrónico'
                        type='email'
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        sx={{ mb: 2 }}
                    />

                    {/* Botón para enviar el formulario */}
                    <Button
                        type='submit'
                        fullWidth
                        variant='contained'
                        sx={{
                            backgroundColor: '#e06c14',
                            '&:hover': { backgroundColor: '#c05d11' },
                        }}
                    >
                        Enviar enlace
                    </Button>
                </form>

                {/* Mensaje de éxito si el correo fue enviado */}
                {message && (
                    <Typography color='success.main' sx={{ mt: 2 }}>
                        {message}
                    </Typography>
                )}

                {/* Mensaje de error si ocurrió algún problema */}
                {error && (
                    <Typography color='error.main' sx={{ mt: 2 }}>
                        {error}
                    </Typography>
                )}
            </Box>
        </Modal>
    );
};

// Exporta el componente para su uso en otras partes de la aplicación
export default ResetPasswordModal;
