import React from 'react';
import {
  Box,
  Container,
  useTheme,
  useMediaQuery,
  Fade,
  AppBar,
  Toolbar,
  TextField,
  IconButton,
  Button,
  Badge,
  Typography,
  Paper,
  Modal,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  ListItemSecondaryAction,
  Menu,
  MenuItem
} from '@mui/material';
import {
  Search as SearchIcon,
  ShoppingCart as ShoppingCartIcon,
  Close as CloseIcon,
  FlightTakeoff as FlightIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  AccountCircle as AccountCircleIcon,
  Headset as HeadsetIcon,
  LocalAirport as AirportIcon,
  Speed as SpeedIcon,
  Visibility as VisibilityIcon,
  Navigation as NavigationIcon,
  Security as SecurityIcon
} from '@mui/icons-material';

import logo from '/Images/Logo-pilotos.png';
// Importar las clases Login y Registro
import Login from './Login';
import Registro from './Registro';

class Tienda extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchQuery: '',
      cartItems: [],
      totalItems: 0,
      cartModalOpen: false,
      userMenuAnchor: null,
      // Agregar estados para controlar qué componente mostrar
      currentView: 'tienda', // 'tienda', 'login', 'registro'
      isLoggedIn: false,
      userData: null
    };
    console.log('Tienda inicializada');
  }

  // Datos de productos con diferentes descripciones y precios
  productos = [
    {
      id: 1,
      nombre: "Auriculares de Aviación David Clark H10-13.4",
      descripcion: "Auriculares profesionales con cancelación de ruido activa para pilotos comerciales",
      precio: 2499.99,
      icono: HeadsetIcon
    },
    {
      id: 2,
      nombre: "GPS Garmin G1000 NXi",
      descripcion: "Sistema de navegación GPS avanzado con pantalla táctil y mapas actualizados",
      precio: 15999.99,
      icono: NavigationIcon
    },
    {
      id: 3,
      nombre: "Altímetro Kollsman Sensitive",
      descripcion: "Altímetro de precisión certificado para uso en aeronaves comerciales",
      precio: 899.50,
      icono: SpeedIcon
    },
    {
      id: 4,
      nombre: "Chaleco Salvavidas Automático",
      descripcion: "Chaleco de seguridad con inflado automático certificado por FAA",
      precio: 345.75,
      icono: SecurityIcon
    },
    {
      id: 5,
      nombre: "Kit de Vuelo Nocturno LED",
      descripcion: "Luces LED rojas para preservar la visión nocturna durante vuelos",
      precio: 125.00,
      icono: VisibilityIcon
    },
    {
      id: 6,
      nombre: "Manual de Operaciones Boeing 737",
      descripcion: "Manual completo de procedimientos y operaciones para Boeing 737-800",
      precio: 450.00,
      icono: AirportIcon
    },
    {
      id: 7,
      nombre: "Cronómetro de Vuelo Breitling",
      descripcion: "Cronómetro de precisión suiza diseñado específicamente para aviación",
      precio: 3200.00,
      icono: SpeedIcon
    },
    {
      id: 8,
      nombre: "Maletin de Vuelo Pilot Gear",
      descripcion: "Maletín profesional de cuero con compartimentos para documentos y equipos",
      precio: 280.50,
      icono: FlightIcon
    },
    {
      id: 9,
      nombre: "Transceptor de Radio Icom IC-A25N",
      descripcion: "Radio portátil con GPS integrado y función de emergencia",
      precio: 1150.00,
      icono: HeadsetIcon
    },
    {
      id: 10,
      nombre: "Gafas de Sol Aviador Ray-Ban",
      descripcion: "Gafas polarizadas con protección UV400 diseñadas para pilotos",
      precio: 195.00,
      icono: VisibilityIcon
    },
    {
      id: 11,
      nombre: "Sistema EFB iPad Pro Aviation",
      descripcion: "iPad Pro configurado con software de vuelo ForeFlight y Jeppesen",
      precio: 2800.00,
      icono: NavigationIcon
    },
    {
      id: 12,
      nombre: "Uniforme de Piloto Premium",
      descripcion: "Uniforme completo de 4 piezas con galones dorados y insignias bordadas",
      precio: 650.00,
      icono: SecurityIcon
    }
  ];

  // Manejar búsqueda
  handleSearchChange = (event) => {
    this.setState({ searchQuery: event.target.value });
  }

  handleSearchSubmit = (event) => {
    event.preventDefault();
    console.log('Búsqueda:', this.state.searchQuery);
  }

  // Manejar carrito - Abrir modal del carrito
  handleCartClick = () => {
    console.log('Carrito clickeado');
    this.setState({ cartModalOpen: true });
  }

  // Cerrar modal del carrito
  cerrarCarritoModal = () => {
    this.setState({ cartModalOpen: false });
  }

  // Manejar menú de usuario
  handleUserMenuClick = (event) => {
    this.setState({ userMenuAnchor: event.currentTarget });
  }

  handleUserMenuClose = () => {
    this.setState({ userMenuAnchor: null });
  }

  // Navegación a Login
  handleLogin = () => {
    console.log('Navegando a Login');
    this.setState({
      currentView: 'login',
      userMenuAnchor: null
    });
  }

  // Navegación a Registro
  handleRegister = () => {
    console.log('Navegando a Registro');
    this.setState({
      currentView: 'registro',
      userMenuAnchor: null
    });
  }

  // Volver a la tienda
  handleBackToTienda = () => {
    this.setState({ currentView: 'tienda' });
  }

  // Manejar login exitoso
  handleLoginSuccess = (userData) => {
    console.log('Login exitoso:', userData);
    this.setState({
      isLoggedIn: true,
      userData: userData,
      currentView: 'tienda'
    });
  }

  // Manejar registro exitoso
  handleRegistroSuccess = (userData) => {
    console.log('Registro exitoso:', userData);
    this.setState({
      isLoggedIn: true,
      userData: userData,
      currentView: 'tienda'
    });
  }

  // Cerrar sesión
  handleLogout = () => {
    console.log('Cerrando sesión');
    this.setState({
      isLoggedIn: false,
      userData: null,
      userMenuAnchor: null
    });
  }

  handleProfile = () => {
    console.log('Ir a perfil');
    this.handleUserMenuClose();
    // Aquí puedes agregar la lógica para ir al perfil
  }

  // Agregar item al carrito
  addToCart = (producto) => {
    this.setState(prevState => {
      const existingItem = prevState.cartItems.find(item => item.id === producto.id);

      let newCartItems;
      if (existingItem) {
        // Si el producto ya existe, incrementar cantidad
        newCartItems = prevState.cartItems.map(item =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      } else {
        // Si es un producto nuevo, agregarlo
        newCartItems = [...prevState.cartItems, { ...producto, cantidad: 1 }];
      }

      // Calcular total de items
      const totalItems = newCartItems.reduce((total, item) => total + item.cantidad, 0);

      return {
        cartItems: newCartItems,
        totalItems: totalItems
      };
    });
  }

  // Aumentar cantidad de un producto
  aumentarCantidad = (productId) => {
    this.setState(prevState => {
      const newCartItems = prevState.cartItems.map(item =>
        item.id === productId
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      );

      const totalItems = newCartItems.reduce((total, item) => total + item.cantidad, 0);

      return {
        cartItems: newCartItems,
        totalItems: totalItems
      };
    });
  }

  // Disminuir cantidad de un producto
  disminuirCantidad = (productId) => {
    this.setState(prevState => {
      const newCartItems = prevState.cartItems.map(item =>
        item.id === productId && item.cantidad > 1
          ? { ...item, cantidad: item.cantidad - 1 }
          : item
      );

      const totalItems = newCartItems.reduce((total, item) => total + item.cantidad, 0);

      return {
        cartItems: newCartItems,
        totalItems: totalItems
      };
    });
  }

  // Eliminar producto del carrito
  eliminarDelCarrito = (productId) => {
    this.setState(prevState => {
      const newCartItems = prevState.cartItems.filter(item => item.id !== productId);
      const totalItems = newCartItems.reduce((total, item) => total + item.cantidad, 0);

      return {
        cartItems: newCartItems,
        totalItems: totalItems
      };
    });
  }

  // Calcular total del carrito
  calcularTotal = () => {
    return this.state.cartItems.reduce((total, item) => total + (item.precio * item.cantidad), 0).toFixed(2);
  }

  // Filtrar productos basado en la búsqueda
  getFilteredProducts = () => {
    if (!this.state.searchQuery) {
      return this.productos;
    }

    return this.productos.filter(producto =>
      producto.nombre.toLowerCase().includes(this.state.searchQuery.toLowerCase()) ||
      producto.descripcion.toLowerCase().includes(this.state.searchQuery.toLowerCase())
    );
  }

  // Renderizar la Navbar sin icono de usuario ni logo
  renderSecondaryNavbar = () => {
    return (
      <AppBar
        position="static"
        elevation={2}
        sx={{
          backgroundColor: 'white',
          minHeight: '70px',
          marginTop: '60px'
        }}
      >
        <Toolbar sx={{ justifyContent: 'center', py: 1, minHeight: '70px !important' }}>
          {/* Barra de búsqueda en el centro */}
          <Box
            component="form"
            onSubmit={this.handleSearchSubmit}
            sx={{
              flexGrow: 1,
              maxWidth: 500,
              mx: { xs: 1, sm: 3 }
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Buscar productos..."
              value={this.state.searchQuery}
              onChange={this.handleSearchChange}
              size="medium"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'white',
                  borderRadius: 2,
                  height: '45px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  border: '2px solid #e0e0e0',
                  '& fieldset': {
                    borderColor: '#2c1a99',
                    borderWidth: '2px',
                  },
                  '&:hover': {
                    borderColor: '#2c1a99',
                    '& fieldset': {
                      borderColor: '#2c1a99',
                      borderWidth: '2px',
                    }
                  },
                  '&.Mui-focused': {
                    borderColor: '#2c1a99',
                    boxShadow: '0 0 0 3px rgba(44, 26, 153, 0.2)',
                    '& fieldset': {
                      borderColor: '#2c1a99',
                      borderWidth: '3px',
                    }
                  }
                },
                '& .MuiInputBase-input': {
                  padding: '10px 14px',
                  fontSize: '16px',
                  fontWeight: '500'
                }
              }}
            />
          </Box>

          {/* Iconos de búsqueda y carrito */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 2 }}>
            <IconButton
              type="submit"
              onClick={this.handleSearchSubmit}
              sx={{
                color: 'black',
                backgroundColor: 'rgba(255,255,255,0.2)',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.4)' }
              }}
              size="large"
            >
              <SearchIcon sx={{ fontSize: 30 }} />
            </IconButton>

            <IconButton
              onClick={this.handleCartClick}
              sx={{
                color: 'black',
                backgroundColor: 'rgba(255,255,255,0.2)',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.4)' }
              }}
              size="large"
            >
              <Badge badgeContent={this.state.totalItems} color="error">
                <ShoppingCartIcon sx={{ fontSize: 30 }} />
              </Badge>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
    );
  }

  // Renderizar contenido de la tienda
  renderTiendaContent = () => {
    const filteredProducts = this.getFilteredProducts();

    return (
      <Container
        maxWidth="lg"
        sx={{
          py: 4,
          maxHeight: 'calc(100vh - 150px)',
          overflow: 'auto',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': {
            display: 'none'
          },
          '-ms-overflow-style': 'none'
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ color: '#2c1a99', fontWeight: 'bold' }}>
          {this.state.isLoggedIn
            ? `Bienvenido ${this.state.userData?.nombre || 'Usuario'} a la Tienda de Pilotos`
            : 'Bienvenido a la Tienda de Pilotos'
          }
        </Typography>

        {this.state.searchQuery && (
          <Typography variant="h6" sx={{ mb: 2, color: '#666' }}>
            Resultados para: "{this.state.searchQuery}" ({filteredProducts.length} productos)
          </Typography>
        )}

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 3, mt: 3 }}>
          {filteredProducts.map((producto) => {
            const IconComponent = producto.icono;
            return (
              <Paper
                key={producto.id}
                elevation={2}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                  },
                  height: 'fit-content'
                }}
              >
                <Box
                  sx={{
                    height: 150,
                    backgroundColor: '#f8f9fa',//fondo de los Iconos de cada producto
                    borderRadius: 1,
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid #e9ecef'
                  }}
                >
                  <IconComponent sx={{ fontSize: 50, color: '#2c1a99' }} />
                </Box>

                <Typography variant="h6" gutterBottom sx={{
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  lineHeight: 1.3,
                  minHeight: '2.6rem',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {producto.nombre}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  gutterBottom
                  sx={{
                    minHeight: '3rem',
                    fontSize: '0.9rem',
                    lineHeight: 1.4,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  {producto.descripcion}
                </Typography>

                <Typography
                  variant="h5"
                  sx={{
                    color: '#2c1a99',
                    fontWeight: 'bold',
                    mb: 2,
                    fontSize: '1.3rem'
                  }}
                >
                  L{producto.precio.toLocaleString('es-HN', { minimumFractionDigits: 2 })}
                </Typography>

                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => this.addToCart(producto)}
                  sx={{
                    backgroundColor: '#E06C14',//del boton agregar producto
                    color: 'white',
                    fontWeight: 'bold',
                    py: 1.2,
                    fontSize: '1rem',
                    '&:hover': {
                      backgroundColor: '#28a428',// cuando estoy encima del boton agregar producto de otro color
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(50, 205, 50, 0.3)'
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  Agregar al Carrito
                </Button>
              </Paper>
            );
          })}
        </Box>

        {filteredProducts.length === 0 && this.state.searchQuery && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <SearchIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No se encontraron productos que coincidan con tu búsqueda
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Intenta con términos diferentes o explora nuestros productos
            </Typography>
          </Box>
        )}
      </Container>
    );
  }

  // Renderizar modal del carrito
  renderCarritoModal = () => {
    return (
      <Modal
        open={this.state.cartModalOpen}
        onClose={this.cerrarCarritoModal}
        aria-labelledby="carrito-modal"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: 650 },
          // Se eliminó maxHeight y overflow del Box principal
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          display: 'flex', // Añadido para facilitar el layout interno
          flexDirection: 'column', // Añadido para que el contenido fluya verticalmente
          maxHeight: '90vh' // Limita la altura total del modal en pantallas grandes
        }}>
          {/* Header del carrito */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" component="h2">
              Carrito de Compras
            </Typography>
            <IconButton onClick={this.cerrarCarritoModal}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Contenido del carrito */}
          {this.state.cartItems.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <ShoppingCartIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                Tu carrito está vacío
              </Typography>
            </Box>
          ) : (
            <>
              {/* Lista de productos con scroll propio */}
              <List sx={{
                flexGrow: 1, // Permite que la lista ocupe el espacio disponible
                overflowY: 'auto', // Habilita el scroll vertical si el contenido excede la altura
                scrollbarWidth: 'none', // Para Firefox
                '&::-webkit-scrollbar': { // Para Webkit (Chrome, Safari)
                  display: 'none'
                },
                '-ms-overflow-style': 'none' // Para IE/Edge
              }}>
                {this.state.cartItems.map((item, index) => {
                  const IconComponent = item.icono || FlightIcon;
                  return (
                    <React.Fragment key={item.id}>
                      <ListItem sx={{ py: 2 }}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: '#2c1a99', width: 50, height: 50 }}>
                            <IconComponent />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 'bold' }}>
                              {item.nombre}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="body2" color="text.secondary">
                              L{item.precio.toLocaleString('es-HN', { minimumFractionDigits: 2 })} c/u
                            </Typography>
                          }
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 2 }}>
                          <IconButton
                            size="small"
                            onClick={() => this.disminuirCantidad(item.id)}
                            disabled={item.cantidad <= 1}
                            sx={{
                              bgcolor: '#f5f5f5',
                              '&:hover': { bgcolor: '#e0e0e0' }
                            }}
                          >
                            <RemoveIcon />
                          </IconButton>
                          <Typography variant="body1" sx={{
                            minWidth: 40,
                            textAlign: 'center',
                            fontWeight: 'bold',
                            fontSize: '1.1rem'
                          }}>
                            {item.cantidad}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => this.aumentarCantidad(item.id)}
                            sx={{
                              bgcolor: '#f5f5f5',
                              '&:hover': { bgcolor: '#e0e0e0' }
                            }}
                          >
                            <AddIcon />
                          </IconButton>
                        </Box>
                        <Box sx={{ textAlign: 'right', mr: 2 }}>
                          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                            L{(item.precio * item.cantidad).toLocaleString('es-HN', { minimumFractionDigits: 2 })}
                          </Typography>
                        </Box>
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => this.eliminarDelCarrito(item.id)}
                            sx={{
                              color: '#d32f2f',
                              '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.1)' }
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                      {index < this.state.cartItems.length - 1 && <Divider />}
                    </React.Fragment>
                  );
                })}
              </List>

              {/* Total y botón de pago */}
              <Divider sx={{ my: 2 }} />
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                bgcolor: '#f8f9fa',
                p: 2,
                borderRadius: 1
              }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  Total: L{parseFloat(this.calcularTotal()).toLocaleString('es-HN', { minimumFractionDigits: 2 })}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{
                    bgcolor: '#E06C14',// fondo del boton de proceder a pagar
                    px: 3,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    '&:hover': { bgcolor: '#28a428' } // cambio de fondo del boton de proceder a pagar
                  }}
                  onClick={() => {
                    alert('¡Gracias por tu compra!');
                    this.setState({ cartItems: [], totalItems: 0, cartModalOpen: false });
                  }}
                >
                  Proceder al Pago
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    );
  }

  render() {
    console.log('Renderizando Tienda - Vista actual:', this.state.currentView);

    // Renderizar componente según la vista actual
    switch (this.state.currentView) {
      case 'login':
        return (
          <Login
            onLoginSuccess={this.handleLoginSuccess}
            onBackToTienda={this.handleBackToTienda}
          />
        );

      case 'registro':
        return (
          <Registro
            onRegistroSuccess={this.handleRegistroSuccess}
            onBackToTienda={this.handleBackToTienda}
          />
        );

      default:
        return (
          <>
            {/* Contenido principal de la tienda */}
            <Box
              sx={{
                minHeight: '100vh',
                width: '100%',
                background: '#f5f5f5',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Espaciado superior para separar de la navbar principal */}
              <Box sx={{ height: '20px' }} />

              {/* Navbar sin icono de usuario ni logo */}
              {this.renderSecondaryNavbar()}

              {/* Contenido de la tienda */}
              <Box
                sx={{
                  flex: 1,
                  backgroundColor: '#ffffff',//fondo de toda la pagina
                  overflow: 'hidden'
                }}
              >
                {this.renderTiendaContent()}
              </Box>
            </Box>

            {/* Modal para el carrito de compras */}
            {this.renderCarritoModal()}
          </>
        );
    }
  }
}

export default Tienda;