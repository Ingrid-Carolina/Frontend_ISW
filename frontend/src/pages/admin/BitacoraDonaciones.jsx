import React, { useState, useEffect } from "react";
import { api } from "../../api/api";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

export default function BitacoraDonaciones() {
  const [donaciones, setDonaciones] = useState([]);

  const fetchDonaciones = async () => {
    try {
      const res = await api.get("/auth/donaciones", { skipAuthRedirect: true });
      setDonaciones(res.data.donaciones);
      console.log(res.data.donaciones);
    } catch (error) {
      console.error("Error al obtener donaciones:", error.message);
    }
  };

  useEffect(() => {
    fetchDonaciones();
  }, []);

  return (
    <Box sx={{ mt: 12, px: { xs: 1, sm: 2, md: 3 } }}>
      {/* Título */}
      <Typography
        variant="h4"
        sx={{
          fontFamily: "GroteskBold",
          mb: 4,
          textAlign: "center",
          color: "#10045c",
        }}
      >
        Bitácora de Donaciones
      </Typography>

      {/* Tabla de donaciones */}
      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#10045c" }}>
              <TableCell sx={{ fontFamily: "PeterMedium", fontWeight: "bold", color: "#fff" }}>
                ID Donación
              </TableCell>
              <TableCell sx={{ fontFamily: "PeterMedium", fontWeight: "bold", color: "#fff" }}>
                Nombre
              </TableCell>
              <TableCell sx={{ fontFamily: "PeterMedium", fontWeight: "bold", color: "#fff" }}>
                Teléfono
              </TableCell>
              <TableCell sx={{ fontFamily: "PeterMedium", fontWeight: "bold", color: "#fff" }}>
                Correo
              </TableCell>
              <TableCell sx={{ fontFamily: "PeterMedium", fontWeight: "bold", color: "#fff" }}>
                Día
              </TableCell>
              <TableCell sx={{ fontFamily: "PeterMedium", fontWeight: "bold", color: "#fff" }}>
                Horario
              </TableCell>
              <TableCell sx={{ fontFamily: "PeterMedium", fontWeight: "bold", color: "#fff" }}>
                Descripción
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {donaciones.map((donacion, index) => (
              <TableRow key={index} hover>
                <TableCell sx={{ fontFamily: "PeterMedium" }}>{donacion.id_donacion}</TableCell>
                <TableCell sx={{ fontFamily: "PeterMedium" }}>{donacion.nombre}</TableCell>
                <TableCell sx={{ fontFamily: "PeterMedium" }}>{donacion.telefono}</TableCell>
                <TableCell sx={{ fontFamily: "PeterMedium" }}>{donacion.correo}</TableCell>
                <TableCell sx={{ fontFamily: "PeterMedium" }}>{donacion.dia}</TableCell>
                <TableCell sx={{ fontFamily: "PeterMedium" }}>{donacion.horario}</TableCell>
                <TableCell sx={{ fontFamily: "PeterMedium" }}>{donacion.descripcion}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
