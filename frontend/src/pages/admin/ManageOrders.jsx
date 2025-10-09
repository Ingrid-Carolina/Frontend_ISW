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
  TextField,
  Button
} from "@mui/material";

export default function ManageOrders() {
  const [ordenes, setordenes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const elementsPerPage = 10;
   const [searchTerm, setSearchTerm] = useState("");

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
              detalle_camisa: producto.detalle_camisa || '', // AGREGAR ESTA LÍNEA
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

   // Filtra las donaciones según el término de búsqueda
  const filteredOrders = ordenes.filter((orden) =>{ 
    // Busca el término en cualquier campo de la donación
    const datos_generales=Object.values(orden).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )

      const matchesProductos = orden.productos_comprados.some((producto) => //busca el arreglo anidado productos_comprados en el arreglo base(ordenes)
    Object.values(producto).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return datos_generales||matchesProductos;

});

  

  // Calcula el número total de páginas para la paginación
  const totalPages = Math.ceil(filteredOrders.length / elementsPerPage);
  // Obtiene las donaciones a mostrar en la página actual
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * elementsPerPage,
    currentPage * elementsPerPage
  );

  

  const handleEstado = async (orderIndex, newEstado) => {
    const idorden = ordenes[orderIndex].idorden;
    setordenes((prevordenes) =>
      prevordenes.map((orden, i) =>
        i === orderIndex ? { ...orden, estado: newEstado } : orden
      )
    );
    const url = `/auth/estado/${idorden}`;
    const updatedestado = {
      estado: newEstado
    };

    console.log(updatedestado);
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



  const handleNextPage = () => {
    setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
  };

  return (
    <Box sx={{ mt: 12, px: { xs: 1, sm: 2, md: 3 }}}>
      <Typography
        variant="h4"
        sx={{
         fontFamily: "GroteskBold",
         mb: { xs: 2, sm: 3, md: 4 },
         textAlign: "center",
        color: "#10045c",
         fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
        }}
      >
        Administrar Órdenes
      </Typography>

     {/* Barra de búsqueda centrada y responsiva */}
<Box
  display="flex"
  justifyContent="center"
  alignItems="center"
  sx={{
    mb: { xs: 2, sm: 3, md: 4 }, // margin bottom changes per device
    px: { xs: 1, sm: 2, md: 3 }, // horizontal padding for breathing room
  }}
>
  <TextField
    label="Buscar..."
    variant="outlined"
    size="small"
    value={searchTerm}
    onChange={(e) => {
      setSearchTerm(e.target.value);
      setCurrentPage(1);
    }}
    fullWidth
    sx={{
      maxWidth: { xs: 300, sm: 500, md: 600 }, // limit width but let it scale
      borderRadius: "30px",
      "& .MuiOutlinedInput-root": {
        borderRadius: "30px",
      },
      "& .MuiInputLabel-root": {
        fontFamily: "PeterMedium",
      },
      "& .MuiOutlinedInput-input": {
        fontFamily: "PeterMedium",
      },
    }}
  />
</Box>


<Box
  sx={{
    width: '100%',
    overflowX: {
      xs: 'auto', // allow scroll on small screens
      md: 'visible',
    },
    WebkitOverflowScrolling: 'touch',
  }}
>
  <Box
    sx={{
      minWidth: 1200, // forces horizontal overflow
      display: 'inline-block',
    }}
  >
      <TableContainer component={Paper} sx={{ borderRadius: 3}}>
        <Table  >
          <TableHead>
            <TableRow sx={{ backgroundColor: "#10045c" }}>
              <TableCell sx={{ fontFamily: "PeterMedium", fontWeight: "bold", color: "#fff", fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' }, }}>Usuario</TableCell>
              <TableCell sx={{ fontFamily: "PeterMedium", fontWeight: "bold", color: "#fff", fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' }, }}>Productos</TableCell>
              {/* NUEVA COLUMNA AGREGADA */}
              <TableCell sx={{ fontFamily: "PeterMedium", fontWeight: "bold", color: "#fff", fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' }, }}>Detalle Camisa</TableCell>
              <TableCell sx={{ fontFamily: "PeterMedium", fontWeight: "bold", color: "#fff", fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' }, }}>Cantidad</TableCell>
              <TableCell sx={{ fontFamily: "PeterMedium", fontWeight: "bold", color: "#fff", fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' }, }}>Precio Total</TableCell>
              <TableCell sx={{ fontFamily: "PeterMedium", fontWeight: "bold", color: "#fff", fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' }, }}>Email de Compra</TableCell>
              <TableCell sx={{ fontFamily: "PeterMedium", fontWeight: "bold", color: "#fff", fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' }, }}>Estado</TableCell>
              <TableCell sx={{ fontFamily: "PeterMedium", fontWeight: "bold", color: "#fff", fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' }, }}>Fecha de Compra</TableCell>
              <TableCell sx={{ fontFamily: "PeterMedium", fontWeight: "bold", color: "#fff", fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' }, }}>ID Compra</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedOrders.map((order, index) => {
              const total = order.productos_comprados.reduce( //usamos la funcion reduce para calcular el total de cada elemento en productos_comprados
                (acc, item) => acc + item.total,
                0
              );
              return (
                <TableRow key={order.idorden} hover>
                  <TableCell sx={{ fontFamily: "PeterMedium", fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' } }}>{order.nombre_usuario}</TableCell>
                  <TableCell sx={{ fontFamily: "PeterMedium", fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' } }}>
                    <List dense sx={{fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' }}} >
                      {order.productos_comprados.map((prod, i) => (
                        <ListItem key={i} sx={{ p: 0 }}>{prod.producto}</ListItem>
                      ))}
                    </List>
                  </TableCell>
                  
                  {/* NUEVA CELDA PARA DETALLES DE CAMISA */}
                  <TableCell sx={{ fontFamily: "PeterMedium", fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' } }}>
                    <List dense  sx={{fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' }}}>
                      {order.productos_comprados.map((prod, i) => (
                        <ListItem key={i} sx={{ p: 0, fontSize: '0.875rem' }}>
                          {prod.detalle_camisa && prod.detalle_camisa.trim() !== "" 
                            ? prod.detalle_camisa 
                            : "-"}
                        </ListItem>
                      ))}
                    </List>
                  </TableCell>
                  
                  <TableCell sx={{ fontFamily: "PeterMedium" , fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' }}}>
                    <List dense  sx={{fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' }}}>
                      {order.productos_comprados.map((prod, i) => (
                        <ListItem key={i} sx={{ p: 0 }}>{prod.cantidad}</ListItem>
                      ))}
                    </List>
                  </TableCell>
                  <TableCell sx={{ fontFamily: "PeterMedium", fontWeight: "bold", fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' } }}>L.{total.toFixed(2)}</TableCell>
                  <TableCell sx={{ fontFamily: "PeterMedium", fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' } }}>{order.email}</TableCell>
                  <TableCell sx={{ fontFamily: "PeterMedium" , fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' }}}>
                    <Select
                      value={order.estado}
                      onChange={(e) => handleEstado(index + indexOfFirstElement, e.target.value)}
                      variant="standard"
                      sx={{ fontFamily: "PeterMedium", minWidth: 120,fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' }}}
                      
                    >
                      <MenuItem value="Pendiente">Pendiente</MenuItem>
                      <MenuItem value="En Proceso">En Proceso</MenuItem>
                      <MenuItem value="Entregado">Entregado</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell sx={{ fontFamily: "PeterMedium", fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' } }}>{order.fecha}</TableCell>
                  <TableCell sx={{ fontFamily: "PeterMedium", fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' } }}>{order.idorden}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
       </Box>
</Box>
      {/* Controles de Paginación */}
      <Box sx={{ display: 'flex',flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'center',alignItems: 'center', mt: 2, gap: 2 }}>
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