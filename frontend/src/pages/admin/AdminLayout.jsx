import React from 'react';
import CustomNavbar from '../../components/Navbar';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemText, Toolbar } from '@mui/material';
import '../../components/styles.css';

const drawerWidth = 240; // Ancho del Drawer lateral

const menuItems = [
  { text: 'Estadisticas del Sitio', path: 'dashboard' },
  { text: 'Comentarios de Visitantes', path: 'comments' },
  { text: 'Estadísticas de Jugadores', path: 'players' },
];

export default function AdminLayout() {
  const location = useLocation();

  return (
    <Box>
      {/* Navbar superior */}
      <CustomNavbar />

      {/* Layout principal: Drawer + contenido */}
      <Box sx={{ display: 'flex'}}>
        {/* Drawer lateral */}
        <Drawer
          variant="permanent"
          anchor="left"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { 
              width: drawerWidth,
              boxSizing: 'border-box',
              backgroundColor: '#10045c', // Color de fondo
              color: '#FFFFFF',           // Color de texto
              top: '90px', // 👈 Esto baja todo el Drawer (no solo su contenido)
              height: 'calc(100% - 90px)', // 👈 Ajusta altura para que no se salga de pantalla
              position: 'fixed', // 👈 Necesario para que el top funcione
            },
          }}
        >
          <Box sx={{ overflow: 'auto' }}>
            <List>
              {menuItems.map((item) => (
                <ListItem key={item.text} disablePadding>
                  <ListItemButton
                    component={Link}
                    to={`/admin/${item.path}`}
                    selected={location.pathname.endsWith(item.path)}
                  >
                    <ListItemText primary={item.text} primaryTypographyProps={{ fontFamily: 'PeterMedium' }} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>

        {/* Contenido renderizado */}
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}