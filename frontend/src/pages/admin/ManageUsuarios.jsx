import React, { useState, useEffect } from "react";
// Importa el cliente API personalizado para peticiones al backend
import { api } from '../../api/api';
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
  List,
  ListItem,
  MenuItem,
  Select
} from "@mui/material";

// Componente principal para administrar usuarios
const ManageUsuarios = () => {

  // Estado para almacenar la lista de usuarios obtenidos del backend
  const [usuarios, setusuarios] = useState([]);

  // Función para obtener los usuarios desde la API
  const fetchUsuarios = async () => {
    try {
      // Realiza la petición GET para obtener usuarios
      const res = await api.get('/auth/obtenerusuarios', {
        skipAuthRedirect: true,
      });

      const usuarios = res.data;

      // Formatea la respuesta para el frontend
      const usuariosLista = usuarios.map(usuario => ({
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      }));

      // Actualiza el estado con la lista de usuarios
      setusuarios(usuariosLista);
      console.log(usuarios);

    } catch (error) {
      // Muestra error en consola si la petición falla
      console.error('Error al obtener testimonios:', error.message);
    }
  }

  // useEffect para cargar los usuarios al montar el componente
  useEffect(() => {
    fetchUsuarios();
  }, []);

  // Función para cambiar el rol de un usuario
  const handleRol = async (usuarioIndex, newRol) => {
    const id = usuarios[usuarioIndex].id;
    // Actualiza el estado localmente para feedback inmediato
    setusuarios((prevusuarios) =>
      prevusuarios.map((usuario, i) =>
        i === usuarioIndex ? { ...usuario, rol: newRol } : usuario
      )
    );

    // Prepara la petición para actualizar el rol en el backend
    const url = `/auth/usuario/${id}`;
    const updatedrol = {
      rol: newRol
    }

    try {
      // Realiza la petición PUT para actualizar el rol
      const res = await api.put(url, updatedrol, {
        headers: { "Content-Type": "application/json" }
      });
      console.log(res.data);
    } catch (error) {
      // Muestra error en consola si la actualización falla
      console.error('Error al setear el rol:', error.message);
    }
  }

  // Renderizado del componente
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
        Administrar Usuarios
      </Typography>

      {/* Tabla de usuarios */}
      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#10045c" }}>
              <TableCell sx={{ fontFamily: "PeterMedium", fontWeight: "bold", color: "#fff" }}>
                Nombre
              </TableCell>
              <TableCell sx={{ fontFamily: "PeterMedium", fontWeight: "bold", color: "#fff" }}>
                Email
              </TableCell>
              <TableCell sx={{ fontFamily: "PeterMedium", fontWeight: "bold", color: "#fff" }}>
                Rol
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Filas de la tabla, una por cada usuario */}
            {usuarios.map((usuario, index) => {
              return (
                <TableRow key={usuario.id} hover>
                  {/* Nombre del usuario */}
                  <TableCell sx={{ fontFamily: "PeterMedium" }}>{usuario.nombre}</TableCell>
                  {/* Email del usuario */}
                  <TableCell sx={{ fontFamily: "PeterMedium" }}>{usuario.email} </TableCell>
                  {/* Rol editable del usuario */}
                  <TableCell sx={{ fontFamily: "PeterMedium" }}>
                    <Select
                      value={usuario.rol}
                      onChange={(e) => handleRol(index, e.target.value)}
                      variant="standard"
                      sx={{ fontFamily: "PeterMedium", minWidth: 120 }}
                    >
                      <MenuItem value="admin">admin</MenuItem>
                      <MenuItem value="admin-calendario">admin-calendario</MenuItem>
                      <MenuItem value="cliente">cliente</MenuItem>
                    </Select>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default ManageUsuarios;