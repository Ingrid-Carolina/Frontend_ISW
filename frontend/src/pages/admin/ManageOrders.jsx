import React from "react";
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
} from "@mui/material";

export default function ManageOrders() {
  const orders = [
    {
      usuario: "Juan Pérez",
      productos: ["Camiseta Oficial"],
      cantidad: [2],
      precios: [25], // precio unitario
      email: "juan@example.com",
      fecha: "2025-09-01",
      idProducto: ["P123"],
      idCompra: "C456",
      estado: "Enviando",
    },
    {
      usuario: "María López",
      productos: ["Gorra del equipo"],
      cantidad: [1],
      precios: [15],
      email: "maria@example.com",
      fecha: "2025-09-02",
      idProducto: ["P789"],
      idCompra: "C987",
      estado: "Entregado",
    },
    {
      usuario: "Carlos Gómez",
      productos: ["Camiseta Oficial", "Bufanda del equipo"],
      cantidad: [1, 1],
      precios: [25, 20],
      email: "carlos@example.com",
      fecha: "2025-09-03",
      idProducto: ["P123", "P456"],
      idCompra: "C654",
      estado: "Pendiente",
    },
    {
      usuario: "Ana Martínez",
      productos: ["Gorra del equipo", "Camiseta Oficial", "Taza con logo"],
      cantidad: [1, 2, 1],
      precios: [15, 25, 10],
      email: "ana@example.com",
      fecha: "2025-09-04",
      idProducto: ["P789", "P123", "P321"],
      idCompra: "C741",
      estado: "En proceso",
    },
  ];

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
        Administrar Órdenes
      </Typography>

      {/* Tabla de órdenes */}
      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#10045c" }}>
              <TableCell sx={{ fontFamily: "PeterMedium", fontWeight: "bold", color: "#fff" }}>
                Usuario
              </TableCell>
              <TableCell sx={{ fontFamily: "PeterMedium", fontWeight: "bold", color: "#fff" }}>
                Productos
              </TableCell>
              <TableCell sx={{ fontFamily: "PeterMedium", fontWeight: "bold", color: "#fff" }}>
                Cantidad
              </TableCell>
              <TableCell sx={{ fontFamily: "PeterMedium", fontWeight: "bold", color: "#fff" }}>
                Precio Total
              </TableCell>
              <TableCell sx={{ fontFamily: "PeterMedium", fontWeight: "bold", color: "#fff" }}>
                Email de Compra
              </TableCell>
              <TableCell sx={{ fontFamily: "PeterMedium", fontWeight: "bold", color: "#fff" }}>
                Estado
              </TableCell>
              <TableCell sx={{ fontFamily: "PeterMedium", fontWeight: "bold", color: "#fff" }}>
                Fecha de Compra
              </TableCell>
              <TableCell sx={{ fontFamily: "PeterMedium", fontWeight: "bold", color: "#fff" }}>
                ID Producto
              </TableCell>
              <TableCell sx={{ fontFamily: "PeterMedium", fontWeight: "bold", color: "#fff" }}>
                ID Compra
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order, index) => {
              // Calcular total de la orden
              const total = order.productos.reduce(
                (acc, _, i) => acc + order.cantidad[i] * order.precios[i],
                0
              );

              return (
                <TableRow key={index} hover>
                  <TableCell sx={{ fontFamily: "PeterMedium" }}>{order.usuario}</TableCell>

                  {/* Productos en lista */}
                  <TableCell sx={{ fontFamily: "PeterMedium" }}>
                    <List dense>
                      {order.productos.map((prod, i) => (
                        <ListItem key={i} sx={{ p: 0 }}>
                          {prod}
                        </ListItem>
                      ))}
                    </List>
                  </TableCell>

                  {/* Cantidades en lista */}
                  <TableCell sx={{ fontFamily: "PeterMedium" }}>
                    <List dense>
                      {order.cantidad.map((cant, i) => (
                        <ListItem key={i} sx={{ p: 0 }}>
                          {cant}
                        </ListItem>
                      ))}
                    </List>
                  </TableCell>
                  {/* Precio Total */}
                  <TableCell sx={{ fontFamily: "PeterMedium", fontWeight: "bold" }}>
                    ${total.toFixed(2)}
                  </TableCell>
                  <TableCell sx={{ fontFamily: "PeterMedium" }}>{order.email}</TableCell>
                  <TableCell sx={{ fontFamily: "PeterMedium" }}>{order.estado}</TableCell>
                  <TableCell sx={{ fontFamily: "PeterMedium" }}>{order.fecha}</TableCell>

                  {/* IDs de productos */}
                  <TableCell sx={{ fontFamily: "PeterMedium" }}>
                    <List dense>
                      {order.idProducto.map((id, i) => (
                        <ListItem key={i} sx={{ p: 0 }}>
                          {id}
                        </ListItem>
                      ))}
                    </List>
                  </TableCell>

                  <TableCell sx={{ fontFamily: "PeterMedium" }}>{order.idCompra}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
