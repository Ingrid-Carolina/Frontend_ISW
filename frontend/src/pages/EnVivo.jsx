import React from "react";
import { Box, Typography, Button } from "@mui/material";
import HeaderBesibol from "/Logo-pilotosA.png";

const EnVivo = () => {
  return (
   <Box
  sx={{ 
    minHeight:"100hv",
    width: "100%",
    backgroundImage: `linear-gradient(rgba(16, 4, 92, 0.95), rgba(16, 4, 92, 0.95)), url(${HeaderBesibol})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: "40px 20px",
  }}
>
      {/* Título */}
      <Typography
        variant="h4" // 👈 más grande
        sx={{
          fontFamily: "Groteskbold",
          color: "white",
          marginBottom: "2rem", // 👈 más espacio abajo
          marginTop: "80px", // 👈 más abajo del top
          textAlign: "center",
        }}
      >
        Bienvenido! Esperamos disfrutes de nuestros partidos en vivo!!!
      </Typography>

      {/* Contenedor Video + Botón */}
      <Box
        sx={{
          width: "95%",
          maxWidth: "1200px", // 👈 video más ancho
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          flex: 1,
        }}
      >
        {/* Video */}
        <Box
          sx={{
            width: "100%",
            flex: 1,
            marginBottom:'2rem',
            aspectRatio: "16/9",
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow: "0 8px 25px rgba(0,0,0,0.7)",
          }}
        >
          <iframe
            src="https://www.youtube.com/embed/gMm3EODDb6w?si=iS7QnVSDgYpJZVGn&autoplay=1&mute=1"
            title="En Vivo"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ width: "100%", height: "100%", border: "none" }}
          ></iframe>
        </Box>

        {/* Botón */}
        <Button
          variant="contained"
          sx={{
            fontFamily: "Petermedium",
            backgroundColor: "#fff",
            color: "#e06c14",
            borderRadius: "20px",
            marginTop: "20px",
            "&:hover": { Bordercolor: "#e06c14", backgroundColor: "#c8c6c5ff" },
          }}
          onClick={() =>
            window.open("https://www.youtube.com/@BaseballSport.", "_blank")
          }
        >
          Ir al Canal
        </Button>
      </Box>
    </Box>
  );
};

export default EnVivo;
