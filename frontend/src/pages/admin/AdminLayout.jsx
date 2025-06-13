import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemText, Toolbar } from '@mui/material';

const menuItems = [
  { text: 'Estadísticas del Sitio', path: 'dashboard' },
  { text: 'Comentarios de Visitantes', path: 'comments' },
  { text: 'Estadísticas de Jugadores', path: 'players' },
];

export default function AdminLayout() {
  const location = useLocation();

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer variant="permanent" anchor="left">
        <Toolbar />
        <Box sx={{ width: 240 }}>
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton component={Link} to={item.path} selected={location.pathname.endsWith(item.path)}>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}