import React from 'react';
import CustomNavbar from '../../components/Navbar';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemText, Toolbar, Typography } from '@mui/material';
import '../../components/styles.css';
import { useTheme, useMediaQuery, IconButton } from '@mui/material';
import { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';




const menuItems = [
  { text: 'Estadisticas del Sitio', path: 'dashboard' },
  { text: 'Noticias', path: 'newsadm' },
  { text: 'Control de Jugadores', path: 'players' },
  { text: 'Testimonios', path: 'mngtestimonios' },
];

export default function AdminLayout() {
  const location = useLocation();
  const theme = useTheme();
const isXsScreen = useMediaQuery(theme.breakpoints.down('sm'));  //para dispositos super chiquitos
  
const drawerWidth = 240; // Shrinks on mobile
const [mobileOpen, setMobileOpen] = useState(false);

const handleDrawerToggle = () => {
  setMobileOpen(!mobileOpen);
};


  return (
    <Box>
      {/* Navbar superior */}
      <CustomNavbar />

      {/* Layout principal: Drawer + contenido */}
      <Box sx={{ display: 'flex'}}>
        {/* Drawer lateral */}
       {isXsScreen ? (
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
    {/* Drawer content here */}
     <Box sx={{ overflow: 'auto',  placeItems: 'stretch', mt: { xs: 8, md: 10 } }}>
            {/* Título agregado */}
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
) : (
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
       
          <Box sx={{ overflow: 'auto', placeItems: 'stretch', mt: { xs: 8, md: 5 } }}>
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
                 fontSize: { xs: '0.8rem', md: '1.5rem' }
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
)
}

        {/* Contenido renderizado */}
        <Box component="main" sx={{ flexGrow:1, p: { xs: 1, sm: 2, md: 3 } ,placeItems: 'stretch'}}>
  
          <Outlet />
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