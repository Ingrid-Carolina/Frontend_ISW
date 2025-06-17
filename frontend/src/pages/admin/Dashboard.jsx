import React from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

// Datos de ejemplo para la gráfica de barras
const visitData = [
  { month: 'Ene', visits: 120 },
  { month: 'Feb', visits: 200 },
  { month: 'Mar', visits: 150 },
  { month: 'Abr', visits: 180 },
  { month: 'May', visits: 250 },
];

// Componente de tarjeta de estadística
const StatCard = ({ title, value }) => (
  <Paper elevation={3} sx={{ padding: 2, textAlign: 'center', fontFamily: 'PeterMedium' }}>
    <Typography variant="h6" gutterBottom>
      {title}
    </Typography>
    <Typography variant="h4" color="primary">
      {value}
    </Typography>
  </Paper>
);

export default function Dashboard() {
  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" gutterBottom sx={{ fontFamily: 'PeterMedium' }}>
        Estadisticas del Sitio
      </Typography>

      {/* Tarjetas de resumen */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <StatCard title="Visitantes Totales" value="2,340" />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard title="Comentarios Recibidos" value="128" />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard title="Eventos Publicados" value="15" />
        </Grid>
      </Grid>

      {/* Gráfica de visitas */}
      <Box sx={{ marginTop: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ fontFamily: 'PeterMedium' }}>
          Visitas por Mes
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={visitData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="visits" fill="#3f51b5" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}
// Este componente muestra un dashboard simple con estadísticas del sitio y una gráfica de visitas por mes.