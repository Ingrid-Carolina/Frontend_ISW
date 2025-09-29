// components/EditableText.jsx es un componente de React que permite editar texto al hacer clic en él. 
// Si el usuario tiene permisos de administrador, aparece un botón de edición al pasar el cursor sobre el texto. 
// Al hacer clic en el botón, se abre un modal con un campo de texto para editar el contenido. 
// El componente utiliza Material-UI para los estilos y los componentes de la interfaz de usuario.
import React, { useState, useEffect } from 'react';
import { Box, Typography, Backdrop, TextField, Button } from '@mui/material';

// Icono de edición personalizado
const Edit = () => (
    <svg
        width='14'
        height='14'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
    >
        <path d='M12 20h9' />
        <path d='M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z' />
    </svg>
);

// Componente EditableText
const EditableText = ({
    text,
    onTextSave,
    isAdmin,
    variant = 'body1',
    sx = {},
    className = '',
    multiline = false,
    placeholder = 'Escribe aquí...'
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedText, setEditedText] = useState(text);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        setEditedText(text);
    }, [text]);

    const handleSave = () => {
        if (editedText.trim() !== text) {
            onTextSave(editedText.trim());
        }
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditedText(text);
        setIsEditing(false);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey && !multiline) {
            e.preventDefault();
            handleSave();
        }
        if (e.key === 'Escape') {
            handleCancel();
        }
    };

    if (isEditing) {
        return (
            <Backdrop open={isEditing} sx={{ zIndex: 1300 }}>
                <Box className="text-edit-modal">
                    <Box className="text-edit-modal-content fade-in">
                        <Typography variant="h6" sx={{ mb: 2, color: '#333' }}>
                            Editar texto
                        </Typography>
                        <TextField
                            value={editedText}
                            onChange={(e) => setEditedText(e.target.value)}
                            onKeyPress={handleKeyPress}
                            multiline={multiline}
                            minRows={multiline ? 3 : 1}
                            maxRows={multiline ? 10 : 1}
                            fullWidth
                            variant="outlined"
                            autoFocus
                            placeholder={placeholder}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#667eea',
                                    },
                                },
                            }}
                        />
                        <Box className="text-edit-buttons">
                            <Button
                                onClick={handleCancel}
                                variant="outlined"
                                sx={{
                                    borderRadius: '25px',
                                    textTransform: 'none',
                                }}
                            >
                                Cancelar
                            </Button>
                            <Button
                                onClick={handleSave}
                                variant="contained"
                                sx={{
                                    background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                                    borderRadius: '25px',
                                    textTransform: 'none',
                                }}
                            >
                                Guardar
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Backdrop>
        );
    }

    return (
        <Box
            className={`editable-text ${className} ${isHovered ? 'hovered' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            sx={{
                display: 'inline-block',
                position: 'relative',
                ...sx
            }}
        >
            <Typography 
                variant={variant} 
                className="editable-text-content"
                sx={sx}
            >
                {text}
            </Typography>
            
            {isAdmin && (
                <Button
                    className="edit-text-button"
                    onClick={() => setIsEditing(true)}
                    sx={{
                        minWidth: 'auto',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        '&:hover': {
                            backgroundColor: '#3b82f6',
                            color: 'white',
                        },
                        p: 0,
                    }}
                >
                    <Edit />
                </Button>
            )}
        </Box>
    );
};

export default EditableText;