import React from 'react';
import CustomNavbar from '../../components/Navbar';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemText, Toolbar, Typography } from '@mui/material';
import '../../components/styles.css';
import { useTheme, useMediaQuery, IconButton } from '@mui/material';
import { useState } from 'react';


const drawerWidth = 240; // Ancho del Drawer lateral


const menuItems = [
  { text: 'Estadisticas del Sitio', path: 'dashboard' },
  { text: 'Noticias', path: 'newsadm' },
  { text: 'Control de Jugadores', path: 'players' },
  { text: 'Testimonios', path: 'mngtestimonios' },
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
              backgroundColor: '#10045c',
              color: '#FFFFFF',           
              top: '90px', 
              height: 'calc(100% - 90px)', 
              position: 'fixed', 
            },
          }}
        >
          <Box sx={{ overflow: 'auto' }}>
            {/* Título agregado */}
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="h5"
                sx={{
                  fontFamily: 'GroteskBold',
                  color: '#ffffff',
                  textAlign: 'center',
                  letterSpacing: 1,
                  paddingTop: 4,
                  pt: { xs: 2, md: 4 },
                 fontSize: { xs: '1.2rem', md: '1.5rem' }
                }}
              >Panel de Administrador</Typography>
            </Box>
            <List>
              {menuItems.map((item) => (
                <ListItem key={item.text} disablePadding>
                  <ListItemButton
                    component={Link}
                    to={`/admin/${item.path}`}
                    selected={location.pathname.endsWith(item.path)}
                  >
                    <ListItemText primary={item.text} primaryTypographyProps={{ fontFamily: 'PeterMedium', textAlign: 'center'}} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>

        {/* Contenido renderizado */}
        <Box component="main" sx={{ flexGrow: 1, p: { xs: 1, sm: 2, md: 3 },  marginLeft:0 }}>
          <Toolbar />
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}