import React, { useState, useEffect } from "react";
import { api } from '../../api/api';
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
  Select,
  Button
} from "@mui/material";

export default function ManageOrders() {
  const [ordenes, setordenes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const elementsPerPage = 10;

  const fetchOrdenes = async () => {
    try {
      const res = await api.get('/auth/ordenes', { skipAuthRedirect: true });
      const orders = res.data.ordenes;

      const ordenesConProductos = await Promise.all(
        orders.map(async (orden) => {
          try {
            const productosRes = await api.get(`/auth/ordenes/${orden.idorden}/productos_comprados`);
            const productosLista = productosRes.data.map((producto) => ({
              producto: producto.nombre_producto,
              cantidad: producto.cantidad,
              precio_unitario: producto.precio_unitario,
              total: producto.cantidad * producto.precio_unitario,
            }));

            return {
              idorden: orden.idorden,
              nombre_usuario: orden.nombre_usuario,
              fecha: orden.fecha,
              estado: orden.estado,
              email: orden.email,
              productos_comprados: productosLista,
            };
          } catch (err) {
            console.error(`Error al obtener productos para orden ${orden.idorden}:`, err.message);
            return {
              ...orden,
              productos_comprados: [],
            };
          }
        })
      );
      setordenes(ordenesConProductos);
    } catch (error) {
      console.error('Error al obtener ordenes:', error.message);
    }
  };

  useEffect(() => {
    fetchOrdenes();
  }, []);

  const handleEstado = async (orderIndex, newEstado) => {
    const idorden = ordenes[orderIndex].idorden;
    setordenes((prevordenes) =>
      prevordenes.map((orden, i) =>
        i === orderIndex ? { ...orden, estado: newEstado } : orden
      )
    );
    const url = `/auth/orden/${idorden}`;
    const updatedestado = {
      estado: newEstado
    };
    try {
      const res = await api.put(url, updatedestado, {
        headers: { "Content-Type": "application/json" }
      });
      console.log(res.data);
    } catch (error) {
      console.error('Error al setear el estado:', error.message);
    }
  };

  // Lógica de Paginación
  const indexOfLastElement = currentPage * elementsPerPage;
  const indexOfFirstElement = indexOfLastElement - elementsPerPage;
  const currentElements = ordenes.slice(indexOfFirstElement, indexOfLastElement);

  const totalPages = Math.ceil(ordenes.length / elementsPerPage);

  const handleNextPage = () => {
    setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
  };

  return (
    <Box sx={{ mt: 12, px: { xs: 1, sm: 2, md: 3 } }}>
      <Typography
        variant="h4"
        sx={{
          fontFamily: "GroteskBold",
          mb: 4,
          textAlign: "center",
          color: "#10045c",
        }}
      >
        Administrar Órdenes
      </Typography>

      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#10045c" }}>
              <TableCell sx={{ fontFamily: "PeterMedium", fontWeight: "bold", color: "#fff" }}>Usuario</TableCell>
              <TableCell sx={{ fontFamily: "PeterMedium", fontWeight: "bold", color: "#fff" }}>Productos</TableCell>
              <TableCell sx={{ fontFamily: "PeterMedium", fontWeight: "bold", color: "#fff" }}>Cantidad</TableCell>
              <TableCell sx={{ fontFamily: "PeterMedium", fontWeight: "bold", color: "#fff" }}>Precio Total</TableCell>
              <TableCell sx={{ fontFamily: "PeterMedium", fontWeight: "bold", color: "#fff" }}>Email de Compra</TableCell>
              <TableCell sx={{ fontFamily: "PeterMedium", fontWeight: "bold", color: "#fff" }}>Estado</TableCell>
              <TableCell sx={{ fontFamily: "PeterMedium", fontWeight: "bold", color: "#fff" }}>Fecha de Compra</TableCell>
              <TableCell sx={{ fontFamily: "PeterMedium", fontWeight: "bold", color: "#fff" }}>ID Compra</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentElements.map((order, index) => {
              const total = order.productos_comprados.reduce(
                (acc, item) => acc + item.total,
                0
              );
              return (
                <TableRow key={order.idorden} hover>
                  <TableCell sx={{ fontFamily: "PeterMedium" }}>{order.nombre_usuario}</TableCell>
                  <TableCell sx={{ fontFamily: "PeterMedium" }}>
                    <List dense>
                      {order.productos_comprados.map((prod, i) => (
                        <ListItem key={i} sx={{ p: 0 }}>{prod.producto}</ListItem>
                      ))}
                    </List>
                  </TableCell>
                  <TableCell sx={{ fontFamily: "PeterMedium" }}>
                    <List dense>
                      {order.productos_comprados.map((prod, i) => (
                        <ListItem key={i} sx={{ p: 0 }}>{prod.cantidad}</ListItem>
                      ))}
                    </List>
                  </TableCell>
                  <TableCell sx={{ fontFamily: "PeterMedium", fontWeight: "bold" }}>L.{total.toFixed(2)}</TableCell>
                  <TableCell sx={{ fontFamily: "PeterMedium" }}>{order.email}</TableCell>
                  <TableCell sx={{ fontFamily: "PeterMedium" }}>
                    <Select
                      value={order.estado}
                      onChange={(e) => handleEstado(index + indexOfFirstElement, e.target.value)}
                      variant="standard"
                      sx={{ fontFamily: "PeterMedium", minWidth: 120 }}
                    >
                      <MenuItem value="Pendiente">Pendiente</MenuItem>
                      <MenuItem value="En Proceso">En Proceso</MenuItem>
                      <MenuItem value="Entregado">Entregado</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell sx={{ fontFamily: "PeterMedium" }}>{order.fecha}</TableCell>
                  <TableCell sx={{ fontFamily: "PeterMedium" }}>{order.idorden}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Controles de Paginación */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, gap: 2 }}>
        <Button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          variant="contained"
          sx={{ fontFamily: "PeterMedium" }}
        >
          Anterior
        </Button>
        <Typography sx={{ alignSelf: 'center', fontFamily: "PeterMedium" }}>
          Página {currentPage} de {totalPages}
        </Typography>
        <Button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          variant="contained"
          sx={{ fontFamily: "PeterMedium" }}
        >
          Siguiente
        </Button>
      </Box>
    </Box>
  );
}
