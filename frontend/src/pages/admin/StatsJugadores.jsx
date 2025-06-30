import React from "react";
import { Box, Typography } from "@mui/material";

export default function StatsJugadores() {
  return (
    <Box sx={{ width: '100%', pt: 2 }}>
      <Typography
        variant="h2"
        sx={{
          fontFamily: 'Varsity',
          color: '#10045c',
          mb: 4,
          textAlign: 'center'
        }}
      >
        Estadisticas de Jugadores
      </Typography>
    </Box>
  );
}