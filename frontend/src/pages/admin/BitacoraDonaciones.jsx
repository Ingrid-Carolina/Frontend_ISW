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
  TextField,
  Pagination,
} from "@mui/material";

export default function BitacoraDonaciones() {
  const [donaciones, setDonaciones] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

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

  const filteredDonaciones = donaciones.filter((donacion) =>
    Object.values(donacion).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredDonaciones.length / rowsPerPage);
  const paginatedDonaciones = filteredDonaciones.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <Box sx={{ mt: 12, px: { xs: 1, sm: 2, md: 3 } }}>
      {/* Título */}
      <Typography
        variant="h4"
        sx={{
          fontFamily: "GroteskBold",
          mb: 2,
          textAlign: "center",
          color: "#10045c",
        }}
      >
        Bitácora de Donaciones
      </Typography>

      {/* 🔍 Search Bar (más pequeña, centrada y con bordes redondeados) */}
      <Box display="flex" justifyContent="center" sx={{ mb: 3 }}>
        <TextField
          label="Buscar..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
          sx={{
            width: "50%", // más pequeño y centrado
            borderRadius: "30px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "30px",
            },
          }}
        />
      </Box>

      {/* Tabla */}
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
            {paginatedDonaciones.map((donacion, index) => (
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

      {/* 📑 Paginación con color personalizado */}
      <Box display="flex" justifyContent="center" sx={{ mt: 3 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, value) => setPage(value)}
          sx={{
            "& .MuiPaginationItem-root.Mui-selected": {
              backgroundColor: "#10045c",
              color: "#fff",
            },
            "& .MuiPaginationItem-root.Mui-selected:hover": {
              backgroundColor: "#0d034a",
            },
          }}
        />
      </Box>
    </Box>
  );
}
