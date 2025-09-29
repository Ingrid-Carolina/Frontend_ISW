import React, { useState, useEffect } from "react";
// Importa el cliente API personalizado
import { api } from "../../api/api";
// Importa componentes de Material UI para la interfaz
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

// Componente principal para mostrar la bitácora de donaciones
export default function BitacoraDonaciones() {
  // Estado para almacenar la lista de donaciones obtenidas del backend
  const [donaciones, setDonaciones] = useState([]);
  // Estado para el término de búsqueda ingresado por el usuario
  const [searchTerm, setSearchTerm] = useState("");
  // Estado para la página actual de la paginación
  const [page, setPage] = useState(1);
  // Cantidad de filas a mostrar por página
  const rowsPerPage = 10;

  // Función para obtener las donaciones desde la API
  const fetchDonaciones = async () => {
    try {
      // Realiza la petición GET a la ruta de donaciones
      const res = await api.get("/auth/donaciones", { skipAuthRedirect: true });
      // Guarda las donaciones en el estado
      setDonaciones(res.data.donaciones);
      // Imprime las donaciones en consola para depuración
      console.log(res.data.donaciones);
    } catch (error) {
      // Muestra error en consola si la petición falla
      console.error("Error al obtener donaciones:", error.message);
    }
  };

  // useEffect para cargar las donaciones al montar el componente
  useEffect(() => {
    fetchDonaciones();
  }, []);

  // Filtra las donaciones según el término de búsqueda
  const filteredDonaciones = donaciones.filter((donacion) =>
    // Busca el término en cualquier campo de la donación
    Object.values(donacion).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Calcula el número total de páginas para la paginación
  const totalPages = Math.ceil(filteredDonaciones.length / rowsPerPage);
  // Obtiene las donaciones a mostrar en la página actual
  const paginatedDonaciones = filteredDonaciones.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  // Renderizado del componente
  return (
    <Box sx={{ mt: 12, px: { xs: 1, sm: 2, md: 3 } }}>
      {/* Título de la página */}
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

      {/* Barra de búsqueda centrada y estilizada */}
      <Box display="flex" justifyContent="center" sx={{ mb: 3 }}>
        <TextField
          label="Buscar..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value); // Actualiza el término de búsqueda
            setPage(1); // Reinicia la paginación al buscar
          }}
          sx={{
            width: "50%", // ancho reducido y centrado
            borderRadius: "30px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "30px",
            },
          }}
        />
      </Box>

      {/* Tabla de donaciones */}
      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead>
            {/* Encabezado de la tabla con estilos personalizados */}
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
            {/* Filas de la tabla, una por cada donación paginada */}
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

      {/* Paginación centrada y con estilos personalizados */}
      <Box display="flex" justifyContent="center" sx={{ mt: 3 }}>
        <Pagination
          count={totalPages} // Número total de páginas
          page={page} // Página actual
          onChange={(_, value) => setPage(value)} // Cambia la página al hacer clic
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
