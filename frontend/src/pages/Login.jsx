import React from 'react';
import TextField from '../components/TextField.jsx';
import {Typography, Stack,Button } from '@mui/material';
import Boton from '../components/Boton.jsx';

const Login = () => {
  return (
   
                <div style={{ display: 'flex', marginTop:'110px' }}>
                <div style={{ flex: 2 }}></div>
                <div style={{ flex: 1 }}>
                    
                    <Typography
					variant="h3"
					sx={{
						fontFamily: '"Jersey", cursive',
						fontWeight: 'bold',
						textAlign: 'center',
						mb: 4,
						fontSize: { xs: '3rem', md: '4rem' },
						color: '#e06c14'
					}}
                    >
                        LOGIN
                    </Typography>
                    <h2 style={{fontFamily:'Groteskbold', color:'#10045c'}}>Nombre de Usuario</h2>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <TextField nombre="Nombre" rol="search" />
                    <h2 style={{fontFamily:'Groteskbold', color:'#10045c'}}>Contraseña</h2>
                    <TextField nombre="Contraseña" rol="password" />
                    </div>
                    <Stack direction="row" spacing={2} marginTop={3}>
                        <Boton referencia='' mensaje='Registrarme' ></Boton>
                        <Boton referencia='' mensaje='Iniciar Sesion' ></Boton>        
                    </Stack>
                    
                </div>
                <div style={{ flex: 2}}></div>
                </div>
      
  );
};

export default Login;
