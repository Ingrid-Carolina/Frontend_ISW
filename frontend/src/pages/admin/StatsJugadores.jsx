import React from "react";
import { Box, Typography } from "@mui/material";

export default function StatsJugadores() {
  return (
    <Box sx={{ width: '100%', pt: 2 }}>
      <Typography
        variant="h2"
        gutterBottom
        fontFamily="Varsity"
        sx={{ textAlign: "center" }}
      >
        Estadísticas de Jugadores
      </Typography>
    </Box>
  );
}