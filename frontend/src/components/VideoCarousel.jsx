// Componente VideoCarousel.jsx es un carrusel de videos de YouTube Shorts que permite navegar entre varios videos, mostrando miniaturas y un botón para abrir cada Short en YouTube.
// Utiliza Material-UI para los estilos y componentes, y maneja errores en la carga de miniaturas.
import React, { useState } from "react";
import { Box, IconButton, Typography, Chip, Button } from "@mui/material";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ShortsIcon from "@mui/icons-material/VideoLibrary";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

// Función para obtener ID de YouTube Shorts
function getYouTubeShortsId(url) {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;

    // YouTube Shorts
    if (hostname.includes("youtube.com") && urlObj.pathname.includes("/shorts/")) {
      const pathParts = urlObj.pathname.split("/shorts/");
      return pathParts[1]?.split("?")[0]; // Remover parámetros de query
    }

    return null;
  } catch {
    return null;
  }
}

// Función para detectar si es un Short
function isYouTubeShort(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.includes("youtube.com") && urlObj.pathname.includes("/shorts/");
  } catch {
    return false;
  }
}

const VideoCarousel = ({ videos }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % videos.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + videos.length) % videos.length);
  };

  // Función para abrir Short en YouTube
  const openInYouTube = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Box
      sx={{
        maxWidth: "400px", // Ancho más adecuado para shorts
        margin: "auto",
        position: "relative",
        backgroundColor: "#000",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
      }}
    >
      {/* Contador de slides */}
      <Box
        sx={{
          position: "absolute",
          top: 16,
          right: 16,
          backgroundColor: "rgba(0,0,0,0.7)",
          color: "white",
          padding: "4px 12px",
          borderRadius: "20px",
          fontSize: "0.875rem",
          fontWeight: "500",
          zIndex: 10,
        }}
      >
        {currentSlide + 1} / {videos.length}
      </Box>

      {/* Video principal */}
      <Box sx={{ position: "relative" }}>
        {videos.map((video, index) => {
          const videoId = getYouTubeShortsId(video.url);
          const isShort = isYouTubeShort(video.url);
          const isActive = index === currentSlide;

          if (!videoId) {
            return (
              <Box
                key={index}
                sx={{
                  display: isActive ? "block" : "none",
                  textAlign: "center",
                  padding: "60px 20px",
                  backgroundColor: "#000",
                  color: "white",
                  height: "600px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6" color="text.secondary" sx={{ color: "white", mb: 2 }}>
                  Short no válido
                </Typography>
                <Button 
                  variant="contained" 
                  onClick={() => openInYouTube(video.url)}
                  startIcon={<OpenInNewIcon />}
                >
                  Abrir en YouTube
                </Button>
              </Box>
            );
          }

          const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

          return (
            <Box
              key={index}
              sx={{
                display: isActive ? "block" : "none",
                position: "relative",
                height: "600px", // Altura fija para formato vertical
                backgroundColor: "#000",
                cursor: "pointer",
              }}
              onClick={() => openInYouTube(video.url)}
            >
              {/* Badge para Shorts */}
              <Chip
                icon={<ShortsIcon />}
                label="YouTube Short"
                size="small"
                sx={{
                  position: "absolute",
                  top: 16,
                  left: 16,
                  backgroundColor: "#FF0000",
                  color: "white",
                  fontWeight: "bold",
                  zIndex: 10,
                  "& .MuiChip-icon": {
                    color: "white",
                  },
                }}
              />

              {/* Miniatura del Short */}
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <img
                  src={thumbnailUrl}
                  alt={`Short ${index + 1}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                  onError={(e) => {
                    // Fallback si maxresdefault no existe
                    e.target.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                  }}
                />
                
                {/* Overlay de play */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "rgba(0,0,0,0.4)",
                    transition: "background-color 0.3s ease",
                    "&:hover": {
                      backgroundColor: "rgba(0,0,0,0.2)",
                    },
                  }}
                >
                  {/* Botón de play grande */}
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: "50%",
                      backgroundColor: "#FF0000",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 2,
                      transition: "transform 0.3s ease",
                      "&:hover": {
                        transform: "scale(1.1)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 0,
                        height: 0,
                        borderTop: "15px solid transparent",
                        borderBottom: "15px solid transparent",
                        borderLeft: "25px solid white",
                        marginLeft: "5px",
                      }}
                    />
                  </Box>

                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: "white", 
                      fontWeight: "bold",
                      textAlign: "center",
                      mb: 1
                    }}
                  >
                    Ver en YouTube
                  </Typography>
                  
                  <Button 
                    variant="outlined" 
                    onClick={(e) => {
                      e.stopPropagation();
                      openInYouTube(video.url);
                    }}
                    startIcon={<OpenInNewIcon />}
                    sx={{
                      color: "white",
                      borderColor: "white",
                      "&:hover": {
                        borderColor: "#FF0000",
                        backgroundColor: "rgba(255,0,0,0.1)",
                      },
                    }}
                  >
                    Abrir Short
                  </Button>
                </Box>
              </Box>
            </Box>
          );
        })}

        {/* Botones de navegación */}
        <IconButton
          onClick={prevSlide}
          sx={{
            position: "absolute",
            left: 16,
            top: "50%",
            transform: "translateY(-50%)",
            backgroundColor: "rgba(255,255,255,0.9)",
            color: "#FF0000",
            "&:hover": {
              backgroundColor: "white",
              transform: "translateY(-50%) scale(1.1)",
            },
            transition: "all 0.3s ease",
            boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
            zIndex: 5,
          }}
          size="large"
        >
          <NavigateBeforeIcon />
        </IconButton>

        <IconButton
          onClick={nextSlide}
          sx={{
            position: "absolute",
            right: 16,
            top: "50%",
            transform: "translateY(-50%)",
            backgroundColor: "rgba(255,255,255,0.9)",
            color: "#FF0000",
            "&:hover": {
              backgroundColor: "white",
              transform: "translateY(-50%) scale(1.1)",
            },
            transition: "all 0.3s ease",
            boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
            zIndex: 5,
          }}
          size="large"
        >
          <NavigateNextIcon />
        </IconButton>
      </Box>

      {/* Miniaturas de navegación */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 1,
          padding: "16px",
          backgroundColor: "#1a1a1a",
          borderTop: "1px solid #333",
          overflowX: "auto",
        }}
      >
        {videos.map((video, index) => {
          const videoId = getYouTubeShortsId(video.url);
          const isActive = index === currentSlide;

          if (!videoId) return null;

          return (
            <Box
              key={index}
              onClick={() => setCurrentSlide(index)}
              sx={{
                position: "relative",
                width: 60, // Miniaturas cuadradas para shorts
                height: 60,
                borderRadius: "8px",
                overflow: "hidden",
                cursor: "pointer",
                border: isActive ? "3px solid #FF0000" : "3px solid transparent",
                opacity: isActive ? 1 : 0.7,
                transition: "all 0.3s ease",
                "&:hover": {
                  opacity: 1,
                  transform: "scale(1.05)",
                },
                flexShrink: 0,
              }}
            >
              <img
                src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                alt={`Short ${index + 1}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
              
              {/* Overlay de play en miniatura */}
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "rgba(0,0,0,0.3)",
                  transition: "background-color 0.3s ease",
                }}
              >
                <Box
                  sx={{
                    width: 0,
                    height: 0,
                    borderTop: "4px solid transparent",
                    borderBottom: "4px solid transparent",
                    borderLeft: "8px solid white",
                    marginLeft: "1px",
                  }}
                />
              </Box>

              {/* Indicador de Short en miniatura */}
              <Box
                sx={{
                  position: "absolute",
                  top: 4,
                  left: 4,
                  backgroundColor: "#FF0000",
                  color: "white",
                  borderRadius: "4px",
                  padding: "1px 4px",
                  fontSize: "0.5rem",
                  fontWeight: "bold",
                  lineHeight: 1,
                }}
              >
                S
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* Indicadores de navegación inferior */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 1,
          padding: "12px",
          backgroundColor: "#1a1a1a",
        }}
      >
        {videos.map((_, index) => (
          <Box
            key={index}
            onClick={() => setCurrentSlide(index)}
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: index === currentSlide ? "#FF0000" : "#666",
              cursor: "pointer",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: index === currentSlide ? "#FF0000" : "#999",
                transform: "scale(1.2)",
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default VideoCarousel;