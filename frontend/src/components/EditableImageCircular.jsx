//EditableImageCircular.jsx es un componente de React que muestra una imagen circular que puede ser editada al hacer clic en ella. Al pasar el cursor sobre la imagen, aparece un botón de edición que permite al usuario seleccionar un nuevo archivo de imagen desde su dispositivo. El componente utiliza Material-UI para los estilos y los iconos.
import React, { useState, useRef } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

const EditableImageCircular = ({ src, alt, onImageUpload, sx = {}, ...props }) => {
  const fileInputRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  // Maneja el clic en la imagen para abrir el selector de archivos 
  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  // Maneja el cambio de archivo y llama a la función onImageUpload con el archivo seleccionado
  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onImageUpload(file);
    }
  };

  // Renderiza el componente con estilos y funcionalidad
  return (
    <Box
      sx={{
        position: 'relative',
        cursor: 'pointer',
        display: 'inline-block',
        '&:hover .edit-button': {
          opacity: 1,
        },
        ...sx,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      <Box
        component="img"
        src={src}
        alt={alt}
        className="editable-image"
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          borderRadius: '50%', // Estilo circular
          transition: 'filter 0.3s ease-in-out',
          filter: isHovered ? 'brightness(0.7)' : 'brightness(1)',
        }}
      />
      <Tooltip title="Cambiar imagen" arrow>
        <IconButton
          className="edit-button"
          onClick={handleImageClick}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'rgba(255, 255, 255, 0.8)',
            color: '#000',
            opacity: 0,
            transition: 'opacity 0.3s ease-in-out',
            zIndex: 10,
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 1)',
            },
          }}
        >
          <EditIcon />
        </IconButton>
      </Tooltip>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleChange}
        style={{ display: 'none' }}
        accept="image/jpeg,image/png,image/webp,image/avif"
      />
    </Box>
  );
};

export default EditableImageCircular;