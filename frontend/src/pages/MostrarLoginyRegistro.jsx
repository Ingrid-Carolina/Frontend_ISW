import React from 'react';
import { Box, Container, useTheme, useMediaQuery, Fade } from '@mui/material';
import Login from './Login.jsx';
import Registro from './Registro.jsx';

class MostrarLoginyRegistro extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      vistaActual: 'login', // 'login' o 'registro'
      isAnimating: false
    };
    console.log('MostrarLoginyRegistro  inicializada con vista:', this.state.vistaActual);
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
    this.setState({ isAnimating: true }, () => {
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

  render() {
    console.log('Renderizando MostrarLoginyRegistro con vista:', this.state.vistaActual);
    
    return (
      <Box
        sx={{
          minHeight: '100vh',
          width: '100%',
          // FONDO CAMBIADO: Fondo blanco en lugar del gradiente azul
          background: '#ffffff',
          // O si prefieres un fondo transparente:
          // background: 'transparent',
          // O si quieres un color específico:
          // background: '#f5f5f5',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Elementos decorativos de fondo - OPCIONALES, puedes comentarlos o eliminarlos */}
        {/* 
        <Box
          sx={{
            position: 'absolute',
            top: { xs: '-50px', md: '-100px' },
            right: { xs: '-50px', md: '-100px' },
            width: { xs: '200px', md: '300px' },
            height: { xs: '200px', md: '300px' },
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            zIndex: 0
          }}
        />
        
        <Box
          sx={{
            position: 'absolute',
            bottom: { xs: '-75px', md: '-150px' },
            left: { xs: '-75px', md: '-150px' },
            width: { xs: '250px', md: '400px' },
            height: { xs: '250px', md: '400px' },
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.05)',
            zIndex: 0
          }}
        />
        */}

        {/* Contenedor principal */}
        <Container
          maxWidth="lg"
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: { xs: 'flex-start', md: 'center' },
            justifyContent: 'center',
            px: { xs: 2, sm: 3, md: 4 },
            py: { xs: 2, sm: 4 },
            pt: { xs: '140px', sm: '120px', md: 4 },
            position: 'relative',
            zIndex: 1
          }}
        >
          <Box
            sx={{
              width: '100%',
              maxWidth: { xs: '400px', sm: '500px', md: '600px', lg: '700px' },
              // Fondo del contenedor del formulario - también puedes cambiarlo
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: { xs: 3, md: 4 },
              boxShadow: {
                xs: '0 8px 32px rgba(0, 0, 0, 0.1)',
                md: '0 20px 60px rgba(0, 0, 0, 0.15)'
              },
              border: '1px solid rgba(255, 255, 255, 0.2)',
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            {/* Indicador de vista actual */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #e06c14, #c55a11)',
                zIndex: 2
              }}
            />

            {/* Contenido con transición */}
            <Fade 
              in={!this.state.isAnimating} 
              timeout={300}
              unmountOnExit
            >
              <Box
                sx={{
                  p: { xs: 3, sm: 4, md: 5 },
                  minHeight: { xs: 'auto', md: '600px' },
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}
              >
                {this.state.vistaActual === 'login' ? (
                  <Login onRegistroClick={this.mostrarRegistro} />
                ) : (
                  <Registro onLoginClick={this.mostrarLogin} />
                )}
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
                  zIndex: 3
                }}
              >
                <Box
                  sx={{
                    width: '40px',
                    height: '40px',
                    border: '4px solid #f3f3f3',
                    borderTop: '4px solid #e06c14',
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

// Versión con hooks (alternativa moderna) - TAMBIÉN ACTUALIZADA
export const MostrarLoginyRegistroFunctional = () => {
  const [vistaActual, setVistaActual] = React.useState('login');
  const [isAnimating, setIsAnimating] = React.useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

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
    setTimeout(() => {
      setVistaActual('login');
      setIsAnimating(false);
    }, 150);
  }, []);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        // FONDO CAMBIADO: Fondo blanco en lugar de gradientes azules
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
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: { xs: 2, sm: 3, md: 4 },
          py: { xs: 2, sm: 4 },
          position: 'relative',
          zIndex: 1
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: { xs: '400px', sm: '500px', md: '600px', lg: '700px' },
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: { xs: 3, md: 4 },
            boxShadow: {
              xs: '0 8px 32px rgba(0, 0, 0, 0.1)',
              md: '0 20px 60px rgba(0, 0, 0, 0.15)'
            },
            border: '1px solid rgba(255, 255, 255, 0.2)',
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #e06c14, #c55a11)',
              zIndex: 2
            }}
          />

          <Fade in={!isAnimating} timeout={300} unmountOnExit>
            <Box
              sx={{
                p: { xs: 3, sm: 4, md: 5 },
                minHeight: { xs: 'auto', md: '600px' },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              {vistaActual === 'login' ? (
                <Login onRegistroClick={mostrarRegistro} />
              ) : (
                <Registro onLoginClick={mostrarLogin} />
              )}
            </Box>
          </Fade>

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
                background: 'rgba(255, 255, 255, 0.8)',
                zIndex: 3
              }}
            >
              <Box
                sx={{
                  width: '40px',
                  height: '40px',
                  border: '4px solid #f3f3f3',
                  borderTop: '4px solid #e06c14',
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
      </Container>

      {/* FOOTER ELIMINADO */}
    </Box>
  );
};

export default MostrarLoginyRegistro ;