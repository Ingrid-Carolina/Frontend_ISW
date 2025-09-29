import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Box, IconButton, Typography } from "@mui/material";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

// Función mejorada para obtener ID de distintos tipos de URL
function getYouTubeId(url) {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;

    if (hostname === "youtu.be") {
      return urlObj.pathname.slice(1);
    }

    if (hostname.includes("youtube.com")) {
      return urlObj.searchParams.get("v");
    }

    return null;
  } catch {
    return null;
  }
}

const VideoCarousel = ({ videos }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: false,
    beforeChange: (_, next) => setCurrentSlide(next),
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % videos.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + videos.length) % videos.length);
  };

  return (
    <Box
      sx={{
        maxWidth: "900px",
        margin: "auto",
        position: "relative",
        backgroundColor: "#f8f9fa",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
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
          const videoId = getYouTubeId(video.url);
          if (!videoId) {
            return (
              <Box
                key={index}
                sx={{
                  display: index === currentSlide ? "block" : "none",
                  textAlign: "center",
                  padding: "60px 20px",
                }}
              >
                <Typography variant="h6" color="text.secondary">
                  Video no válido: {video.url}
                </Typography>
              </Box>
            );
          }

          const embedUrl = `https://www.youtube.com/embed/${videoId}?${
            currentSlide === index ? "autoplay=1&mute=1" : "autoplay=0"
          }`;

          return (
            <Box
              key={index}
              sx={{
                display: index === currentSlide ? "block" : "none",
                position: "relative",
                paddingTop: "56.25%", // 16:9 aspect ratio
              }}
            >
              <iframe
                src={embedUrl}
                title={`video-${index}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  border: "none",
                }}
              />
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
            color: "#1976d2",
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
            color: "#1976d2",
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
          backgroundColor: "white",
          borderTop: "1px solid #e0e0e0",
        }}
      >
        {videos.map((video, index) => {
          const videoId = getYouTubeId(video.url);
          const isActive = index === currentSlide;

          if (!videoId) return null;

          return (
            <Box
              key={index}
              onClick={() => setCurrentSlide(index)}
              sx={{
                position: "relative",
                width: 80,
                height: 60,
                borderRadius: "8px",
                overflow: "hidden",
                cursor: "pointer",
                border: isActive ? "3px solid #1976d2" : "3px solid transparent",
                opacity: isActive ? 1 : 0.7,
                transition: "all 0.3s ease",
                "&:hover": {
                  opacity: 1,
                  transform: "scale(1.05)",
                },
              }}
            >
              <img
                src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                alt={`Miniatura ${index + 1}`}
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
                    borderTop: "6px solid transparent",
                    borderBottom: "6px solid transparent",
                    borderLeft: "12px solid white",
                    marginLeft: "2px",
                  }}
                />
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
          backgroundColor: "white",
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
              backgroundColor: index === currentSlide ? "#1976d2" : "#e0e0e0",
              cursor: "pointer",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: index === currentSlide ? "#1976d2" : "#bdbdbd",
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