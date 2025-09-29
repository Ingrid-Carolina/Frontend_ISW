// Importación de librerías y componentes necesarios
import React from 'react'; // React para componentes de clase y funcionales
import { Box, Container, useTheme, useMediaQuery, Fade } from '@mui/material'; // Componentes de MUI para diseño y animaciones
import Login from './Login.jsx'; // Componente de Login
import Registro from './Registro.jsx'; // Componente de Registro

// Componente de clase principal que gestiona la vista de Login y Registro con animaciones
class MostrarLoginyRegistro extends React.Component {
  constructor(props) {
    super(props);
    // Estado inicial: muestra el login y no está animando
    this.state = {
      vistaActual: 'login', // 'login' o 'registro'
      isAnimating: false // Controla la animación de transición
    };
    // Mensaje de depuración
    console.log('MostrarLoginyRegistro  inicializada con vista:', this.state.vistaActual);
  }

  // Cambia la vista a 'registro' con animación (Fade)
  mostrarRegistro = () => {
    console.log('Cambiando a registro...');
    // Activa animación y luego cambia la vista
    this.setState({ isAnimating: true }, () => {
      setTimeout(() => {
        this.setState({ 
          vistaActual: 'registro',
          isAnimating: false
        }, () => {
          // Mensaje de depuración tras cambio de estado
          console.log('Estado actualizado:', this.state.vistaActual);
        });
      }, 150); // Duración de la animación
    });
  }

  // Cambia la vista a 'login' con animación (Fade)
  mostrarLogin = () => {
    console.log('Cambiando a login...');
    // Activa animación y luego cambia la vista
    this.setState({ isAnimating: true }, () => {
      setTimeout(() => {
        this.setState({ 
          vistaActual: 'login',
          isAnimating: false
        }, () => {
          // Mensaje de depuración tras cambio de estado
          console.log('Estado actualizado:', this.state.vistaActual);
        });
      }, 150); // Duración de la animación
    });
  }

  // Renderiza el componente principal
  render() {
    // Mensaje de depuración para saber qué vista se está mostrando
    console.log('Renderizando MostrarLoginyRegistro con vista:', this.state.vistaActual);
    // Estructura principal de la página
    return (
      <Box
        sx={{
          minHeight: '100vh', // Altura mínima de la pantalla
          width: '100%', // Ocupa todo el ancho
          background: '#ffffff', // Fondo blanco
          display: 'flex', // Flexbox para estructura vertical
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
          paddingTop: '80px' // Espacio superior para separar del header
        }}
      >
        

  {/* Contenedor principal del formulario login/registro */}
        <Container
          maxWidth="lg"
          sx={{
            flex: 1, // Ocupa el espacio disponible
            display: 'flex',
            alignItems: { xs: 'flex-start', md: 'center' }, // Centrado vertical en desktop
            justifyContent: 'center', // Centrado horizontal
            px: { xs: 2, sm: 3, md: 4 }, // Padding horizontal responsivo
            py: { xs: 2, sm: 4 }, // Padding vertical responsivo
            pt: { xs: '140px', sm: '120px', md: 4 }, // Padding top responsivo
            position: 'relative',
            zIndex: 1 // Sobre otros elementos
          }}
        >
          <Box
            sx={{
              width: '100%', // Ocupa todo el ancho disponible
              maxWidth: { xs: '400px', sm: '500px', md: '600px', lg: '700px' }, // Máximo ancho responsivo
              // Fondo semitransparente y difuminado para el formulario
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)', // Difumina el fondo
              borderRadius: { xs: 3, md: 4 }, // Bordes redondeados
              boxShadow: {
                xs: '0 8px 32px rgba(0, 0, 0, 0.1)',
                md: '0 20px 60px rgba(0, 0, 0, 0.15)'
              }, // Sombra para profundidad
              border: '1px solid rgba(255, 255, 255, 0.2)', // Borde sutil
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            {/* Indicador visual de la vista actual (barra superior de color) */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px', // Altura de la barra
                background: 'linear-gradient(90deg, #e06c14, #c55a11)', // Degradado naranja
                zIndex: 2
              }}
            />

            {/* Contenido principal con transición Fade (animación entre login y registro) */}
            <Fade 
              in={!this.state.isAnimating} 
              timeout={300}
              unmountOnExit
            >
              <Box
                sx={{
                  p: { xs: 3, sm: 4, md: 5 }, // Padding interno
                  minHeight: { xs: 'auto', md: '600px' }, // Altura mínima en desktop
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}
              >
                {/* Renderiza Login o Registro según el estado actual */}
                {this.state.vistaActual === 'login' ? (
                  <Login onRegistroClick={this.mostrarRegistro} />
                ) : (
                  <Registro onLoginClick={this.mostrarLogin} />
                )}
              </Box>
            </Fade>

            {/* Loader (animación de carga) durante el cambio de vista */}
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
                  background: 'rgba(255, 255, 255, 0.8)', // Fondo semitransparente
                  zIndex: 3
                }}
              >
                {/* Loader circular animado */}
                <Box
                  sx={{
                    width: '40px',
                    height: '40px',
                    border: '4px solid #f3f3f3',
                    borderTop: '4px solid #e06c14', // Color animado
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite', // Animación de giro
                    '@keyframes spin': {
                      '0%': { transform: 'rotate(0deg)' },
                      '100%': { transform: 'rotate(360deg)' }
                    }
                  }}
                />
              </Box>
            )}
          </Box>
        </Container>

  {/* FOOTER ELIMINADO - Si quieres mantenerlo pero cambiarlo, descomenta y modifica: */}
        {/*
        <Box
          sx={{
            py: { xs: 2, md: 3 },
            px: { xs: 2, md: 4 },
            textAlign: 'center',
            color: 'rgba(0, 0, 0, 0.6)', // Color cambiado para fondo blanco
            fontSize: { xs: '0.8rem', md: '0.9rem' },
            fontFamily: 'Groteskbold',
            zIndex: 1,
            position: 'relative'
          }}
        >
          Tu texto personalizado aquí
        </Box>
        */}
      </Box>
    );
  }
}

// Versión funcional moderna usando hooks de React
export const MostrarLoginyRegistroFunctional = () => {
  // Estado para la vista actual ('login' o 'registro')
  const [vistaActual, setVistaActual] = React.useState('login');
  // Estado para controlar la animación
  const [isAnimating, setIsAnimating] = React.useState(false);
  // Hooks de MUI para detectar tamaño de pantalla
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  // Función para mostrar el registro con animación
  const mostrarRegistro = React.useCallback(() => {
    console.log('Cambiando a registro...');
    setIsAnimating(true);
    setTimeout(() => {
      setVistaActual('registro');
      setIsAnimating(false);
    }, 150);
  }, []);

  // Función para mostrar el login con animación
  const mostrarLogin = React.useCallback(() => {
    console.log('Cambiando a login...');
    setIsAnimating(true);
    setTimeout(() => {
      setVistaActual('login');
      setIsAnimating(false);
    }, 150);
  }, []);

  // Renderiza la versión funcional del componente
  return (
    <Box
      sx={{
        minHeight: '100vh', // Altura mínima de la pantalla
        width: '100%', // Ocupa todo el ancho
        // Fondo blanco
        background: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Elementos decorativos eliminados o comentados */}
      
      <Container
        maxWidth="lg"
        sx={{
          flex: 1, // Ocupa el espacio disponible
          display: 'flex',
          alignItems: 'center', // Centrado vertical
          justifyContent: 'center', // Centrado horizontal
          px: { xs: 2, sm: 3, md: 4 }, // Padding horizontal responsivo
          py: { xs: 2, sm: 4 }, // Padding vertical responsivo
          position: 'relative',
          zIndex: 1 // Sobre otros elementos
        }}
      >
        <Box
          sx={{
            width: '100%', // Ocupa todo el ancho disponible
            maxWidth: { xs: '400px', sm: '500px', md: '600px', lg: '700px' }, // Máximo ancho responsivo
            background: 'rgba(255, 255, 255, 0.95)', // Fondo semitransparente
            backdropFilter: 'blur(10px)', // Difumina el fondo
            borderRadius: { xs: 3, md: 4 }, // Bordes redondeados
            boxShadow: {
              xs: '0 8px 32px rgba(0, 0, 0, 0.1)',
              md: '0 20px 60px rgba(0, 0, 0, 0.15)'
            }, // Sombra para profundidad
            border: '1px solid rgba(255, 255, 255, 0.2)', // Borde sutil
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          {/* Indicador visual de la vista actual (barra superior de color) */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px', // Altura de la barra
              background: 'linear-gradient(90deg, #e06c14, #c55a11)', // Degradado naranja
              zIndex: 2
            }}
          />

          {/* Contenido principal con transición Fade (animación entre login y registro) */}
          <Fade in={!isAnimating} timeout={300} unmountOnExit>
            <Box
              sx={{
                p: { xs: 3, sm: 4, md: 5 }, // Padding interno
                minHeight: { xs: 'auto', md: '600px' }, // Altura mínima en desktop
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              {/* Renderiza Login o Registro según el estado actual */}
              {vistaActual === 'login' ? (
                <Login onRegistroClick={mostrarRegistro} />
              ) : (
                <Registro onLoginClick={mostrarLogin} />
              )}
            </Box>
          </Fade>

          {/* Loader (animación de carga) durante el cambio de vista */}
          {isAnimating && (
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
                background: 'rgba(255, 255, 255, 0.8)', // Fondo semitransparente
                zIndex: 3
              }}
            >
              {/* Loader circular animado */}
              <Box
                sx={{
                  width: '40px',
                  height: '40px',
                  border: '4px solid #f3f3f3',
                  borderTop: '4px solid #e06c14', // Color animado
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite', // Animación de giro
                  '@keyframes spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' }
                  }
                }}
              />
            </Box>
          )}
        </Box>
      </Container>

      {/* FOOTER ELIMINADO */}
    </Box>
  );
};

// Exporta el componente principal por defecto
export default MostrarLoginyRegistro ;