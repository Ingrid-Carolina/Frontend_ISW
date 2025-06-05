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
  ListItemSecondaryAction
} from '@mui/material';
import {
  Search as SearchIcon,
  ShoppingCart as ShoppingCartIcon,
  Close as CloseIcon,
  FlightTakeoff as FlightIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

import Login from './Login.jsx';
import Registro from './Registro.jsx';
import logo from '/Images/Logo-pilotos.png';

class Tienda extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      vistaActual: 'tienda', // 'login', 'registro', 'tienda'
      isAnimating: false,
      searchQuery: '',
      cartItems: [], // CAMBIO CLAVE: Inicializado como un array vacío
      totalItems: 0, // Nuevo estado para el conteo total de items en el badge
      modalOpen: false, // Nuevo estado para controlar el modal
      cartModalOpen: false // Nuevo modal para el carrito
    };
    console.log('Tienda inicializada con vista:', this.state.vistaActual);
  }

  // Método para cambiar a la vista de registro con animación
  mostrarRegistro = () => {
    console.log('Cambiando a registro...');
    this.setState({ isAnimating: true }, () => {
      setTimeout(() => {
        this.setState({ 
          vistaActual: 'registro',
          isAnimating: false
        }, () => {
          console.log('Estado actualizado:', this.state.vistaActual);
        });
      }, 150);
    });
  }

  // Método para volver al login con animación
  mostrarLogin = () => {
    console.log('Cambiando a login...');
    this.setState({ 
      isAnimating: true,
      modalOpen: true // Abrir modal
    }, () => {
      setTimeout(() => {
        this.setState({ 
          vistaActual: 'login',
          isAnimating: false
        }, () => {
          console.log('Estado actualizado:', this.state.vistaActual);
        });
      }, 150);
    });
  }

  // Método para mostrar la tienda principal
  mostrarTienda = () => {
    console.log('Cambiando a tienda...');
    this.setState({ 
      isAnimating: true,
      modalOpen: false // Cerrar modal
    }, () => {
      setTimeout(() => {
        this.setState({ 
          vistaActual: 'tienda',
          isAnimating: false
        }, () => {
          console.log('Estado actualizado:', this.state.vistaActual);
        });
      }, 150);
    });
  }

  // Cerrar modal
  cerrarModal = () => {
    this.setState({ modalOpen: false, vistaActual: 'tienda' });
  }

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
  
  // Agregar item al carrito
  addToCart = (producto) => { // 'producto' ahora se recibe correctamente
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
        totalItems: totalItems // Actualizar totalItems
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

  // Renderizar la Navbar Secundaria (Verde) - Específica de la tienda
  renderSecondaryNavbar = () => {
    return (
      <AppBar 
        position="static" 
        elevation={2}
        sx={{
          backgroundColor: '#32cd32', // Verde similar a la imagen
          minHeight: '70px',
          marginTop: '60px' // Baja la navbar 40px desde arriba
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', py: 1, minHeight: '70px !important' }}>
          {/* Logo del avión a la izquierda */}
          <Box sx={{ display: 'flex', alignItems: 'center', minWidth: { xs: 100, sm: 150 } }}>
            
             <Box
											component='img'
											src={logo}
											alt='Logo Pilotos'
											sx={{ height: 50, cursor: 'pointer' }}
										/>
            
          </Box>

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
                  borderRadius: 1,
                  height: '45px',
                  '& fieldset': {
                    borderColor: 'transparent',
                  },
                  '&:hover fieldset': {
                    borderColor: '#2c1a99',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#2c1a99',
                  }
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
              <Badge badgeContent={this.state.totalItems} color="error"> {/* Usa totalItems aquí */}
                <ShoppingCartIcon sx={{ fontSize: 30 }} />
              </Badge>
            </IconButton>
          </Box>

          {/* Botón Iniciar Sesión a la derecha */}
          <Button
            variant="contained"
            onClick={this.mostrarLogin}
            sx={{
              backgroundColor: '#ffa500', // Amarillo/naranja
              color: 'black',
              textTransform: 'none',
              fontWeight: 'bold',
              fontSize: { xs: '0.9rem', md: '1rem' },
              minWidth: { xs: 100, sm: 140 },
              height: '45px',
              borderRadius: 1,
              '&:hover': {
                backgroundColor: '#ff8c00',
              }
            }}
          >
            Iniciar Sesión
          </Button>
        </Toolbar>
      </AppBar>
    );
  }

  // Renderizar contenido de la tienda - CON SCROLL OCULTO
  renderTiendaContent = () => {
    return (
      <Container 
        maxWidth="lg" 
        sx={{ 
          py: 4,
          // AQUÍ SE OCULTA EL SCROLL PERO SE MANTIENE LA FUNCIONALIDAD
          maxHeight: 'calc(100vh - 150px)', // Altura máxima considerando navbar
          overflow: 'auto', // Permite scroll
          // Estilos para ocultar scrollbar
          scrollbarWidth: 'none', // Firefox
          '&::-webkit-scrollbar': {
            display: 'none' // Safari y Chrome
          },
          '-ms-overflow-style': 'none' // IE y Edge
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ color: '#2c1a99', fontWeight: 'bold' }}>
          Bienvenido a la Tienda de Pilotos
        </Typography>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 3, mt: 3 }}>
          {/* Productos de ejemplo */}
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item) => (
            <Paper
              key={item}
              elevation={2}
              sx={{
                p: 2,
                borderRadius: 2,
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-2px)' }
              }}
            >
              <Box
                sx={{
                  height: 150,
                  backgroundColor: '#f5f5f5',
                  borderRadius: 1,
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <FlightIcon sx={{ fontSize: 40, color: '#2c1a99' }} />
              </Box>
              <Typography variant="h6" gutterBottom>
                Equipo de Piloto {item}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Equipo profesional para pilotos
              </Typography>
              <Typography variant="h6" color="primary" gutterBottom>
                $199.99
              </Typography>
              <Button
                fullWidth
                variant="contained"
                // CAMBIO CLAVE: Pasar el objeto de producto completo
                onClick={() => this.addToCart({ 
                  id: item, 
                  nombre: `Equipo de Piloto ${item}`, 
                  precio: 199.99 
                })}
                sx={{
                  backgroundColor: '#32cd32',
                  color: 'white',
                  '&:hover': { backgroundColor: '#28a428' }
                }}
              >
                Agregar al Carrito
              </Button>
            </Paper>
          ))}
        </Box>
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
		  width: { xs: '90%', sm: 600 },
		  maxHeight: '80vh',
		  bgcolor: 'background.paper',
		  border: '2px solid #000',
		  boxShadow: 24,
		  p: 4,
		  borderRadius: 2,
		  overflow: 'auto'
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
			<Box sx={{ textAlign: 'center', py: 4 }}>
			  <ShoppingCartIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
			  <Typography variant="h6" color="text.secondary">
				Tu carrito está vacío
			  </Typography>
			</Box>
		  ) : (
			<>
			  {/* Lista de productos */}
			  <List>
				{this.state.cartItems.map((item, index) => (
				  <React.Fragment key={item.id}>
					<ListItem>
					  <ListItemAvatar>
						<Avatar sx={{ bgcolor: '#4CAF50' }}>
						  <FlightIcon />
						</Avatar>
					  </ListItemAvatar>
					  <ListItemText
						primary={item.nombre}
						secondary={`$${item.precio} c/u`}
					  />
					  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 2 }}>
						<IconButton 
						  size="small" 
						  onClick={() => this.disminuirCantidad(item.id)}
						  disabled={item.cantidad <= 1}
						>
						  <RemoveIcon />
						</IconButton>
						<Typography variant="body1" sx={{ minWidth: 30, textAlign: 'center' }}>
						  {item.cantidad}
						</Typography>
						<IconButton 
						  size="small" 
						  onClick={() => this.aumentarCantidad(item.id)}
						>
						  <AddIcon />
						</IconButton>
					  </Box>
					  <ListItemSecondaryAction>
						<IconButton 
						  edge="end" 
						  aria-label="delete"
						  onClick={() => this.eliminarDelCarrito(item.id)}
						>
						  <DeleteIcon />
						</IconButton>
					  </ListItemSecondaryAction>
					</ListItem>
					{index < this.state.cartItems.length - 1 && <Divider />}
				  </React.Fragment>
				))}
			  </List>

			  {/* Total */}
			  <Divider sx={{ my: 2 }} />
			  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
				<Typography variant="h6">
				  Total: ${this.calcularTotal()}
				</Typography>
				<Button 
				  variant="contained" 
				  color="primary" 
				  size="large"
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

  // Renderizar el modal de login/registro - CON SCROLL OCULTO
  renderModal = () => {
    return (
      <Modal
        open={this.state.modalOpen}
        onClose={this.cerrarModal}
        aria-labelledby="modal-login-registro"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
          // OCULTAR SCROLL EN EL MODAL
          overflow: 'hidden'
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: { xs: '90vw', sm: '500px', md: '600px' },
            maxHeight: '90vh',
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(10px)',
            borderRadius: { xs: 2, md: 3 },
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            // SCROLL OCULTO PERO FUNCIONAL EN EL CONTENIDO DEL MODAL
            overflow: 'auto',
            scrollbarWidth: 'none', // Firefox
            '&::-webkit-scrollbar': {
              display: 'none' // Safari y Chrome
            },
            '-ms-overflow-style': 'none', // IE y Edge
            position: 'relative',
            outline: 'none'
          }}
        >
          {/* Botón para cerrar */}
          <IconButton
            onClick={this.cerrarModal}
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              zIndex: 10,
              color: '#666',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 1)',
              }
            }}
          >
            <CloseIcon />
          </IconButton>

          {/* Indicador de vista actual */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #32cd32, #28a428)',
              borderRadius: '3px 3px 0 0',
              zIndex: 2
            }}
          />

          {/* Contenido con transición */}
          <Fade 
            in={!this.state.isAnimating && this.state.modalOpen} 
            timeout={300}
          >
            <Box
              sx={{
                p: { xs: 3, sm: 4, md: 5 },
                pt: { xs: 5, sm: 6, md: 7 }, // Espacio extra para el botón cerrar
                minHeight: { xs: 'auto', md: '500px' },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              {this.state.vistaActual === 'login' ? (
                <Login 
                  onRegistroClick={this.mostrarRegistro}
                  onLoginSuccess={this.mostrarTienda}
                />
              ) : this.state.vistaActual === 'registro' ? (
                <Registro 
                  onLoginClick={this.mostrarLogin}
                  onRegistroSuccess={this.mostrarTienda}
                />
              ) : null}
            </Box>
          </Fade>

          {/* Loader durante animación */}
          {this.state.isAnimating && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(255, 255, 255, 0.8)',
                zIndex: 3,
                borderRadius: { xs: 2, md: 3 }
              }}
            >
              <Box
                sx={{
                  width: '40px',
                  height: '40px',
                  border: '4px solid #f3f3f3',
                  borderTop: '4px solid #32cd32',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  '@keyframes spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' }
                  }
                }}
              />
            </Box>
          )}
        </Box>
      </Modal>
    );
  }

  render() {
    console.log('Renderizando Tienda con vista:', this.state.vistaActual);
    
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
            // OCULTAR SCROLL EN EL CONTENEDOR PRINCIPAL
            overflow: 'hidden' // Esto oculta completamente el scroll del contenedor principal
          }}
        >
          {/* Espaciado superior para separar de la navbar principal */}
          <Box sx={{ height: '20px' }} />
          
          {/* Navbar Secundaria (Verde) - Específica de la tienda */}
          {this.renderSecondaryNavbar()}

          {/* Contenido de la tienda */}
          <Box 
            sx={{ 
              flex: 1, 
              backgroundColor: '#ffffff',
              // AQUÍ SE CONTROLA EL SCROLL DEL CONTENIDO
              overflow: 'hidden' // Si quieres scroll completamente oculto
              // O usa esto si quieres scroll funcional pero invisible:
              // overflow: 'auto',
              // scrollbarWidth: 'none',
              // '&::-webkit-scrollbar': { display: 'none' },
              // '-ms-overflow-style': 'none'
            }}
          >
            {this.renderTiendaContent()}
          </Box>
        </Box>

        {/* Modal para login/registro */}
        {this.renderModal()}
         {/* Modal para el carrito de compras */}
         {this.renderCarritoModal()}
      </>
    );
  }
}

// Versión con hooks (alternativa moderna)
export const TiendaFunctional = () => {
  const [vistaActual, setVistaActual] = React.useState('tienda');
  const [isAnimating, setIsAnimating] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [cartItems, setCartItems] = React.useState([]); // Cambio aquí también
  const [totalItems, setTotalItems] = React.useState(0); // Nuevo estado
  const [modalOpen, setModalOpen] = React.useState(false);
  const [cartModalOpen, setCartModalOpen] = React.useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const mostrarRegistro = React.useCallback(() => {
    console.log('Cambiando a registro...');
    setIsAnimating(true);
    setTimeout(() => {
      setVistaActual('registro');
      setIsAnimating(false);
    }, 150);
  }, []);

  const mostrarLogin = React.useCallback(() => {
    console.log('Cambiando a login...');
    setIsAnimating(true);
    setModalOpen(true);
    setTimeout(() => {
      setVistaActual('login');
      setIsAnimating(false);
    }, 150);
  }, []);

  const mostrarTienda = React.useCallback(() => {
    console.log('Cambiando a tienda...');
    setIsAnimating(true);
    setModalOpen(false);
    setTimeout(() => {
      setVistaActual('tienda');
      setIsAnimating(false);
    }, 150);
  }, []);

  const cerrarModal = React.useCallback(() => {
    setModalOpen(false);
    setVistaActual('tienda');
  }, []);

  // La lógica para cartItems, totalItems, addToCart, etc.,
  // debería replicarse usando useState y useCallback para la versión funcional.
  // Por ejemplo, para addToCart:
  // const addToCart = React.useCallback((producto) => {
  //   setCartItems(prevCartItems => {
  //     const existingItem = prevCartItems.find(item => item.id === producto.id);
  //     let newCartItems;
  //     if (existingItem) {
  //       newCartItems = prevCartItems.map(item =>
  //         item.id === producto.id
  //           ? { ...item, cantidad: item.cantidad + 1 }
  //           : item
  //       );
  //     } else {
  //       newCartItems = [...prevCartItems, { ...producto, cantidad: 1 }];
  //     }
  //     setTotalItems(newCartItems.reduce((total, item) => total + item.cantidad, 0));
  //     return newCartItems;
  //   });
  // }, []);


  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: '#f5f5f5',
      // SCROLL OCULTO EN VERSION FUNCIONAL
      overflow: 'hidden',
      scrollbarWidth: 'none',
      '&::-webkit-scrollbar': { display: 'none' },
      '-ms-overflow-style': 'none'
    }}>
      {/* Implementación similar a la clase */}
    </Box>
  );
};

export default Tienda;