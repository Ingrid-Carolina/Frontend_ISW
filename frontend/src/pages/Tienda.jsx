import React from 'react';
import axios from 'axios';
import {
  Box,
  Container,
  Drawer,
  AppBar,
  MenuItem,
  Toolbar,
  TextField,
  IconButton,
  Button,
  Badge,
  Typography,
  Paper,
  List,
  ListItem,
  Avatar,
  Divider,

} from '@mui/material';
import {
  Search as SearchIcon,
  ShoppingCart as ShoppingCartIcon,
  Close as CloseIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  //AccountCircle as AccountCircleIcon, // Usado en la barra superior, no en productos
  
} from '@mui/icons-material';

// --- Importa imágenes  ---

import camisaLocal from '/Images/camisa_local.jpg';
import camisaVisita from '/Images/camisa_visita.jpg';
import camisaAngelito from '/Images/camiseta_ange.jpg';
import camisetaLocal from '/Images/Camiseta_Local.jpg';
import camisetaVisita from '/Images/Camiseta_visita.jpg';

// Importar las clases Login y Registro
import Login from './Login';
import Registro from './Registro';

class Tienda extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedSizes: {}, // Nuevo estado para tallas seleccionadas
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
      nombre: "Camisa de Botones Local Blanca",
      descripcion: "Camisa oficial de local, diseño exclusivo para esta temporada.",
      precio: 500.00,
      imagen: camisaLocal
    }, 
    {
      id: 2,
      nombre: "Camiseta Local Blanca",
      descripcion: "Uniforme completo de 4 piezas con galones dorados y insignias bordadas.",
      precio: 350.00,
      imagen: camisetaLocal
    },
     {
      id: 3,
      nombre: "Camisa de Botones Visita Moteada",
      descripcion: "Uniforme completo de 4 piezas con galones dorados y insignias bordadas.",
      precio: 500.00,
      imagen: camisaVisita
    },
    {
      id: 4,
      nombre: "Camiseta Visita Moteada",
      descripcion: "Camiseta de visitante con colores vibrantes y tejido transpirable.",
      precio: 350.00,
      imagen: camisetaVisita
    },
    {
      id: 5,
      nombre: "Camiseta Conmemorativa Fundación Angelitos",
      descripcion: "Edición especial para apoyar a la Fundación Angelitos, con diseño único.",
      precio: 350.50,
      imagen: camisaAngelito
    },
    {
      id: 6,
      nombre: "Banderas",
      descripcion: "Banderas de alta calidad, ideales para eventos y soporte a tu equipo.",
      precio: 345.75,
      imagen: camisaLocal
    },
    {
      id: 7,
      nombre: "Banderines",
      descripcion: "Pequeños banderines decorativos, perfectos para coleccionar o regalar.",
      precio: 125.00,
      imagen:camisaLocal
    },
    {
      id: 8,
      nombre: "Gorra",
      descripcion: "Gorra de diseño clásico, cómoda y con protección solar.",
      precio: 450.00,
      imagen: camisaLocal
    },
    {
      id: 9,
      nombre: "Gorras 2",
      descripcion: "Nueva colección de gorras con bordados premium y ajuste perfecto.",
      precio: 3200.00,
      imagen: camisaLocal
    },
    {
      id: 10,
      nombre: "Gorras 3",
      descripcion: "Gorras de edición limitada con materiales reciclados y un estilo moderno.",
      precio: 280.50,
      imagen: camisaLocal
    },
    {
      id: 11,
      nombre: "Gorras 4",
      descripcion: "Diseño urbano para las gorras 4, con visera plana y logotipos discretos.",
      precio: 1150.00,
      imagen: camisaLocal
    },
    {
      id: 12,
      nombre: "Gorras 5",
      descripcion: "Gorras 5: Máximo confort y estilo deportivo, ideales para el día a día.",
      precio: 195.00,
      imagen: camisaLocal
    },
    {
      id: 13,
      nombre: "Gorras 6",
      descripcion: "La gorra 6 combina funcionalidad y moda, perfecta para cualquier ocasión.",
      precio: 2800.00,
      imagen: camisaLocal
    },
    {
      id: 14,
      nombre: "CamisadeNiño",
      descripcion: "La gorra 6 combina funcionalidad y moda, perfecta para cualquier ocasión.",
      precio: 2800.00,
      imagen: camisaLocal
    },
   
  ];

   

  // Manejar búsqueda
  handleSearchChange = (event) => {
   const query = event.target.value;
  this.setState({ searchQuery: query });
  
  // Debug: mostrar cuántos productos se encontraron
  if (query.trim()) {
    setTimeout(() => {
      const filtered = this.getFilteredProducts();
      console.log(`Búsqueda "${query}" encontró ${filtered.length} productos`);
    }, 100);
  }
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

cambiarTallaEnCarrito = (itemId, tallaActual, nuevaTalla) => {
  if (!nuevaTalla || tallaActual === nuevaTalla) return;

  this.setState(prevState => {
    const newCartItems = prevState.cartItems.map(item => {
      // Encontrar el item específico por ID y talla actual
      if (item.id === itemId && item.talla === tallaActual) {
        // Buscar el producto original para obtener el precio base
        const productoOriginal = prevState.productos ? 
          prevState.productos.find(p => p.id === itemId) : 
          { precio: item.precioOriginal || item.precio, precioNino: item.precioNino };

        if (productoOriginal) {
          // Calcular el nuevo precio según la nueva talla
          const nuevoPrecio = this.getPrecioByTalla(productoOriginal, nuevaTalla);
          
          console.log(`Cambiando talla de ${tallaActual} a ${nuevaTalla}. Precio: ${item.precio} -> ${nuevoPrecio}`);
          
          return {
            ...item,
            talla: nuevaTalla,
            precio: nuevoPrecio
          };
        }
      }
      return item;
    });

    return {
      cartItems: newCartItems
    };
  });
}


// Función para obtener el precio según la talla
getPrecioByTalla = (producto, talla) => {
  const tallasNino = ['6', '8', '10', '12'];
  
  if (tallasNino.includes(talla)) {
    // Si el producto tiene un precio específico para niños, úsalo, sino usa un precio por defecto
    return producto.precioNino || (producto.precio - 50); // 20% descuento como ejemplo
  }
  
  return producto.precio; // Precio normal para tallas S, M, L, XL
};

 productoRequiereTalla = (producto) => {
    const nombre = producto.nombre.toLowerCase();
    return nombre.includes("camisa") || 
           nombre.includes("camiseta") 
  };

  // Agregar item al carrito
 addToCart = (producto) => {
  const tallaSeleccionada = this.state.selectedSizes?.[producto.id] || null;
  
  // Verificar si el producto requiere talla y si está seleccionada
  const requiereTalla = this.productoRequiereTalla(producto);
  if (requiereTalla && !tallaSeleccionada) {
    alert("Por favor selecciona una talla antes de agregar al carrito.");
  
    return;
  }
  //

  this.setState(prevState => {
    // Buscar si el producto ya existe en el carrito (considerando la talla)
    const existingItem = prevState.cartItems.find(item => 
      item.id === producto.id && 
      (requiereTalla ? item.talla === tallaSeleccionada : true)
    );

    let newCartItems;
    
    if (existingItem) {
      // Si el producto ya existe, incrementar cantidad
      newCartItems = prevState.cartItems.map(item =>
        item.id === producto.id && 
        (requiereTalla ? item.talla === tallaSeleccionada : true)
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      );
    } else {
      const precioFinal = requiereTalla ? 
        this.getPrecioByTalla(producto, tallaSeleccionada) : 
        producto.precio;
      // Si es un producto nuevo, agregarlo al carrito
      const nuevoItem = { 
        ...producto, 
        precio: precioFinal,
        precioOriginal: producto.precio, // ⭐ Guardar precio original
        precioNino: producto.precioNino, // ⭐ Guardar precio de niño si existe
        cantidad: 1,
        ...(requiereTalla && { talla: tallaSeleccionada })
      };
      newCartItems = [...prevState.cartItems, nuevoItem];
    }

    // Calcular total de items
    const totalItems = newCartItems.reduce((total, item) => total + item.cantidad, 0);

    return {
      cartItems: newCartItems,
      totalItems: totalItems
    };
  });
}

// VERSIÓN ALTERNATIVA de cambiarTallaEnCarrito si usas precioOriginal:
cambiarTallaEnCarritoAlternativa = (itemId, tallaActual, nuevaTalla) => {
  if (!nuevaTalla || tallaActual === nuevaTalla) return;

  this.setState(prevState => {
    const newCartItems = prevState.cartItems.map(item => {
      if (item.id === itemId && item.talla === tallaActual) {
        // Usar la información guardada en el item
        const productoBase = {
          precio: item.precioOriginal || item.precio,
          precioNino: item.precioNino
        };
        
        const nuevoPrecio = this.getPrecioByTalla(productoBase, nuevaTalla);
        
        return {
          ...item,
          talla: nuevaTalla,
          precio: nuevoPrecio
        };
      }
      return item;
    });

    return {
      cartItems: newCartItems
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

  actualizarPreciosCarrito = () => {
  this.setState(prevState => {
    const newCartItems = prevState.cartItems.map(item => {
      // Si el producto requiere talla, recalcular precio
      const requiereTalla = this.productoRequiereTalla(item);
      
      if (requiereTalla && item.talla) {
        const productoBase = {
          precio: item.precioOriginal || item.precio,
          precioNino: item.precioNino
        };
        
        const nuevoPrecio = this.getPrecioByTalla(productoBase, item.talla);
        
        return {
          ...item,
          precio: nuevoPrecio
        };
      }
      
      return item;
    });

    return {
      cartItems: newCartItems
    };
  });
}

  // Calcular total del carrito
  calcularTotal = () => {
  return this.state.cartItems.reduce((total, item) => {
    return total + (item.precio * item.cantidad);
  }, 0).toFixed(2);
}

calcularTotalConActualizacion = () => {
  // Primero actualizar precios si es necesario
  this.actualizarPreciosCarrito();
  
  // Luego calcular con un pequeño delay para asegurar que el state se actualice
  setTimeout(() => {
    const total = this.calcularTotal();
    console.log('Total calculado:', total);
    return total;
  }, 0);
}

// Versión síncrona que calcula directamente sin depender del state
calcularTotalSincrono = (cartItems = null) => {
  const items = cartItems || this.state.cartItems;
  
  return items.reduce((total, item) => {
    // Recalcular precio en tiempo real si es necesario
    let precioFinal = item.precio;
    
    // Si el producto requiere talla, verificar que el precio sea correcto
    const requiereTalla = this.productoRequiereTalla(item);
    if (requiereTalla && item.talla) {
      const productoBase = {
        precio: item.precioOriginal || item.precio,
        precioNino: item.precioNino
      };
      precioFinal = this.getPrecioByTalla(productoBase, item.talla);
    }
    
    const precio = parseFloat(precioFinal) || 0;
    const cantidad = parseInt(item.cantidad) || 0;
    
    return total + (precio * cantidad);
  }, 0).toFixed(2);
}

  // Filtrar productos basado en la búsqueda
  //2. FUNCIÓN DE FILTRADO MEJORADA:
getFilteredProducts = () => {
  if (!this.state.searchQuery || this.state.searchQuery.trim() === '') {
    return this.productos;
  }

  const searchTerm = this.state.searchQuery.toLowerCase().trim();
  console.log('Buscando:', searchTerm); // Para debug

  return this.productos.filter(producto => {
    // Búsqueda en nombre
    const nombreMatch = producto.nombre.toLowerCase().includes(searchTerm);
    
    // Búsqueda en descripción
    const descripcionMatch = producto.descripcion.toLowerCase().includes(searchTerm);
    
    // Búsqueda por palabras individuales (más flexible)
    const palabrasBusqueda = searchTerm.split(' ').filter(palabra => palabra.length > 0);
    const palabrasMatch = palabrasBusqueda.some(palabra => 
      producto.nombre.toLowerCase().includes(palabra) || 
      producto.descripcion.toLowerCase().includes(palabra)
    );
    
    // Búsqueda por categorías comunes
    const categoriaMatch = this.buscarPorCategoria(producto, searchTerm);
    
    const match = nombreMatch || descripcionMatch || palabrasMatch || categoriaMatch;
    
    if (match) {
      console.log('Producto encontrado:', producto.nombre); // Para debug
    }
    
    return match;
  });
}

// 3. FUNCIÓN AUXILIAR PARA BÚSQUEDA POR CATEGORÍAS:
buscarPorCategoria = (producto, searchTerm) => {
  const nombre = producto.nombre.toLowerCase();
  
  // Mapeo de términos de búsqueda a categorías
  const categorias = {
    'camisa': ['camisa', 'camiseta'],
    'camiseta': ['camisa', 'camiseta'],
    'gorra': ['gorra', 'gorras'],
    'gorras': ['gorra', 'gorras'],
    'bandera': ['bandera', 'banderas', 'banderin', 'banderines'],
    'niño': ['niño', 'niña', 'infantil', 'kid'],
    'local': ['local', 'casa', 'home'],
    'visita': ['visita', 'visitante', 'away'],
    'angelito': ['angelito', 'angelitos', 'fundacion'],
    'conmemorativa': ['conmemorativa', 'especial', 'edicion']
  };
  
  // Verificar si el término de búsqueda coincide con alguna categoría
  for (const [termino, sinonimos] of Object.entries(categorias)) {
    if (searchTerm.includes(termino)) {
      return sinonimos.some(sinonimo => nombre.includes(sinonimo));
    }
  }
  
  return false;
}


 realizarPeticion = async () => {
    const url = "http://localhost:3000/auth/comprar"; 

    const body = {
    nombreproducto: this.state.cartItems.map(item => item.nombre),
    cantidad: this.state.cartItems.map(item => item.cantidad)
};

    try {
        const res = await axios.post(url, body, {
            headers: { "Content-Type": "application/json" }
        });

        console.log("response data: ", res.data.mensaje);
        return res.data;
    } catch (error) {
        console.log("Error:", error);

        if (error.response) {
            console.log("Error data:", error.response.data.mensaje);
            console.log("Error status:", error.response.status);

            window.alert((error.response.data.mensaje));
        } else if (error.request) {
            window.alert("Ninguna respuesta del servidor.Por favor verifique su red.");
        } else {
            window.alert("Error en la red.");
        }
    }
};


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
  const hasSearchQuery = this.state.searchQuery && this.state.searchQuery.trim() !== '';
  return (
    <Container
      maxWidth="lg"
      sx={{
        py: 4,
        maxHeight: 'calc(100vh + 290px)',
        overflow: 'auto',
        /*scrollbarWidth: 'none',
        '&::-webkit-scrollbar': {
         display: 'none'
      },
        '-ms-overflow-style': 'none',*/
        // SCROLL PERSONALIZADO TEMA PILOTOS
         '&::-webkit-scrollbar': {
    width: '12px',
  },
  '&::-webkit-scrollbar-track': {
    background: '#f8f9fa',
    borderRadius: '20px',
    boxShadow: 'inset 0 0 5px rgba(0,0,0,0.1)',
  },
  '&::-webkit-scrollbar-thumb': {
    background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '20px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
    border: '2px solid #f8f9fa',
    '&:hover': {
      background: 'linear-gradient(45deg, #764ba2 0%, #667eea 100%)',
      boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
    },
  },
  scrollbarWidth: 'auto',
  scrollbarColor: '#667eea #f8f9fa',
        paddingBottom: '80px'
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ color: '#2c1a99', fontWeight: 'bold' }}>
        {this.state.isLoggedIn
          ? `Bienvenido ${this.state.userData?.nombre || 'Usuario'} a la Tienda de Pilotos`
          : 'Bienvenido a la Tienda de Pilotos'
        }
      </Typography>

      
         {/* Mostrar información de búsqueda mejorada */}
      {hasSearchQuery && (
        <Box sx={{ mb: 3, p: 2, bgcolor: '#f8f9fa', borderRadius: 1 }}>
          <Typography variant="h6" sx={{ color: '#2c1a99', fontWeight: 'bold' }}>
            Resultados para: "{this.state.searchQuery}"
          </Typography>
          <Typography variant="body1" sx={{ color: '#666' }}>
            {filteredProducts.length > 0 
              ? `Se encontraron ${filteredProducts.length} producto${filteredProducts.length !== 1 ? 's' : ''}`
              : 'No se encontraron productos'
            }
          </Typography>
          {filteredProducts.length === 0 && (
            <Typography variant="body2" sx={{ color: '#999', mt: 1 }}>
              Sugerencias: Intenta con "camisa", "gorra", "bandera", "niño", etc.
            </Typography>
          )}
        </Box>
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
              {/* Imagen del producto */}
              <Box
                sx={{
                  height: 150,
                  backgroundColor: '#f8f9fa', // fondo de los iconos de cada producto
                  borderRadius: 1,
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #e9ecef',
                  overflow: 'hidden' // Asegura que la imagen no se desborde
                }}
              >
                <img
                  src={producto.imagen}
                  alt={producto.nombre}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain' // Para que la imagen se ajuste sin distorsionarse
                  }}
                />
              </Box>


              {/* Título del producto */}
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  lineHeight: 1.3,
                  minHeight: '2.6rem',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}
              >
                {producto.nombre}
              </Typography>

              {/* Descripción del producto */}
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

              {/* Selector de tallas (solo para camisas/camisetas) */}
              {(producto.nombre.toLowerCase().includes("camisa") || 
                producto.nombre.toLowerCase().includes("camiseta")) && (
                <TextField
                  select
                  fullWidth
                  label="Talla"
                  value={this.state.selectedSizes?.[producto.id] || ''}
                  onChange={(e) => this.setState(prev => ({
                    selectedSizes: { ...prev.selectedSizes, [producto.id]: e.target.value }
                  }))}
                  sx={{ mb: 2 }}
                >
                  {['6','8','10','12','14','15','16','S', 'M', 'L', 'XL'].map((size) => (
                    <MenuItem key={size} value={size}>
                      {size}
                        



                    </MenuItem>
                  ))}
                </TextField>
              )}

              {/* Precio del producto */}
              <Typography
                variant="h5"
                sx={{
                  color: '#2c1a99',
                  fontWeight: 'bold',
                  mb: 2,
                  fontSize: '1.3rem'
                }}
              >
                
                 L.{this.getPrecioByTalla(producto, this.state.selectedSizes[producto.id]).toFixed(2)}
              </Typography>

              {/* Botón agregar al carrito */}
              <Button
                fullWidth
                variant="contained"
                onClick={() => this.addToCart(producto)}
                sx={{
                  backgroundColor: '#E06C14', // color del botón agregar producto
                  color: 'white',
                  fontWeight: 'bold',
                  py: 1.2,
                  fontSize: '1rem',
                  '&:hover': {
                    backgroundColor: '#28a428', // cuando estoy encima del botón agregar producto
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

      {/* Mensaje cuando no hay resultados */}
      {filteredProducts.length === 0 && this.state.searchQuery && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <SearchIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No se encontraron productos  No hay productos que coincidan con "{this.state.searchQuery}"
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Intenta buscar por: camisa, camiseta, gorra, bandera, niño, local, visita
          </Typography>
          <Button 
          variant = "outlined"
          onClick={()=> this.setState.apply({searchQuery: ''})}
          sx={{mt:2}}
          >Limpiar Busqueda
            
          </Button>
        </Box>
      )}
    </Container>
  );
}

  // Renderizar modal del carrito
  renderCarritoModal = () => {
  const totalActualizado = this.calcularTotalSincrono();
  
  return (
    <Drawer
      anchor="right"
      open={this.state.cartModalOpen}
      onClose={this.cerrarCarritoModal}
      PaperProps={{
        sx: { width: { xs: '100%', sm: 400, md: 550 },
          overflowX: 'hidden',
        overflowY: 'hidden'  }
      }}
    >
      <Box sx={{ p: 3, pt: { xs: '130px', sm: '130px' }, display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" sx={{ color: '#2c1a99', fontWeight: 'bold' }}>Carrito de Compras</Typography>
          <IconButton onClick={this.cerrarCarritoModal}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Contenido del carrito */}
        {this.state.cartItems.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
 <ShoppingCartIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />           
             <Typography variant="h6" color="text.secondary">Tu carrito está vacío</Typography>
          </Box>
        ) : (
          
          <>
            {/* Lista de productos con scroll propio */}
            <List sx={{ flexGrow: 1, overflowY: 'auto' }}>
              {this.state.cartItems.map((item, index) => {
                 const itemKey = item.talla ? `${item.id}-${item.talla}` : item.id;
                  return(
                <React.Fragment key={itemKey}>
                  <ListItem key={item.id} disableGutters sx={{ px: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <Avatar
                      src={item.imagen}
                      alt={item.nombre}
                      variant="square"
                      sx={{ width: 70, height: 70, borderRadius: 1, mr: 2 }}
                    />
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '1.05rem' }}>
                            {item.nombre}
                          </Typography>
                          <Typography variant="body1" sx={{ fontSize: '0.95rem', color: 'text.secondary' }}>
                            L{(totalActualizado).toLocaleString('es-HN', { minimumFractionDigits: 2 })} c/u
                          </Typography>
                          {/* Mostrar talla si existe */}
                            {item.talla && (
                              <Typography variant="body2" color="text.secondary">
                                Talla: {item.talla}
                              </Typography>
                            )}

                        </Box>
                        {/* Cantidad: más alejado del texto, más cerca del precio */}
                      <Box sx={{ display: 'flex', alignItems: 'center', ml: 3, mr: 1 }}>
                        <IconButton size="small" onClick={() => this.disminuirCantidad(item.id)} disabled={item.cantidad <= 1}>
                          <RemoveIcon />
                        </IconButton>
                        <Typography sx={{ mx: 1, minWidth: 30, textAlign: 'center', fontWeight: 'bold' }}>
                          {item.cantidad}
                        </Typography>
                        <IconButton size="small" onClick={() => this.aumentarCantidad(item.id, item.talla)}>
                          {item.cantidad <= 1}
                          <AddIcon />
                        </IconButton>
                      </Box>
                      {/* Total */}
                      <Box sx={{ minWidth: 90, textAlign: 'right', mr: 1 }}>
                        <Typography fontWeight="bold" noWrap>
                          L{(item.precio * item.cantidad).toLocaleString('es-HN', { minimumFractionDigits: 2 })}
                        </Typography>
                        {/*boton de Eliminar*/}
                      </Box>
                          <IconButton onClick={() => this.eliminarDelCarrito(item.id, item.talla)} 
                          sx={{
                            color: '#d32f2f',
                            '&:hover': { 
                              bgcolor: 'rgba(211, 47, 47, 0.1)',
                              transform: 'scale(1.1)'
                            },
                            transition: 'all 0.2s ease'
                          }}>
                            <DeleteIcon />
                        </IconButton>
                    </Box>
                  </ListItem>
                      {index < this.state.cartItems.length - 1 && <Divider />}
                </React.Fragment>
                
                // Crear una key única que incluya la talla si existe
                
                );
              })}
            </List>


            {/* Total y botón de pago */}
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  Total: L{parseFloat(this.calcularTotal()).toLocaleString('es-HN', { minimumFractionDigits: 2 })}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {this.state.totalItems} {this.state.totalItems === 1 ? 'artículo' : 'artículos'}
                </Typography>
              </Box>
              
              <Button
                variant="contained"
                sx={{
                  bgcolor: '#E06C14',
                  fontWeight: 'bold',
                  '&:hover': { bgcolor: '#28a428' }
                }}
                onClick={() => {
                  this.realizarPeticion();
                  alert('¡Gracias por tu compra!');
                  this.setState({ 
                    cartItems: [], 
                    totalItems: 0, 
                    cartModalOpen: false,
                    selectedSizes: {} // Limpiar tallas seleccionadas
                  });
                }}
              >
                Proceder al Pago
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Drawer>
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

    case 'tienda':
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

            {/* Navbar secundaria de la tienda */}
            {this.renderSecondaryNavbar()}

            {/* Contenido principal de la tienda */}
            <Box
              sx={{
                flex: 1,
                backgroundColor: '#ffffff', // fondo de toda la página
                overflow: 'hidden'
              }}
            >
              {this.renderTiendaContent()}
            </Box>
          </Box>

          {/* Modal del carrito de compras */}
          {this.renderCarritoModal()}
        </>
      );
  }
}
}

export default Tienda;