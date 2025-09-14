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

const ManageUsuarios=()=> {


    const [usuarios, setusuarios]= useState([]);


    const fetchUsuarios=async()=>{

      try {

          const res = await api.get('/auth/obtenerusuarios',{ //hacemos fetch de los videos
				skipAuthRedirect: true,
			});

        const usuarios= res.data;

         const usuariosLista = usuarios.map(usuario => ({ //transformo my res.data en un array que el frontend pueda leer
          id: usuario.id,
          nombre: usuario.nombre,
          email: usuario.email,
          rol: usuario.rol,
        }));


        setusuarios(usuariosLista)
        console.log(usuarios);
        
      } catch (error) {
         console.error('Error al obtener testimonios:', error.message);
        
      }
        


    }


  useEffect(() => {


    fetchUsuarios();
        
        
    }, []);



  const handleRol = async (usuarioIndex, newRol) => {
    const id = usuarios[usuarioIndex].id;
  setusuarios((prevusuarios) => //solamente para frontend
    prevusuarios.map((usuario, i) =>
      i === usuarioIndex ? { ...usuario, rol: newRol } : usuario //iteramos hasta llegar al indice elegido
    )
  );


  

   const url = `/auth/usuario/${id}`;

   const updatedrol={

    rol: newRol

   }

   try {

     const res = await api.put(url, updatedrol, {
           headers: { "Content-Type": "application/json" }
         });

         console.log(res.data);
    
   } catch (error) {

     console.error('Error al setear el rol:', error.message);
    
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
        Administrar Usuarios
      </Typography>

      {/* Tabla de órdenes */}
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
            {usuarios.map((usuario, index) => {
              // Calcular total de la orden

              return (
                <TableRow key={usuario.id} hover>
                  <TableCell sx={{ fontFamily: "PeterMedium" }}>{usuario.nombre}</TableCell>


                  {/* Cantidades en lista */}
                  <TableCell sx={{ fontFamily: "PeterMedium" }}>{usuario.email} </TableCell>
                  {/* Precio Total */}
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