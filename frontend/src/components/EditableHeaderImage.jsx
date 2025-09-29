/*EditableHeaderImage.jsx es el archivo que permite cambiar la imagen de fondo del header, y hacerla editable cada vez que se necesite*/
import React, { useRef } from 'react';
import { IconButton, Box, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

// Componente para editar la imagen de fondo del header
const EditableHeaderImage = ({ onImageUpload }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const handleEditClick = () => {
    fileInputRef.current.click();
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'flex-end', // Alinea el botón a la derecha
        alignItems: 'flex-end', // Alinea el botón abajo
        zIndex: 10, // Asegura que esté por encima del filtro
        pointerEvents: 'none', // Permite clics a través del div, excepto en el botón
      }}
    >
      <Tooltip title="Cambiar imagen de fondo" arrow>
        <IconButton
          onClick={handleEditClick}
          sx={{
            pointerEvents: 'auto', // Habilita clics en el botón
            bgcolor: 'rgba(255, 255, 255, 0.8)',
            margin: '20px',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 1)',
            },
          }}
        >
          <EditIcon />
        </IconButton>
      </Tooltip>
      <input // Input oculto para seleccionar archivo
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        accept="image/jpeg,image/png,image/webp,image/avif"
      />
    </Box>
  );
};

export default EditableHeaderImage;