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
  Select
} from "@mui/material";

export default function ManageOrders() {
  

  const [ordenes, setordenes]= useState([]);
 const [productosPorOrden, setProductosPorOrden] = useState({});

 
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
    console.log(ordenesConProductos);
  } catch (error) {
    console.error('Error al obtener ordenes:', error.message);
  }
};


useEffect(() => {

    fetchOrdenes();
        
        
    }, []);

    const handleEstado = async (orderIndex, newEstado) => {
       const idorden = ordenes[orderIndex].idorden;
     setordenes((prevordenes) => //solamente para frontend
       prevordenes.map((orden, i) =>
         i === orderIndex ? { ...orden, estado: newEstado } : orden //iteramos hasta llegar al indice elegido
       )
     );
   
   
     
   
      const url = `/auth/orden/${idorden}`;
   
      const updatedestado={
   
       estado: newEstado
   
      }
   
      try {
   
        const res = await api.put(url, updatedestado, {
              headers: { "Content-Type": "application/json" }
            });
   
            console.log(res.data);
       
      } catch (error) {
   
        console.error('Error al setear el estado:', error.message);
       
      }
   
     }


 

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
                ID Compra
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ordenes.map((order, index) => {
              // Calcular total de la orden
              const total = order.productos_comprados.reduce(
                (acc,item) => acc + item.total, //por cada item, calculamos su total
                0
              );

              return (
                <TableRow key={index} hover>
                  <TableCell sx={{ fontFamily: "PeterMedium" }}>{order.nombre_usuario}</TableCell>

                  {/* Productos en lista */}
                  <TableCell sx={{ fontFamily: "PeterMedium" }}>
                    <List dense>
                      {order.productos_comprados.map((prod, i) => (
                        <ListItem key={i} sx={{ p: 0 }}>
                          {prod.producto}
                        </ListItem>
                      ))}
                    </List>
                  </TableCell>

                  {/* Cantidades en lista */}
                  <TableCell sx={{ fontFamily: "PeterMedium" }}>
                    <List dense>
                      {order.productos_comprados.map((prod, i) => (
                        <ListItem key={i} sx={{ p: 0 }}>
                          {prod.cantidad}
                        </ListItem>
                      ))}
                    </List>
                  </TableCell>
                  {/* Precio Total */}
                  <TableCell sx={{ fontFamily: "PeterMedium", fontWeight: "bold" }}>
                    L.{total.toFixed(2)}
                  </TableCell>
                  <TableCell sx={{ fontFamily: "PeterMedium" }}>{order.email}</TableCell>
                <TableCell sx={{ fontFamily: "PeterMedium" }}>
                    <Select
                      value={order.estado}
                      onChange={(e) => handleEstado(index, e.target.value)}
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
    </Box>
  );
}

