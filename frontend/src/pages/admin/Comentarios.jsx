import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Divider } from "@mui/material";

export default function Comentarios() {
  const [comentarios, setComentarios] = useState([]);

  useEffect(() => {
    const fetchComentarios = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/comentarios");
        const data = await response.json();
        setComentarios(data);
      } catch (error) {
        console.error("Error al cargar comentarios:", error);
      }
    };

    fetchComentarios();
  }, []);

  return (
    <Box sx={{ mt: 4, px: 2 }}>
      <Typography
        variant="h2"
        sx={{
          fontFamily: 'Varsity',
          color: '#10045c',
          mb: 4,
          textAlign: 'center'
        }}
      >
        Comentarios de Visitantes
      </Typography>

      {comentarios.map((comentario, index) => (
        <Paper key={index} sx={{ mb: 2, p: 2, borderLeft: "5px solid #f06414" }}>
          <Typography variant="subtitle1" fontWeight="bold">
            {comentario.nombre}
          </Typography>
          <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
            {comentario.mensaje}
          </Typography>
          <Divider sx={{ mt: 1 }} />
          <Typography variant="caption" color="text.secondary">
            {new Date(comentario.fecha).toLocaleString()}
          </Typography>
        </Paper>
      ))}
    </Box>
  );
}
