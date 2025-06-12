import React from 'react';
import {
  Box,
  Container,

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

} from '@mui/material';
import {
  Search as SearchIcon,
  ShoppingCart as ShoppingCartIcon,
  Close as CloseIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  AccountCircle as AccountCircleIcon, // Usado en la barra superior, no en productos
  
} from '@mui/icons-material';

// --- Importa imágenes  ---

import camisaLocalImg from '/Images/camisa_local.jpg';
import camisaVisita from '/Images/camisa_visita.jpg';
import camisaAngelito from '/Images/camiseta_ange.jpg';


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
      nombre: "Camisa Local",
      descripcion: "Camisa oficial de local, diseño exclusivo para esta temporada.",
      precio: 299.99,
      imagen: camisaLocalImg 
    },
    {
      id: 2,
      nombre: "Camiseta Visita",
      descripcion: "Camiseta de visitante con colores vibrantes y tejido transpirable.",
      precio: 199.99,
      imagen: camisaVisita
    },
    {
      id: 3,
      nombre: "Camiseta Conmemorativa Fundación Angelitos",
      descripcion: "Edición especial para apoyar a la Fundación Angelitos, con diseño único.",
      precio: 899.50,
      imagen: camisaAngelito
    },
    {
      id: 4,
      nombre: "Banderas",
      descripcion: "Banderas de alta calidad, ideales para eventos y soporte a tu equipo.",
      precio: 345.75,
      imagen: camisaLocalImg
    },
    {
      id: 5,
      nombre: "Banderines",
      descripcion: "Pequeños banderines decorativos, perfectos para coleccionar o regalar.",
      precio: 125.00,
      imagen:camisaLocalImg
    },
    {
      id: 6,
      nombre: "Gorra",
      descripcion: "Gorra de diseño clásico, cómoda y con protección solar.",
      precio: 450.00,
      imagen: camisaLocalImg
    },
    {
      id: 7,
      nombre: "Gorras 2",
      descripcion: "Nueva colección de gorras con bordados premium y ajuste perfecto.",
      precio: 3200.00,
      imagen: camisaLocalImg
    },
    {
      id: 8,
      nombre: "Gorras 3",
      descripcion: "Gorras de edición limitada con materiales reciclados y un estilo moderno.",
      precio: 280.50,
      imagen: camisaLocalImg
    },
    {
      id: 9,
      nombre: "Gorras 4",
      descripcion: "Diseño urbano para las gorras 4, con visera plana y logotipos discretos.",
      precio: 1150.00,
      imagen: camisaLocalImg
    },
    {
      id: 10,
      nombre: "Gorras 5",
      descripcion: "Gorras 5: Máximo confort y estilo deportivo, ideales para el día a día.",
      precio: 195.00,
      imagen: camisaLocalImg
    },
    {
      id: 11,
      nombre: "Gorras 6",
      descripcion: "La gorra 6 combina funcionalidad y moda, perfecta para cualquier ocasión.",
      precio: 2800.00,
      imagen: camisaLocalImg
    },
    {
      id: 12,
      nombre: "Uniforme de Piloto Premium",
      descripcion: "Uniforme completo de 4 piezas con galones dorados y insignias bordadas.",
      precio: 650.00,
      imagen: camisaLocalImg
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
        // Si es un producto nuevo, agregarlo (aseguramos que la 'imagen' esté presente)
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

  // Renderizar la Navbar
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
                    border: '2px solid #e9ecef',
                    overflow: 'hidden' // Asegura que la imagen no se desborde
                  }}
                >
                  {/* MODIFICACIÓN CLAVE AQUÍ: Usamos <img> en lugar de un componente */}
                  <img
                    src={producto.imagen} // La propiedad 'imagen' del producto
                    alt={producto.nombre} // Texto alternativo para accesibilidad
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain' // Para que la imagen se ajuste sin distorsionarse
                    }}
                  />
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
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh'
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
                flexGrow: 1,
                overflowY: 'auto',
                scrollbarWidth: 'none',
                '&::-webkit-scrollbar': {
                  display: 'none'
                },
                '-ms-overflow-style': 'none'
              }}>
                {this.state.cartItems.map((item, index) => {
                  return (
                    <React.Fragment key={item.id}>
                      <ListItem sx={{ py: 2 }}>
                        <ListItemAvatar>
                          {/* MODIFICACIÓN CLAVE AQUÍ: Avatar con la imagen del producto */}
                          <Avatar
                            src={item.imagen} // La propiedad 'imagen' del item del carrito
                            alt={item.nombre}
                            sx={{ width: 50, height: 50, borderRadius: 1 }} // Puedes ajustar el borderRadius si quieres que sean cuadrados
                          />
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