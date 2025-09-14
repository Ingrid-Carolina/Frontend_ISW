import React, { useState, useRef } from "react";
import { Box, IconButton, styled, CircularProgress } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { motion } from "framer-motion";

const StyledBox = styled(Box)(({ theme }) => ({
  position: "relative",
  overflow: "hidden", 
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  
  "& .editable-image": {
    width: "100%",
    height: "100%",
    objectFit: "cover", 
    borderRadius: "inherit",
    transition: "opacity 0.3s ease",
  },
  "&:hover .edit-button, &:focus-within .edit-button": {
    opacity: 1,
  },
  "& .edit-button": {
    opacity: 0,
    transition: "opacity 0.3s ease",
    position: "absolute",
    // NUEVA POSICIÓN: Dentro de los bordes de la imagen
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
      await onImageUpload(file);
      setIsUploading(false);
    }
  };

  const handleEditClick = () => {
    fileInputRef.current.click();
  };

  return (
    <StyledBox sx={sx}>
      <motion.img
        src={src}
        alt={alt}
        className="editable-image"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      />
      <HiddenInput
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
      />
      <IconButton
        onClick={handleEditClick}
        className="edit-button"
        disabled={isUploading}
        color="primary"
        sx={{
          bgcolor: 'white', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          '&:hover': {
            bgcolor: 'white'
          }
        }}
      >
        {isUploading ? <CircularProgress size={24} /> : <EditIcon />}
      </IconButton>
    </StyledBox>
  );
}

export default EditableImage;