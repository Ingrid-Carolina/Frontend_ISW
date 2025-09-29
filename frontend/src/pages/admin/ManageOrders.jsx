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
  Select,
  Button
} from "@mui/material";

// Componente principal para administrar órdenes
export default function ManageOrders() {
  // Estado para almacenar las órdenes obtenidas del backend
  const [ordenes, setordenes] = useState([]);
  // Estado para la página actual de la paginación
  const [currentPage, setCurrentPage] = useState(1);
  // Cantidad de elementos por página
  const elementsPerPage = 10;

  // Función para obtener las órdenes y sus productos desde la API
  const fetchOrdenes = async () => {
    try {
      // Obtiene todas las órdenes
      const res = await api.get('/auth/ordenes', { skipAuthRedirect: true });
      const orders = res.data.ordenes;

      // Para cada orden, obtiene los productos comprados
      const ordenesConProductos = await Promise.all(
        orders.map(async (orden) => {
          try {
            // Petición para obtener productos comprados en la orden
            const productosRes = await api.get(`/auth/ordenes/${orden.idorden}/productos_comprados`);
            // Formatea la lista de productos
            const productosLista = productosRes.data.map((producto) => ({
              producto: producto.nombre_producto,
              cantidad: producto.cantidad,
              precio_unitario: producto.precio_unitario,
              total: producto.cantidad * producto.precio_unitario,
            }));

            // Retorna la orden con los productos agregados
            return {
              idorden: orden.idorden,
              nombre_usuario: orden.nombre_usuario,
              fecha: orden.fecha,
              estado: orden.estado,
              email: orden.email,
              productos_comprados: productosLista,
            };
          } catch (err) {
            // Si falla la petición de productos, retorna la orden sin productos
            console.error(`Error al obtener productos para orden ${orden.idorden}:`, err.message);
            return {
              ...orden,
              productos_comprados: [],
            };
          }
        })
      );
      // Actualiza el estado con las órdenes completas
      setordenes(ordenesConProductos);
    } catch (error) {
      // Si falla la petición de órdenes, muestra error en consola
      console.error('Error al obtener ordenes:', error.message);
    }
  };

  // useEffect para cargar las órdenes al montar el componente
  useEffect(() => {
    fetchOrdenes();
  }, []);

  // Función para cambiar el estado de una orden
  const handleEstado = async (orderIndex, newEstado) => {
    const idorden = ordenes[orderIndex].idorden;
    // Actualiza el estado localmente para feedback inmediato
    setordenes((prevordenes) =>
      prevordenes.map((orden, i) =>
        i === orderIndex ? { ...orden, estado: newEstado } : orden
      )
    );
    // Prepara la petición para actualizar el estado en el backend
    const url = `/auth/orden/${idorden}`;
    const updatedestado = {
      estado: newEstado
    };
    try {
      // Realiza la petición PUT para actualizar el estado
      const res = await api.put(url, updatedestado, {
        headers: { "Content-Type": "application/json" }
      });
      console.log(res.data);
    } catch (error) {
      // Si falla la actualización, muestra error en consola
      console.error('Error al setear el estado:', error.message);
    }
  };

  // Lógica de Paginación
  const indexOfLastElement = currentPage * elementsPerPage;
  const indexOfFirstElement = indexOfLastElement - elementsPerPage;
  // Obtiene las órdenes a mostrar en la página current
  const currentElements = ordenes.slice(indexOfFirstElement, indexOfLastElement);

  // Calcula el número total de páginas
  const totalPages = Math.ceil(ordenes.length / elementsPerPage);

  // Función para avanzar a la siguiente página
  const handleNextPage = () => {
    setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages));
  };

  // Función para retroceder a la página anterior
  const handlePrevPage = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
  };

  // Renderizado del componente
  return (
    <Box sx={{ mt: 12, px: { xs: 1, sm: 2, md: 3 } }}>
      {/* Título de la página */}
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

      {/* Tabla de órdenes */}
      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead>
            {/* Encabezado de la tabla con estilos personalizados */}
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
            {/* Filas de la tabla, una por cada orden paginada */}
            {currentElements.map((order, index) => {
              // Calcula el total de la orden sumando los totales de cada producto
              const total = order.productos_comprados.reduce(
                (acc, item) => acc + item.total,
                0
              );
              return (
                <TableRow key={order.idorden} hover>
                  {/* Usuario que realizó la compra */}
                  <TableCell sx={{ fontFamily: "PeterMedium" }}>{order.nombre_usuario}</TableCell>
                  {/* Lista de productos comprados */}
                  <TableCell sx={{ fontFamily: "PeterMedium" }}>
                    <List dense>
                      {order.productos_comprados.map((prod, i) => (
                        <ListItem key={i} sx={{ p: 0 }}>{prod.producto}</ListItem>
                      ))}
                    </List>
                  </TableCell>
                  {/* Cantidad de cada producto */}
                  <TableCell sx={{ fontFamily: "PeterMedium" }}>
                    <List dense>
                      {order.productos_comprados.map((prod, i) => (
                        <ListItem key={i} sx={{ p: 0 }}>{prod.cantidad}</ListItem>
                      ))}
                    </List>
                  </TableCell>
                  {/* Precio total de la orden */}
                  <TableCell sx={{ fontFamily: "PeterMedium", fontWeight: "bold" }}>L.{total.toFixed(2)}</TableCell>
                  {/* Email del usuario */}
                  <TableCell sx={{ fontFamily: "PeterMedium" }}>{order.email}</TableCell>
                  {/* Estado editable de la orden */}
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
                  {/* Fecha de la compra */}
                  <TableCell sx={{ fontFamily: "PeterMedium" }}>{order.fecha}</TableCell>
                  {/* ID de la orden */}
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
