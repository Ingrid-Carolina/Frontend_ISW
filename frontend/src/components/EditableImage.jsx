// components/EditableImage.jsx
import React, { useState } from 'react';
import { api } from '../api/api'; 
import { CircularProgress } from '@mui/material';
import IconButton from '@mui/material/IconButton'; // Asegúrate de importar IconButton
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'; // El ícono de la cámara
import './EditableImage.css'; 

const EditableImage = ({ src, alt, onImageUpload }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const newImageUrl = response.data.imageUrl;
      onImageUpload(newImageUrl);
    } catch (err) {
      setError('Error al subir la imagen.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => {
    document.getElementById('file-input').click();
  };

  return (
    <div className="editable-image-container">
      {loading ? (
        <CircularProgress className="loading-spinner" />
      ) : (
        <img src={src} alt={alt} className="editable-image" />
      )}
      <input
        type="file"
        id="file-input"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      {/* Aquí usamos IconButton, que es correcto para este propósito */}
      <IconButton 
        className="edit-button" 
        onClick={handleClick}
        aria-label="cambiar imagen"
        disabled={loading}
      >
        <PhotoCameraIcon />
      </IconButton>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default EditableImage;