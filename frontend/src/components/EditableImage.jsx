/* EditableImage.jsx es un componente que muestra una imagen que puede ser editada (cambiada) por el usuario 'Admin'.*/
import React, { useState, useRef } from "react";
import { Box, IconButton, styled, CircularProgress } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { motion } from "framer-motion";

const StyledBox = styled(Box)(({ theme }) => ({
  position: "relative",
  // Eliminamos overflow: "hidden" para evitar posibles redondeos heredados
  // overflow: "hidden", 
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  // IMPORTANTE: Para que la imagen genérica no sea circular, nos aseguramos de que este Box no tenga borderRadius propio.
  // El borderRadius se aplicará solo si se pasa explícitamente en el sx del componente padre, o si se usa el circular.

  "& .editable-image": {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    // Eliminamos borderRadius de aquí también, a menos que se especifique en el sx del componente padre.
    // borderRadius: "inherit", 
    transition: "opacity 0.3s ease",
  },
  "&:hover .edit-button, &:focus-within .edit-button": {
    opacity: 1,
  },
  "& .edit-button": {
    opacity: 0,
    transition: "opacity 0.3s ease",
    position: "absolute",
    bottom: 10,
    right: 10,
    zIndex: 2,
  },
}));

const HiddenInput = styled("input")({
  display: "none",
});

function EditableImage({ src, alt, onImageUpload, sx = {} }) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setIsUploading(true);
      try {
        await onImageUpload(file);
      } catch (error) {
        console.error("Error uploading image:", error);
        // Aquí podrías añadir lógica para mostrar un mensaje de error al usuario
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleEditClick = () => {
    fileInputRef.current.click();
  };

  return (
    <StyledBox sx={sx}>
      {/* Usamos un Box para contener la imagen y aplicar el objectFit */}
      <Box
        component={motion.img} // motion.img para las animaciones
        src={src}
        alt={alt}
        className="editable-image"
        initial={{ opacity: 0 }}
        animate={{ opacity: src ? 1 : 0 }} // Solo anima a visible si hay src
        transition={{ duration: 0.8 }}
        sx={{
          // Aseguramos que la imagen tome el tamaño del Box padre
          width: '100%',
          height: '100%',
          objectFit: 'cover', // Mantiene la relación de aspecto y recorta si es necesario
          display: 'block', // Evita espacios extra debajo de la imagen
          // Eliminamos cualquier borderRadius aquí, se gestionará en el sx del StyledBox padre si es necesario.
        }}
      />
      
      {isUploading && (
        <Box
          sx={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            bgcolor: 'rgba(255, 255, 255, 0.7)',
            zIndex: 3,
          }}
        >
          <CircularProgress size={40} />
        </Box>
      )}

      <HiddenInput
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
      />
      
      {/* El IconButton del botón de editar */}
      <IconButton
        onClick={handleEditClick}
        className="edit-button"
        disabled={isUploading}
        color="primary"
        sx={{
          bgcolor: 'white',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          '&:hover': {
            bgcolor: 'white',
          },
        }}
      >
        <EditIcon />
      </IconButton>
    </StyledBox>
  );
}

export default EditableImage;