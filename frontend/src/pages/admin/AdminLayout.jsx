import React from 'react';
// Importa la barra de navegación personalizada
import CustomNavbar from '../../components/Navbar';
// Importa componentes de React Router para navegación y rutas
import { Outlet, Link, useLocation } from 'react-router-dom';
// Importa componentes de Material UI para el diseño y la interfaz
import { Box, Drawer, List, ListItem, ListItemButton, ListItemText, Toolbar, Typography } from '@mui/material';
import '../../components/styles.css';
// Importa hooks y componentes adicionales de Material UI
import { useTheme, useMediaQuery, IconButton } from '@mui/material';
import { useState } from 'react';
// Importa el ícono del menú hamburguesa
import MenuIcon from '@mui/icons-material/Menu';

// Array con los elementos del menú lateral, cada uno tiene texto y ruta
const menuItems = [
  { text: 'Noticias', path: 'newsadm' },
  { text: 'Testimonios', path: 'mngtestimonios' },
  { text: 'Administrar Órdenes', path: 'mngordenes' }, 
  { text: 'Administrar Productos de Donaciones', path: 'mngproddonaciones' }, 
  { text: 'Administrar Roles', path: 'mngusuarios' }, 
  { text: 'Administrar Donaciones', path: 'mngdonaciones' },
];

// Componente principal del layout de administrador
export default function AdminLayout() {
  // Hook para obtener la ubicación actual (ruta) del navegador
  const location = useLocation();
  // Hook para obtener el tema de Material UI
  const theme = useTheme();
  // Hook para detectar si la pantalla es extra pequeña (responsive)
  const isXsScreen = useMediaQuery(theme.breakpoints.down('sm'));  //para dispositos super chiquitos

  // Ancho del drawer lateral
  const drawerWidth = 240; // Shrinks on mobile
  // Estado para controlar si el drawer móvil está abierto
  const [mobileOpen, setMobileOpen] = useState(false);

  // Función para alternar el estado del drawer móvil
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Renderizado del componente
  return (
    <Box>
      {/* Navbar superior */}
      <CustomNavbar />

      {/* Layout principal: Drawer + contenido */}
      <Box sx={{ display: 'flex' }}>
        {/* Drawer lateral */}
        {isXsScreen ? (
          // Drawer temporal para pantallas pequeñas (móvil)
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              [`& .MuiDrawer-paper`]: {
                width: 200,
                backgroundColor: '#10045c',
                color: '#FFFFFF',
              },
            }}
          >
            {/* Contenido del drawer */}
            <Box sx={{ overflow: 'auto', placeItems: 'stretch', mt: { xs: 8, md: 10 } }}>
              {/* Título del panel */}
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontFamily: 'GroteskBold',
                    color: '#ffffff',
                    textAlign: 'center',
                    letterSpacing: 1,
                    paddingTop: 1,
                    pt: { xs: 2, md: 4 },
                    fontSize: { xs: '1.5rem', md: '3.5rem' }
                  }}
                >Panel de Administrador</Typography>
              </Box>
              {/* Lista de opciones del menú */}
              <List>
                {menuItems.map((item) => (
                  <ListItem key={item.text} disablePadding>
                    <ListItemButton
                      component={Link}
                      to={`/admin/${item.path}`}
                      selected={location.pathname.endsWith(item.path)}
                    >
                      <ListItemText primary={item.text} primaryTypographyProps={{ fontFamily: 'PeterMedium', textAlign: 'center' }} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Box>
          </Drawer>
        ) : (
          // Drawer permanente para pantallas grandes (desktop/tablet)
          <Drawer
            variant="permanent"
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
                overflowX: 'hidden',
                transition: 'width 0.3s ease-in-out',
              },
            }}
          >
            {/* Contenido del drawer */}
            <Box sx={{ overflow: 'auto', placeItems: 'stretch', mt: { xs: 8, md: 5 } }}>
              {/* Título del panel */}
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
                    fontSize: { xs: '0.8rem', md: '1.5rem' }
                  }}
                >Panel de Administrador</Typography>
              </Box>
              {/* Lista de opciones del menú */}
              <List>
                {menuItems.map((item) => (
                  <ListItem key={item.text} disablePadding>
                    <ListItemButton
                      component={Link}
                      to={`/admin/${item.path}`}
                      selected={location.pathname.endsWith(item.path)}
                    >
                      <ListItemText primary={item.text} primaryTypographyProps={{ fontFamily: 'PeterMedium', textAlign: 'center' }} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Box>
          </Drawer>
        )
        }

        {/* Contenido principal renderizado según la ruta */}
        <Box component="main" sx={{ flexGrow: 1, p: { xs: 1, sm: 2, md: 3 }, placeItems: 'stretch' }}>
          {/* Outlet renderiza el componente hijo según la ruta actual */}
          <Outlet />
          {/* Toolbar con botón para abrir el drawer en móvil */}
          <Toolbar>
            {isXsScreen && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Toolbar>
        </Box>
      </Box>
    </Box>
  )
}