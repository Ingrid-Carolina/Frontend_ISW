import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import EventIcon from '@mui/icons-material/Event';
import Button from '@mui/material/Button';
import CallIcon from '@mui/icons-material/Call';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EmojiPeopleRoundedIcon from '@mui/icons-material/EmojiPeopleRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import logo from '../ima/Logo-pilotos.png';
import { Link } from 'react-router-dom';

const menuItems = [
  { text: 'Categoria', icon: <GroupsRoundedIcon/> },
  { text: 'Jugadores', icon: <EmojiPeopleRoundedIcon /> },
  { text: 'Calendario', icon: <CalendarMonthIcon /> },
  { text: 'Noticias y Eventos', icon: <EventIcon /> },
  { text: 'Logros', icon: <EmojiEventsIcon /> },
  { text: 'Contactanos', icon: <CallIcon /> },
  { text: 'Voluntariado', icon: <PersonAddIcon /> }
];

const navLinks = [
  { text: 'NUESTRA HISTORIA', path: '/historia' },
  { text: 'LO QUE HACEMOS', path: '/quehacemos' },
  { text: 'TIENDA', path: '/tienda' },
  { text: 'DONAR', path: '/donar' }
];

export default function CustomNavbar() {
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const toggleDrawer = () => {
    setDrawerOpen((prev) => !prev);
  };

  return (
    <>
    
      <AppBar position="fixed" sx={{ backgroundColor: '#0c005a', zIndex: 1301 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Box component="img" src={logo} alt="Logo Pilotos" sx={{ height: 50 }} />

            <Box sx={{ display: 'flex', gap: 3 }}>
              {navLinks.map((link) => (
                <Button
                  key={link.text}
                  component={Link}
                  to={link.path}
                  sx={{
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    fontFamily: '"Bebas Neue", sans-serif',
                    '&:hover': {
                      color: '#c62828',
                    },
                  }}
                >
                  {link.text}
                </Button>
              ))}
            </Box>
          </Box>

          <IconButton
            onClick={toggleDrawer}
            color="inherit"
            sx={{
              '&:hover': {
                color: '#c62828',
              },
            }}
          >
            {drawerOpen ? <CloseIcon /> : <MenuIcon />}
            <Typography sx={{ ml: 1, fontWeight: 'bold', fontFamily: '"Bebas Neue", sans-serif' }}>MENÚ</Typography>
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="top"
        open={drawerOpen}
        onClose={toggleDrawer}
        ModalProps={{ keepMounted: true }}
        PaperProps={{ sx: { mt: '64px', zIndex: 1200 } }}
      >
        <Box
          sx={{ width: '100%', p: 3 }}
          role="presentation"
          onClick={toggleDrawer}
          onKeyDown={toggleDrawer}
        >
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', fontFamily: '"Bebas Neue", sans-serif' }}>
          </Typography>
          <List>
            {menuItems.map((item) => (
              <ListItem button key={item.text}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontFamily: '"Bebas Neue", sans-serif',
                    fontWeight: 'bold',
                    fontSize: '0.95rem',
                    sx: {
                      '&:hover': {
                        color: '#c62828',
                      },
                    },
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>

  );
}
